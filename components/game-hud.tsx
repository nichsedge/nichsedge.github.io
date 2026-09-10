'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, CheckCircle2, ChevronUp, ChevronDown, Gamepad2 
} from 'lucide-react';
import { 
  useGameState, gameEngine, getXpForNextLevel, 
  INITIAL_QUESTS 
} from '@/lib/game-engine';
import { GameDiagnosticDrawer } from '@/components/game-diagnostic-drawer';
import { soundEngine } from '@/lib/audio';

const DataHighwayArcade = dynamic(
  () => import('@/components/three/data-highway-arcade').then(m => m.DataHighwayArcade),
  { ssr: false }
);

interface GameHudProps {
  locale?: 'en' | 'id';
}

export function GameHUD({ locale = 'en' }: GameHudProps) {
  const gameState = useGameState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const isID = locale === 'id';

  // Find next uncompleted quest
  const activeQuest = INITIAL_QUESTS.find(q => !gameState.completedQuests.includes(q.id));
  const maxLevelXp = getXpForNextLevel(gameState.level);
  const xpPercent = Math.min(100, Math.max(0, (gameState.xp / maxLevelXp) * 100));

  const handleOpenDrawer = () => {
    soundEngine.playClick(1000, 0.03);
    setDrawerOpen(true);
    if (!gameState.completedQuests.includes('inspect_telemetry')) {
      gameEngine.completeQuest('inspect_telemetry');
    }
  };

  const handleOpenArcade = () => {
    soundEngine.playSqlExecute();
    setArcadeOpen(true);
  };

  return (
    <>
      {/* Toast Notification for XP, Level-Up, or Badge Unlock */}
      <AnimatePresence>
        {gameState.notification && (
          <motion.div
            key={gameState.notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-auto sm:top-auto sm:bottom-24 sm:right-6 sm:left-auto sm:translate-x-0 z-[100] max-w-sm font-mono text-xs p-3.5 rounded-sm border shadow-2xl backdrop-blur-md flex items-center gap-3 ${
              gameState.notification.type === 'level' 
                ? 'bg-accent/15 border-accent text-accent shadow-[0_0_25px_rgba(0,225,207,0.3)]' 
                : gameState.notification.type === 'badge'
                ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.3)]'
                : 'bg-[#09090b]/90 border-accent/40 text-text-0'
            }`}
          >
            <div className="p-1.5 rounded-full bg-accent/20 text-accent shrink-0">
              {gameState.notification.type === 'level' ? (
                <Sparkles size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-text-3 font-semibold">
                {gameState.notification.type === 'level' ? '[SYSTEM PROMOTION]' : '[QUEST COMPLETED]'}
              </div>
              <div className="font-bold text-xs mt-0.5">{gameState.notification.message}</div>
              {gameState.notification.xp && (
                <span className="text-[10px] text-accent font-bold">+{gameState.notification.xp} XP</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Data Highway Arcade Modal */}
      <AnimatePresence>
        {arcadeOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl"
            >
              <DataHighwayArcade 
                onClose={() => setArcadeOpen(false)} 
                locale={locale} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Game HUD Dock */}
      <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-[80] pointer-events-auto">
        {minimized ? (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={() => setMinimized(false)}
            className="bg-[#09090b]/95 border border-accent/40 hover:border-accent rounded-full px-3.5 py-2 backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.8)] flex items-center gap-2 text-xs font-mono cursor-pointer transition-all min-h-[36px]"
            title={isID ? "Buka Game HUD" : "Expand Game HUD"}
            aria-label="Expand Game HUD"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-bold text-[10px]">LVL {gameState.level}</span>
            <span className="text-text-3 text-[10px]">•</span>
            <span className="text-text-2 text-[10px] max-w-[120px] sm:max-w-[130px] truncate">
              {activeQuest ? (isID ? activeQuest.titleId : activeQuest.title) : 'SYSTEM ROOT'}
            </span>
            <ChevronUp size={12} className="text-accent ml-0.5" />
          </motion.button>
        ) : (
          <div className="w-[95vw] max-w-3xl">
            <div className="bg-[#09090b]/90 border border-border-subtle hover:border-accent/40 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-between gap-1.5 sm:gap-2.5 text-xs font-mono transition-colors">
              
              {/* Rank & XP Bar */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold text-[10px] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span>LVL {gameState.level}</span>
                </div>

                <div className="hidden sm:flex flex-col min-w-[100px]">
                  <div className="flex justify-between text-[9px] text-text-3 font-medium">
                    <span className="text-text-1 font-semibold truncate max-w-[80px]">{gameState.title}</span>
                    <span>{gameState.xp}/{maxLevelXp} XP</span>
                  </div>
                  <div className="w-full h-1 bg-border-subtle rounded-full overflow-hidden mt-1">
                    <motion.div 
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercent}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </div>

              {/* Active Mission Pill */}
              <div 
                onClick={handleOpenDrawer}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-bg-1/60 hover:bg-accent/10 border border-border-subtle hover:border-accent/30 cursor-pointer transition-all min-w-0 max-w-[120px] xs:max-w-[160px] sm:max-w-none"
                title={isID ? "Klik untuk melihat matriks misi" : "Click to view mission matrix"}
              >
                <span className="text-accent text-[11px] shrink-0">🎯</span>
                <span className="text-[10px] text-text-2 truncate">
                  {activeQuest 
                    ? (isID ? activeQuest.titleId : activeQuest.title)
                    : (isID ? 'Semua Misi Selesai (Root Access)' : 'All Missions Cleared (Root Access)')}
                </span>
                <span className="hidden md:inline-block text-[9px] text-accent font-bold shrink-0">
                  {activeQuest ? `+${activeQuest.xp}XP` : '★'}
                </span>
              </div>

              {/* Controls: 3D Arcade, Diagnostic Drawer Trigger & Mobile Collapse */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={handleOpenArcade}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-accent/15 hover:bg-accent hover:text-bg text-accent border border-accent/40 font-mono text-[10px] font-bold uppercase transition-all shadow-[0_0_12px_rgba(0,225,207,0.2)] cursor-pointer"
                  title={isID ? "Mainkan 3D Data Highway Minigame" : "Play 3D Data Highway Minigame"}
                >
                  <Gamepad2 size={12} />
                  <span className="hidden sm:inline">{isID ? '3D GAME' : '3D GAME'}</span>
                </button>

                <button
                  onClick={handleOpenDrawer}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-bg-1 hover:bg-accent hover:text-bg text-text-1 border border-border-subtle hover:border-accent font-mono text-[10px] font-bold uppercase transition-all cursor-pointer"
                  title={isID ? "Buka Tactical Deck" : "Open Tactical Deck"}
                >
                  <ChevronUp size={12} />
                  <span className="hidden sm:inline">{isID ? 'DECK' : 'DECK'}</span>
                  <span className="px-1 py-0.2 rounded-full bg-accent/20 text-accent group-hover:bg-bg group-hover:text-accent text-[9px]">
                    {gameState.completedQuests.length}/{INITIAL_QUESTS.length}
                  </span>
                </button>

                <button
                  onClick={() => setMinimized(true)}
                  className="p-1.5 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full text-text-3 hover:text-accent transition-colors cursor-pointer sm:hidden"
                  title={isID ? "Kecilkan HUD" : "Minimize HUD"}
                  aria-label="Minimize HUD"
                >
                  <ChevronDown size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slide-Up Tactical Diagnostics & Quest Drawer */}
      <GameDiagnosticDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        onOpenArcade={handleOpenArcade}
        locale={locale} 
      />
    </>
  );
}
