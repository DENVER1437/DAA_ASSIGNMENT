import React from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  Zap,
  BarChart3,
  FileSpreadsheet,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Play
} from 'lucide-react';

export const Landing = ({ onStartBattle, onTryDemo }) => {
  const features = [
    {
      icon: Swords,
      title: 'Algorithm Duel Arena',
      description: 'Pit Bubble, Selection, Insertion, Merge, Quick, and Heap sort in real-time frame-by-frame 60fps head-to-head battles.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: BarChart3,
      title: 'Simultaneous Benchmarking',
      description: 'Run all 6 manual DAA implementations across up to 100,000 dataset elements with nanosecond-precision metrics.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FileSpreadsheet,
      title: 'Real-World File Ingestion',
      description: 'Parse Excel (.xlsx/.xls) with sheet/column selectors, CSV, and text files. Download formatted sorted outputs.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Cpu,
      title: 'Dataset Intelligence Analyzer',
      description: 'Pre-evaluates sortedness, entropy, duplicate density, and computes predictive algorithmic recommendations.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: ShieldCheck,
      title: 'Stability Proof Showcase',
      description: 'Interactive demonstration of equal-key preservation across stable vs unstable algorithms built for viva exams.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Zap,
      title: '100% Pure DAA Manual Code',
      description: 'Zero built-in Array.prototype.sort(). Strictly manual pointer partitioning, binary max-heaping, and merge buffers.',
      color: 'from-rose-500 to-red-500'
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 overflow-hidden mesh-gradient-bg">
      {/* Floating Glowing Blobs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 pt-8 sm:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 backdrop-blur-md shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Design & Analysis of Algorithms Practical Suite 2k26</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
        >
          Sorting Battle Arena
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
            Real-World Dataset & Algorithm Analyzer
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed font-normal"
        >
          Benchmark sorting algorithms using real-world datasets with interactive visualizations,
          step-by-step playback, duplicate stability proofs, and downloadable sorted files.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap pt-4"
        >
          <button
            onClick={onStartBattle}
            className="group relative px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all duration-200 flex items-center gap-2"
          >
            <Swords className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
            <span>Start Battle Arena</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <button
            onClick={onTryDemo}
            className="px-7 py-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-semibold text-sm transition-all duration-200 flex items-center gap-2 backdrop-blur-md shadow-lg"
          >
            <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
            <span>Try Interactive Demo</span>
          </button>
        </motion.div>
      </div>

      {/* Feature Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative z-10 max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-zinc-900/60 border border-white/5 glass-panel-interactive space-y-3"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${feat.color} p-0.5 flex items-center justify-center text-white shadow-md`}>
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{feat.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{feat.description}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Subtle Footer Banner */}
      <div className="relative z-10 text-center text-xs text-zinc-500 pt-16">
        Ready for Vercel & Render • Pure DAA Manual Implementations • 2026 Academic Edition
      </div>
    </div>
  );
};

export default Landing;
