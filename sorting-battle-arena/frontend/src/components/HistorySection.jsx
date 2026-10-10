import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Download,
  Trash2,
  Calendar,
  RotateCcw
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
    <section id="history-section" className="relative py-10 sm:py-14 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
      {/* Restored Original Section Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B0C10]/65 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C62832] flex items-center gap-1.5">
            <HistoryIcon className="w-3.5 h-3.5" /> Step 6 • Audit History
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          {historyList.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-500/20 text-xs transition-colors font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* History Table or SortingLoader */}
      <div className="rounded-2xl bg-[#0B0C10]/65 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden">
        {loading ? (
          <div className="py-10 flex justify-center">
            <SortingLoader
              message="Fetching Audit Records..."
              subtext="Retrieving historical algorithm telemetry..."
            />
          </div>
        ) : historyList.length === 0 ? (
          <div className="p-10 text-center text-zinc-500 space-y-2">
            <HistoryIcon className="w-8 h-8 mx-auto opacity-30 animate-pulse text-[#C62832]" />
            <p className="text-sm font-medium">No previous battles recorded yet.</p>
            <p className="text-xs text-zinc-600">Complete an arena duel above to log historical sessions here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#08090C]/80 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                  <th className="py-3 px-4 sm:px-5">Timestamp</th>
                  <th className="py-3 px-4 sm:px-5">Mode</th>
                  <th className="py-3 px-4 sm:px-5">Algorithms</th>
                  <th className="py-3 px-4 sm:px-5">Dataset Size</th>
                  <th className="py-3 px-4 sm:px-5">Input Source</th>
                  <th className="py-3 px-4 sm:px-5">Victor</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {historyList.map((entry, idx) => {
                  const isFileUpload = entry.inputType === 'file';

                  return (
                    <tr key={entry.id || idx} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-5 text-zinc-400 font-mono text-[11px] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700/60 font-semibold text-[11px] text-zinc-300">
                          {entry.mode || 'Battle'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 font-bold text-white">
                        {Array.isArray(entry.algorithms) ? entry.algorithms.join(' vs ') : entry.primaryAlgorithm}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 font-mono text-zinc-300">
                        {entry.datasetSize?.toLocaleString()} items
                      </td>
                      <td className="py-3.5 px-4 sm:px-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isFileUpload
                              ? 'bg-[#C62832]/10 text-rose-300 border-[#C62832]/30'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {isFileUpload ? 'File Upload' : entry.inputType === 'random' ? 'Random Gen' : 'Manual'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-5">
                        <span className="px-2.5 py-1 rounded-xl bg-[#C62832]/15 text-[#FF5A64] border border-[#C62832]/30 text-xs font-semibold">
                          {entry.winner}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 text-right">
                        {isFileUpload && entry.downloadFilename ? (
                          <button
                            onClick={() => handleDownload(entry.downloadFilename)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C62832]/20 hover:bg-[#C62832]/30 text-white border border-[#C62832]/40 text-xs transition-colors"
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
