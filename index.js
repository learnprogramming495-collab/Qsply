require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

// --- Security Middleware ---
app.use(helmet());

// Rate Limiter for general API routes
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
});

// Stricter Rate Limiter for authentication routes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 requests per window
	message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
});

// --- Core Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Database Connection ---
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/agritech_fallback';
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Static Files ---
app.use(express.static('public'));

// --- API Routes ---
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/products', apiLimiter, require('./routes/products'));
app.use('/api/cart', apiLimiter, require('./routes/cart'));
app.use('/api/orders', apiLimiter, require('./routes/orders')); // Apply general limiter

// --- Server Startup ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
