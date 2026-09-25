import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
  Code2,
  BookOpen,
  ChevronDown
} from 'lucide-react';

export const ComplexityCard = ({ algoKey, data }) => {
  const [showCode, setShowCode] = useState(false);

  const {
    name,
    tagline,
    timeComplexity,
    spaceComplexity,
    stable,
    color,
    accentColor,
    description
  } = data;

  const pseudoCodeMap = {
    bubble: `// Bubble Sort (O(N^2))
for i = 0 to N - 1:
  swapped = false
  for j = 0 to N - i - 1:
    if arr[j] > arr[j + 1]:
      swap(arr[j], arr[j + 1])
      swapped = true
  if not swapped: break`,
    selection: `// Selection Sort (O(N^2))
for i = 0 to N - 1:
  min_idx = i
  for j = i + 1 to N:
    if arr[j] < arr[min_idx]:
      min_idx = j
  swap(arr[i], arr[min_idx])`,
    insertion: `// Insertion Sort (O(N^2) worst, O(N) best)
for i = 1 to N:
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j + 1] = arr[j]
    j = j - 1
  arr[j + 1] = key`,
    merge: `// Merge Sort (O(N log N))
function mergeSort(arr, l, r):
  if l < r:
    m = floor((l + r) / 2)
    mergeSort(arr, l, m)
    mergeSort(arr, m + 1, r)
    merge(arr, l, m, r)`,
    quick: `// Quick Sort (O(N log N) avg, O(N^2) worst)
function quickSort(arr, low, high):
  if low < high:
    pivot_idx = partition(arr, low, high)
    quickSort(arr, low, pivot_idx - 1)
    quickSort(arr, pivot_idx + 1, high)`,
    heap: `// Heap Sort (O(N log N))
// 1. Build Max Heap
for i = floor(N / 2) - 1 down to 0:
  heapify(arr, N, i)
// 2. Extract max root to end
for i = N - 1 down to 1:
  swap(arr[0], arr[i])
  heapify(arr, i, 0)`
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel flex flex-col justify-between space-y-4 hover:border-white/20 transition-all shadow-xl group"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${color}`} />
            <h3 className="text-lg font-bold text-white tracking-tight">{name}</h3>
          </div>

          {/* Stability Pill */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              stable
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            {stable ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" /> Stable
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" /> Unstable
              </>
            )}
          </span>
        </div>

        <p className="text-xs text-zinc-400 mt-1">{tagline}</p>
        <p className="text-xs text-zinc-300 mt-3 leading-relaxed">{description}</p>
      </div>

      {/* Complexity Badges Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
        {/* Best Case */}
        <div className="p-2.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-0.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Best Time</span>
          <span className="font-mono text-xs font-bold text-emerald-400">{timeComplexity.best}</span>
        </div>

        {/* Avg Case */}
        <div className="p-2.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-0.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Average Time</span>
          <span className="font-mono text-xs font-bold text-blue-400">{timeComplexity.avg}</span>
        </div>

        {/* Worst Case */}
        <div className="p-2.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-0.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Worst Time</span>
          <span className="font-mono text-xs font-bold text-rose-400">{timeComplexity.worst}</span>
        </div>

        {/* Space Complexity */}
        <div className="p-2.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-0.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Space Aux</span>
          <span className="font-mono text-xs font-bold text-purple-400">{spaceComplexity}</span>
        </div>
      </div>

      {/* Expandable Pseudo Code / Logic */}
      <div className="pt-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Code2 className="w-3.5 h-3.5 text-blue-400" /> Pseudo-Logic / Implementation
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${showCode ? 'rotate-180' : ''}`}
          />
        </button>

        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 rounded-2xl bg-zinc-950 font-mono text-[11px] text-zinc-300 border border-white/5 overflow-x-auto leading-relaxed"
          >
            <pre>{pseudoCodeMap[algoKey] || '// Code snippet'}</pre>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ComplexityCard;
