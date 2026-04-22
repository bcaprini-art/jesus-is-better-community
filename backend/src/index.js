// Jesus Is Better Community — API Server
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const { apiLimiter } = require('./middleware/rateLimit');

const authRoutes = require('./routes/auth');
const sermonRoutes = require('./routes/sermons');
const commentRoutes = require('./routes/commentary');
const prayerRoutes = require('./routes/prayers');
const communityRoutes = require('./routes/community');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ─── BODY PARSING ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── GLOBAL RATE LIMIT ───────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Jesus Is Better Community API' });
});

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/sermons', sermonRoutes);
// Commentary is mounted under sermons with mergeParams
app.use('/api/sermons/:sermonId/comments', commentRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/community', communityRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── ERROR HANDLER ───────────────────────────────────────────────────────────
// express-async-errors routes thrown errors here automatically
app.use((err, _req, res, _next) => {
  console.error(err);

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with that value already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({ error: message });
});

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✝  Jesus Is Better Community API running on port ${PORT}`);
});

module.exports = app;
