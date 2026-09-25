import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, FileDown } from 'lucide-react';

export const SplitPreview = ({ originalData = [], sortedData = [], onDownload }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 12;

  if (!originalData || originalData.length === 0) {
    return null;
  }

  const filteredOriginal = originalData.filter((val) =>
    String(val).toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOriginal.length / pageSize);
  const currentOriginal = filteredOriginal.slice(page * pageSize, (page + 1) * pageSize);
  const currentSorted = (sortedData || []).slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel space-y-5">
      {/* Header with Search and Download Action */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Before & After Split Preview
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Live Comparative
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Compare initial raw sequence against algorithmically sorted output
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search value..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setPage(0);
              }}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 w-36"
            />
          </div>

          {onDownload && sortedData && sortedData.length > 0 && (
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Split Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Left Panel */}
        <div className="rounded-2xl bg-zinc-950/60 border border-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 pb-2 border-b border-white/5">
            <span className="text-blue-400 font-bold">Original Raw Input</span>
            <span className="text-[11px] text-zinc-500">{originalData.length} items</span>
          </div>

          <div className="space-y-1.5 min-h-[220px]">
            {currentOriginal.map((val, idx) => {
              const actualIdx = page * pageSize + idx;
              return (
                <motion.div
                  key={`orig-${actualIdx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-white/5 text-xs"
                >
                  <span className="font-mono text-zinc-500 text-[10px]">#{actualIdx + 1}</span>
                  <span className="font-mono font-bold text-zinc-200">{val}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sorted Right Panel */}
        <div className="rounded-2xl bg-zinc-950/60 border border-emerald-500/20 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 pb-2 border-b border-white/5">
            <span className="text-emerald-400 font-bold">Sorted Output Sequence</span>
            <span className="text-[11px] text-emerald-500/80">
              {sortedData && sortedData.length > 0 ? `${sortedData.length} items` : 'Pending Sort'}
            </span>
          </div>

          <div className="space-y-1.5 min-h-[220px]">
            {sortedData && sortedData.length > 0 ? (
              currentSorted.map((val, idx) => {
                const actualIdx = page * pageSize + idx;
                return (
                  <motion.div
                    key={`sort-${actualIdx}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs"
                  >
                    <span className="font-mono text-zinc-500 text-[10px]">#{actualIdx + 1}</span>
                    <span className="font-mono font-bold text-emerald-400">{val}</span>
                  </motion.div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500 text-center py-10">
                Run an algorithm or start battle to preview sorted dataset here.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-xs"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitPreview;
