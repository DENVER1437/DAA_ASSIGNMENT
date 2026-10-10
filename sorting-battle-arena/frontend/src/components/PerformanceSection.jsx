import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Trophy,
  Download,
  ArrowUpDown,
  Sparkles,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  CartesianGrid
} from 'recharts';
import sortingApi from '../services/api';
import { useToast } from './Toast';

// Smooth count-up ticker for empirical metrics
const AnimatedNumber = ({ value, decimals = 0, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(() => Number(value) || 0);

  useEffect(() => {
    const end = Number(value) || 0;
    const duration = 800;
    const startTime = performance.now();

    const frame = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = end * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setDisplayValue(end);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  return (
    <span>
      {prefix}
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString()}
      {suffix}
    </span>
  );
};

export const PerformanceSection = ({
  battleResults = [],
  inputType = 'manual',
  downloadInfo = null,
  datasetSize = 0
}) => {
  const { addToast } = useToast();
  const [activeMetricTab, setActiveMetricTab] = useState('time'); // 'time', 'comparisons', 'swaps'

  if (!battleResults || battleResults.length === 0) {
    return null;
  }

  // Determine winner (lowest execution time)
  const sortedByTime = [...battleResults].sort((a, b) => a.executionTimeMs - b.executionTimeMs);
  const champion = sortedByTime[0];

  // Chart data ONLY for algorithms that ran
  const chartData = battleResults.map((item) => ({
    name: item.name.replace(' Sort', ''),
    fullName: item.name,
    time: Number(item.executionTimeMs.toFixed(3)),
    comparisons: item.comparisons,
    swaps: item.swaps
  }));

  const handleDownload = () => {
    if (downloadInfo?.filename) {
      window.open(sortingApi.getDownloadUrl(downloadInfo.filename), '_blank');
      addToast(`Downloading ${downloadInfo.filename}...`, 'success');
    }
  };

  const getMetricLabel = () => {
    switch (activeMetricTab) {
      case 'time': return 'Execution Time (ms)';
      case 'comparisons': return 'Total Comparisons';
      case 'swaps': return 'Total Swaps / Shifts';
      default: return '';
    }
  };

  const formatBarValue = (val) => {
    if (val === undefined || val === null) return '';
    if (activeMetricTab === 'time') return `${val} ms`;
    return Number(val).toLocaleString();
  };

  // Gradient configurations for the bars
  const barGradients = [
    { id: 'gradCrimson1', start: '#FF3B47', end: '#C62832' },
    { id: 'gradCrimson2', start: '#E5383B', end: '#843C43' },
    { id: 'gradCrimson3', start: '#C62832', end: '#581C20' },
    { id: 'gradCrimson4', start: '#843C43', end: '#300C0F' },
    { id: 'gradCrimson5', start: '#A1A1AA', end: '#424553' },
    { id: 'gradCrimson6', start: '#FF5A64', end: '#843C43' }
  ];

  return (
    <section id="performance-section" className="relative py-10 sm:py-14 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Restored Original Section Header & Conditional Download Button */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-white/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C62832] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Step 4 • Empirical Analytics & Export
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Performance Results
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Comparing exactly {battleResults.length} selected algorithm{battleResults.length > 1 ? 's' : ''} on {datasetSize.toLocaleString()} elements.
          </p>
        </div>

        {/* CONDITIONAL DOWNLOAD BUTTON */}
        {inputType === 'file' && downloadInfo ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C62832] to-[#E5383B] hover:from-[#E5383B] hover:to-[#FF3B47] text-white font-bold text-xs shadow-lg shadow-[#C62832]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download Sorted {downloadInfo.format.toUpperCase()}</span>
            </button>
            <span className="block text-[10px] text-zinc-400 text-right mt-1 font-mono">
              Output matches uploaded format
            </span>
          </motion.div>
        ) : (
          <div className="p-2.5 rounded-xl bg-[#111216] border border-white/5 text-right">
            <span className="text-xs text-zinc-400 font-medium block">Export Status:</span>
            <span className="text-[11px] text-zinc-500 font-mono">
              Downloads only generated for File Upload mode
            </span>
          </div>
        )}
      </div>

      {/* Champion Winner Spotlight Card */}
      {champion && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-2xl bg-[#0B0C10]/75 backdrop-blur-xl border border-[#C62832]/40 shadow-[0_8px_32px_rgba(198,40,50,0.2)] flex items-center justify-between flex-wrap gap-4 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-xl bg-[#C62832]/20 border border-[#C62832]/40 flex items-center justify-center text-[#FF5A64] shadow-md">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C62832] flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" /> Fastest Algorithm
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">{champion.name}</h3>
              <p className="text-xs text-zinc-300 mt-0.5">
                Completed in{' '}
                <span className="text-white font-bold font-mono text-sm">
                  <AnimatedNumber value={champion.executionTimeMs} decimals={3} suffix=" ms" />
                </span>{' '}
                with{' '}
                <span className="text-white font-bold font-mono">
                  <AnimatedNumber value={champion.comparisons} />
                </span>{' '}
                comparisons and{' '}
                <span className="text-[#FF5A64] font-bold font-mono">
                  <AnimatedNumber value={champion.swaps} />
                </span>{' '}
                swaps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2.5 rounded-xl bg-[#18191F] border border-white/10 text-center min-w-[90px]">
              <span className="text-zinc-400 block text-[9px] uppercase font-mono">Space Auxiliary</span>
              <span className="font-mono font-bold text-white text-xs">{champion.complexity?.space || 'O(1)'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#18191F] border border-white/10 text-center min-w-[90px]">
              <span className="text-zinc-400 block text-[9px] uppercase font-mono">Time Complexity</span>
              <span className="font-mono font-bold text-[#C62832] text-xs">{champion.complexity?.average || 'O(N log N)'}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* PERFORMANCE TABLE */}
      <div className="rounded-2xl bg-[#0B0C10]/65 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#C62832]" />
            <span>Comparative Performance Table</span>
          </h4>
          <span className="text-xs text-zinc-400 font-mono">N = {datasetSize.toLocaleString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-[#08090C]/80 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4 sm:px-5">Algorithm</th>
                <th className="py-3 px-4 sm:px-5">Execution Time</th>
                <th className="py-3 px-4 sm:px-5">Comparisons</th>
                <th className="py-3 px-4 sm:px-5">Swaps / Shifts</th>
                <th className="py-3 px-4 sm:px-5">Space (Auxiliary)</th>
                <th className="py-3 px-4 sm:px-5">Stability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {battleResults.map((item, idx) => (
                <motion.tr
                  key={item.id || idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`hover:bg-zinc-800/40 transition-colors ${
                    item.name === champion?.name ? 'bg-[#C62832]/5' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 sm:px-5 font-bold text-white flex items-center gap-2">
                    <span className="text-xs sm:text-sm">{item.name}</span>
                    {item.name === champion?.name && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C62832]/20 text-[#FF5A64] border border-[#C62832]/40 font-mono">
                        Winner #1
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 font-mono font-bold text-white text-xs sm:text-sm">
                    <AnimatedNumber value={item.executionTimeMs} decimals={3} suffix=" ms" />
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 font-mono text-zinc-200">
                    <AnimatedNumber value={item.comparisons} />
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 font-mono text-[#FF5A64] font-semibold">
                    <AnimatedNumber value={item.swaps} />
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 font-mono text-white font-semibold">
                    {item.complexity?.space || 'O(1)'}
                  </td>
                  <td className="py-3.5 px-4 sm:px-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      item.complexity?.stable
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {item.complexity?.stable ? 'Stable' : 'Unstable'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DYNAMIC CHARTS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-5 sm:p-6 rounded-2xl bg-[#0B0C10]/65 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/5 pb-3">
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C62832]" />
              <span>Visual Comparative Chart</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Values displayed directly on bars for {battleResults.length} selected algorithm{battleResults.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#08090B] border border-white/10 text-xs">
            <button
              onClick={() => setActiveMetricTab('time')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMetricTab === 'time'
                  ? 'bg-[#C62832] text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Time (ms)
            </button>
            <button
              onClick={() => setActiveMetricTab('comparisons')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMetricTab === 'comparisons'
                  ? 'bg-[#C62832] text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Comparisons
            </button>
            <button
              onClick={() => setActiveMetricTab('swaps')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMetricTab === 'swaps'
                  ? 'bg-[#C62832] text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Swaps
            </button>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-72 sm:h-84 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 28, right: 20, left: 5, bottom: 8 }}
            >
              <defs>
                {barGradients.map((g) => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={g.start} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={g.end} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid stroke="#22242C" strokeDasharray="3 3" vertical={false} opacity={0.6} />

              <XAxis
                dataKey="name"
                stroke="#a1a1aa"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
              />

              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
                tickFormatter={(val) => activeMetricTab === 'time' ? `${val}ms` : val.toLocaleString()}
              />

              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)', radius: 8 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-[#08090B] border border-white/15 backdrop-blur-xl shadow-xl text-xs space-y-1 min-w-[130px]">
                        <span className="font-extrabold text-white text-xs block">{data.fullName}</span>
                        <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-white/5 font-mono">
                          <span>{getMetricLabel()}:</span>
                          <span className="font-bold text-[#FF5A64] ml-2">
                            {formatBarValue(data[activeMetricTab])}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar
                dataKey={activeMetricTab}
                maxBarSize={60}
                radius={[8, 8, 0, 0]}
                animationDuration={700}
              >
                <LabelList
                  dataKey={activeMetricTab}
                  position="top"
                  offset={10}
                  fill="#ffffff"
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="Inter, monospace"
                  formatter={formatBarValue}
                />

                {chartData.map((entry, index) => {
                  const grad = barGradients[index % barGradients.length];
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#${grad.id})`}
                      style={{ filter: `drop-shadow(0 4px 10px ${grad.start}40)` }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
};

export default PerformanceSection;
