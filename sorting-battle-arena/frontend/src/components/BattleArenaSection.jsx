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
    // Continuous formula: 70ms at 1x, 700ms at 0.1x, 14ms at 5x, 7ms at 10x
    return Math.max(5, Math.round(70 / multiplier));
  };

  // Main synchronous animation tick with rock-solid ref tracking
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

              // If first to finish, crown winner and throw celebratory confetti!
              if (!winnerRef.current) {
                const winName = ALGORITHM_DETAILS[algoKey]?.name || algoKey;
                winnerRef.current = winName;
                setWinner(winName);
                soundEffects.playChime();
                try {
                  confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
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

        // Only commit if algorithm steps are active
        if (anyAlgosLoaded) {
          stepIndicesRef.current = nextIndices;
          setStepIndices(nextIndices);

          // Once ALL algorithms reach 100%, stop cleanly and show completion button (NO AUTO-SCROLL!)
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

  // Vibrant gradient colors for bars
  const getBarColor = (step, index) => {
    if (step.comparing?.includes(index)) {
      return 'bg-gradient-to-t from-amber-500 to-yellow-300 shadow-[0_0_16px_rgba(251,191,36,0.9)] scale-y-105 z-10'; // Yellow -> Comparing
    }
    if (step.swapping?.includes(index)) {
      return 'bg-gradient-to-t from-rose-600 to-pink-400 shadow-[0_0_16px_rgba(244,63,94,0.9)] scale-y-110 z-10 animate-bounce'; // Pink -> Swapping
    }
    if (step.sorted?.includes(index)) {
      return 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'; // Emerald -> Sorted
    }
    return 'bg-gradient-to-t from-blue-600 to-indigo-400 hover:from-blue-500 hover:to-indigo-300 shadow-[0_0_8px_rgba(59,130,246,0.3)]'; // Blue -> Idle
  };

  return (
    <section id="battle-arena-section" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Speed Controller */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel flex items-center justify-between flex-wrap gap-4 shadow-2xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" /> Step 3 • Live Battle Arena
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
            {selectedAlgos.map((a) => ALGORITHM_DETAILS[a]?.name.replace(' Sort', '')).join(' vs ')}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Synchronously visualizes pointer comparisons and swaps. Initialized at 5× speed.
          </p>
        </div>

        {/* Horizontal Speed Scroller Slider (0.1x to 10x) and Sound Toggle */}
        <div className="w-full sm:w-84 p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-inner space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 font-bold">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              <span>Speed:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const active = soundEffects.toggleSound();
                  setSoundOn(active);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  soundOn
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/20'
                    : 'bg-zinc-800 text-zinc-400 border border-white/5 hover:text-zinc-200'
                }`}
                title={soundOn ? 'Sound On (Click to Mute)' : 'Sound Muted (Click to Unmute)'}
              >
                {soundOn ? <Volume2 className="w-3 h-3 text-blue-400" /> : <VolumeX className="w-3 h-3 text-zinc-400" />}
                <span>{soundOn ? 'Sound On' : 'Muted'}</span>
              </button>
              <span className="font-mono font-black text-blue-400 px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
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
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />

          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <button
              type="button"
              onClick={() => setSpeed(0.1)}
              className={`hover:text-zinc-300 transition-colors ${speed <= 0.25 ? 'text-blue-400 font-bold' : ''}`}
            >
              0.1× (Viva)
            </button>
            <button
              type="button"
              onClick={() => setSpeed(1)}
              className={`hover:text-zinc-300 transition-colors ${speed >= 0.8 && speed <= 1.2 ? 'text-blue-400 font-bold' : ''}`}
            >
              1×
            </button>
            <button
              type="button"
              onClick={() => setSpeed(5)}
              className={`hover:text-zinc-300 transition-colors ${speed >= 4.5 && speed <= 5.5 ? 'text-blue-400 font-bold' : ''}`}
            >
              5× (Default)
            </button>
            <button
              type="button"
              onClick={() => setSpeed(10)}
              className={`hover:text-zinc-300 transition-colors ${speed >= 9.5 ? 'text-blue-400 font-bold' : ''}`}
            >
              10× (Ultra)
            </button>
          </div>
        </div>
      </div>

      {/* Completion Banner with EXPLICIT BUTTON to view performance analytics (NO AUTO-SCROLL!) */}
      <AnimatePresence>
        {isBattleComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-blue-950/40 to-purple-950/40 border border-emerald-500/40 shadow-2xl flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xl shadow-emerald-500/20">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Race Completed
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white">
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
                className="px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay</span>
              </button>

              {/* USER EXPLICITLY CLICKS THIS BUTTON TO PROCEED TO PERFORMANCE SECTION */}
              <button
                onClick={onProceedToPerformance}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs shadow-xl shadow-emerald-500/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
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
        className={`grid gap-6 ${
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
              className="flex flex-col rounded-3xl bg-zinc-900/90 border border-white/10 glass-panel overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20"
            >
              {/* Card Header: Algorithm Name & Live Counters */}
              <div className="p-4 sm:p-5 border-b border-white/5 bg-zinc-950/40 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${details.color} animate-pulse`} />
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                      {details.name}
                      {isDone && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-zinc-400">{details.tagline}</p>
                  </div>
                </div>

                {/* Comparisons & Swaps Badges */}
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-xl bg-zinc-900 border border-white/5 text-center">
                    <span className="block text-[9px] text-zinc-400 uppercase">Comps</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {currStep.comparisons.toLocaleString()}
                    </span>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-zinc-900 border border-white/5 text-center">
                    <span className="block text-[9px] text-zinc-400 uppercase">Swaps</span>
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {currStep.swaps.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* CURRENT OPERATION INDICATOR (Educational Highlight) */}
              <div className="px-5 py-2.5 border-b border-white/5 bg-zinc-950/70 flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
                <span className="font-mono text-zinc-300 truncate">
                  {currStep.message || 'Processing dataset...'}
                </span>
              </div>

              {/* Bar Canvas with Stretch, Bounce, and Color Highlights */}
              <div className="relative h-64 sm:h-72 p-4 flex items-end justify-center gap-1 sm:gap-1.5 bg-gradient-to-b from-zinc-950/30 to-zinc-950/70 overflow-hidden">
                {currStep.array.map((value, idx) => {
                  const heightPercent = Math.max(8, Math.min(100, (Number(value) / maxVal) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full max-w-[28px] relative group"
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-75 ${getBarColor(currStep, idx)}`}
                      />
                      {currStep.array.length <= 30 && (
                        <span className="text-[9px] font-mono text-zinc-400 mt-1 truncate">
                          {value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Card Footer: Progress Bar */}
              <div className="px-5 py-2.5 bg-zinc-950/60 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Step {currIdx + 1} of {totalSteps}</span>
                <span className="font-mono">{Math.round(((currIdx + 1) / totalSteps) * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unified Playback & Replay Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Reset to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            onClick={handleStepBackward}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Step Back"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsPlaying(!isPlaying);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" /> Pause Replay
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Resume Replay
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={handleStepForward}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Color Legend */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Sorted</span>
          </div>
        </div>
      </div>

      {/* Bottom Completion Action Bar: Always easily clickable after watching the race */}
      <AnimatePresence>
        {isBattleComplete && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-blue-950/50 to-purple-950/50 border border-emerald-500/40 shadow-2xl flex items-center justify-between flex-wrap gap-4 text-center sm:text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">
                  {winner ? `${winner} Won The Race!` : 'Sorting Race Completed!'}
                </h4>
                <p className="text-xs text-zinc-300">
                  All comparisons and swaps are complete. Ready to inspect empirical runtimes, bar graphs, and dataset exports?
                </p>
              </div>
            </div>

            <button
              onClick={onProceedToPerformance}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View Performance Analytics & Results</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BattleArenaSection;
