const path = require('path');
const fs = require('fs');
const {
  runSort,
  algorithmsMap
} = require('../algorithms');
const { analyzeDataset } = require('../utils/analyzer');
const {
  inspectFile,
  extractDataFromFile,
  extractNumbersFromText,
  generateSortedFile
} = require('../utils/fileProcessor');

// In-memory battle history log (capped at 50 most recent battles)
const battleHistory = [];

const outputsDir = path.join(__dirname, '..', 'outputs');
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

/**
 * Handle File Upload and return sheets/columns inspection
 */
async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const inspection = inspectFile(req.file.path, req.file.originalname);

    res.json({
      success: true,
      message: 'File uploaded and inspected successfully',
      file: {
        id: path.basename(req.file.path),
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        ...inspection
      }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to inspect file.' });
  }
}

/**
 * Extract data from an uploaded file if user selects sheet/column
 */
async function extractFileData(req, res) {
  try {
    const { fileId, sheetName, columnIndex } = req.body;
    if (!fileId) {
      return res.status(400).json({ success: false, error: 'fileId is required' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', fileId);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Uploaded file not found or expired' });
    }

    const extracted = extractDataFromFile(filePath, fileId, { sheetName, columnIndex });
    const analysis = analyzeDataset(extracted.numbers);

    res.json({
      success: true,
      count: extracted.numbers.length,
      sample: extracted.numbers.slice(0, 15),
      numbers: extracted.numbers,
      analysis,
      metadata: extracted.metadata
    });
  } catch (error) {
    console.error('Extract Data Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Analyze a dataset directly (e.g. manual numbers or generated array)
 */
async function analyzeData(req, res) {
  try {
    const { numbers, rawText } = req.body;
    let data = [];

    if (Array.isArray(numbers)) {
      data = numbers.map(Number).filter((n) => !isNaN(n));
    } else if (typeof rawText === 'string') {
      data = extractNumbersFromText(rawText);
    }

    if (data.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid numbers provided for analysis' });
    }

    const analysis = analyzeDataset(data);
    res.json({ success: true, count: data.length, analysis });
  } catch (error) {
    console.error('Analyze Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Run Battle Sort on dataset supporting:
 * - Single Mode (1 algorithm)
 * - Duel Mode (2 algorithms)
 * - Multi Battle (3-6 algorithms)
 * 
 * CONDITIONAL DOWNLOAD RULE:
 * - If inputType === 'file' (or fileId present): generate downloadable sorted file matching uploaded format.
 * - If inputType === 'manual' or 'random': NO download file is generated (download is null).
 */
async function sortDataset(req, res) {
  try {
    const {
      numbers,
      fileId,
      originalFilename,
      sheetName,
      columnIndex,
      algorithms = ['quick'], // array of algo keys, e.g. ['quick', 'merge', 'bubble']
      mode = 'Single', // 'Single', 'Duel', 'Multi'
      inputType = 'manual', // 'file', 'manual', 'random'
      order = 'asc',
      recordSteps = true
    } = req.body;

    let dataset = [];
    let sourceName = originalFilename || fileId || 'dataset';
    let outputFormat = 'csv';

    if (fileId) {
      const filePath = path.join(__dirname, '..', 'uploads', fileId);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: 'Uploaded file not found' });
      }
      const extracted = extractDataFromFile(filePath, fileId, { sheetName, columnIndex });
      dataset = extracted.numbers;
      sourceName = originalFilename || fileId;
    } else if (Array.isArray(numbers)) {
      dataset = numbers.map(Number).filter((n) => !isNaN(n));
      sourceName = originalFilename || 'dataset';
    }

    // Determine output format from original file extension
    const ext = path.extname(sourceName).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls') outputFormat = 'xlsx';
    else if (ext === '.txt') outputFormat = 'txt';
    else outputFormat = 'csv';

    if (dataset.length === 0) {
      return res.status(400).json({ success: false, error: 'Dataset is empty. Provide numbers or upload a valid file.' });
    }

    const algoList = Array.isArray(algorithms) && algorithms.length > 0 ? algorithms : ['quick'];
    const shouldRecordSteps = recordSteps && dataset.length <= 150;
    const maxSteps = 3000;

    // Execute each selected algorithm manually
    const algorithmResults = [];
    let fastestAlgo = null;
    let minTime = Infinity;

    for (const algoKey of algoList) {
      const resData = runSort(algoKey, dataset, order, shouldRecordSteps, maxSteps);
      algorithmResults.push({
        id: algoKey,
        name: resData.algorithm,
        executionTimeMs: resData.executionTimeMs,
        comparisons: resData.comparisons,
        swaps: resData.swaps,
        complexity: resData.complexity,
        sortedPreview: resData.sortedArray.slice(0, 50),
        steps: resData.steps
      });

      if (resData.executionTimeMs < minTime) {
        minTime = resData.executionTimeMs;
        fastestAlgo = resData.algorithm;
      }
    }

    // CONDITIONAL DOWNLOAD RULE:
    // Only generate output file if inputType was 'file' (or fileId present)
    let downloadInfo = null;
    if (inputType === 'file' || fileId) {
      // Use the sorted array from the primary / fastest algorithm
      const primarySorted = algorithmResults[0]?.sortedPreview ? runSort(algoList[0], dataset, order, false).sortedArray : [];
      const fileResult = generateSortedFile(primarySorted, sourceName, outputFormat, outputsDir);
      downloadInfo = {
        filename: fileResult.filename,
        format: fileResult.format,
        downloadUrl: `/api/download/${fileResult.filename}`
      };
    }

    // Dataset Analysis
    const analysis = analyzeDataset(dataset);

    // Save entry to Battle History
    const historyEntry = {
      id: `battle-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      mode: mode || (algoList.length === 1 ? 'Single' : algoList.length === 2 ? 'Duel' : 'Multi'),
      algorithms: algorithmResults.map((r) => r.name),
      datasetSize: dataset.length,
      inputType: inputType || (fileId ? 'file' : 'manual'),
      winner: fastestAlgo || algorithmResults[0]?.name,
      winnerTimeMs: minTime,
      downloadFilename: downloadInfo ? downloadInfo.filename : null,
      resultsSummary: algorithmResults.map((r) => ({
        name: r.name,
        time: r.executionTimeMs,
        comparisons: r.comparisons,
        swaps: r.swaps,
        space: r.complexity?.space || 'O(1)'
      }))
    };

    battleHistory.unshift(historyEntry);
    if (battleHistory.length > 50) battleHistory.pop();

    res.json({
      success: true,
      datasetSize: dataset.length,
      mode: historyEntry.mode,
      order,
      inputType: historyEntry.inputType,
      analysis,
      results: algorithmResults,
      winner: {
        name: fastestAlgo,
        time: minTime
      },
      download: downloadInfo // null if manual or random, object if file upload!
    });
  } catch (error) {
    console.error('Sort Controller Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Download generated sorted file
 */
async function downloadFile(req, res) {
  try {
    const filename = req.params.filename;
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(outputsDir, sanitizedFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found or expired.' });
    }

    res.download(filePath, sanitizedFilename);
  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get Battle History
 */
async function getHistory(req, res) {
  try {
    res.json({
      success: true,
      count: battleHistory.length,
      history: battleHistory
    });
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Clear Battle History
 */
async function clearHistory(req, res) {
  try {
    battleHistory.length = 0;
    res.json({
      success: true,
      message: 'Battle history successfully cleared',
      count: 0
    });
  } catch (error) {
    console.error('Clear History Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  uploadFile,
  extractFileData,
  analyzeData,
  sortDataset,
  downloadFile,
  getHistory,
  clearHistory
};
