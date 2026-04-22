// Community Routes — /api/community
const router = require('express').Router();
const prisma = require('../lib/prisma');
const { requireAuth, requireRole } = require('../middleware/auth');
const { writeLimiter } = require('../middleware/rateLimit');

const ADMIN_ROLES = ['ADMIN', 'PASTOR'];

// GET /api/community/feed
// Mixed feed: recent sermons + recent prayers + pinned/recent announcements
router.get('/feed', async (req, res) => {
  const limit = Math.min(30, parseInt(req.query.limit) || 15);

  const [sermons, prayers, announcements] = await Promise.all([
    prisma.sermon.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        scriptureRef: true,
        seriesName: true,
        thumbnailUrl: true,
        publishedAt: true,
        featured: true,
        _count: { select: { comments: true } },
      },
    }),
    prisma.prayerRequest.findMany({
      where: { answered: false },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        _count: { select: { intercessions: true } },
      },
    }),
    prisma.announcement.findMany({
      orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
      take: 5,
    }),
  ]);

  // Mask anonymous prayer authors
  const sanitizedPrayers = prayers.map((p) => ({
    ...p,
    user: p.anonymous ? null : p.user,
  }));

  // Interleave into a single chronological feed with type labels
  const feedItems = [
    ...sermons.map((s) => ({ type: 'sermon', ...s })),
    ...sanitizedPrayers.map((p) => ({ type: 'prayer', ...p })),
    ...announcements.map((a) => ({ type: 'announcement', ...a })),
  ].sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt);
    const dateB = new Date(b.publishedAt || b.createdAt);
    return dateB - dateA;
  });

  res.json({ feed: feedItems.slice(0, limit) });
});

// GET /api/community/announcements
router.get('/announcements', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.announcement.count(),
  ]);

  res.json({
    announcements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + announcements.length < total,
    },
  });
});

// POST /api/community/announcements — admin/pastor only
router.post(
  '/announcements',
  requireAuth,
  requireRole(...ADMIN_ROLES),
  writeLimiter,
  async (req, res) => {
    const { title, content, pinned, publishedAt } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorId: req.user.id,
        pinned: pinned === true || pinned === 'true',
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    res.status(201).json({ announcement });
  }
);

// GET /api/community/stats — homepage stats
router.get('/stats', async (req, res) => {
  const [members, prayers, sermons, intercessions] = await Promise.all([
    prisma.user.count(),
    prisma.prayerRequest.count(),
    prisma.sermon.count(),
    prisma.intercession.count(),
  ]);

  res.json({
    stats: {
      members,
      prayers,
      sermons,
      intercessions,
      answeredPrayers: await prisma.prayerRequest.count({ where: { answered: true } }),
    },
  });
});

module.exports = router;
