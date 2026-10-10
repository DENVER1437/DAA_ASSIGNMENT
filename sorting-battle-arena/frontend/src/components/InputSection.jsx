import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Keyboard,
  Dice5,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
  ArrowRight
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
    <section id="input-section" className="relative py-10 sm:py-14 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Restored Original Section Header */}
      <div className="text-center space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C62832]">
          Step 1 • Dataset Configuration
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Choose Your Input Type
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Supply your numbers via Manual Input, Synthetic Generation, or File Upload.
        </p>
      </div>

      {/* 3 Compact Tactile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* CARD 1: MANUAL INPUT */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className={`group relative p-5 sm:p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between space-y-4 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] ${
            activeInputType === 'manual'
              ? 'border-[#C62832] shadow-[0_0_30px_-5px_rgba(198,40,50,0.35)] bg-[#12131A]/75 ring-1 ring-[#C62832]/40'
              : 'bg-[#0B0C10]/65 border-white/10 hover:border-[#C62832]/40 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]'
          }`}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#14151B]/80 border border-white/10 flex items-center justify-center text-[#C62832] shadow-sm">
                <Keyboard className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#14151B]/80 text-zinc-300 border border-white/10">
                Live Validation
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Manual Input</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Type custom comma-separated numbers.</p>
            </div>

            <textarea
              rows={3}
              value={manualText}
              onChange={(e) => {
                setManualText(e.target.value);
                setManualError(null);
              }}
              placeholder="e.g. 45, 12, 89, 7, 31, 64"
              className="w-full p-3 rounded-xl bg-[#07080A]/80 border border-zinc-700/60 focus:border-[#C62832] text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors resize-none shadow-inner"
            />

            {/* Counters & Live Feedback */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono text-[11px]">
                {manualText.length} chars • {parsedManualCount} items
              </span>
              {manualError ? (
                <span className="text-rose-400 flex items-center gap-1 font-medium text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" /> {manualError}
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleManualSubmit}
            className="w-full py-3 rounded-xl bg-[#C62832] hover:bg-[#E5383B] text-white font-bold text-xs shadow-md shadow-[#C62832]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Apply Manual Dataset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* CARD 2: RANDOM GENERATOR */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className={`group relative p-5 sm:p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between space-y-4 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] ${
            activeInputType === 'random'
              ? 'border-[#C62832] shadow-[0_0_30px_-5px_rgba(198,40,50,0.35)] bg-[#12131A]/75 ring-1 ring-[#C62832]/40'
              : 'bg-[#0B0C10]/65 border-white/10 hover:border-[#C62832]/40 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]'
          }`}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#14151B]/80 border border-white/10 flex items-center justify-center text-[#C62832] shadow-sm">
                <Dice5 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#14151B]/80 text-zinc-300 border border-white/10">
                Synthetic Scale
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Random Generator</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Synthesize structured data distributions.</p>
            </div>

            {/* Slider */}
            <div className="space-y-1.5 pt-0.5">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C62832]"
              />
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>10 (Visual)</span>
                <span>100</span>
                <span>500</span>
              </div>
            </div>

            {/* Distribution Type Selection */}
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Distribution Type:</label>
              <select
                value={genType}
                onChange={(e) => setGenType(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#07080A]/80 border border-zinc-700/60 text-xs text-zinc-100 focus:outline-none focus:border-[#C62832]"
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
            className="w-full py-3 rounded-xl bg-[#C62832] hover:bg-[#E5383B] text-white font-bold text-xs shadow-md shadow-[#C62832]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Generate & Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* CARD 3: FILE UPLOAD */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className={`group relative p-5 sm:p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between space-y-4 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] ${
            activeInputType === 'file'
              ? 'border-[#C62832] shadow-[0_0_30px_-5px_rgba(198,40,50,0.35)] bg-[#12131A]/75 ring-1 ring-[#C62832]/40'
              : 'bg-[#0B0C10]/65 border-white/10 hover:border-[#C62832]/40 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]'
          }`}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#18191F] border border-white/10 flex items-center justify-center text-[#C62832] shadow-md">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C62832]/10 text-rose-300 border border-[#C62832]/30 font-bold">
                Enables Download ✓
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">File Upload</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Ingest Excel (.xlsx/.xls), CSV, or TXT.</p>
            </div>

            {/* Dropzone Box or File Preview */}
            {isUploading ? (
              <SortingLoader message="Uploading Dataset File..." subtext="Transferring file to server..." />
            ) : isExtracting ? (
              <SortingLoader message="Extracting Data Columns..." subtext="Parsing spreadsheet matrix into array..." />
            ) : uploadedFile ? (
              <div className="p-3 rounded-xl bg-[#08090B] border border-zinc-700/60 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <FileSpreadsheet className="w-4 h-4 text-[#C62832] shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{uploadedFile.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 rounded-lg bg-zinc-800 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-400 border border-white/10 transition-all text-xs flex items-center gap-1 shrink-0"
                    title="Remove this file and choose another"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">Remove</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-300 bg-[#18191F] px-2 py-1 rounded-lg border border-white/5">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#C62832]" /> File uploaded
                  </span>
                  <span className="text-[10px] text-zinc-400">Click confirm below</span>
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
                  isDragActive
                    ? 'border-[#C62832] bg-[#C62832]/10 scale-[1.01]'
                    : 'border-zinc-700 hover:border-zinc-500 bg-[#08090B]/60'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-zinc-300">
                    {isDragActive ? 'Drop file here' : 'Drop dataset or click to browse'}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    .XLSX, .XLS, .CSV, .TXT (up to 25MB)
                  </p>
                </div>
              </div>
            )}

            {/* Column / Sheet Selection */}
            {fileInspection && uploadedFile && !isExtracting && !isUploading && (
              <div className="space-y-1.5 pt-0.5">
                {fileInspection.sheets?.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400 w-14">Sheet:</span>
                    <select
                      value={selectedSheet}
                      onChange={(e) => setSelectedSheet(e.target.value)}
                      className="flex-1 px-2 py-1 rounded-lg bg-[#08090B] border border-zinc-700 text-xs text-white"
                    >
                      {fileInspection.sheets.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                {fileInspection.columns?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400 w-14">Column:</span>
                    <select
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(Number(e.target.value))}
                      className="flex-1 px-2 py-1 rounded-lg bg-[#08090B] border border-zinc-700 text-xs text-white"
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

          <button
            onClick={handleFileExtract}
            disabled={!fileInspection || isExtracting || isUploading}
            className="w-full py-3 rounded-xl bg-[#C62832] hover:bg-[#E5383B] text-white font-bold text-xs shadow-md shadow-[#C62832]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-40 hover:scale-[1.01] active:scale-[0.99]"
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
          className="p-3.5 rounded-xl bg-[#111216] border border-white/10 flex items-center justify-between text-xs text-zinc-300"
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
