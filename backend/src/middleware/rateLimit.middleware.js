"use strict";

const rateLimit = require("express-rate-limit");
const ApiError = require("../utils/ApiError");

function makeHandler(message) {
  return (req, res) => {
    res.status(429).json({
      success: false,
      message,
      retryAfter: res.getHeader("Retry-After"),
    });
  };
}

// Global limiter — applied to all routes
const globalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeHandler("Too many requests. Please try again later."),
});

// Stricter limiter for auth endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeHandler("Too many login attempts. Please try again in 15 minutes."),
  skipSuccessfulRequests: true,
});

// Limiter for public form submissions
const formRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeHandler("Too many form submissions. Please try again later."),
});

module.exports = { globalRateLimiter, authRateLimiter, formRateLimiter };
