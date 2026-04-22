// Auth Routes — /api/auth
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { requireAuth, signToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'email, name, and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const emailLower = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: emailLower } });
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists' });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: emailLower,
      name: name.trim(),
      password: hashed,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      location: true,
      role: true,
      verified: true,
      createdAt: true,
    },
  });

  const token = signToken(user);

  res.status(201).json({ token, user });
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken(user);

  const { password: _pw, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      location: true,
      role: true,
      verified: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          comments: true,
          prayers: true,
          intercessions: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

// PATCH /api/auth/profile
router.patch('/profile', requireAuth, async (req, res) => {
  const { name, bio, location, avatar } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (bio !== undefined) updates.bio = bio;
  if (location !== undefined) updates.location = location;
  if (avatar !== undefined) updates.avatar = avatar;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updates,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      location: true,
      role: true,
      verified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({ user });
});

module.exports = router;
