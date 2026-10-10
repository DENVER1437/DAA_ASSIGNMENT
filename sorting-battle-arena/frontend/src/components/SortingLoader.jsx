import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';

export const SortingLoader = ({
  message = 'Processing Dataset...',
  subtext = 'Running manual sorting algorithms...'
}) => {
  const [activeMessageIdx, setActiveMessageIdx] = useState(0);

  const messages = [
    'Parsing Raw Matrix...',
    'Partitioning Array Vectors...',
    'Executing Merge & Quick Routines...',
    'Synthesizing Empirical Complexity Data...',
    'Generating Output File Structure...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMessageIdx((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const bars = [
    { id: 1, initialH: 25, targetH: 85, color: 'from-[#843C43] to-[#C62832]' },
    { id: 2, initialH: 70, targetH: 30, color: 'from-[#C62832] to-[#FF3B47]' },
    { id: 3, initialH: 40, targetH: 90, color: 'from-[#18191F] to-[#843C43]' },
    { id: 4, initialH: 95, targetH: 20, color: 'from-[#C62832] to-[#E5383B]' },
    { id: 5, initialH: 35, targetH: 60, color: 'from-[#843C43] to-[#FF3B47]' },
    { id: 6, initialH: 80, targetH: 45, color: 'from-[#18191F] to-[#C62832]' },
    { id: 7, initialH: 55, targetH: 75, color: 'from-[#C62832] to-[#FF3B47]' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 space-y-5 text-center">
      <div className="relative p-6 rounded-2xl bg-[#111216] border border-white/[0.08] charcoal-panel shadow-2xl flex flex-col items-center justify-center min-w-[280px]">
        {/* Subtle top rim */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C62832]/60 to-transparent" />

        {/* Animated Sorting Bars Canvas */}
        <div className="flex items-end justify-center gap-2 h-20 w-44 pb-2 border-b border-white/[0.06] relative">
          {bars.map((bar, i) => (
            <motion.div
              key={bar.id}
              animate={{
                height: [`${bar.initialH}%`, `${bar.targetH}%`, `${bar.initialH}%`],
                opacity: [0.75, 1, 0.75]
              }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                delay: i * 0.14,
                ease: 'easeInOut'
              }}
              className={`w-3.5 rounded-t-sm bg-gradient-to-t ${bar.color} shadow-md`}
            />
          ))}
        </div>

        {/* Dynamic Status Ticker */}
        <div className="pt-4 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-[#C62832] uppercase tracking-wider">
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
          <p className="text-[11px] text-[#A1A1AA] font-mono">
            {subtext}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SortingLoader;
