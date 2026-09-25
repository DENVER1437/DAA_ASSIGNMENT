import React from 'react';
import { BookOpen, ShieldCheck, ShieldAlert } from 'lucide-react';

export const ComplexitySection = () => {
  const algorithms = [
    {
      name: 'Bubble Sort',
      color: 'bg-blue-500',
      best: 'O(N)',
      avg: 'O(N²)',
      worst: 'O(N²)',
      space: 'O(1)',
      stable: true,
      definition: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.'
    },
    {
      name: 'Selection Sort',
      color: 'bg-amber-500',
      best: 'O(N²)',
      avg: 'O(N²)',
      worst: 'O(N²)',
      space: 'O(1)',
      stable: false,
      definition: 'Finds the minimum element from the unsorted part and places it at the beginning, repeating for each position.'
    },
    {
      name: 'Insertion Sort',
      color: 'bg-emerald-500',
      best: 'O(N)',
      avg: 'O(N²)',
      worst: 'O(N²)',
      space: 'O(1)',
      stable: true,
      definition: 'Builds the sorted array one item at a time by picking each element and inserting it into its correct position.'
    },
    {
      name: 'Merge Sort',
      color: 'bg-purple-500',
      best: 'O(N log N)',
      avg: 'O(N log N)',
      worst: 'O(N log N)',
      space: 'O(N)',
      stable: true,
      definition: 'Divides the array into two halves, recursively sorts each half, and merges the sorted halves back together.'
    },
    {
      name: 'Quick Sort',
      color: 'bg-rose-500',
      best: 'O(N log N)',
      avg: 'O(N log N)',
      worst: 'O(N²)',
      space: 'O(log N)',
      stable: false,
      definition: 'Selects a pivot, partitions array into smaller and greater elements, and recursively sorts both subarrays.'
    },
    {
      name: 'Heap Sort',
      color: 'bg-cyan-500',
      best: 'O(N log N)',
      avg: 'O(N log N)',
      worst: 'O(N log N)',
      space: 'O(1)',
      stable: false,
      definition: 'Converts array into a binary max-heap, then repeatedly extracts the root maximum element to the end.'
    }
  ];

  return (
    <section id="complexity-section" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center justify-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Step 5 • Algorithmic Theory & Specs
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Algorithm Complexity & Overview
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Compact comparative reference of asymptotic bounds, memory usage, stability, and definitions.
        </p>
      </div>

      {/* Small Clean Comparative Table */}
      <div className="rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-950/60 text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                <th className="py-3.5 px-5">Algorithm</th>
                <th className="py-3.5 px-4 text-center">Best Case</th>
                <th className="py-3.5 px-4 text-center">Average Case</th>
                <th className="py-3.5 px-4 text-center">Worst Case</th>
                <th className="py-3.5 px-4 text-center">Space</th>
                <th className="py-3.5 px-4 text-center">Stability</th>
                <th className="py-3.5 px-5 min-w-[280px]">Definition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {algorithms.map((algo) => (
                <tr key={algo.name} className="hover:bg-zinc-800/40 transition-colors">
                  {/* Algorithm Name with Dot */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${algo.color} shrink-0`} />
                      <span className="font-extrabold text-white text-sm whitespace-nowrap">{algo.name}</span>
                    </div>
                  </td>

                  {/* Best Case */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      algo.best === 'O(N)'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    }`}>
                      {algo.best}
                    </span>
                  </td>

                  {/* Average Case */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      algo.avg.includes('log N')
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {algo.avg}
                    </span>
                  </td>

                  {/* Worst Case */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      algo.worst.includes('log N')
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {algo.worst}
                    </span>
                  </td>

                  {/* Space */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      algo.space === 'O(1)'
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        : algo.space === 'O(log N)'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                    }`}>
                      {algo.space}
                    </span>
                  </td>

                  {/* Stability */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      algo.stable
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {algo.stable ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Stable</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3 text-zinc-500" />
                          <span>Unstable</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Small Definition */}
                  <td className="py-3.5 px-5 text-zinc-300 text-xs leading-relaxed">
                    {algo.definition}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComplexitySection;
