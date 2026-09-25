import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Users,
  Check,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
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
  // Only 2 modes now: Single Mode and Multi Battle (which encompasses 1v1 and beyond!)
  const modes = [
    {
      id: 'Single',
      name: 'Single Mode',
      badge: 'Solo Inspector',
      desc: 'Pick 1 algorithm to visually trace its comparisons, swaps, and internal pointer mechanics in depth.',
      icon: User,
      color: 'from-blue-500 via-indigo-500 to-cyan-500',
      activeGlow: 'border-blue-500 shadow-[0_0_35px_-5px_rgba(59,130,246,0.4)] bg-blue-950/30'
    },
    {
      id: 'Multi',
      name: 'Multi Battle',
      badge: 'Arena Showdown',
      desc: 'Select 2 or more algorithms (e.g. 1v1 Duel or all 6) to race side-by-side with synchronized metrics.',
      icon: Users,
      color: 'from-purple-500 via-pink-500 to-rose-500',
      activeGlow: 'border-purple-500 shadow-[0_0_35px_-5px_rgba(168,85,247,0.4)] bg-purple-950/30'
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

    // Multi Battle mode: toggle algorithm on/off (minimum 2)
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
    <section id="battle-mode-section" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Step 2 • Battle Arena Configuration
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Choose Battle Mode & Competitors
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Select Single Mode for isolated analysis, or Multi Battle to race 2 to 6 algorithms against each other.
        </p>
      </div>

      {/* 2 Vibrant Large Mode Cards (1v1 removed, merged naturally into Multi Battle) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = selectedMode === m.id;
          return (
            <motion.div
              key={m.id}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleModeChange(m.id)}
              className={`p-7 rounded-[24px] border glass-panel cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-4 ${
                isActive
                  ? `${m.activeGlow} ring-1 ring-white/20`
                  : 'border-white/10 hover:border-white/25 bg-zinc-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${m.color} p-0.5 flex items-center justify-center text-white shadow-xl`}>
                    <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    isActive
                      ? 'bg-white/10 text-white border-white/20 shadow-sm'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {isActive ? 'Active Mode ✓' : m.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white">{m.name}</h3>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{m.desc}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>{m.id === 'Single' ? '1 Algorithm' : '2 – 6 Algorithms'}</span>
                <span className={isActive ? 'text-purple-300 font-bold' : 'text-zinc-500'}>
                  {isActive ? 'Selected' : 'Click to select'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Algorithm Checkbox Cards */}
      <div className="space-y-5 max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
          <div>
            <h4 className="text-lg font-extrabold text-white flex items-center gap-2">
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

          <div className="flex items-center gap-1.5 text-xs font-mono bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/10 text-blue-300">
            <span>Competing:</span>
            <span className="font-bold text-white">
              {selectedAlgos.map((a) => ALGORITHM_DETAILS[a]?.name.replace(' Sort', '')).join(' vs ')}
            </span>
          </div>
        </div>

        {/* 6 Checkbox Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(ALGORITHM_DETAILS).map(([key, details]) => {
            const isChecked = selectedAlgos.includes(key);

            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleAlgo(key)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
                  isChecked
                    ? 'border-blue-500/80 bg-blue-950/40 shadow-[0_0_25px_-3px_rgba(59,130,246,0.4)]'
                    : 'border-white/5 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Glowing Animated Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 border ${
                      isChecked
                        ? 'bg-blue-600 border-blue-400 text-white scale-105 shadow-md shadow-blue-500/50'
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

      {/* Enter Arena Button: User must explicitly click this to launch the arena */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            soundEffects.playClick();
            onEnterArena();
          }}
          disabled={!isValidSelection}
          className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Zap className="w-5 h-5 text-amber-300" />
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
