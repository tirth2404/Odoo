const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const adminRoutes = require('./routes/admin');
const swapRoutes = require('./routes/swapRoutes');

// Middleware - ORDER MATTERS!
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running!' });
});

// Test image serving
app.get('/api/test-images', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, '../uploads');
  
  try {
    const files = fs.readdirSync(uploadsPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    res.json({
      success: true,
      uploadsPath,
      totalFiles: files.length,
      imageFiles: imageFiles.map(file => ({
        filename: file,
        url: `/uploads/${file}`,
        fullUrl: `http://localhost:3000/uploads/${file}`
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      uploadsPath
    });
  }
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
