// Commentary Routes — /api/sermons/:sermonId/comments
// Mounted at /api/sermons with mergeParams: true
const router = require('express').Router({ mergeParams: true });
const prisma = require('../lib/prisma');
const { requireAuth, requireRole } = require('../middleware/auth');
const { writeLimiter } = require('../middleware/rateLimit');

const MOD_ROLES = ['ADMIN', 'PASTOR', 'MODERATOR'];
const PAGE_SIZE = 20;

// GET /api/sermons/:sermonId/comments
// Returns top-level comments with their replies nested, plus like counts
router.get('/', async (req, res) => {
  const { sermonId } = req.params;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || PAGE_SIZE));
  const skip = (page - 1) * limit;

  // Verify sermon exists
  const sermon = await prisma.sermon.findUnique({ where: { id: sermonId } });
  if (!sermon) {
    return res.status(404).json({ error: 'Sermon not found' });
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { sermonId, parentId: null, flagged: false },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { likes: true, replies: true } },
        replies: {
          where: { flagged: false },
          orderBy: { createdAt: 'asc' },
          take: 5, // first 5 replies inline; fetch more via separate endpoint
          include: {
            user: {
              select: { id: true, name: true, avatar: true, role: true },
            },
            _count: { select: { likes: true } },
          },
        },
      },
    }),
    prisma.comment.count({ where: { sermonId, parentId: null, flagged: false } }),
  ]);

  res.json({
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + comments.length < total,
    },
  });
});

// POST /api/sermons/:sermonId/comments — authenticated
router.post('/', requireAuth, writeLimiter, async (req, res) => {
  const { sermonId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  if (content.length > 5000) {
    return res.status(400).json({ error: 'Comment must be 5000 characters or fewer' });
  }

  const sermon = await prisma.sermon.findUnique({ where: { id: sermonId } });
  if (!sermon) {
    return res.status(404).json({ error: 'Sermon not found' });
  }

  const comment = await prisma.comment.create({
    data: {
      sermonId,
      userId: req.user.id,
      content: content.trim(),
    },
    include: {
      user: {
        select: { id: true, name: true, avatar: true, role: true },
      },
      _count: { select: { likes: true, replies: true } },
    },
  });

  res.status(201).json({ comment });
});

// POST /api/sermons/:sermonId/comments/:commentId/reply
router.post('/:commentId/reply', requireAuth, writeLimiter, async (req, res) => {
  const { sermonId, commentId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Reply content is required' });
  }

  if (content.length > 5000) {
    return res.status(400).json({ error: 'Reply must be 5000 characters or fewer' });
  }

  const parent = await prisma.comment.findFirst({
    where: { id: commentId, sermonId },
  });

  if (!parent) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  // Replies are always children of the root comment (flat threading)
  const replyParentId = parent.parentId || parent.id;

  const reply = await prisma.comment.create({
    data: {
      sermonId,
      userId: req.user.id,
      parentId: replyParentId,
      content: content.trim(),
    },
    include: {
      user: {
        select: { id: true, name: true, avatar: true, role: true },
      },
      _count: { select: { likes: true } },
    },
  });

  res.status(201).json({ comment: reply });
});

// POST /api/sermons/:sermonId/comments/:commentId/like — toggle
router.post('/:commentId/like', requireAuth, async (req, res) => {
  const { sermonId, commentId } = req.params;
  const userId = req.user.id;

  const comment = await prisma.comment.findFirst({ where: { id: commentId, sermonId } });
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const existing = await prisma.commentLike.findUnique({
    where: { commentId_userId: { commentId, userId } },
  });

  if (existing) {
    await prisma.commentLike.delete({
      where: { commentId_userId: { commentId, userId } },
    });
    const count = await prisma.commentLike.count({ where: { commentId } });
    return res.json({ liked: false, likeCount: count });
  } else {
    await prisma.commentLike.create({ data: { commentId, userId } });
    const count = await prisma.commentLike.count({ where: { commentId } });
    return res.json({ liked: true, likeCount: count });
  }
});

// DELETE /api/sermons/:sermonId/comments/:commentId — own or moderator
router.delete('/:commentId', requireAuth, async (req, res) => {
  const { sermonId, commentId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const comment = await prisma.comment.findFirst({ where: { id: commentId, sermonId } });
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const isMod = MOD_ROLES.includes(userRole);
  if (comment.userId !== userId && !isMod) {
    return res.status(403).json({ error: 'You can only delete your own comments' });
  }

  await prisma.comment.delete({ where: { id: commentId } });

  res.json({ message: 'Comment deleted' });
});

module.exports = router;
