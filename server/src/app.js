const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const adminRoutes = require('./routes/admin');
const swapRoutes = require('./routes/swapRoutes');

// Middleware - ORDER MATTERS!
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    headers: req.headers['content-type']
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running!' });
});

// Test JSON parsing
app.post('/api/test', (req, res) => {
  res.json({ 
    message: 'JSON parsing test',
    body: req.body,
    contentType: req.headers['content-type']
  });
});

module.exports = app;
