import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Gauge,
  CheckCircle2,
  Swords
} from 'lucide-react';
import { ALGORITHM_DETAILS } from '../utils/sortingAlgorithms';

export const VisualizerPanel = ({
  algorithmKey = 'quick',
  steps = [],
  executionTimeMs = 0,
  isBattleDuel = false,
  panelTitle = null
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(3); // 1x to 10x
  const animationFrameRef = useRef(null);
  const lastTickRef = useRef(0);

  const algoInfo = ALGORITHM_DETAILS[algorithmKey] || ALGORITHM_DETAILS.quick;
  const currentStep = steps[currentStepIndex] || {
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    pivot: null,
    comparisons: 0,
    swaps: 0,
    message: 'Ready to replay'
  };

  const totalSteps = steps.length;
  const isFinished = currentStepIndex >= totalSteps - 1;

  // Reset when steps change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const intervalMs = Math.max(10, 120 - speedMultiplier * 11);

    const stepRunner = (time) => {
      if (time - lastTickRef.current >= intervalMs) {
        lastTickRef.current = time;
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }
      animationFrameRef.current = requestAnimationFrame(stepRunner);
    };

    animationFrameRef.current = requestAnimationFrame(stepRunner);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, totalSteps, speedMultiplier]);

  const maxVal = Math.max(...(currentStep.array || [100]), 10);

  const getBarColor = (index) => {
    if (currentStep.comparing?.includes(index)) {
      return 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] z-10'; // Yellow -> Comparing
    }
    if (currentStep.swapping?.includes(index)) {
      return 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] z-10'; // Pink -> Swapping
    }
    if (currentStep.pivot === index) {
      return 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)] z-10'; // Pivot
    }
    if (currentStep.sorted?.includes(index)) {
      return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'; // Green -> Sorted
    }
    return 'bg-blue-500/80 hover:bg-blue-400'; // Blue -> Idle
  };

  return (
    <div className="flex flex-col h-full rounded-3xl bg-zinc-900/90 border border-white/10 glass-panel overflow-hidden shadow-2xl">
      {/* Header with Title and Live Metrics */}
      <div className="p-4 sm:p-5 border-b border-white/5 bg-zinc-950/40 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${algoInfo.color} animate-pulse`} />
          <div>
            <h4 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              {panelTitle || algoInfo.name}
              {isFinished && totalSteps > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Sorted
                </span>
              )}
            </h4>
            <p className="text-xs text-zinc-400">{algoInfo.tagline}</p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-center">
            <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Comparisons</span>
            <span className="text-sm font-mono font-bold text-amber-400">{currentStep.comparisons.toLocaleString()}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-center">
            <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Swaps</span>
            <span className="text-sm font-mono font-bold text-rose-400">{currentStep.swaps.toLocaleString()}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-center">
            <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Time</span>
            <span className="text-sm font-mono font-bold text-blue-400">{executionTimeMs} ms</span>
          </div>
        </div>
      </div>

      {/* Bar Color Legend */}
      <div className="px-5 py-2 border-b border-white/5 bg-zinc-950/20 flex items-center justify-between text-[11px] text-zinc-400 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Sorted</span>
          </div>
        </div>
        <div className="text-zinc-500 truncate max-w-xs font-mono text-[10px]">
          {currentStep.message || 'Ready'}
        </div>
      </div>

      {/* Interactive Visualizer Canvas (Bars Area) */}
      <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] p-4 flex items-end justify-center gap-0.5 sm:gap-1 bg-gradient-to-b from-zinc-950/20 to-zinc-950/60 overflow-hidden">
        {currentStep.array && currentStep.array.length > 0 ? (
          currentStep.array.map((value, idx) => {
            const heightPercent = Math.max(5, Math.min(100, (Number(value) / maxVal) * 100));
            const showLabel = currentStep.array.length <= 32;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full max-w-[28px] group relative"
              >
                {/* Optional Tooltip on hover */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-white font-mono z-20 whitespace-nowrap shadow-lg">
                  Idx {idx}: {value}
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-75 ${getBarColor(idx)}`}
                />

                {showLabel && (
                  <span className="text-[9px] font-mono text-zinc-400 mt-1 truncate">
                    {value}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-500 space-y-2">
            <Swords className="w-8 h-8 opacity-40 animate-bounce" />
            <p className="text-xs">No dataset loaded. Click "Start Battle" or generate a dataset.</p>
          </div>
        )}
      </div>

      {/* Step Scrubber Slider */}
      <div className="px-5 pt-3 pb-1 bg-zinc-950/40 border-t border-white/5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
          <span>Replay Step: {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}</span>
          <span>{totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0}%</span>
        </div>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentStepIndex(Number(e.target.value));
          }}
          disabled={totalSteps === 0}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-30"
        />
      </div>

      {/* Control Bar: Play, Pause, Next, Prev, Reset, Speed */}
      <div className="p-4 bg-zinc-950/80 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          {/* Reset */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            disabled={totalSteps === 0}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 transition-colors"
            title="Reset to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentStepIndex === 0 || totalSteps === 0}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 transition-colors"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => {
              if (isFinished) {
                setCurrentStepIndex(0);
                setIsPlaying(true);
              } else {
                setIsPlaying(!isPlaying);
              }
            }}
            disabled={totalSteps === 0}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold flex items-center gap-1.5 text-xs shadow-lg shadow-blue-500/20 disabled:opacity-40 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" /> Pause
              </>
            ) : isFinished ? (
              <>
                <RotateCcw className="w-4 h-4" /> Replay
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Play Replay
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
            }}
            disabled={isFinished || totalSteps === 0}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 transition-colors"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400 font-mono">{speedMultiplier}x</span>
          <input
            type="range"
            min="1"
            max="10"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
            className="w-20 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            title={`Speed: ${speedMultiplier}x`}
          />
        </div>
      </div>
    </div>
  );
};

export default VisualizerPanel;
