import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sortingApi = {
  /**
   * Upload dataset file (.xlsx, .xls, .csv, .txt)
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('dataset', file);
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Extract data from uploaded file given sheet name and column index
   */
  async extractFileData(fileId, sheetName, columnIndex) {
    const response = await api.post('/api/extract', {
      fileId,
      sheetName,
      columnIndex,
    });
    return response.data;
  },

  /**
   * Pre-analyze dataset characteristics
   */
  async analyzeDataset(numbers, rawText = null) {
    const response = await api.post('/api/analyze', {
      numbers,
      rawText,
    });
    return response.data;
  },

  /**
   * Run battle sort with Single, Duel, or Multi modes
   * Conditional download: output is returned only if inputType is 'file'
   */
  async sortDataset(payload) {
    const response = await api.post('/api/sort', payload);
    return response.data;
  },

  /**
   * Fetch battle history
   */
  async getHistory() {
    const response = await api.get('/api/history');
    return response.data;
  },

  /**
   * Clear battle history on server
   */
  async clearHistory() {
    try {
      const response = await api.delete('/api/history');
      return response.data;
    } catch (e) {
      const fallback = await api.post('/api/history/clear');
      return fallback.data;
    }
  },

  /**
   * Construct download URL
   */
  getDownloadUrl(filename) {
    const base = API_BASE_URL.replace(/\/$/, '');
    return `${base}/api/download/${filename}`;
  }
};

export default sortingApi;
