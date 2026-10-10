import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Gauge,
  Trophy,
  CheckCircle2,
  Swords,
  Sparkles,
  ArrowDown,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALGORITHM_DETAILS, generateVisualSteps } from '../utils/sortingAlgorithms';
import soundEffects from '../utils/soundEffects';

export const BattleArenaSection = ({
  dataset = [],
  selectedAlgos = ['quick', 'merge'],
  order = 'asc',
  onProceedToPerformance
}) => {
  // Speed options & audio state
  const [speed, setSpeed] = useState(5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundOn, setSoundOn] = useState(soundEffects.isEnabled());
  const soundTickCounter = useRef(0);

  // Multi-algorithm states
  const [algoRuns, setAlgoRuns] = useState({});
  const [stepIndices, setStepIndices] = useState({});
  const [completedAlgos, setCompletedAlgos] = useState(new Set());
  const [winner, setWinner] = useState(null);
  const [isBattleComplete, setIsBattleComplete] = useState(false);

  const animationFrameRef = useRef(null);
  const lastTickRef = useRef(0);
  const stepIndicesRef = useRef({});
  const completedSetRef = useRef(new Set());
  const winnerRef = useRef(null);

  // Initialize visual steps for each selected algorithm
  useEffect(() => {
    if (!dataset || dataset.length === 0 || selectedAlgos.length === 0) return;

    // Use up to 45 elements for optimal visual bar rendering
    const visualSlice = dataset.length > 45 ? dataset.slice(0, 45) : dataset;

    const runs = {};
    const initialIndices = {};

    selectedAlgos.forEach((algoKey) => {
      const run = generateVisualSteps(algoKey, visualSlice, order);
      runs[algoKey] = run;
      initialIndices[algoKey] = 0;
    });

    stepIndicesRef.current = initialIndices;
    completedSetRef.current = new Set();
    winnerRef.current = null;

    setAlgoRuns(runs);
    setStepIndices(initialIndices);
    setCompletedAlgos(new Set());
    setWinner(null);
    setIsBattleComplete(false);
    setIsPlaying(true);
    lastTickRef.current = 0;
  }, [dataset, selectedAlgos, order]);

  // Speed interval in ms based on multiplier (0.1x to 10x)
  const getIntervalMs = (multiplier) => {
    if (!multiplier || multiplier <= 0) return 16;
    return Math.max(5, Math.round(70 / multiplier));
  };

  // Main synchronous animation tick
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const intervalMs = getIntervalMs(speed);

    const stepRunner = (time) => {
      if (!lastTickRef.current) lastTickRef.current = time;

      if (time - lastTickRef.current >= intervalMs) {
        lastTickRef.current = time;

        const currentIndices = stepIndicesRef.current;
        const nextIndices = { ...currentIndices };
        let allFinished = true;
        let anyAlgosLoaded = false;
        let hadSwaps = false;
        let hadComps = false;

        selectedAlgos.forEach((algoKey) => {
          const run = algoRuns[algoKey];
          if (!run || !run.steps || run.steps.length === 0) return;

          anyAlgosLoaded = true;
          const total = run.steps.length;
          const current = currentIndices[algoKey] || 0;

          if (current < total - 1) {
            const nextIdx = current + 1;
            nextIndices[algoKey] = nextIdx;
            allFinished = false;

            const stepObj = run.steps[nextIdx];
            if (stepObj) {
              if (stepObj.swapping && stepObj.swapping.length > 0) {
                hadSwaps = true;
              } else if (stepObj.comparing && stepObj.comparing.length > 0) {
                hadComps = true;
              }
            }
          } else {
            // Reached completion
            if (!completedSetRef.current.has(algoKey)) {
              completedSetRef.current.add(algoKey);
              setCompletedAlgos(new Set(completedSetRef.current));

              // If first to finish, crown winner and throw celebratory confetti
              if (!winnerRef.current) {
                const winName = ALGORITHM_DETAILS[algoKey]?.name || algoKey;
                winnerRef.current = winName;
                setWinner(winName);
                soundEffects.playChime();
                try {
                  confetti({
                    particleCount: 75,
                    spread: 65,
                    origin: { y: 0.6 },
                    colors: ['#C62832', '#FF5A64', '#F2F2F3', '#843C43']
                  });
                } catch (e) {}
              }
            }
          }
        });

        // Acoustically balanced sound triggers
        soundTickCounter.current += 1;
        if (hadSwaps) {
          soundEffects.playSwap();
        } else if (hadComps) {
          if (speed <= 2.5 || soundTickCounter.current % (speed > 6 ? 4 : 2) === 0) {
            soundEffects.playCompare();
          }
        }

        if (anyAlgosLoaded) {
          stepIndicesRef.current = nextIndices;
          setStepIndices(nextIndices);

          if (allFinished) {
            setIsPlaying(false);
            setIsBattleComplete(true);
            soundEffects.playChime();
            return;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(stepRunner);
    };

    animationFrameRef.current = requestAnimationFrame(stepRunner);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, speed, selectedAlgos, algoRuns]);

  // Scrub and Replay controls
  const handleReset = () => {
    soundEffects.playClick();
    const resetIndices = {};
    selectedAlgos.forEach((k) => (resetIndices[k] = 0));
    stepIndicesRef.current = resetIndices;
    completedSetRef.current = new Set();
    winnerRef.current = null;
    setStepIndices(resetIndices);
    setCompletedAlgos(new Set());
    setWinner(null);
    setIsBattleComplete(false);
    setIsPlaying(true);
    lastTickRef.current = 0;
  };

  const handleStepForward = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    const next = { ...stepIndicesRef.current };
    selectedAlgos.forEach((k) => {
      const total = algoRuns[k]?.steps?.length || 0;
      if (next[k] < total - 1) next[k] += 1;
    });
    stepIndicesRef.current = next;
    setStepIndices(next);
  };

  const handleStepBackward = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    const next = { ...stepIndicesRef.current };
    selectedAlgos.forEach((k) => {
      if (next[k] > 0) next[k] -= 1;
    });
    stepIndicesRef.current = next;
    setStepIndices(next);
  };

  // Bar Colors with deep crimson operational accents
  const getBarColor = (step, index) => {
    if (step.swapping?.includes(index)) {
      return 'bg-gradient-to-t from-[#C62832] to-[#FF3B47] shadow-[0_0_16px_rgba(255,59,71,0.9)] scale-y-110 z-10'; // Bright crimson -> Swapping
    }
    if (step.comparing?.includes(index)) {
      return 'bg-gradient-to-t from-[#843C43] to-[#E5383B] shadow-[0_0_12px_rgba(198,40,50,0.6)] scale-y-105 z-10'; // Muted red -> Comparing
    }
    if (step.sorted?.includes(index)) {
      return 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'; // Emerald -> Sorted
    }
    return 'bg-gradient-to-t from-[#18191F] to-[#2B2D37] hover:to-[#424553] shadow-[0_0_6px_rgba(0,0,0,0.4)]'; // Charcoal -> Idle
  };

  return (
    <section id="battle-arena-section" className="relative py-10 sm:py-14 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
      {/* Header & Speed Controller */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B0C10]/65 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C62832] flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" /> Step 3 • Live Battle Arena
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-1">
            {selectedAlgos.map((a) => ALGORITHM_DETAILS[a]?.name.replace(' Sort', '')).join(' vs ')}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Synchronously visualizes pointer comparisons and swaps. Initialized at 5× speed.
          </p>
        </div>

        {/* Speed Slider (0.1x to 10x) and Sound Toggle */}
        <div className="w-full sm:w-80 p-3 rounded-xl bg-[#07080A]/80 backdrop-blur-md border border-white/10 shadow-inner space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 font-bold">
              <Gauge className="w-3.5 h-3.5 text-[#C62832]" />
              <span>Speed:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const active = soundEffects.toggleSound();
                  setSoundOn(active);
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  soundOn
                    ? 'bg-[#C62832]/20 text-rose-300 border border-[#C62832]/40 shadow-sm'
                    : 'bg-zinc-800 text-zinc-400 border border-white/5 hover:text-zinc-200'
                }`}
                title={soundOn ? 'Sound On (Click to Mute)' : 'Sound Muted (Click to Unmute)'}
              >
                {soundOn ? <Volume2 className="w-3 h-3 text-[#C62832]" /> : <VolumeX className="w-3 h-3 text-zinc-400" />}
                <span>{soundOn ? 'Sound On' : 'Muted'}</span>
              </button>
              <span className="font-mono font-black text-[#C62832] px-2 py-0.5 rounded bg-[#18191F] border border-white/10 text-xs">
                {Number(speed) < 1 ? Number(speed).toFixed(2) : Number(speed) < 10 ? Number(speed).toFixed(1) : '10'}×
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C62832]"
          />

          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <button
              type="button"
              onClick={() => setSpeed(0.1)}
              className={`hover:text-zinc-300 transition-colors ${speed <= 0.25 ? 'text-[#C62832] font-bold' : ''}`}
            >
              0.1× (Viva)
            </button>
            <button
              type="button"
              onClick={() => setSpeed(1)}
              className={`hover:text-zinc-300 transition-colors ${speed >= 0.8 && speed <= 1.2 ? 'text-[#C62832] font-bold' : ''}`}
            >
              1×
            </button>
            <button
              type="button"
              onClick={() => setSpeed(5)}
              className={`hover:text-zinc-300 transition-colors ${speed >= 4.5 && speed <= 5.5 ? 'text-[#C62832] font-bold' : ''}`}
            >
              5× (Default)
            </button>
            <button
              type="button"
              onClick={() => setSpeed(10)}
              className={`hover:text-zinc-300 transition-colors ${speed >= 9.5 ? 'text-[#C62832] font-bold' : ''}`}
            >
              10× (Ultra)
            </button>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <AnimatePresence>
        {isBattleComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 sm:p-6 rounded-2xl bg-[#0B0C10]/80 backdrop-blur-xl border border-[#C62832]/50 shadow-[0_8px_32px_rgba(198,40,50,0.25)] flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#C62832]/20 text-[#FF5A64] border border-[#C62832]/40 shadow-md">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C62832] flex items-center gap-1 font-mono">
                  <Sparkles className="w-3.5 h-3.5" /> Race Completed
                </span>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {winner ? `${winner} Finished First!` : 'Sorting Finished!'}
                </h4>
                <p className="text-xs text-zinc-300 mt-0.5">
                  All algorithms have finished sorting the dataset. Click below to inspect performance charts and tables.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>

              <button
                onClick={onProceedToPerformance}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C62832] via-[#E5383B] to-[#C62832] hover:from-[#E5383B] hover:to-[#FF3B47] text-white font-black text-xs shadow-lg shadow-[#C62832]/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Performance Analytics & Results</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Selected Algorithm Cards */}
      <div
        className={`grid gap-5 ${
          selectedAlgos.length === 1
            ? 'grid-cols-1'
            : selectedAlgos.length === 2
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {selectedAlgos.map((algoKey) => {
          const run = algoRuns[algoKey];
          const currIdx = stepIndices[algoKey] || 0;
          const currStep = run?.steps?.[currIdx] || {
            array: dataset.slice(0, 45),
            comparing: [],
            swapping: [],
            sorted: [],
            comparisons: 0,
            swaps: 0,
            message: 'Initializing...'
          };
          const totalSteps = run?.steps?.length || 1;
          const isDone = currIdx >= totalSteps - 1;
          const maxVal = Math.max(...(currStep.array || [100]), 10);
          const details = ALGORITHM_DETAILS[algoKey] || ALGORITHM_DETAILS.quick;

          return (
            <div
              key={algoKey}
              className="flex flex-col rounded-2xl bg-[#0B0C10]/65 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              {/* Card Header: Algorithm Name & Live Counters */}
              <div className="p-3.5 sm:p-4 border-b border-white/5 bg-[#08090C]/80 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#C62832] animate-pulse" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      {details.name}
                      {isDone && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono">{details.tagline}</p>
                  </div>
                </div>

                {/* Comparisons & Swaps Badges */}
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-lg bg-[#18191F] border border-white/5 text-center min-w-[50px]">
                    <span className="block text-[8px] text-zinc-400 uppercase font-mono">Comps</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {currStep.comparisons.toLocaleString()}
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded-lg bg-[#18191F] border border-white/5 text-center min-w-[50px]">
                    <span className="block text-[8px] text-zinc-400 uppercase font-mono">Swaps</span>
                    <span className="text-xs font-mono font-bold text-[#FF5A64]">
                      {currStep.swaps.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* CURRENT OPERATION INDICATOR */}
              <div className="px-4 py-2 border-b border-white/5 bg-[#08090B] flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C62832] shrink-0" />
                <span className="font-mono text-zinc-300 text-[11px] truncate">
                  {currStep.message || 'Processing dataset...'}
                </span>
              </div>

              {/* Bar Canvas */}
              <div className="relative h-56 sm:h-64 p-3 flex items-end justify-center gap-1 sm:gap-1.5 bg-[#08090B] overflow-hidden">
                {currStep.array.map((value, idx) => {
                  const heightPercent = Math.max(8, Math.min(100, (Number(value) / maxVal) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full max-w-[26px] relative group"
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm transition-all duration-75 ${getBarColor(currStep, idx)}`}
                      />
                      {currStep.array.length <= 30 && (
                        <span className="text-[8px] font-mono text-zinc-400 mt-1 truncate">
                          {value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Card Footer: Progress Bar */}
              <div className="px-4 py-2 bg-[#0B0C0E] border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Step {currIdx + 1} of {totalSteps}</span>
                <span className="font-bold text-white">{Math.round(((currIdx + 1) / totalSteps) * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unified Playback Controls & Legend */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#111216]/90 border border-white/10 glass-panel flex items-center justify-between flex-wrap gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Reset to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleStepBackward}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Step Back"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setIsPlaying(!isPlaying);
            }}
            className="px-4 py-2 rounded-lg bg-[#C62832] hover:bg-[#E5383B] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" /> Pause Replay
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" /> Resume Replay
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Legend */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-[2px] bg-[#2B2D37]" />
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-[2px] bg-[#E5383B]" />
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-[2px] bg-[#FF3B47]" />
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-[2px] bg-emerald-500" />
            <span>Sorted</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BattleArenaSection;
