/**
 * File Processor utility for Excel (.xlsx, .xls), CSV, and TXT parsing & generation.
 */

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

/**
 * Inspect uploaded file to extract sheets, columns, and preview
 */
function inspectFile(filePath, originalFilename) {
  const ext = path.extname(originalFilename || filePath).toLowerCase();

  if (ext === '.xlsx' || ext === '.xls') {
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const defaultSheet = sheetNames[0];
    const worksheet = workbook.Sheets[defaultSheet];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = jsonData[0] || [];
    const sampleRows = jsonData.slice(1, 10);

    // Identify numeric columns
    const columns = [];
    headers.forEach((header, idx) => {
      let isNumeric = false;
      let sampleValues = [];
      for (const row of sampleRows) {
        if (row[idx] !== undefined && row[idx] !== null && !isNaN(Number(row[idx]))) {
          isNumeric = true;
          sampleValues.push(Number(row[idx]));
        }
      }
      columns.push({
        index: idx,
        name: String(header || `Column ${idx + 1}`),
        isNumeric,
        samples: sampleValues.slice(0, 3)
      });
    });

    return {
      type: 'excel',
      sheets: sheetNames,
      activeSheet: defaultSheet,
      columns,
      totalRows: jsonData.length - 1
    };
  }

  if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    const firstLine = lines[0];
    const headers = firstLine.split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const sampleLines = lines.slice(1, 10);

    const columns = headers.map((header, idx) => {
      let isNumeric = false;
      const samples = [];
      for (const line of sampleLines) {
        const parts = line.split(',');
        const val = parts[idx]?.trim().replace(/^["']|["']$/g, '');
        if (val !== undefined && val !== '' && !isNaN(Number(val))) {
          isNumeric = true;
          samples.push(Number(val));
        }
      }
      return {
        index: idx,
        name: header || `Column ${idx + 1}`,
        isNumeric,
        samples: samples.slice(0, 3)
      };
    });

    return {
      type: 'csv',
      sheets: ['Default'],
      activeSheet: 'Default',
      columns,
      totalRows: lines.length - 1
    };
  }

  if (ext === '.txt') {
    const content = fs.readFileSync(filePath, 'utf8');
    // Check if comma-separated or newline-separated
    const numbers = extractNumbersFromText(content);
    return {
      type: 'txt',
      sheets: ['Text Data'],
      activeSheet: 'Text Data',
      columns: [{ index: 0, name: 'Numeric Values', isNumeric: true, samples: numbers.slice(0, 5) }],
      totalCount: numbers.length,
      preview: numbers.slice(0, 20)
    };
  }

  throw new Error(`Unsupported file extension: ${ext}. Supported: .xlsx, .xls, .csv, .txt`);
}

/**
 * Extract numbers from uploaded file based on sheet/column choices
 */
function extractDataFromFile(filePath, originalFilename, options = {}) {
  const ext = path.extname(originalFilename || filePath).toLowerCase();
  const { sheetName, columnIndex } = options;

  if (ext === '.xlsx' || ext === '.xls') {
    const workbook = xlsx.readFile(filePath);
    const targetSheet = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[targetSheet];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length <= 1) {
      throw new Error('Selected sheet has no data rows');
    }

    const colIdx = columnIndex !== undefined ? Number(columnIndex) : 0;
    const extracted = [];
    const fullRows = [];

    for (let r = 1; r < jsonData.length; r++) {
      const row = jsonData[r];
      if (row && row[colIdx] !== undefined && row[colIdx] !== null && row[colIdx] !== '') {
        const num = Number(row[colIdx]);
        if (!isNaN(num)) {
          extracted.push(num);
          fullRows.push(row);
        }
      }
    }

    if (extracted.length === 0) {
      throw new Error(`No numeric values found in column ${columnIndex} of sheet "${targetSheet}"`);
    }

    return {
      numbers: extracted,
      metadata: {
        type: 'excel',
        headers: jsonData[0],
        sheetName: targetSheet,
        columnIndex: colIdx,
        fullRows
      }
    };
  }

  if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const colIdx = columnIndex !== undefined ? Number(columnIndex) : 0;
    const extracted = [];

    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(',');
      const val = cells[colIdx]?.trim().replace(/^["']|["']$/g, '');
      if (val !== undefined && val !== '' && !isNaN(Number(val))) {
        extracted.push(Number(val));
      }
    }

    if (extracted.length === 0) {
      throw new Error(`No numeric values found in column index ${colIdx}`);
    }

    return {
      numbers: extracted,
      metadata: {
        type: 'csv',
        headers,
        columnIndex: colIdx
      }
    };
  }

  if (ext === '.txt') {
    const content = fs.readFileSync(filePath, 'utf8');
    const numbers = extractNumbersFromText(content);
    if (numbers.length === 0) {
      throw new Error('No numeric values could be extracted from text file');
    }
    return {
      numbers,
      metadata: {
        type: 'txt'
      }
    };
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

/**
 * Parse numbers from text with whitespace, newlines, commas, or semicolons
 */
function extractNumbersFromText(text) {
  if (!text) return [];
  // Tokenize by commas, semicolons, whitespace, newlines
  const tokens = text.split(/[\s,;\t\r\n]+/);
  const numbers = [];
  for (const token of tokens) {
    const trimmed = token.trim();
    if (trimmed.length > 0 && !isNaN(Number(trimmed))) {
      numbers.push(Number(trimmed));
    }
  }
  return numbers;
}

/**
 * Generate output file in Excel, CSV, or TXT
 */
function generateSortedFile(sortedArray, originalFilename = 'dataset', outputFormat = 'csv', outputDir) {
  const baseName = path.basename(originalFilename, path.extname(originalFilename)).replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const format = (outputFormat || 'csv').toLowerCase();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let finalFilename;
  let filePath;

  if (format === 'xlsx') {
    finalFilename = `${baseName}_sorted_${timestamp}.xlsx`;
    filePath = path.join(outputDir, finalFilename);

    const sheetData = [['Sorted_Value']];
    sortedArray.forEach((val) => {
      sheetData.push([typeof val === 'object' && val !== null ? val.value : val]);
    });

    const worksheet = xlsx.utils.aoa_to_sheet(sheetData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sorted Data');
    xlsx.writeFile(workbook, filePath);
  } else if (format === 'txt') {
    finalFilename = `${baseName}_sorted_${timestamp}.txt`;
    filePath = path.join(outputDir, finalFilename);

    const content = sortedArray
      .map((val) => (typeof val === 'object' && val !== null ? val.value : val))
      .join('\n');
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    // Default to CSV
    finalFilename = `${baseName}_sorted_${timestamp}.csv`;
    filePath = path.join(outputDir, finalFilename);

    const lines = ['Index,Sorted_Value'];
    sortedArray.forEach((val, idx) => {
      const v = typeof val === 'object' && val !== null ? val.value : val;
      lines.push(`${idx + 1},${v}`);
    });
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  }

  return {
    filename: finalFilename,
    filePath,
    format,
    recordCount: sortedArray.length
  };
}

module.exports = {
  inspectFile,
  extractDataFromFile,
  extractNumbersFromText,
  generateSortedFile
};
