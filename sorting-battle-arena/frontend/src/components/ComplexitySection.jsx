import React from 'react';
import { BookOpen, ShieldCheck, ShieldAlert } from 'lucide-react';

export const ComplexitySection = () => {
  const algorithms = [
    {
      name: 'Bubble Sort',
      accent: '#C62832',
      best: 'O(N)',
      avg: 'O(N²)',
      worst: 'O(N²)',
      space: 'O(1)',
      stable: true,
      definition: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.'
    },
    {
      name: 'Selection Sort',
      accent: '#843C43',
      best: 'O(N²)',
      avg: 'O(N²)',
      worst: 'O(N²)',
      space: 'O(1)',
      stable: false,
      definition: 'Finds the minimum element from the unsorted part and places it at the beginning, repeating for each position.'
    },
    {
      name: 'Insertion Sort',
      accent: '#E5383B',
      best: 'O(N)',
      avg: 'O(N²)',
      worst: 'O(N²)',
      space: 'O(1)',
      stable: true,
      definition: 'Builds the sorted array one item at a time by picking each element and inserting it into its correct position.'
    },
    {
      name: 'Merge Sort',
      accent: '#A1A1AA',
      best: 'O(N log N)',
      avg: 'O(N log N)',
      worst: 'O(N log N)',
      space: 'O(N)',
      stable: true,
      definition: 'Divides the array into two halves, recursively sorts each half, and merges the sorted halves back together.'
    },
    {
      name: 'Quick Sort',
      accent: '#FF5A64',
      best: 'O(N log N)',
      avg: 'O(N log N)',
      worst: 'O(N²)',
      space: 'O(log N)',
      stable: false,
      definition: 'Selects a pivot, partitions array into smaller and greater elements, and recursively sorts both subarrays.'
    },
    {
      name: 'Heap Sort',
      accent: '#C62832',
      best: 'O(N log N)',
      avg: 'O(N log N)',
      worst: 'O(N log N)',
      space: 'O(1)',
      stable: false,
      definition: 'Converts array into a binary max-heap, then repeatedly extracts the root maximum element to the end.'
    }
  ];

  return (
    <section id="complexity-section" className="relative py-10 sm:py-14 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
      {/* Restored Original Section Header */}
      <div className="text-center space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C62832] flex items-center justify-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Step 5 • Algorithmic Theory & Specs
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Algorithm Complexity & Overview
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Compact comparative reference of asymptotic bounds, memory usage, stability, and definitions.
        </p>
      </div>

      {/* Small Clean Comparative Table */}
      <div className="rounded-2xl bg-[#0B0C10]/65 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-[#08090C]/80 text-[10px] font-bold text-zinc-300 uppercase tracking-wider font-mono">
                <th className="py-3 px-4 sm:px-5">Algorithm</th>
                <th className="py-3 px-3 text-center">Best Case</th>
                <th className="py-3 px-3 text-center">Average Case</th>
                <th className="py-3 px-3 text-center">Worst Case</th>
                <th className="py-3 px-3 text-center">Space</th>
                <th className="py-3 px-3 text-center">Stability</th>
                <th className="py-3 px-4 sm:px-5 min-w-[260px]">Definition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {algorithms.map((algo) => (
                <tr key={algo.name} className="hover:bg-zinc-800/40 transition-colors">
                  {/* Algorithm Name */}
                  <td className="py-3 px-4 sm:px-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C62832] shrink-0" />
                      <span className="font-extrabold text-white text-xs sm:text-sm whitespace-nowrap">{algo.name}</span>
                    </div>
                  </td>

                  {/* Best Case */}
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[10px] bg-[#18191F] text-emerald-400 border border-emerald-500/30">
                      {algo.best}
                    </span>
                  </td>

                  {/* Average Case */}
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[10px] bg-[#18191F] text-white border border-white/10">
                      {algo.avg}
                    </span>
                  </td>

                  {/* Worst Case */}
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[10px] bg-[#18191F] text-[#FF5A64] border border-[#C62832]/30">
                      {algo.worst}
                    </span>
                  </td>

                  {/* Space */}
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[10px] bg-[#18191F] text-zinc-300 border border-white/10">
                      {algo.space}
                    </span>
                  </td>

                  {/* Stability */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
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

                  {/* Definition */}
                  <td className="py-3 px-4 sm:px-5 text-zinc-300 text-xs leading-relaxed">
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
