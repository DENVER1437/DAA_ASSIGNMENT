import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Trophy,
  Download,
  Clock,
  ArrowUpDown,
  Repeat,
  HardDrive,
  FileCheck2,
  Sparkles,
  Zap,
  TrendingDown,
  TrendingUp
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
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const end = Number(value) || 0;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 900;
    const startTime = performance.now();

    const frame = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
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
      case 'comparisons': return 'Total Comparisons (Count)';
      case 'swaps': return 'Total Swaps / Shifts (Count)';
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
    { id: 'gradBlue', start: '#3B82F6', end: '#1D4ED8' },
    { id: 'gradPurple', start: '#8B5CF6', end: '#6D28D9' },
    { id: 'gradEmerald', start: '#10B981', end: '#047857' },
    { id: 'gradPink', start: '#F43F5E', end: '#BE123C' },
    { id: 'gradAmber', start: '#F59E0B', end: '#B45309' },
    { id: 'gradCyan', start: '#06B6D4', end: '#0E7490' }
  ];

  return (
    <section id="performance-section" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header & Conditional Download Button */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Step 4 • Empirical Analytics & Export
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
            Performance Results
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Comparing exactly {battleResults.length} selected algorithm{battleResults.length > 1 ? 's' : ''} on {datasetSize.toLocaleString()} elements.
          </p>
        </div>

        {/* CONDITIONAL DOWNLOAD BUTTON: ONLY SHOWN IF FILE UPLOAD WAS SELECTED */}
        {inputType === 'file' && downloadInfo ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download Sorted {downloadInfo.format.toUpperCase()}</span>
            </button>
            <span className="block text-[10px] text-zinc-400 text-right mt-1 font-mono">
              Output matches uploaded format
            </span>
          </motion.div>
        ) : (
          <div className="p-3 rounded-2xl bg-zinc-950/60 border border-white/5 text-right">
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-7 rounded-[24px] bg-gradient-to-r from-emerald-950/40 via-blue-950/30 to-purple-950/20 border border-emerald-500/30 shadow-2xl flex items-center justify-between flex-wrap gap-4 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Fastest Algorithm
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{champion.name}</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Completed in{' '}
                <span className="text-emerald-300 font-bold font-mono text-sm">
                  <AnimatedNumber value={champion.executionTimeMs} decimals={3} suffix=" ms" />
                </span>{' '}
                with{' '}
                <span className="text-zinc-100 font-bold font-mono">
                  <AnimatedNumber value={champion.comparisons} />
                </span>{' '}
                comparisons and{' '}
                <span className="text-zinc-100 font-bold font-mono">
                  <AnimatedNumber value={champion.swaps} />
                </span>{' '}
                swaps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-center">
              <span className="text-zinc-400 block text-[10px] uppercase font-mono">Space Auxiliary</span>
              <span className="font-mono font-bold text-purple-400 text-sm">{champion.complexity?.space || 'O(1)'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-center">
              <span className="text-zinc-400 block text-[10px] uppercase font-mono">Time Complexity</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{champion.complexity?.average || 'O(N log N)'}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* PERFORMANCE TABLE (Animated Row Entrance) */}
      <div className="rounded-[24px] bg-zinc-900/80 border border-white/10 glass-panel overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-blue-400" />
            <span>Comparative Performance Table</span>
          </h4>
          <span className="text-xs text-zinc-400 font-mono">N = {datasetSize.toLocaleString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-950/40 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Algorithm</th>
                <th className="py-3.5 px-5">Execution Time</th>
                <th className="py-3.5 px-5">Comparisons</th>
                <th className="py-3.5 px-5">Swaps / Shifts</th>
                <th className="py-3.5 px-5">Space (Auxiliary)</th>
                <th className="py-3.5 px-5">Stability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {battleResults.map((item, idx) => (
                <motion.tr
                  key={item.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`hover:bg-zinc-800/40 transition-colors ${
                    item.name === champion?.name ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <td className="py-4 px-5 font-bold text-white flex items-center gap-2.5">
                    <span className="text-sm">{item.name}</span>
                    {item.name === champion?.name && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Winner #1
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-emerald-400 text-sm">
                    <AnimatedNumber value={item.executionTimeMs} decimals={3} suffix=" ms" />
                  </td>
                  <td className="py-4 px-5 font-mono text-zinc-200">
                    <AnimatedNumber value={item.comparisons} />
                  </td>
                  <td className="py-4 px-5 font-mono text-zinc-200">
                    <AnimatedNumber value={item.swaps} />
                  </td>
                  <td className="py-4 px-5 font-mono text-purple-400 font-semibold">
                    {item.complexity?.space || 'O(1)'}
                  </td>
                  <td className="py-4 px-5">
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

      {/* DYNAMIC CHARTS (Only for Selected Algorithms) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 sm:p-7 rounded-[24px] bg-zinc-900/80 border border-white/10 glass-panel space-y-6 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-4">
          <div>
            <h4 className="text-base font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span>Visual Comparative Chart</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Values displayed directly on bars for {battleResults.length} selected algorithm{battleResults.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-zinc-950/80 border border-white/10 text-xs">
            <button
              onClick={() => setActiveMetricTab('time')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeMetricTab === 'time'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Time (ms)
            </button>
            <button
              onClick={() => setActiveMetricTab('comparisons')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeMetricTab === 'comparisons'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Comparisons
            </button>
            <button
              onClick={() => setActiveMetricTab('swaps')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeMetricTab === 'swaps'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Swaps
            </button>
          </div>
        </div>

        {/* Recharts Bar Chart with Sleek Max Width, Gradient Fills, Values on Bars, and High Contrast */}
        <div className="h-80 sm:h-96 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 32, right: 24, left: 10, bottom: 12 }}
            >
              <defs>
                {barGradients.map((g) => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={g.start} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={g.end} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} opacity={0.6} />

              <XAxis
                dataKey="name"
                stroke="#a1a1aa"
                fontSize={13}
                fontWeight={600}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
              />

              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
                tickFormatter={(val) => activeMetricTab === 'time' ? `${val}ms` : val.toLocaleString()}
              />

              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)', radius: 12 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3.5 rounded-2xl bg-zinc-950/95 border border-white/15 backdrop-blur-xl shadow-2xl text-xs space-y-1 min-w-[140px]">
                        <span className="font-extrabold text-white text-sm block">{data.fullName}</span>
                        <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-white/5 font-mono">
                          <span>{getMetricLabel()}:</span>
                          <span className="font-bold text-emerald-400 ml-2">
                            {formatBarValue(data[activeMetricTab])}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Bar with controlled width (maxBarSize 60px) so 2 bars NEVER look gigantic and flat! */}
              <Bar
                dataKey={activeMetricTab}
                maxBarSize={64}
                radius={[12, 12, 0, 0]}
                animationDuration={800}
              >
                {/* DISPLAY EXACT VALUE PROMINENTLY ON TOP OF EACH BAR */}
                <LabelList
                  dataKey={activeMetricTab}
                  position="top"
                  offset={12}
                  fill="#ffffff"
                  fontSize={13}
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
                      style={{ filter: `drop-shadow(0 4px 14px ${grad.start}40)` }}
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
