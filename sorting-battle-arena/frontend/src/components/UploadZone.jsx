import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  X,
  Layers,
  Columns,
  Loader2,
  FileCheck
} from 'lucide-react';
import sortingApi from '../services/api';
import { useToast } from './Toast';

export const UploadZone = ({ onDataLoaded }) => {
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileInspection, setFileInspection] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(0);
  const [extracting, setExtracting] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      setUploading(true);

      try {
        const response = await sortingApi.uploadFile(uploadedFile);
        if (response.success && response.file) {
          setFileInspection(response.file);
          if (response.file.sheets && response.file.sheets.length > 0) {
            setSelectedSheet(response.file.sheets[0]);
          }
          if (response.file.columns && response.file.columns.length > 0) {
            const firstNumeric = response.file.columns.find((c) => c.isNumeric);
            setSelectedColumn(firstNumeric ? firstNumeric.index : 0);
          }
          addToast(`File ${uploadedFile.name} uploaded successfully!`, 'success');

          // If TXT, auto extract numbers
          if (response.file.type === 'txt' && response.file.preview) {
            handleExtract(response.file.id, '', 0);
          }
        }
      } catch (err) {
        console.error('File upload error:', err);
        addToast(err.response?.data?.error || 'Failed to process uploaded file', 'error');
        setFile(null);
        setFileInspection(null);
      } finally {
        setUploading(false);
      }
    },
    [addToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleExtract = async (fileId = fileInspection?.id, sheet = selectedSheet, col = selectedColumn) => {
    if (!fileId) return;
    setExtracting(true);
    try {
      const res = await sortingApi.extractFileData(fileId, sheet, col);
      if (res.success && res.numbers) {
        addToast(`Extracted ${res.count} elements from ${file?.name || 'file'}!`, 'success');
        onDataLoaded?.(res.numbers, file?.name || 'Uploaded File', res.analysis);
      }
    } catch (err) {
      console.error('Extraction error:', err);
      addToast(err.response?.data?.error || 'Could not extract numbers from chosen column/sheet', 'error');
    } finally {
      setExtracting(false);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    setFileInspection(null);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (ext === 'xlsx' || ext === 'xls') return FileSpreadsheet;
    return FileText;
  };

  const FileIconComponent = file ? getFileIcon(file.name) : UploadCloud;

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : fileInspection
            ? 'border-emerald-500/40 bg-zinc-900/60'
            : 'border-zinc-700/60 hover:border-zinc-500 bg-zinc-900/40 hover:bg-zinc-900/60'
        }`}
      >
        <input {...getInputProps()} />

        {/* Floating gradient mesh within dropzone */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              <p className="text-sm font-semibold text-zinc-300">Inspecting file structures & sheets...</p>
            </div>
          ) : fileInspection ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                <FileCheck className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-white truncate max-w-xs">{file?.name}</p>
                <p className="text-xs text-zinc-400">
                  {(file?.size / 1024).toFixed(1)} KB • {fileInspection.type?.toUpperCase()}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Remove & Upload Another
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-200">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  {isDragActive ? 'Drop your dataset file here' : 'Drag & drop your dataset here, or browse'}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Supports Excel (.xlsx, .xls), CSV (.csv), and Text (.txt) up to 25MB
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                {['.XLSX', '.CSV', '.TXT'].map((ext) => (
                  <span
                    key={ext}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-400"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sheet & Column Selection for Excel and CSV */}
      <AnimatePresence>
        {fileInspection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-3xl bg-zinc-900/80 border border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Configure Dataset Extraction
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Ready to parse
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sheet Selector (for Excel) */}
              {fileInspection.sheets && fileInspection.sheets.length > 1 && (
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" /> Select Sheet:
                  </label>
                  <select
                    value={selectedSheet}
                    onChange={(e) => setSelectedSheet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  >
                    {fileInspection.sheets.map((sheet) => (
                      <option key={sheet} value={sheet}>
                        {sheet}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Column Selector */}
              {fileInspection.columns && fileInspection.columns.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <Columns className="w-3.5 h-3.5 text-purple-400" /> Select Numeric Column:
                  </label>
                  <select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                  >
                    {fileInspection.columns.map((col) => (
                      <option key={col.index} value={col.index}>
                        {col.name} {col.isNumeric ? '(Numeric ✓)' : '(Text/Mixed)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={() => handleExtract()}
              disabled={extracting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {extracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting & Analyzing...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Load Extracted Numbers into Workspace</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadZone;
