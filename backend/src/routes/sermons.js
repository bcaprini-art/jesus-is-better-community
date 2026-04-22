// Sermon Routes — /api/sermons
const router = require('express').Router();
const prisma = require('../lib/prisma');
const { requireAuth, requireRole } = require('../middleware/auth');

const ADMIN_ROLES = ['ADMIN', 'PASTOR'];
const PAGE_SIZE = 20;

// GET /api/sermons
// Query: page, limit, series, tag, search, sort (newest|oldest)
router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || PAGE_SIZE));
  const skip = (page - 1) * limit;
  const { series, tag, search, sort } = req.query;

  const where = {};

  if (series) {
    where.seriesName = { equals: series, mode: 'insensitive' };
  }

  if (tag) {
    where.tags = { has: tag };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { scriptureRef: { contains: search, mode: 'insensitive' } },
      { seriesName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy =
    sort === 'oldest'
      ? { publishedAt: 'asc' }
      : { publishedAt: 'desc' };

  const [sermons, total] = await Promise.all([
    prisma.sermon.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        scriptureRef: true,
        seriesName: true,
        videoUrl: true,
        audioUrl: true,
        thumbnailUrl: true,
        publishedAt: true,
        durationSeconds: true,
        featured: true,
        tags: true,
        createdAt: true,
        _count: { select: { comments: true } },
      },
    }),
    prisma.sermon.count({ where }),
  ]);

  res.json({
    sermons,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + sermons.length < total,
    },
  });
});

// GET /api/sermons/featured
router.get('/featured', async (req, res) => {
  const limit = Math.min(10, parseInt(req.query.limit) || 6);

  const sermons = await prisma.sermon.findMany({
    where: { featured: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      description: true,
      scriptureRef: true,
      seriesName: true,
      videoUrl: true,
      thumbnailUrl: true,
      publishedAt: true,
      durationSeconds: true,
      tags: true,
      _count: { select: { comments: true } },
    },
  });

  res.json({ sermons });
});

// GET /api/sermons/series
router.get('/series', async (req, res) => {
  const result = await prisma.sermon.groupBy({
    by: ['seriesName'],
    where: { seriesName: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  const series = result.map((r) => ({
    name: r.seriesName,
    count: r._count.id,
  }));

  res.json({ series });
});

// GET /api/sermons/:id
router.get('/:id', async (req, res) => {
  const sermon = await prisma.sermon.findUnique({
    where: { id: req.params.id },
    include: {
      _count: { select: { comments: true } },
    },
  });

  if (!sermon) {
    return res.status(404).json({ error: 'Sermon not found' });
  }

  res.json({ sermon });
});

// POST /api/sermons — admin/pastor only
router.post(
  '/',
  requireAuth,
  requireRole(...ADMIN_ROLES),
  async (req, res) => {
    const {
      title,
      description,
      scriptureRef,
      seriesName,
      videoUrl,
      audioUrl,
      thumbnailUrl,
      publishedAt,
      durationSeconds,
      featured,
      tags,
    } = req.body;

    if (!title || !description || !scriptureRef || !publishedAt) {
      return res.status(400).json({
        error: 'title, description, scriptureRef, and publishedAt are required',
      });
    }

    const sermon = await prisma.sermon.create({
      data: {
        title,
        description,
        scriptureRef,
        seriesName: seriesName || null,
        videoUrl: videoUrl || null,
        audioUrl: audioUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        publishedAt: new Date(publishedAt),
        durationSeconds: durationSeconds ? parseInt(durationSeconds) : null,
        featured: featured || false,
        tags: tags || [],
      },
    });

    res.status(201).json({ sermon });
  }
);

// PATCH /api/sermons/:id — admin/pastor only
router.patch(
  '/:id',
  requireAuth,
  requireRole(...ADMIN_ROLES),
  async (req, res) => {
    const exists = await prisma.sermon.findUnique({
      where: { id: req.params.id },
    });
    if (!exists) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    const allowed = [
      'title',
      'description',
      'scriptureRef',
      'seriesName',
      'videoUrl',
      'audioUrl',
      'thumbnailUrl',
      'publishedAt',
      'durationSeconds',
      'featured',
      'tags',
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.publishedAt) {
      updates.publishedAt = new Date(updates.publishedAt);
    }

    const sermon = await prisma.sermon.update({
      where: { id: req.params.id },
      data: updates,
    });

    res.json({ sermon });
  }
);

module.exports = router;
