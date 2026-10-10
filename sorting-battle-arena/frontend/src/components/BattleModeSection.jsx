import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Users,
  Check,
  ArrowRight,
  Zap
} from 'lucide-react';
import { ALGORITHM_DETAILS } from '../utils/sortingAlgorithms';
import soundEffects from '../utils/soundEffects';

export const BattleModeSection = ({
  selectedMode,
  setSelectedMode,
  selectedAlgos,
  setSelectedAlgos,
  onEnterArena,
  onSelectionChange
}) => {
  const modes = [
    {
      id: 'Single',
      name: 'Single Mode',
      badge: 'Solo Inspector',
      desc: 'Pick 1 algorithm to visually trace its comparisons, swaps, and internal pointer mechanics in depth.',
      icon: User,
    },
    {
      id: 'Multi',
      name: 'Multi Battle',
      badge: 'Arena Showdown',
      desc: 'Select 2 or more algorithms (e.g. 1v1 Duel or all 6) to race side-by-side with synchronized metrics.',
      icon: Users,
    }
  ];

  const handleModeChange = (modeId) => {
    soundEffects.playClick();
    setSelectedMode(modeId);
    if (modeId === 'Single') {
      setSelectedAlgos([selectedAlgos[0] || 'quick']);
    } else if (modeId === 'Multi') {
      if (selectedAlgos.length < 2) {
        setSelectedAlgos(['quick', 'merge']);
      }
    }
    if (onSelectionChange) onSelectionChange();
  };

  const handleToggleAlgo = (algoKey) => {
    soundEffects.playClick();
    if (selectedMode === 'Single') {
      setSelectedAlgos([algoKey]);
      if (onSelectionChange) onSelectionChange();
      return;
    }

    if (selectedAlgos.includes(algoKey)) {
      if (selectedAlgos.length > 2) {
        setSelectedAlgos(selectedAlgos.filter((k) => k !== algoKey));
        if (onSelectionChange) onSelectionChange();
      }
    } else {
      setSelectedAlgos([...selectedAlgos, algoKey]);
      if (onSelectionChange) onSelectionChange();
    }
  };

  const isValidSelection =
    (selectedMode === 'Single' && selectedAlgos.length === 1) ||
    (selectedMode === 'Multi' && selectedAlgos.length >= 2);

  return (
    <section id="battle-mode-section" className="relative py-10 sm:py-14 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Restored Original Section Header */}
      <div className="text-center space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C62832] flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Step 2 • Battle Arena Configuration
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Choose Battle Mode & Competitors
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Select Single Mode for isolated analysis, or Multi Battle to race 2 to 6 algorithms against each other.
        </p>
      </div>

      {/* 2 Compact Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = selectedMode === m.id;
          return (
            <motion.div
              key={m.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleModeChange(m.id)}
              className={`p-5 sm:p-6 rounded-2xl border cursor-pointer backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] ${
                isActive
                  ? 'border-[#C62832] bg-[#14151D]/80 shadow-[0_0_30px_-5px_rgba(198,40,50,0.35)] ring-1 ring-[#C62832]/40'
                  : 'border-white/10 hover:border-white/20 bg-[#0B0C10]/65'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                    isActive
                      ? 'bg-[#C62832]/20 border-[#C62832] text-white shadow-md'
                      : 'bg-[#14151B]/80 border-white/10 text-zinc-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isActive
                      ? 'bg-[#C62832]/20 text-white border-[#C62832]/40'
                      : 'bg-[#14151B]/80 text-zinc-400 border-white/10'
                  }`}>
                    {isActive ? 'Active Mode ✓' : m.badge}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">{m.name}</h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{m.desc}</p>
              </div>

              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>{m.id === 'Single' ? '1 Algorithm' : '2 – 6 Algorithms'}</span>
                <span className={isActive ? 'text-rose-300 font-bold' : 'text-zinc-500'}>
                  {isActive ? 'Selected' : 'Click to select'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Algorithm Checkbox Cards */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span>Select Competing Algorithms</span>
              <span className="text-xs font-mono font-medium text-zinc-400">
                ({selectedAlgos.length} selected
                {selectedMode === 'Single' ? ' — 1 required' : ' — min 2 required'})
              </span>
            </h4>
            <p className="text-xs text-zinc-400">
              Each algorithm is manually implemented with zero built-in sorting routines.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono bg-[#0B0C10]/70 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 text-zinc-300">
            <span>Competing:</span>
            <span className="font-bold text-[#C62832]">
              {selectedAlgos.map((a) => ALGORITHM_DETAILS[a]?.name.replace(' Sort', '')).join(' vs ')}
            </span>
          </div>
        </div>

        {/* 6 Checkbox Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.entries(ALGORITHM_DETAILS).map(([key, details]) => {
            const isChecked = selectedAlgos.includes(key);

            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleToggleAlgo(key)}
                className={`p-3.5 rounded-xl border cursor-pointer backdrop-blur-xl transition-all duration-200 flex items-center justify-between gap-3 shadow-md ${
                  isChecked
                    ? 'border-[#C62832] bg-[#14151D]/80 shadow-[0_0_20px_-3px_rgba(198,40,50,0.35)]'
                    : 'border-white/10 bg-[#0B0C10]/60 hover:bg-[#12131A]/70 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 border ${
                      isChecked
                        ? 'bg-[#C62832] border-[#C62832] text-white shadow-sm'
                        : 'border-zinc-700 bg-zinc-800 text-transparent'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform ${isChecked ? 'scale-100' : 'scale-0'}`} />
                  </div>

                  <div>
                    <h5 className="text-sm font-extrabold text-white tracking-tight">{details.name}</h5>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Avg: {details.timeComplexity.avg} • Space: {details.spaceComplexity}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    details.stable
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {details.stable ? 'Stable' : 'Unstable'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enter Arena Button */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            soundEffects.playClick();
            onEnterArena();
          }}
          disabled={!isValidSelection}
          className="group relative px-9 py-3.5 rounded-xl bg-gradient-to-r from-[#C62832] via-[#E5383B] to-[#C62832] hover:from-[#E5383B] hover:to-[#FF3B47] text-white font-extrabold text-sm shadow-xl shadow-[#C62832]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Zap className="w-4 h-4 text-white" />
          <span>Enter Arena & Begin Battle</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
        <p className="text-xs text-zinc-400 mt-2 font-mono">
          Click above when ready to unlock the arena and begin sorting.
        </p>
      </div>
    </section>
  );
};

export default BattleModeSection;
