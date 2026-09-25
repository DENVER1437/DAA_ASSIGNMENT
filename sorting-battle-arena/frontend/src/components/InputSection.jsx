import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Keyboard,
  Dice5,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Trash2,
  ArrowRight,
  Sparkles,
  Layers,
  RotateCcw
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { generateDataset, formatNumber } from '../utils/datasetGenerators';
import sortingApi from '../services/api';
import { useToast } from './Toast';
import SortingLoader from './SortingLoader';
import soundEffects from '../utils/soundEffects';

export const InputSection = ({ onInputReady, activeInputType, datasetSummary }) => {
  const { addToast } = useToast();

  // Card 1: Manual State
  const [manualText, setManualText] = useState('45, 12, 89, 7, 31, 64, 22, 90, 18, 53');
  const [manualError, setManualError] = useState(null);

  // Card 2: Generator State
  const [genSize, setGenSize] = useState(40);
  const [genType, setGenType] = useState('random');

  // Card 3: File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileInspection, setFileInspection] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(0);

  // Manual Input Validation
  const validateManual = (text) => {
    const tokens = text.split(/[\s,;\t\r\n]+/).filter(Boolean);
    for (const t of tokens) {
      if (isNaN(Number(t))) {
        return { valid: false, count: tokens.length, error: 'Only numeric items allowed' };
      }
    }
    if (tokens.length === 0) return { valid: false, count: 0, error: 'Input cannot be empty' };
    return { valid: true, count: tokens.length, numbers: tokens.map(Number) };
  };

  const handleManualSubmit = () => {
    soundEffects.playClick();
    const check = validateManual(manualText);
    if (!check.valid) {
      setManualError(check.error);
      addToast(check.error, 'error');
      return;
    }
    setManualError(null);
    onInputReady(check.numbers, 'manual', { label: `Manual Input (${check.count} numbers)` });
    addToast(`Loaded ${check.count} numbers from manual input!`, 'success');
  };

  // Generator Submit
  const handleGenSubmit = () => {
    soundEffects.playClick();
    const numbers = generateDataset(genSize, genType, 1, 1000);
    onInputReady(numbers, 'random', {
      label: `Generated (${genType.replace('_', ' ')} - ${formatNumber(numbers.length)} items)`
    });
    addToast(`Generated ${formatNumber(numbers.length)} elements!`, 'success');
  };

  // Dropzone setup
  const onDrop = async (accepted) => {
    if (!accepted || accepted.length === 0) return;
    soundEffects.playClick();
    const file = accepted[0];
    setUploadedFile(file);
    setIsUploading(true);

    try {
      const res = await sortingApi.uploadFile(file);
      if (res.success && res.file) {
        setFileInspection(res.file);
        if (res.file.sheets?.length > 0) setSelectedSheet(res.file.sheets[0]);
        if (res.file.columns?.length > 0) {
          const firstNumeric = res.file.columns.find((c) => c.isNumeric);
          setSelectedColumn(firstNumeric ? firstNumeric.index : 0);
        }
        addToast(`Uploaded ${file.name}. Click "Confirm File Extraction" to proceed.`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to upload file', 'error');
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove File Handler
  const handleRemoveFile = (e) => {
    e.stopPropagation();
    soundEffects.playClick();
    setUploadedFile(null);
    setFileInspection(null);
    setSelectedSheet('');
    setSelectedColumn(0);
    addToast('File removed. You can now upload a new dataset.', 'info');
  };

  // File Extraction on Explicit Button Click
  const handleFileExtract = async () => {
    if (!fileInspection?.id) {
      addToast('Please upload a file first', 'warning');
      return;
    }

    soundEffects.playClick();
    setIsExtracting(true);
    try {
      const res = await sortingApi.extractFileData(fileInspection.id, selectedSheet, selectedColumn);
      if (res.success && res.numbers) {
        onInputReady(res.numbers, 'file', {
          fileId: fileInspection.id,
          originalFilename: uploadedFile?.name,
          sheetName: selectedSheet,
          columnIndex: selectedColumn,
          label: `File: ${uploadedFile?.name} (${res.count} items)`
        });
        addToast(`Extracted ${res.count} values from ${uploadedFile?.name}!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Could not extract numeric column', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    multiple: false
  });

  const parsedManualCount = manualText.split(/[\s,;\t\r\n]+/).filter(Boolean).length;

  return (
    <section id="input-section" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
          Step 1 • Dataset Configuration
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Choose Your Input Type
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Supply your numbers via Manual Input, Synthetic Generation, or File Upload.
        </p>
      </div>

      {/* 3 Animated Tactile Cards with 1° tilt and distinct personalities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CARD 1: MANUAL INPUT (Electric Blue) */}
        <motion.div
          whileHover={{ y: -8, rotate: -1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className={`group relative p-6 sm:p-7 rounded-3xl bg-zinc-900/85 border glass-panel transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden ${
            activeInputType === 'manual'
              ? 'border-blue-500 shadow-[0_0_35px_-5px_rgba(59,130,246,0.4)] bg-blue-950/20 ring-1 ring-blue-500/40'
              : 'border-white/10 hover:border-blue-500/40 hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.25)]'
          }`}
        >
          {/* Shimmer sweep */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md">
                <Keyboard className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-500/30">
                Live Validation
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Manual Input</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Type custom comma-separated numbers.</p>
            </div>

            <textarea
              rows={4}
              value={manualText}
              onChange={(e) => {
                setManualText(e.target.value);
                setManualError(null);
              }}
              placeholder="e.g. 45, 12, 89, 7, 31, 64"
              className="w-full p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-700/60 focus:border-blue-500 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors resize-none shadow-inner"
            />

            {/* Counters & Live Feedback */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono text-[11px]">
                {manualText.length} chars • {parsedManualCount} items
              </span>
              {manualError ? (
                <span className="text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {manualError}
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleManualSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Apply Manual Dataset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* CARD 2: RANDOM GENERATOR (Neon Violet) */}
        <motion.div
          whileHover={{ y: -8, rotate: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className={`group relative p-6 sm:p-7 rounded-3xl bg-zinc-900/85 border glass-panel transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden ${
            activeInputType === 'random'
              ? 'border-purple-500 shadow-[0_0_35px_-5px_rgba(168,85,247,0.4)] bg-purple-950/20 ring-1 ring-purple-500/40'
              : 'border-white/10 hover:border-purple-500/40 hover:shadow-[0_20px_40px_-10px_rgba(168,85,247,0.25)]'
          }`}
        >
          {/* Shimmer sweep */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-md">
                <Dice5 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
                Synthetic Scale
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Random Generator</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Synthesize structured data distributions.</p>
            </div>

            {/* Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Array Size:</span>
                <span className="font-mono font-bold text-white">{formatNumber(genSize)} elements</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={genSize}
                onChange={(e) => setGenSize(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>10 (Visualizer)</span>
                <span>100</span>
                <span>500</span>
              </div>
            </div>

            {/* Distribution Type Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Distribution Type:</label>
              <select
                value={genType}
                onChange={(e) => setGenType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
              >
                <option value="random">Random (Uniform)</option>
                <option value="sorted">Already Sorted (Ascending)</option>
                <option value="reverse">Reverse Sorted (Worst Case)</option>
                <option value="nearly_sorted">Nearly Sorted (5% Swaps)</option>
                <option value="duplicate_heavy">Duplicate Heavy (Redundant)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Generate & Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* CARD 3: FILE UPLOAD (Emerald / Cyan) */}
        <motion.div
          whileHover={{ y: -8, rotate: -1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className={`group relative p-6 sm:p-7 rounded-3xl bg-zinc-900/85 border glass-panel transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden ${
            activeInputType === 'file'
              ? 'border-emerald-500 shadow-[0_0_35px_-5px_rgba(16,185,129,0.4)] bg-emerald-950/20 ring-1 ring-emerald-500/40'
              : 'border-white/10 hover:border-emerald-500/40 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.25)]'
          }`}
        >
          {/* Shimmer sweep */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                Enables Download ✓
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white">File Upload</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Ingest Excel (.xlsx/.xls), CSV, or TXT.</p>
            </div>

            {/* Dropzone Box or File Preview with Remove Button */}
            {isExtracting ? (
              <SortingLoader message="Extracting Data Columns..." subtext="Parsing spreadsheet matrix into array..." />
            ) : uploadedFile ? (
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{uploadedFile.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  {/* PROMINENT REMOVE FILE BUTTON */}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-all text-xs flex items-center gap-1 shrink-0"
                    title="Remove this file and choose another"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium hidden sm:inline">Remove</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-300/80 bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> File uploaded
                  </span>
                  <span>Click confirm below</span>
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
                  isDragActive
                    ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950/30'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-300">
                    {isDragActive ? 'Drop file here' : 'Drop dataset or click to browse'}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    .XLSX, .XLS, .CSV, .TXT (up to 25MB)
                  </p>
                </div>
              </div>
            )}

            {/* Column / Sheet Selection if Excel or CSV */}
            {fileInspection && uploadedFile && !isExtracting && (
              <div className="space-y-2 pt-1">
                {fileInspection.sheets?.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400 w-16">Sheet:</span>
                    <select
                      value={selectedSheet}
                      onChange={(e) => setSelectedSheet(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white"
                    >
                      {fileInspection.sheets.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                {fileInspection.columns?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400 w-16">Column:</span>
                    <select
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(Number(e.target.value))}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white"
                    >
                      {fileInspection.columns.map((c) => (
                        <option key={c.index} value={c.index}>
                          {c.name} {c.isNumeric ? '(✓)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* USER MUST CLICK THIS BUTTON TO EXTRACT AND REVEAL NEXT STEP */}
          <button
            onClick={handleFileExtract}
            disabled={!fileInspection || isExtracting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-40 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Confirm File Extraction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Dataset Summary Indicator */}
      {datasetSummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-zinc-950/70 border border-white/10 flex items-center justify-between text-xs text-zinc-300"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Active Dataset:</span>
            <span>{datasetSummary.label}</span>
          </div>
          <span className="font-mono text-zinc-500 text-[11px]">
            Mode selection unlocked below ↓
          </span>
        </motion.div>
      )}
    </section>
  );
};

export default InputSection;
