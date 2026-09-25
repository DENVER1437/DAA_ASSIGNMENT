import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Clock,
  ArrowUpDown,
  Cpu,
  CheckCircle2,
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
  Cell
} from 'recharts';

export const LeaderboardTable = ({ benchmarkData }) => {
  if (!benchmarkData || !benchmarkData.leaderboard) {
    return (
      <div className="p-8 text-center text-zinc-500 rounded-3xl bg-zinc-900/60 border border-white/5">
        No benchmark results available yet. Click "Run Full Benchmark" to test all 6 algorithms!
      </div>
    );
  }

  const { leaderboard, winner, datasetSize, predictionComparison } = benchmarkData;

  const chartData = leaderboard.map((item) => ({
    name: item.name.replace(' Sort', ''),
    time: Number(item.executionTimeMs.toFixed(3)),
    comparisons: item.comparisons,
    swaps: item.swaps
  }));

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-400" /> #1 Winner
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-400/10 text-zinc-300 border border-zinc-400/30 text-xs font-bold">
          <Medal className="w-3.5 h-3.5 text-zinc-400" /> #2
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-700/10 text-amber-500 border border-amber-700/30 text-xs font-bold">
          <Medal className="w-3.5 h-3.5 text-amber-600" /> #3
        </span>
      );
    }
    return (
      <span className="text-xs text-zinc-500 font-mono pl-3">
        #{index + 1}
      </span>
    );
  };

  const barColors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Winner Spotlight Banner */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-blue-950/30 to-purple-950/20 border border-emerald-500/30 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Trophy className="w-40 h-40 text-emerald-400" />
          </div>

          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Benchmark Champion
                </span>
                <h3 className="text-2xl font-black text-white">{winner.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Completed in <span className="text-emerald-300 font-semibold">{winner.time} ms</span> with {winner.comparisons.toLocaleString()} comparisons
                </p>
              </div>
            </div>

            {predictionComparison && (
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-xs space-y-1">
                <span className="text-zinc-400 block font-medium">DAA Heuristic Match:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  {predictionComparison.predictionMatched ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Prediction matched ({predictionComparison.predicted})
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-400" />
                      Predicted: {predictionComparison.predicted}
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Recharts Execution Time Comparison */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Execution Time (ms) Comparison</h4>
            <p className="text-xs text-zinc-400">Lower is faster (logarithmic or linear scale)</p>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-xl">
            N = {datasetSize.toLocaleString()}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="time" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard Detailed Table */}
      <div className="rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">Algorithm Benchmark Leaderboard</h4>
          <span className="text-xs text-zinc-400">All 6 manual DAA implementations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-950/40 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-5">Algorithm</th>
                <th className="py-3.5 px-5">Execution Time</th>
                <th className="py-3.5 px-5">Comparisons</th>
                <th className="py-3.5 px-5">Swaps / Shifts</th>
                <th className="py-3.5 px-5">Time Complexity</th>
                <th className="py-3.5 px-5">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {leaderboard.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-zinc-800/40 transition-colors ${
                    idx === 0 ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <td className="py-4 px-5">{getRankBadge(idx)}</td>
                  <td className="py-4 px-5 font-bold text-white flex items-center gap-2">
                    {item.name}
                    {idx === 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </td>
                  <td className="py-4 px-5 font-mono font-semibold text-emerald-400">
                    {item.executionTimeMs} ms
                  </td>
                  <td className="py-4 px-5 font-mono text-zinc-300">
                    {item.comparisons.toLocaleString()}
                  </td>
                  <td className="py-4 px-5 font-mono text-zinc-300">
                    {item.swaps.toLocaleString()}
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700/60 font-mono text-[11px] text-zinc-300">
                      {item.complexity?.average || 'O(N log N)'}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-zinc-400">
                    {item.complexity?.space || 'O(1)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTable;
