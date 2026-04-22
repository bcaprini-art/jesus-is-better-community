// Rate Limiting — tuned for 1M-user scale
const rateLimit = require('express-rate-limit');

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 min default

/**
 * General API rate limit — 100 req / 15 min per IP
 */
const apiLimiter = rateLimit({
  windowMs,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
  },
});

/**
 * Strict limiter for auth routes — 10 req / 15 min per IP
 * Protects against credential stuffing and brute force.
 */
const authLimiter = rateLimit({
  windowMs,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
});

/**
 * Write limiter — 30 req / 15 min per IP
 * For comment/prayer creation endpoints.
 */
const writeLimiter = rateLimit({
  windowMs,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please slow down.',
  },
});

module.exports = { apiLimiter, authLimiter, writeLimiter };
