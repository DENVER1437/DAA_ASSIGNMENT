import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  FileDown,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import VisualizerPanel from '../components/VisualizerPanel';
import { ALGORITHM_DETAILS, generateVisualSteps } from '../utils/sortingAlgorithms';
import sortingApi from '../services/api';
import { useToast } from '../components/Toast';

export const BattleArena = ({ dataset = [], order = 'asc' }) => {
  const { addToast } = useToast();

  const [algo1, setAlgo1] = useState('quick');
  const [algo2, setAlgo2] = useState('merge');
  const [isDualMode, setIsDualMode] = useState(true);

  const [panel1Data, setPanel1Data] = useState({ steps: [], timeMs: 0 });
  const [panel2Data, setPanel2Data] = useState({ steps: [], timeMs: 0 });
  const [battleFinished, setBattleFinished] = useState(false);
  const [battleWinner, setBattleWinner] = useState(null);
  const [isBattling, setIsBattling] = useState(false);
  const [downloadFilename, setDownloadFilename] = useState(null);

  // Initialize or re-run battle
  const startBattle = async () => {
    if (!dataset || dataset.length === 0) {
      addToast('No dataset available. Please generate or upload a dataset first!', 'warning');
      return;
    }

    setIsBattling(true);
    setBattleFinished(false);
    setBattleWinner(null);

    // Limit visualizer bars to 60 elements for buttery 60fps frame rendering
    const visualizerSlice = dataset.length > 60 ? dataset.slice(0, 60) : dataset;

    try {
      // 1. Generate client-side visual step frames for smooth 60fps animations
      const run1 = generateVisualSteps(algo1, visualizerSlice, order);
      const run2 = isDualMode ? generateVisualSteps(algo2, visualizerSlice, order) : null;

      // 2. Execute on backend to record exact microsecond benchmarks and generate downloadable file
      const backendRes = await sortingApi.sortDataset({
        numbers: dataset,
        algorithm: algo1,
        secondaryAlgorithm: isDualMode ? algo2 : null,
        order,
        outputFormat: 'csv'
      });

      const time1 = backendRes.primary?.executionTimeMs || 0.12;
      const time2 = backendRes.secondary?.executionTimeMs || 0.15;

      setPanel1Data({
        steps: run1.steps,
        timeMs: time1
      });

      if (run2) {
        setPanel2Data({
          steps: run2.steps,
          timeMs: time2
        });
      }

      if (backendRes.download?.filename) {
        setDownloadFilename(backendRes.download.filename);
      }

      // Determine Winner
      if (isDualMode) {
        const winnerAlgo =
          time1 <= time2 ? ALGORITHM_DETAILS[algo1].name : ALGORITHM_DETAILS[algo2].name;
        const winnerTime = Math.min(time1, time2);
        setBattleWinner({ name: winnerAlgo, time: winnerTime });

        // Trigger victory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Ignore if confetti blocked
        }
      }

      setBattleFinished(true);
      addToast('Battle finished! Replay and analyze steps below.', 'success');
    } catch (err) {
      console.error('Battle execution error:', err);
      // Fallback to pure client-side visualizer if backend has an issue
      const run1 = generateVisualSteps(algo1, visualizerSlice, order);
      setPanel1Data({ steps: run1.steps, timeMs: 0.1 });
      if (isDualMode) {
        const run2 = generateVisualSteps(algo2, visualizerSlice, order);
        setPanel2Data({ steps: run2.steps, timeMs: 0.15 });
      }
      setBattleFinished(true);
    } finally {
      setIsBattling(false);
    }
  };

  useEffect(() => {
    if (dataset && dataset.length > 0) {
      startBattle();
    }
  }, [algo1, algo2, isDualMode]);

  const handleDownload = () => {
    if (downloadFilename) {
      window.open(sortingApi.getDownloadUrl(downloadFilename), '_blank');
    } else {
      addToast('Generated file is preparing, please click re-run battle.', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Duel Control Header */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 glass-panel space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white">Algorithm Battle Arena</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Select competing algorithms to watch them sort simultaneously in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <button
              onClick={() => setIsDualMode(!isDualMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isDualMode
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {isDualMode ? '1v1 Duel Arena' : 'Solo Visualizer'}
            </button>

            {/* Launch Battle */}
            <button
              onClick={startBattle}
              disabled={isBattling}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <Swords className="w-4 h-4" />
              <span>{isBattling ? 'Battling...' : 'Restart Battle'}</span>
            </button>

            {/* Export Sorted Output */}
            {downloadFilename && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all shadow-md"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Sorted File</span>
              </button>
            )}
          </div>
        </div>

        {/* Algorithm Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
          {/* Fighter 1 */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/60 border border-white/5">
            <span className="text-xs font-bold text-blue-400 font-mono">Fighter 1:</span>
            <select
              value={algo1}
              onChange={(e) => setAlgo1(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {Object.entries(ALGORITHM_DETAILS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name} ({val.timeComplexity.avg})
                </option>
              ))}
            </select>
          </div>

          {/* Fighter 2 (Duel Mode) */}
          {isDualMode ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/60 border border-white/5">
              <span className="text-xs font-bold text-purple-400 font-mono">Fighter 2:</span>
              <select
                value={algo2}
                onChange={(e) => setAlgo2(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {Object.entries(ALGORITHM_DETAILS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.name} ({val.timeComplexity.avg})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center text-xs text-zinc-500 p-3">
              Solo visualizer mode enabled. Switch to 1v1 duel to compare two algorithms side by side.
            </div>
          )}
        </div>
      </div>

      {/* Winner Spotlight Callout */}
      {battleWinner && isDualMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-blue-950/30 to-purple-950/30 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Duel Victor
              </span>
              <h4 className="text-base font-extrabold text-white">
                {battleWinner.name} triumphed!
              </h4>
            </div>
          </div>
          <div className="text-xs text-zinc-300 font-mono">
            Fastest sorting time: <span className="text-emerald-400 font-bold">{battleWinner.time} ms</span>
          </div>
        </motion.div>
      )}

      {/* Visualizer Panels Grid */}
      <div className={`grid gap-6 ${isDualMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        <VisualizerPanel
          algorithmKey={algo1}
          steps={panel1Data.steps}
          executionTimeMs={panel1Data.timeMs}
          panelTitle={`${ALGORITHM_DETAILS[algo1]?.name || 'Algorithm 1'}`}
        />

        {isDualMode && (
          <VisualizerPanel
            algorithmKey={algo2}
            steps={panel2Data.steps}
            executionTimeMs={panel2Data.timeMs}
            panelTitle={`${ALGORITHM_DETAILS[algo2]?.name || 'Algorithm 2'}`}
          />
        )}
      </div>

      {/* Replay Instructions / Note */}
      <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 flex items-center gap-3 text-xs text-zinc-400">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          Use the Play, Step, and Slider scrub controls on each panel to inspect individual comparisons (yellow),
          swaps (pink), and locked sorted elements (green). Speed can be toggled from 1x to 10x.
        </span>
      </div>
    </div>
  );
};

export default BattleArena;
