import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import sortingApi from '../services/api';

export const StabilityVisualizer = () => {
  const [demoData, setDemoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState('Merge Sort');

  const fetchStability = async () => {
    setLoading(true);
    try {
      const res = await sortingApi.getStabilityDemo();
      if (res.success) {
        setDemoData(res);
      }
    } catch (err) {
      console.error('Failed to load stability data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStability();
  }, []);

  const activeResult = demoData?.results?.find((r) => r.name === selectedAlgo) || demoData?.results?.[0];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Algorithm Stability Proof & Viva Showcase
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  DAA Practical
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                A sorting algorithm is <strong>stable</strong> if two objects with equal keys appear in the same relative order in sorted output as in input.
              </p>
            </div>
          </div>

          <button
            onClick={fetchStability}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Algorithm Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {demoData?.results?.map((res) => (
          <button
            key={res.name}
            onClick={() => setSelectedAlgo(res.name)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
              selectedAlgo === res.name
                ? 'bg-blue-600/30 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:bg-zinc-800'
            }`}
          >
            {res.theoreticalStability ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{res.name}</span>
          </button>
        ))}
      </div>

      {/* Side-by-Side Visual Proof */}
      {activeResult && demoData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Initial State */}
          <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Initial Dataset (Input Arrival Order)
              </span>
              <span className="text-xs text-zinc-500 font-mono">6 Students</span>
            </div>

            <div className="space-y-2">
              {demoData.originalDataset.map((item, idx) => {
                const isDuplicateKey = item.value === 80;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${
                      isDuplicateKey
                        ? 'bg-purple-950/20 border-purple-500/30 text-purple-200'
                        : 'bg-zinc-950/40 border-white/5 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-zinc-500">#{idx + 1}</span>
                      <span className="font-semibold text-white">{item.name}</span>
                      {isDuplicateKey && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                          Tag {item.tag}
                        </span>
                      )}
                    </div>
                    <div className="font-mono font-bold text-amber-400">
                      Marks: {item.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sorted State */}
          <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                Sorted by Marks via {activeResult.name}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                  activeResult.theoreticalStability
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {activeResult.theoreticalStability ? 'Stable' : 'Unstable'}
              </span>
            </div>

            <div className="space-y-2">
              {activeResult.sortedArray.map((item, idx) => {
                const isDuplicateKey = item.value === 80;
                return (
                  <motion.div
                    key={`${activeResult.name}-${item.id}-${idx}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${
                      isDuplicateKey
                        ? activeResult.theoreticalStability
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                        : 'bg-zinc-950/40 border-white/5 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-zinc-500">#{idx + 1}</span>
                      <span className="font-semibold text-white">{item.name}</span>
                      {isDuplicateKey && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                          activeResult.theoreticalStability
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          Tag {item.tag}
                        </span>
                      )}
                    </div>
                    <div className="font-mono font-bold text-emerald-400">
                      Marks: {item.value}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Viva Question & DAA Explanation Box */}
      {activeResult && (
        <div className="p-5 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <HelpCircle className="w-4 h-4" />
            <span>Viva Examiner Explanation & Conceptual Insight:</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {activeResult.explanation}
          </p>
          <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-[11px] text-zinc-400 font-mono">
            <strong>Key takeaway for exams:</strong> Merge Sort uses `leftItem &lt;= rightItem` when merging, guaranteeing that the element appearing earlier on the left side is chosen first. In Quick Sort and Heap Sort, elements jump across arbitrary pivot boundaries or heap tree levels, destroying relative input order.
          </div>
        </div>
      )}
    </div>
  );
};

export default StabilityVisualizer;
