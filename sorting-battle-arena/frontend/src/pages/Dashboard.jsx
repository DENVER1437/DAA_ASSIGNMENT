import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Keyboard,
  Dice5,
  UploadCloud,
  ArrowUpDown,
  Play,
  Swords,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Layers,
  Sparkles
} from 'lucide-react';
import UploadZone from '../components/UploadZone';
import DatasetAnalyzerCard from '../components/DatasetAnalyzerCard';
import SplitPreview from '../components/SplitPreview';
import { generateDataset, formatNumber } from '../utils/datasetGenerators';
import { useToast } from '../components/Toast';
import sortingApi from '../services/api';

export const Dashboard = ({
  dataset,
  setDataset,
  datasetSource,
  setDatasetSource,
  datasetAnalysis,
  setDatasetAnalysis,
  onNavigateToBattle,
  onNavigateToBenchmark,
  sortedPreview,
  setSortedPreview
}) => {
  const { addToast } = useToast();

  // Card 1: Manual Input State
  const [manualText, setManualText] = useState('45, 12, 89, 7, 31, 64, 22, 90, 18, 53');
  const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
  const [manualValidation, setManualValidation] = useState({ valid: true, count: 10, error: null });

  // Card 2: Generator State
  const [generatorSize, setGeneratorSize] = useState(50);
  const [generatorType, setGeneratorType] = useState('random');

  // Handle Manual Input Change & Live Validation
  const handleManualChange = (e) => {
    const val = e.target.value;
    setManualText(val);

    const parts = val.split(/[\s,;\t\r\n]+/).filter(Boolean);
    let allValid = true;
    for (const p of parts) {
      if (isNaN(Number(p))) {
        allValid = false;
        break;
      }
    }

    if (parts.length === 0) {
      setManualValidation({ valid: false, count: 0, error: 'Input cannot be empty' });
    } else if (!allValid) {
      setManualValidation({ valid: false, count: parts.length, error: 'Only numeric characters are allowed' });
    } else {
      setManualValidation({ valid: true, count: parts.length, error: null });
    }
  };

  const handleApplyManual = async () => {
    const parts = manualText.split(/[\s,;\t\r\n]+/).filter(Boolean);
    const numbers = parts.map(Number).filter((n) => !isNaN(n));

    if (numbers.length === 0) {
      addToast('Please enter at least one valid number.', 'warning');
      return;
    }

    setDataset(numbers);
    setDatasetSource('Manual Input');
    setSortedPreview([]);

    try {
      const res = await sortingApi.analyzeDataset(numbers);
      if (res.success) {
        setDatasetAnalysis(res.analysis);
        addToast(`Loaded ${numbers.length} numbers from manual input!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(`Dataset loaded (${numbers.length} items)`, 'info');
    }
  };

  // Handle Random Generation
  const handleGenerate = async () => {
    const generated = generateDataset(generatorSize, generatorType, 1, 1000);
    setDataset(generated);
    setDatasetSource(`Generated (${generatorType.replace('_', ' ')} - ${formatNumber(generated.length)} items)`);
    setSortedPreview([]);

    try {
      const res = await sortingApi.analyzeDataset(generated);
      if (res.success) {
        setDatasetAnalysis(res.analysis);
        addToast(`Generated ${formatNumber(generated.length)} elements!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(`Generated ${formatNumber(generated.length)} elements!`, 'info');
    }
  };

  // Handle File Upload Callback
  const handleDataLoadedFromFile = (numbers, filename, analysis) => {
    setDataset(numbers);
    setDatasetSource(filename);
    setSortedPreview([]);
    if (analysis) {
      setDatasetAnalysis(analysis);
    }
  };

  // Quick Run Single Sort on Dashboard
  const [sortingLoading, setSortingLoading] = useState(false);
  const handleQuickSort = async () => {
    if (!dataset || dataset.length === 0) {
      addToast('Please load or generate a dataset first!', 'warning');
      return;
    }

    setSortingLoading(true);
    try {
      const res = await sortingApi.sortDataset({
        numbers: dataset,
        algorithm: 'quick',
        order,
        outputFormat: 'csv'
      });

      if (res.success) {
        setSortedPreview(res.primary.sortedPreview || []);
        addToast(`Quick sort completed in ${res.primary.executionTimeMs} ms!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Sort failed', 'error');
    } finally {
      setSortingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-6 rounded-3xl bg-zinc-900/60 border border-white/10 glass-panel">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Active Dataset Workspace
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {datasetSource || 'No Dataset Selected'}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {dataset ? `${formatNumber(dataset.length)} elements loaded and ready` : 'Choose an input method below'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Ascending / Descending Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-zinc-950/80 border border-white/10 text-xs">
            <button
              onClick={() => setOrder('asc')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                order === 'asc' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ascending ↑
            </button>
            <button
              onClick={() => setOrder('desc')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                order === 'desc' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Descending ↓
            </button>
          </div>

          <button
            onClick={onNavigateToBattle}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all"
          >
            <Swords className="w-4 h-4" />
            <span>Duel in Arena</span>
          </button>

          <button
            onClick={onNavigateToBenchmark}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-semibold text-xs transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>Run Benchmark</span>
          </button>
        </div>
      </div>

      {/* Three Large Input Cards (Mandatory Specification) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Manual Input */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Keyboard className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                Card 1 • Manual
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Manual Input</h3>
              <p className="text-xs text-zinc-400">Type comma-separated or newline numbers with live validation.</p>
            </div>

            <textarea
              rows={4}
              value={manualText}
              onChange={handleManualChange}
              placeholder="e.g. 45, 12, 89, 7, 31, 64"
              className="w-full p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-700/60 focus:border-blue-500 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
            />

            {/* Validation Indicator */}
            <div className="flex items-center justify-between text-xs">
              {manualValidation.valid ? (
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid sequence ({manualValidation.count} items)
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {manualValidation.error}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleApplyManual}
            disabled={!manualValidation.valid}
            className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-white/10 disabled:opacity-40 transition-colors"
          >
            Apply Manual Dataset
          </button>
        </div>

        {/* Card 2: Random Dataset Generator */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Dice5 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                Card 2 • Generator
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Random Generator</h3>
              <p className="text-xs text-zinc-400">Choose distribution type and scale from 10 to 100,000 elements.</p>
            </div>

            {/* Size Selector Slider & Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Array Size:</span>
                <span className="font-mono font-bold text-white">{formatNumber(generatorSize)} elements</span>
              </div>
              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={generatorSize}
                onChange={(e) => setGeneratorSize(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span>10 (Visualizer)</span>
                <span>500</span>
                <span>5,000 (Stress test)</span>
              </div>
            </div>

            {/* Distribution Type Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Distribution Type:</label>
              <select
                value={generatorType}
                onChange={(e) => setGeneratorType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
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
            onClick={handleGenerate}
            className="w-full py-2.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 font-semibold text-xs transition-colors"
          >
            Generate {generatorType.replace('_', ' ')} Array
          </button>
        </div>

        {/* Card 3: File Upload */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                Card 3 • Ingestion
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">File Upload</h3>
              <p className="text-xs text-zinc-400">Upload Excel, CSV, or TXT datasets with automatic column extraction.</p>
            </div>

            <UploadZone onDataLoaded={handleDataLoadedFromFile} />
          </div>
        </div>
      </div>

      {/* Dataset Analyzer Intelligence Section */}
      {datasetAnalysis && (
        <DatasetAnalyzerCard analysis={datasetAnalysis} />
      )}

      {/* Before & After Split Preview */}
      <SplitPreview
        originalData={dataset || []}
        sortedData={sortedPreview || []}
        onDownload={handleQuickSort}
      />
    </div>
  );
};

export default Dashboard;
