'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle2, Circle, Volume2, VolumeX, 
  RotateCcw, Sliders, Award, Target, Terminal
} from 'lucide-react';
import { 
  useGameState, gameEngine, INITIAL_QUESTS, BADGES, 
  TelemetryConfig 
} from '@/lib/game-engine';

interface DiagnosticDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenArcade?: () => void;
  locale?: 'en' | 'id';
}

export function GameDiagnosticDrawer({ isOpen, onClose, onOpenArcade, locale = 'en' }: DiagnosticDrawerProps) {
  const gameState = useGameState();
  const [activeTab, setActiveTab] = useState<'quests' | 'badges' | 'telemetry'>('quests');
  const isID = locale === 'id';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-bg border border-border-subtle shadow-2xl rounded-t-xl sm:rounded-lg overflow-hidden flex flex-col max-h-[85vh] z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-bg-1">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-text-0 font-bold flex items-center gap-2">
                  <Terminal size={14} className="text-accent" />
                  {isID ? 'DECK DIAGNOSTIK & MATRIKS MISI' : 'DIAGNOSTIC DECK & QUEST MATRIX'}
                </h3>
                <p className="font-mono text-[10px] text-text-3">
                  {isID ? `STATUS CLEARANCE: ${gameState.title} (LVL ${gameState.level})` : `CLEARANCE STATUS: ${gameState.title} (LVL ${gameState.level})`}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-text-3 hover:text-text-0 hover:bg-bg transition-colors rounded-sm cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="flex border-b border-border-subtle bg-bg-1/50 px-4 gap-2 font-mono text-[11px]">
            <button
              onClick={() => setActiveTab('quests')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'quests' 
                  ? 'border-accent text-accent font-bold' 
                  : 'border-transparent text-text-3 hover:text-text-1'
              }`}
            >
              <Target size={14} />
              {isID ? 'Misi Aktif' : 'Active Quests'} ({gameState.completedQuests.length}/{INITIAL_QUESTS.length})
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'badges' 
                  ? 'border-accent text-accent font-bold' 
                  : 'border-transparent text-text-3 hover:text-text-1'
              }`}
            >
              <Award size={14} />
              {isID ? 'Lencana' : 'Badges'} ({gameState.unlockedBadges.length}/{BADGES.length})
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'telemetry' 
                  ? 'border-accent text-accent font-bold' 
                  : 'border-transparent text-text-3 hover:text-text-1'
              }`}
            >
              <Sliders size={14} />
              {isID ? 'Kontrol Taktis' : 'Tactile Telemetry'}
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
            {activeTab === 'quests' && (
              <div className="space-y-3">
                {onOpenArcade && (
                  <div 
                    onClick={() => { onClose(); onOpenArcade(); }}
                    className="p-3 bg-accent/10 border border-accent/40 hover:border-accent rounded-sm flex items-center justify-between cursor-pointer transition-all shadow-[0_0_15px_rgba(0,225,207,0.15)] group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">🏎️</span>
                      <div>
                        <div className="font-bold text-text-0 group-hover:text-accent transition-colors flex items-center gap-1.5">
                          {isID ? 'MAINKAN: 3D DATA HIGHWAY ARCADE' : 'PLAY: 3D DATA HIGHWAY ARCADE'}
                          <span className="text-[9px] px-1.5 py-0.2 bg-accent text-bg font-bold rounded">MINIGAME</span>
                        </div>
                        <div className="text-[10px] text-text-3 mt-0.5">
                          {isID ? 'Kendalikan drone transmisi dan raih 500+ skor (+200 XP)' : 'Pilot the transmission drone and reach 500+ score (+200 XP)'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-accent font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                      {isID ? 'MAIN →' : 'LAUNCH →'}
                    </span>
                  </div>
                )}

                <div className="text-[10px] text-text-3 uppercase tracking-wider mb-2 pt-1">
                  {isID ? 'Matriks Misi Progres:' : 'Mission Progression Matrix:'}
                </div>
                {INITIAL_QUESTS.map(quest => {
                  const isDone = gameState.completedQuests.includes(quest.id);
                  return (
                    <div 
                      key={quest.id} 
                      className={`p-3 border rounded-sm flex items-start justify-between gap-3 transition-colors ${
                        isDone 
                          ? 'border-accent/30 bg-accent/5' 
                          : 'border-border-subtle bg-bg-1/40 hover:border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isDone ? (
                          <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                        ) : (
                          <Circle size={16} className="text-text-3 shrink-0 mt-0.5 opacity-50" />
                        )}
                        <div>
                          <div className={`font-semibold ${isDone ? 'text-accent line-through opacity-80' : 'text-text-0'}`}>
                            {isID ? quest.titleId : quest.title}
                          </div>
                          <div className="text-[11px] text-text-3 mt-0.5">
                            {isID ? quest.descriptionId : quest.description}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          isDone 
                            ? 'bg-accent/20 text-accent font-bold' 
                            : 'bg-bg-1 text-text-3 border border-border-subtle'
                        }`}>
                          +{quest.xp} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BADGES.map(badge => {
                  const isUnlocked = gameState.unlockedBadges.includes(badge.id);
                  return (
                    <div 
                      key={badge.id} 
                      className={`p-3 border rounded-sm flex items-center gap-3 transition-colors ${
                        isUnlocked 
                          ? 'border-accent/40 bg-accent/5' 
                          : 'border-border-subtle bg-bg-1/20 opacity-40'
                      }`}
                    >
                      <div className="text-2xl p-2 bg-bg-1 border border-border-subtle rounded">
                        {badge.icon}
                      </div>
                      <div>
                        <div className="font-bold text-text-0 flex items-center gap-1.5">
                          {badge.title}
                          {isUnlocked && <span className="text-[9px] text-accent font-mono">[UNLOCKED]</span>}
                        </div>
                        <div className="text-[11px] text-text-3 mt-0.5">{badge.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'telemetry' && (
              <div className="space-y-4">
                <div className="text-[10px] text-text-3 uppercase tracking-wider">
                  {isID 
                    ? 'Alih-alih animasi otomatis yang bising, aktifkan widget telemetri sesuai kebutuhan Anda:' 
                    : 'Instead of passive noisy animations, toggle live telemetry widgets on demand:'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'metrics' as keyof TelemetryConfig, label: 'Live Ingestion Metrics', desc: 'Throughput & batch buffer' },
                    { key: 'stream' as keyof TelemetryConfig, label: 'Realtime Event Stream', desc: 'Subsystem execution logs' },
                    { key: 'routing' as keyof TelemetryConfig, label: 'Geo Routing Mesh', desc: 'Regional edge node latency' },
                    { key: 'allocator' as keyof TelemetryConfig, label: 'Thread Allocator', desc: 'Worker concurrency telemetry' },
                    { key: 'monitor' as keyof TelemetryConfig, label: 'System Monitor', desc: 'CPU, memory, & cache utilization' },
                  ].map(item => {
                    const active = gameState.telemetry[item.key];
                    return (
                      <div 
                        key={item.key}
                        onClick={() => gameEngine.toggleTelemetry(item.key)}
                        className={`p-3 border rounded-sm flex items-center justify-between cursor-pointer transition-all ${
                          active 
                            ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(0,225,207,0.15)]' 
                            : 'border-border-subtle bg-bg-1/40 hover:border-border'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-text-0">{item.label}</div>
                          <div className="text-[10px] text-text-3">{item.desc}</div>
                        </div>
                        <div className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${active ? 'bg-accent' : 'bg-bg-1 border border-border-subtle'}`}>
                          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
                  <button 
                    onClick={() => gameEngine.toggleAudio()}
                    className="flex items-center gap-2 px-3 py-1.5 border border-border-subtle hover:border-accent text-text-2 hover:text-accent rounded-sm transition-colors text-[11px]"
                  >
                    {gameState.audioEnabled ? <Volume2 size={14} className="text-accent" /> : <VolumeX size={14} />}
                    <span>{gameState.audioEnabled ? (isID ? 'Audio: Aktif' : 'Audio: Active') : (isID ? 'Audio: Nonaktif' : 'Audio: Muted')}</span>
                  </button>

                  <button 
                    onClick={() => {
                      if (window.confirm(isID ? 'Reset ulang semua level dan XP?' : 'Reboot system progress & XP?')) {
                        gameEngine.resetProgress();
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-sm transition-colors text-[11px]"
                  >
                    <RotateCcw size={14} />
                    <span>{isID ? 'Reset Progres Sistem' : 'Reset System Progress'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
