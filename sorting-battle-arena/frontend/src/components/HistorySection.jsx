import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History as HistoryIcon,
  Download,
  Trash2,
  Calendar,
  RotateCcw,
  Sparkles,
  Layers,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import sortingApi from '../services/api';
import { useToast } from './Toast';
import SortingLoader from './SortingLoader';
import soundEffects from '../utils/soundEffects';

export const HistorySection = () => {
  const { addToast } = useToast();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await sortingApi.getHistory();
      if (res.success && res.history) {
        setHistoryList(res.history);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownload = (filename) => {
    if (!filename) return;
    soundEffects.playClick();
    window.open(sortingApi.getDownloadUrl(filename), '_blank');
    addToast(`Re-downloading ${filename}...`, 'success');
  };

  const handleClear = async () => {
    soundEffects.playClick();
    try {
      await sortingApi.clearHistory();
      setHistoryList([]);
      addToast('Battle history permanently cleared from server', 'info');
    } catch (err) {
      console.error('Failed to clear backend history:', err);
      setHistoryList([]);
      addToast('History cleared', 'info');
    }
  };

  return (
    <section id="history-section" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="p-6 rounded-[24px] bg-zinc-900/80 border border-white/10 glass-panel flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <HistoryIcon className="w-3.5 h-3.5" /> Step 6 • Audit History
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            Battle & Run History
          </h2>
          <p className="text-xs text-zinc-400">
            Records previous duel sessions. Download is only available for runs originated from File Upload.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              fetchHistory();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          {historyList.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-500/20 text-xs transition-colors font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* History Table or SortingLoader */}
      <div className="rounded-[24px] bg-zinc-900/80 border border-white/10 glass-panel overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-12 flex justify-center">
            <SortingLoader
              message="Fetching Audit Records..."
              subtext="Retrieving historical algorithm telemetry..."
            />
          </div>
        ) : historyList.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <HistoryIcon className="w-8 h-8 mx-auto opacity-30 animate-pulse" />
            <p className="text-sm font-medium">No previous battles recorded yet.</p>
            <p className="text-xs text-zinc-600">Complete an arena duel above to log historical sessions here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-950/40 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-5">Mode</th>
                  <th className="py-3.5 px-5">Algorithms</th>
                  <th className="py-3.5 px-5">Dataset Size</th>
                  <th className="py-3.5 px-5">Input Source</th>
                  <th className="py-3.5 px-5">Victor</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {historyList.map((entry, idx) => {
                  const isFileUpload = entry.inputType === 'file';

                  return (
                    <tr key={entry.id || idx} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-5 text-zinc-400 font-mono text-[11px] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700/60 font-semibold text-[11px] text-zinc-300">
                          {entry.mode || 'Battle'}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold text-white">
                        {Array.isArray(entry.algorithms) ? entry.algorithms.join(' vs ') : entry.primaryAlgorithm}
                      </td>
                      <td className="py-4 px-5 font-mono text-zinc-300">
                        {entry.datasetSize?.toLocaleString()} items
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isFileUpload
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {isFileUpload ? 'File Upload' : entry.inputType === 'random' ? 'Random Gen' : 'Manual'}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold">
                          {entry.winner}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {/* CONDITIONAL DOWNLOAD RULE IN HISTORY: ONLY IF FILE UPLOAD */}
                        {isFileUpload && entry.downloadFilename ? (
                          <button
                            onClick={() => handleDownload(entry.downloadFilename)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Again</span>
                          </button>
                        ) : (
                          <span className="text-zinc-600 text-[11px] font-mono">No download</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorySection;
