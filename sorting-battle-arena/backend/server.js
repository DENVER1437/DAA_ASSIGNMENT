const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const sortingRoutes = require('./routes/sortingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development and production
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parser with 50MB payload limit to handle datasets up to 100,000 items
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sorting Battle Arena Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', sortingRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size limit exceeded. Maximum file size allowed is 25MB.'
      });
    }
    return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` ⚔️  Sorting Battle Arena Backend Server Started`);
  console.log(` 🚀 Listening on: http://localhost:${PORT}`);
  console.log(` 📦 DAA Manual Algorithms Loaded & Ready`);
  console.log(`===============================================`);
});

module.exports = app;
