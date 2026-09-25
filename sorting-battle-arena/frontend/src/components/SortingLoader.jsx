import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu } from 'lucide-react';

export const SortingLoader = ({
  message = 'Processing Dataset...',
  subtext = 'Running manual sorting algorithms...'
}) => {
  const [activeMessageIdx, setActiveMessageIdx] = useState(0);

  const messages = [
    'Reading Dataset...',
    'Running Merge Sort...',
    'Partitioning Arrays & Benchmarking...',
    'Synthesizing Empirical Complexity Data...',
    'Generating Output File...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMessageIdx((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // 7 vertical animated bars that continuously sort/shift heights and colors
  const bars = [
    { id: 1, initialH: 25, targetH: 85, color: 'from-blue-500 to-cyan-400' },
    { id: 2, initialH: 70, targetH: 30, color: 'from-purple-500 to-indigo-400' },
    { id: 3, initialH: 40, targetH: 90, color: 'from-amber-500 to-yellow-300' },
    { id: 4, initialH: 95, targetH: 20, color: 'from-rose-500 to-pink-400' },
    { id: 5, initialH: 35, targetH: 60, color: 'from-emerald-500 to-teal-300' },
    { id: 6, initialH: 80, targetH: 45, color: 'from-violet-500 to-purple-300' },
    { id: 7, initialH: 55, targetH: 75, color: 'from-cyan-500 to-blue-400' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-6 text-center">
      {/* Container with ambient glow */}
      <div className="relative p-6 rounded-3xl bg-zinc-950/80 border border-white/10 glass-panel shadow-2xl flex flex-col items-center justify-center min-w-[280px]">
        {/* Animated Sorting Bars Canvas */}
        <div className="flex items-end justify-center gap-2 h-24 w-44 pb-2 border-b border-white/5 relative">
          {/* Floating glowing particle dots */}
          <motion.div
            animate={{
              x: [-15, 20, -10],
              y: [-10, 15, -5],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 left-6 w-2 h-2 rounded-full bg-blue-400 blur-[1px] shadow-[0_0_10px_#60a5fa]"
          />
          <motion.div
            animate={{
              x: [10, -15, 12],
              y: [5, -12, 8],
              opacity: [0.4, 0.9, 0.4],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 right-8 w-2 h-2 rounded-full bg-purple-400 blur-[1px] shadow-[0_0_10px_#c084fc]"
          />

          {bars.map((bar, i) => (
            <motion.div
              key={bar.id}
              animate={{
                height: [`${bar.initialH}%`, `${bar.targetH}%`, `${bar.initialH}%`],
                opacity: [0.75, 1, 0.75]
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut'
              }}
              className={`w-3.5 rounded-t-md bg-gradient-to-t ${bar.color} shadow-lg shadow-blue-500/20`}
            />
          ))}
        </div>

        {/* Dynamic Status Ticker */}
        <div className="pt-4 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.span
                key={activeMessageIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="font-mono text-[11px]"
              >
                {messages[activeMessageIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">
            {subtext}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SortingLoader;
