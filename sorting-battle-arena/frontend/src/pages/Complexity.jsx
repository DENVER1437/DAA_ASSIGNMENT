import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ShieldCheck, ShieldAlert, Zap, GraduationCap } from 'lucide-react';
import ComplexityCard from '../components/ComplexityCard';
import { ALGORITHM_DETAILS } from '../utils/sortingAlgorithms';

export const Complexity = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlgos = Object.entries(ALGORITHM_DETAILS).filter(([key, val]) =>
    val.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    val.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Algorithm Complexity & Theoretical Specs
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Asymptotic time and auxiliary space bounds, stability metrics, and viva notes for DAA 2k26.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search algorithm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
          />
        </div>
      </div>

      {/* Asymptotic Master Reference Matrix */}
      <div className="rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Asymptotic Complexity Matrix
          </h4>
          <span className="text-[11px] text-zinc-400 font-mono">Big-O Bounds Reference</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-950/40 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-5">Algorithm</th>
                <th className="py-3 px-5">Best Case (Ω)</th>
                <th className="py-3 px-5">Average Case (Θ)</th>
                <th className="py-3 px-5">Worst Case (O)</th>
                <th className="py-3 px-5">Space (Auxiliary)</th>
                <th className="py-3 px-5">Stability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {Object.entries(ALGORITHM_DETAILS).map(([key, val]) => (
                <tr key={key} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-5 font-bold font-sans text-white">{val.name}</td>
                  <td className="py-3.5 px-5 text-emerald-400">{val.timeComplexity.best}</td>
                  <td className="py-3.5 px-5 text-blue-400">{val.timeComplexity.avg}</td>
                  <td className="py-3.5 px-5 text-rose-400">{val.timeComplexity.worst}</td>
                  <td className="py-3.5 px-5 text-purple-400">{val.spaceComplexity}</td>
                  <td className="py-3.5 px-5 font-sans">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        val.stable
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {val.stable ? (
                        <>
                          <ShieldCheck className="w-3 h-3" /> Yes
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3" /> No
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgos.map(([key, data]) => (
          <ComplexityCard key={key} algoKey={key} data={data} />
        ))}
      </div>

      {/* DAA Viva Cheat Sheet Section */}
      <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
          <GraduationCap className="w-5 h-5" />
          <span>DAA Viva Exam Quick Reference:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-300">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-1">
            <span className="font-bold text-white block">Why Quick Sort is preferred over Merge Sort for arrays?</span>
            <p className="text-zinc-400 leading-relaxed">
              Quick Sort works in-place ($O(\log N)$ stack) and demonstrates superior CPU cache locality with minimal memory allocation overhead.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-1">
            <span className="font-bold text-white block">Why Merge Sort is preferred for Linked Lists?</span>
            <p className="text-zinc-400 leading-relaxed">
              Merge Sort requires no random access (arrays index in $O(1)$) and can split/merge linked nodes in $O(1)$ extra space without reallocating arrays.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-1">
            <span className="font-bold text-white block">When is Insertion Sort optimal?</span>
            <p className="text-zinc-400 leading-relaxed">
              For tiny arrays ($N \le 30$) or nearly sorted arrays ($O(N)$ linear time), Insertion Sort beats divide-and-conquer algorithms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complexity;
