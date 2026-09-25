const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadFile,
  extractFileData,
  analyzeData,
  sortDataset,
  downloadFile,
  getHistory,
  clearHistory
} = require('../controllers/sortingController');

// File Upload endpoint
router.post('/upload', upload.single('dataset'), uploadFile);

// File Data extraction after sheet/column selection
router.post('/extract', extractFileData);

// Dataset Analysis (entropy, duplicates, sortedness, prediction)
router.post('/analyze', analyzeData);

// Execute Sort (Single, Duel, or Multi Battle with conditional downloads)
router.post('/sort', sortDataset);

// Download generated sorted file (conditionally enabled for uploads)
router.get('/download/:filename', downloadFile);

// Battle history (Get and Clear)
router.get('/history', getHistory);
router.delete('/history', clearHistory);
router.post('/history/clear', clearHistory);

module.exports = router;
