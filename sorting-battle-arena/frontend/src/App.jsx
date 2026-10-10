import React, { useState } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import MouseGlow from './components/MouseGlow';
import ThreeBackground from './components/ThreeBackground';
import HeroSection from './components/HeroSection';
import InputSection from './components/InputSection';
import BattleModeSection from './components/BattleModeSection';
import BattleArenaSection from './components/BattleArenaSection';
import PerformanceSection from './components/PerformanceSection';
import ComplexitySection from './components/ComplexitySection';
import HistorySection from './components/HistorySection';
import sortingApi from './services/api';
import soundEffects from './utils/soundEffects';

const MainExperience = () => {
  const { addToast } = useToast();

  // Strict Step Progression:
  // 1 = Input Type
  // 2 = Battle Mode & Algorithm Selection
  // 3 = Live Battle Arena
  // 4 = Performance Analytics & Download
  const [unlockedStep, setUnlockedStep] = useState(1);
  const [heroCompressed, setHeroCompressed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundEffects.isEnabled());

  // Active dataset state
  const [dataset, setDataset] = useState([45, 12, 89, 7, 31, 64, 22, 90, 18, 53, 37, 72, 85, 29, 6, 99]);
  const [inputType, setInputType] = useState('manual'); // 'manual', 'random', 'file'
  const [fileDetails, setFileDetails] = useState(null);
  const [datasetSummary, setDatasetSummary] = useState(null);

  // Battle Mode and Algorithm selection state
  const [selectedMode, setSelectedMode] = useState('Multi'); // 'Single' or 'Multi'
  const [selectedAlgos, setSelectedAlgos] = useState(['quick', 'merge']);
  const [confirmedBattleAlgos, setConfirmedBattleAlgos] = useState([]);

  // Results & Download state
  const [battleResults, setBattleResults] = useState([]);
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [arenaKey, setArenaKey] = useState(1);

  const handleToggleSound = () => {
    const active = soundEffects.toggleSound();
    setSoundEnabled(active);
    addToast(active ? 'Tactile audio effects enabled' : 'Audio muted', 'info');
  };

  // When user alters mode or toggles algorithms in Step 2:
  const handleSelectionChange = () => {
    if (unlockedStep > 2) {
      setUnlockedStep(2);
      setConfirmedBattleAlgos([]);
    }
  };

  // 1. Hero CTA: Smoothly scrolls to Step 1
  const handleStartSorting = () => {
    setHeroCompressed(true);
    const inputEl = document.getElementById('input-section');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 2. Input Section Submission: USER CLICKS BUTTON -> Only then reveals and scrolls to Step 2
  const handleInputReady = (numbers, type, details) => {
    setDataset(numbers);
    setInputType(type);
    setFileDetails(details);
    setDatasetSummary(details);

    // Advance to Step 2
    setUnlockedStep((prev) => Math.max(prev, 2));

    // Reset later stages if dataset changes
    setConfirmedBattleAlgos([]);
    setBattleResults([]);
    setDownloadInfo(null);

    // Smooth scroll to Step 2 (Battle Mode)
    setTimeout(() => {
      const modeEl = document.getElementById('battle-mode-section');
      if (modeEl) {
        modeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  // 3. Battle Mode Submission: USER CLICKS "Enter Arena & Begin Battle" -> Only reveals Step 3 and runs!
  const handleEnterArena = async () => {
    setConfirmedBattleAlgos([...selectedAlgos]);
    setUnlockedStep(3);
    setArenaKey(Date.now());

    // Fetch backend telemetry
    try {
      const res = await sortingApi.sortDataset({
        numbers: dataset,
        fileId: fileDetails?.fileId,
        originalFilename: fileDetails?.originalFilename,
        sheetName: fileDetails?.sheetName,
        columnIndex: fileDetails?.columnIndex,
        algorithms: selectedAlgos,
        mode: selectedMode,
        inputType,
        order: 'asc'
      });

      if (res.success && res.results) {
        setBattleResults(res.results);
        setDownloadInfo(res.download);
      }
    } catch (err) {
      console.error('Backend battle run error:', err);
    }

    // Smooth scroll to Step 3 (Battle Arena)
    setTimeout(() => {
      const arenaEl = document.getElementById('battle-arena-section');
      if (arenaEl) {
        arenaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  // 4. Battle Completion: Triggered ONLY when user explicitly clicks "View Performance Analytics & Results ↓"
  const handleProceedToPerformance = () => {
    setUnlockedStep(4);
    addToast('Revealing empirical analytics and performance metrics below!', 'info');

    setTimeout(() => {
      const perfEl = document.getElementById('performance-section');
      if (perfEl) {
        perfEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  return (
    <div className="relative min-h-screen bg-[#08090B] text-zinc-100 overflow-x-hidden selection:bg-[#C62832]/30 selection:text-white">
      {/* Real Animated Three.js 3D Background with Depth & Dynamic Lighting */}
      <ThreeBackground />

      {/* Atmospheric Cursor Glow and Ambient Noise */}
      <MouseGlow />

      {/* Main Continuous Step-by-Step Flow */}
      <main className="relative z-10 space-y-4 sm:space-y-6 pb-16 sm:pb-24">
        {/* Hero Section */}
        <HeroSection
          onStartSorting={handleStartSorting}
          isCompressed={heroCompressed}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        {/* Step 1: Choose Input Type */}
        <InputSection
          onInputReady={handleInputReady}
          activeInputType={inputType}
          datasetSummary={datasetSummary}
        />

        {/* Step 2: Choose Battle Mode & Competitors (Revealed after Step 1 is ready) */}
        {unlockedStep >= 2 && (
          <BattleModeSection
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            selectedAlgos={selectedAlgos}
            setSelectedAlgos={setSelectedAlgos}
            onEnterArena={handleEnterArena}
            onSelectionChange={handleSelectionChange}
          />
        )}

        {/* Step 3: Live Battle Arena (Revealed after "Enter Arena" is clicked) */}
        {unlockedStep >= 3 && confirmedBattleAlgos.length > 0 && (
          <BattleArenaSection
            key={arenaKey}
            dataset={dataset}
            selectedAlgos={confirmedBattleAlgos}
            order="asc"
            onProceedToPerformance={handleProceedToPerformance}
          />
        )}

        {/* Step 4: Performance Analytics & Conditional Download */}
        {unlockedStep >= 4 && (
          <PerformanceSection
            battleResults={battleResults}
            inputType={inputType}
            downloadInfo={downloadInfo}
            datasetSize={dataset.length}
          />
        )}

        {/* Step 5: Complexity & Theoretical Deep Dive */}
        <ComplexitySection />

        {/* Step 6: History & Audit Log */}
        <HistorySection />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <MainExperience />
    </ToastProvider>
  );
}
