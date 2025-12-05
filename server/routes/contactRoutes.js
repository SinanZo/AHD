// server/routes/contactRoutes.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const { handleContact } = require('../controllers/contactController');

const router = express.Router();

// Simple rate limiter to avoid abuse
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,              // 5 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many contact form submissions. Please try again later.',
});

router.post('/', contactLimiter, handleContact);

module.exports = router;
