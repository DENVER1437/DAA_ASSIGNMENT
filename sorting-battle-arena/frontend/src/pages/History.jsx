import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Download, Trash2, Swords, Calendar, Clock, RotateCcw } from 'lucide-react';
import sortingApi from '../services/api';
import { useToast } from '../components/Toast';

export const History = ({ onReplayHistory }) => {
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
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownload = (filename) => {
    if (!filename) {
      addToast('No generated file associated with this historical record', 'info');
      return;
    }
    window.open(sortingApi.getDownloadUrl(filename), '_blank');
  };

  const handleClear = () => {
    setHistoryList([]);
    addToast('History log cleared locally', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white">Battle & Benchmark History</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Audit log of previous executions, dataset metrics, and downloadable exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {historyList.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-500/20 text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* History Table or Empty State */}
      <div className="rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel overflow-hidden">
        {historyList.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <HistoryIcon className="w-10 h-10 mx-auto opacity-30 animate-pulse" />
            <p className="text-sm font-medium">No previous battles recorded yet.</p>
            <p className="text-xs text-zinc-600">Run a duel in Battle Arena or execute a benchmark to log sessions here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-950/40 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-5">Battle Mode / Algorithms</th>
                  <th className="py-3.5 px-5">Dataset Size</th>
                  <th className="py-3.5 px-5">Victor / Champion</th>
                  <th className="py-3.5 px-5">Execution Time</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {historyList.map((entry, idx) => (
                  <tr key={entry.id || idx} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-5 text-zinc-400 font-mono text-[11px] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-5 font-bold text-white">
                      {entry.primaryAlgorithm}
                      {entry.secondaryAlgorithm && (
                        <span className="text-zinc-400 font-normal"> vs {entry.secondaryAlgorithm}</span>
                      )}
                    </td>
                    <td className="py-4 px-5 font-mono text-zinc-300">
                      {entry.datasetSize?.toLocaleString()} items
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                        {entry.winner}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-blue-400">
                      {entry.primaryTimeMs ? `${entry.primaryTimeMs} ms` : 'N/A'}
                    </td>
                    <td className="py-4 px-5 text-right">
                      {entry.downloadFilename ? (
                        <button
                          onClick={() => handleDownload(entry.downloadFilename)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/5 text-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-400" />
                          <span>Download Again</span>
                        </button>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
