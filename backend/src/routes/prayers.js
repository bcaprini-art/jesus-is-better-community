// Prayer Routes — /api/prayers
const router = require('express').Router();
const prisma = require('../lib/prisma');
const { requireAuth, requireRole } = require('../middleware/auth');
const { writeLimiter } = require('../middleware/rateLimit');

const MOD_ROLES = ['ADMIN', 'PASTOR', 'MODERATOR'];
const PAGE_SIZE = 20;

const VALID_CATEGORIES = [
  'GENERAL',
  'HEALING',
  'FAMILY',
  'GRIEF',
  'PROVISION',
  'GUIDANCE',
  'SALVATION',
  'PRAISE',
];

// GET /api/prayers
// Query: page, limit, category, sort (recent|mostPrayed|answered)
router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || PAGE_SIZE));
  const skip = (page - 1) * limit;
  const { category, sort, answered } = req.query;

  const where = {};

  if (category && VALID_CATEGORIES.includes(category.toUpperCase())) {
    where.category = category.toUpperCase();
  }

  if (answered === 'true') {
    where.answered = true;
  } else if (answered === 'false') {
    where.answered = false;
  }

  let orderBy = { createdAt: 'desc' };
  if (sort === 'oldest') orderBy = { createdAt: 'asc' };
  // mostPrayed sorted client-side via _count; for DB-level sorting use raw or separate query

  const [prayers, total] = await Promise.all([
    prisma.prayerRequest.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        _count: {
          select: { intercessions: true, likes: true },
        },
      },
    }),
    prisma.prayerRequest.count({ where }),
  ]);

  // Mask anonymous users
  const sanitized = prayers.map((p) => ({
    ...p,
    user: p.anonymous ? null : p.user,
  }));

  // If sort=mostPrayed, sort in memory after fetch
  if (sort === 'mostPrayed') {
    sanitized.sort((a, b) => b._count.intercessions - a._count.intercessions);
  }

  res.json({
    prayers: sanitized,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + prayers.length < total,
    },
  });
});

// GET /api/prayers/:id
router.get('/:id', async (req, res) => {
  const prayer = await prisma.prayerRequest.findUnique({
    where: { id: req.params.id },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
      _count: {
        select: { intercessions: true, likes: true },
      },
    },
  });

  if (!prayer) {
    return res.status(404).json({ error: 'Prayer request not found' });
  }

  const result = {
    ...prayer,
    user: prayer.anonymous ? null : prayer.user,
  };

  res.json({ prayer: result });
});

// POST /api/prayers — authenticated
router.post('/', requireAuth, writeLimiter, async (req, res) => {
  const { title, content, category, anonymous } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const cat = category ? category.toUpperCase() : 'GENERAL';
  if (!VALID_CATEGORIES.includes(cat)) {
    return res.status(400).json({
      error: `Invalid category. Valid values: ${VALID_CATEGORIES.join(', ')}`,
    });
  }

  const prayer = await prisma.prayerRequest.create({
    data: {
      userId: req.user.id,
      title: title.trim(),
      content: content.trim(),
      category: cat,
      anonymous: anonymous === true || anonymous === 'true',
    },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
      _count: {
        select: { intercessions: true, likes: true },
      },
    },
  });

  res.status(201).json({ prayer });
});

// POST /api/prayers/:id/pray — toggle intercession
router.post('/:id/pray', requireAuth, async (req, res) => {
  const prayerRequestId = req.params.id;
  const userId = req.user.id;

  const prayer = await prisma.prayerRequest.findUnique({
    where: { id: prayerRequestId },
  });
  if (!prayer) {
    return res.status(404).json({ error: 'Prayer request not found' });
  }

  const existing = await prisma.intercession.findUnique({
    where: { prayerRequestId_userId: { prayerRequestId, userId } },
  });

  if (existing) {
    await prisma.intercession.delete({
      where: { prayerRequestId_userId: { prayerRequestId, userId } },
    });
    const count = await prisma.intercession.count({ where: { prayerRequestId } });
    return res.json({ praying: false, prayerCount: count });
  } else {
    await prisma.intercession.create({ data: { prayerRequestId, userId } });
    const count = await prisma.intercession.count({ where: { prayerRequestId } });
    return res.json({ praying: true, prayerCount: count });
  }
});

// PATCH /api/prayers/:id/answered — mark answered with optional testimony
router.patch('/:id/answered', requireAuth, async (req, res) => {
  const { testimony } = req.body;

  const prayer = await prisma.prayerRequest.findUnique({
    where: { id: req.params.id },
  });

  if (!prayer) {
    return res.status(404).json({ error: 'Prayer request not found' });
  }

  const isMod = MOD_ROLES.includes(req.user.role);
  if (prayer.userId !== req.user.id && !isMod) {
    return res.status(403).json({ error: 'You can only update your own prayer requests' });
  }

  const updated = await prisma.prayerRequest.update({
    where: { id: req.params.id },
    data: {
      answered: true,
      answeredAt: new Date(),
      testimony: testimony ? testimony.trim() : null,
    },
    include: {
      _count: { select: { intercessions: true, likes: true } },
    },
  });

  res.json({ prayer: updated });
});

// DELETE /api/prayers/:id — own request or moderator
router.delete('/:id', requireAuth, async (req, res) => {
  const prayer = await prisma.prayerRequest.findUnique({
    where: { id: req.params.id },
  });

  if (!prayer) {
    return res.status(404).json({ error: 'Prayer request not found' });
  }

  const isMod = MOD_ROLES.includes(req.user.role);
  if (prayer.userId !== req.user.id && !isMod) {
    return res.status(403).json({ error: 'You can only delete your own prayer requests' });
  }

  await prisma.prayerRequest.delete({ where: { id: req.params.id } });

  res.json({ message: 'Prayer request deleted' });
});

module.exports = router;
