import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Swords,
  BarChart3,
  BookOpen,
  History,
  FileSpreadsheet,
  Upload,
  Dice5,
  Download,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CommandPalette = ({
  isOpen,
  onClose,
  setActivePage,
  onGenerateRandom,
  onTriggerSort,
  onTriggerBenchmark,
  hasDataset,
  hasDownload
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    {
      category: 'Navigation',
      items: [
        { id: 'nav-dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => { setActivePage('dashboard'); onClose(); } },
        { id: 'nav-battle', label: 'Go to Battle Arena', icon: Swords, action: () => { setActivePage('battle'); onClose(); } },
        { id: 'nav-benchmark', label: 'Go to Benchmark Leaderboard', icon: BarChart3, action: () => { setActivePage('benchmark'); onClose(); } },
        { id: 'nav-complexity', label: 'Go to Complexity Analysis', icon: BookOpen, action: () => { setActivePage('complexity'); onClose(); } },
        { id: 'nav-stability', label: 'Go to Stability Demonstration', icon: Layers, action: () => { setActivePage('stability'); onClose(); } },
        { id: 'nav-history', label: 'Go to Battle History', icon: History, action: () => { setActivePage('history'); onClose(); } },
        { id: 'nav-about', label: 'Go to About & Documentation', icon: Info, action: () => { setActivePage('about'); onClose(); } },
      ]
    },
    {
      category: 'Dataset Actions',
      items: [
        { id: 'act-generate', label: 'Generate Random Dataset (50 items)', icon: Dice5, action: () => { onGenerateRandom?.(50, 'random'); onClose(); } },
        { id: 'act-upload', label: 'Upload Dataset File (.xlsx, .csv, .txt)', icon: Upload, action: () => { setActivePage('dashboard'); onClose(); } },
      ]
    },
    {
      category: 'Execution',
      items: [
        { id: 'act-duel', label: 'Start Algorithm Duel (Battle Arena)', icon: Swords, action: () => { setActivePage('battle'); onTriggerSort?.(); onClose(); } },
        { id: 'act-bench', label: 'Benchmark All 6 Algorithms', icon: BarChart3, action: () => { setActivePage('benchmark'); onTriggerBenchmark?.(); onClose(); } },
      ]
    }
  ];

  const filteredItems = actions.flatMap((group) =>
    group.items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    )
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].action();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass-panel"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search action (e.g. battle, upload, benchmark)..."
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            <kbd className="px-2 py-0.5 text-xs bg-zinc-800 rounded border border-zinc-700 text-zinc-400 font-mono">
              ESC
            </kbd>
          </div>

          {/* Action List */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">
                No matching actions found for "{query}".
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-sm transition-all duration-150 ${
                      isSelected
                        ? 'bg-blue-600/20 text-white border border-blue-500/30'
                        : 'text-zinc-300 hover:bg-zinc-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-blue-400 opacity-100' : 'opacity-0'}`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 bg-zinc-950/60 text-[11px] text-zinc-500">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-zinc-400">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-zinc-400">↓</kbd> to navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-zinc-400">↵</kbd> to select</span>
            </div>
            <span>Sorting Battle Arena Spotlight</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
