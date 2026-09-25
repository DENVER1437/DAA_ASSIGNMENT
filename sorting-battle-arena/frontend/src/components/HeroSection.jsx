import React from 'react';
import { motion } from 'framer-motion';
import { Swords, ArrowDown, Sparkles, Zap, ShieldCheck, Cpu, Volume2, VolumeX } from 'lucide-react';
import soundEffects from '../utils/soundEffects';

export const HeroSection = ({ onStartSorting, isCompressed, soundEnabled, onToggleSound }) => {
  // Staggered text variants for Apple/Linear typography reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  // Mini live hero bars for instant interactive visual wow factor
  const previewBars = [
    { height: 35, color: 'from-blue-500 to-indigo-500' },
    { height: 85, color: 'from-cyan-400 to-blue-600' },
    { height: 50, color: 'from-purple-500 to-pink-500' },
    { height: 95, color: 'from-amber-400 to-rose-500' },
    { height: 25, color: 'from-emerald-400 to-teal-600' },
    { height: 70, color: 'from-violet-500 to-purple-600' },
    { height: 40, color: 'from-pink-500 to-rose-600' },
    { height: 60, color: 'from-blue-400 to-teal-400' },
  ];

  return (
    <section className={`relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ${
      isCompressed ? 'py-12 min-h-[55vh] opacity-95 scale-[0.98]' : 'py-20'
    }`}>
      {/* Floating Sound Toggle Pill in Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 right-6 z-20"
      >
        <button
          onClick={onToggleSound}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all hover:scale-105 active:scale-95"
          title={soundEnabled ? 'Mute audio' : 'Enable tactile audio effects'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-emerald-300">Audio ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-mono text-[11px] text-zinc-400">Audio Muted</span>
            </>
          )}
        </button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto space-y-8"
      >
        {/* Academic / DAA Pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-blue-950/60 border border-white/10 text-xs font-semibold text-zinc-300 backdrop-blur-xl shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
            <span className="tracking-wide">Design & Analysis of Algorithms • 2026 Platform</span>
          </div>
        </motion.div>

        {/* Hero Title with High-Impact Gradient and Depth */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] drop-shadow-2xl">
            Sorting Battle Arena
          </h1>
          <span className="block text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400">
            Interactive Dataset Sorting Platform
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-base sm:text-xl text-zinc-400 leading-relaxed font-normal"
        >
          Benchmark, visually trace, and pit 6 manual algorithms against each other in real-time. Full empirical telemetry with custom dataset exports.
        </motion.p>

        {/* Mini Interactive Preview Element */}
        <motion.div
          variants={itemVariants}
          className="max-w-md mx-auto p-4 rounded-3xl bg-zinc-950/60 border border-white/10 glass-panel shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-50" />
          <div className="relative flex items-end justify-center gap-2 h-16 w-full">
            {previewBars.map((bar, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [`${bar.height * 0.4}%`, `${bar.height}%`, `${bar.height * 0.6}%`],
                }}
                transition={{
                  duration: 2 + i * 0.25,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
                className={`w-5 rounded-t-md bg-gradient-to-t ${bar.color} shadow-lg`}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              60 FPS Engine
            </span>
            <span>Manual DAA Routines</span>
            <span className="text-purple-400">Zero .sort()</span>
          </div>
        </motion.div>

        {/* Primary CTA: Start Sorting Button with Shimmer Sweep */}
        <motion.div variants={itemVariants} className="pt-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              onStartSorting();
            }}
            className="group relative px-9 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-base shadow-[0_0_40px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_-5px_rgba(139,92,246,0.6)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 inline-flex items-center gap-3 overflow-hidden ring-1 ring-white/20"
          >
            {/* Moving Shimmer Beam */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-beam-sweep pointer-events-none" />

            <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200 text-blue-200" />
            <span>Start Sorting</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200 text-purple-200" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
