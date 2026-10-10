import React from 'react';
import { motion } from 'framer-motion';
import { Swords, ArrowDown, Sparkles, Volume2, VolumeX } from 'lucide-react';
import soundEffects from '../utils/soundEffects';

export const HeroSection = ({
  onStartSorting,
  isCompressed,
  soundEnabled,
  onToggleSound
}) => {
  // Mini live hero preview bars with organic algorithmic movement
  const previewBars = [
    { height: 35, color: 'from-[#843C43] to-[#C62832]' },
    { height: 85, color: 'from-[#C62832] to-[#FF5A64]' },
    { height: 50, color: 'from-[#581C20] to-[#843C43]' },
    { height: 95, color: 'from-[#C62832] to-[#FF3B47]' },
    { height: 25, color: 'from-emerald-600 to-teal-400' },
    { height: 70, color: 'from-[#843C43] to-[#E5383B]' },
    { height: 40, color: 'from-[#C62832] to-[#FF5A64]' },
    { height: 65, color: 'from-[#581C20] to-[#C62832]' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 22, stiffness: 100 }
    }
  };

  return (
    <section className={`relative flex flex-col items-center justify-center text-center px-4 sm:px-6 transition-all duration-700 ${
      isCompressed ? 'py-8 min-h-[50vh] opacity-95 scale-[0.98]' : 'py-12 sm:py-16 min-h-[76vh]'
    }`}>
      {/* Discreet Audio Toggle Button in Hero Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20"
      >
        <button
          onClick={onToggleSound}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0C10]/70 hover:bg-[#151720]/80 border border-white/[0.08] text-xs text-[#A1A1AA] hover:text-[#F2F2F3] backdrop-blur-xl transition-all hover:border-[#C62832]/40 active:scale-95 shadow-lg"
          title={soundEnabled ? 'Mute audio' : 'Enable tactile audio effects'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#C62832]" />
              <span className="font-mono text-[11px] text-[#F2F2F3]">Audio ON</span>
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
        className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-7"
      >
        {/* Academic / DAA Pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0C10]/70 border border-white/[0.08] text-xs font-semibold text-[#A1A1AA] backdrop-blur-xl shadow-[0_0_20px_-5px_rgba(198,40,50,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-[#C62832]" />
            <span className="tracking-wide text-[#F2F2F3]">Design & Analysis of Algorithms • 2026 Platform</span>
          </div>
        </motion.div>

        {/* Hero Title: Restored Original Branding with Balanced, Responsive Proportions */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] drop-shadow-xl">
            Sorting Battle Arena
          </h1>
          <span className="block text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#C62832] via-[#FF5A64] to-[#F2F2F3]">
            Interactive Dataset Sorting Platform
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-sm sm:text-base text-[#A1A1AA] leading-relaxed font-normal"
        >
          Benchmark, visually trace, and pit 6 manual algorithms against each other in real-time. Full empirical telemetry with custom dataset exports.
        </motion.p>

        {/* Mini Interactive Preview Element */}
        <motion.div
          variants={itemVariants}
          className="max-w-md mx-auto p-4 rounded-2xl bg-[#0B0C10]/65 border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C62832]/50 to-transparent" />
          <div className="relative flex items-end justify-center gap-2 h-16 w-full">
            {previewBars.map((bar, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [`${bar.height * 0.4}%`, `${bar.height}%`, `${bar.height * 0.55}%`],
                }}
                transition={{
                  duration: 2 + i * 0.25,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
                className={`w-4 sm:w-5 rounded-t-sm bg-gradient-to-t ${bar.color} shadow-md`}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-[#A1A1AA] pt-2 border-t border-white/[0.06]">
            <span className="flex items-center gap-1 text-[#C62832]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C62832] animate-ping" />
              60 FPS Engine
            </span>
            <span>Manual DAA Routines</span>
            <span className="text-[#FF5A64]">Zero .sort()</span>
          </div>
        </motion.div>

        {/* Primary CTA: Start Sorting Button with Moving Beam Sweep */}
        <motion.div variants={itemVariants} className="pt-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              onStartSorting();
            }}
            className="group relative px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#C62832] via-[#E5383B] to-[#C62832] hover:from-[#E5383B] hover:to-[#FF3B47] text-white font-black text-sm tracking-wide uppercase shadow-[0_0_35px_-5px_rgba(198,40,50,0.5)] hover:shadow-[0_0_45px_-3px_rgba(229,56,59,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-3 overflow-hidden ring-1 ring-white/10"
          >
            {/* Moving Shimmer Beam */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-beam-sweep pointer-events-none" />

            <Swords className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200 text-white" />
            <span>Start Sorting</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200 text-white" />
          </button>
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pt-6 flex flex-col items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        onClick={onStartSorting}
      >
        <span className="text-[10px] font-mono tracking-widest text-[#A1A1AA] uppercase">
          Configure Dataset Below
        </span>
        <div className="w-px h-6 bg-gradient-to-b from-[#C62832] to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
