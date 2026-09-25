import React from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Percent,
  Copy,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DatasetAnalyzerCard = ({ analysis, actualWinner = null }) => {
  if (!analysis) return null;

  const {
    size,
    duplicateCount,
    duplicatePercentage,
    alreadySortedPercentage,
    reverseSortedPercentage,
    entropy,
    estimatedBestAlgorithm,
    reasoning
  } = analysis;

  const isPredictionVerified =
    actualWinner &&
    estimatedBestAlgorithm &&
    actualWinner.toLowerCase().includes(estimatedBestAlgorithm.toLowerCase());

  return (
    <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Dataset Intelligence Analyzer
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                DAA Heuristics
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Structural distribution & algorithmic complexity prediction
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-xl bg-zinc-800 text-zinc-300 font-mono border border-zinc-700">
          N = {size.toLocaleString()}
        </span>
      </div>

      {/* Grid of Key Structural Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Duplicates */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Duplicates</span>
            <Copy className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-lg font-bold text-white">
            {duplicatePercentage}%
          </div>
          <p className="text-[11px] text-zinc-500">
            {duplicateCount} duplicate items
          </p>
        </div>

        {/* Sorted % */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Sortedness</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {alreadySortedPercentage}%
          </div>
          <p className="text-[11px] text-zinc-500">
            Ascending pair ratio
          </p>
        </div>

        {/* Reverse Sorted % */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Reverse</span>
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-rose-400">
            {reverseSortedPercentage}%
          </div>
          <p className="text-[11px] text-zinc-500">
            Descending pair ratio
          </p>
        </div>

        {/* Entropy State */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Entropy State</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-amber-400 truncate">
            {entropy}
          </div>
          <p className="text-[11px] text-zinc-500">
            Distribution class
          </p>
        </div>
      </div>

      {/* Heuristic Prediction Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-zinc-900 border border-purple-500/20 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-200">
              Heuristic Prediction:
            </span>
            <span className="text-sm font-bold text-white bg-purple-500/20 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
              {estimatedBestAlgorithm}
            </span>
          </div>

          {actualWinner && (
            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl font-medium border ${
              isPredictionVerified
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}>
              {isPredictionVerified ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Prediction Matched Winner!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Winner was {actualWinner}</span>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          {reasoning}
        </p>
      </div>
    </div>
  );
};

export default DatasetAnalyzerCard;
