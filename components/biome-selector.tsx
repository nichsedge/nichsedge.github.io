'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplet, TreePine, Terminal, Settings2, Globe, Sparkles, Flame, Moon, Monitor,
  Shield, ShieldAlert, EarOff, X, Volume2, VolumeX
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gameEngine, useGameState } from '@/lib/game-engine';

export type BiomeType = 'cyber' | 'oled' | 'terminal' | 'ocean' | 'forest' | 'quantum' | 'nebula';

const ALL_BIOMES: BiomeType[] = ['cyber', 'oled', 'terminal', 'ocean', 'forest', 'quantum', 'nebula'];

export function BiomeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBiome, setCurrentBiome] = useState<BiomeType>('cyber');
  const [isSensoryLockdown, setIsSensoryLockdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const gameState = useGameState();

  // Initialize biome & sensory lockdown from localStorage (safely on mount to avoid hydration mismatch)
  useEffect(() => {
    const savedBiome = localStorage.getItem('selected-biome') as BiomeType | null;
    if (savedBiome && ALL_BIOMES.includes(savedBiome)) {
      setCurrentBiome(savedBiome);
    }
    const savedLockdown = localStorage.getItem('sensory-lockdown') === 'true';
    if (savedLockdown) {
      setIsSensoryLockdown(true);
      document.body.classList.add('sensory-lockdown');
    }
  }, []);

  // Listen to external biome change events (e.g. from the Terminal console)
  useEffect(() => {
    const handleExternalBiomeChange = (e: Event) => {
      const customEvent = e as CustomEvent<BiomeType>;
      if (customEvent.detail && ALL_BIOMES.includes(customEvent.detail)) {
        setCurrentBiome(customEvent.detail);
      }
    };
    window.addEventListener('selected-biome-change', handleExternalBiomeChange as EventListener);
    return () => window.removeEventListener('selected-biome-change', handleExternalBiomeChange as EventListener);
  }, []);

  // Listen to external sensory lockdown toggle events
  useEffect(() => {
    const handleToggleLockdown = () => {
      setIsSensoryLockdown(prev => !prev);
    };
    window.addEventListener('toggle-sensory-lockdown', handleToggleLockdown);
    return () => window.removeEventListener('toggle-sensory-lockdown', handleToggleLockdown);
  }, []);

  // Update body classes and save to localStorage for biome
  useEffect(() => {
    document.documentElement.classList.remove(...ALL_BIOMES.map(b => `biome-${b}`));
    document.documentElement.classList.add(`biome-${currentBiome}`);
    localStorage.setItem('selected-biome', currentBiome);
  }, [currentBiome]);

  // Sync sensory lockdown state with body class & localStorage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isSensoryLockdown) {
      document.body.classList.add('sensory-lockdown');
      localStorage.setItem('sensory-lockdown', 'true');
      setShowNotification(true);
    } else {
      document.body.classList.remove('sensory-lockdown');
      localStorage.setItem('sensory-lockdown', 'false');
      setShowNotification(false);
    }
  }, [isSensoryLockdown]);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (!showNotification) return;
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  // Global keyboard shortcut (Ctrl/Cmd + ,) & open-system-settings event
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('open-system-settings', handleOpenEvent);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('open-system-settings', handleOpenEvent);
    };
  }, []);

  // Click outside to close, Escape key support, and Arrow Up/Down navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const items = containerRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemcheckbox"]');
        if (!items || items.length === 0) return;
        const currentActive = document.activeElement as HTMLElement;
        const currentIndex = Array.from(items).indexOf(currentActive);
        let nextIndex = 0;
        if (event.key === 'ArrowDown') {
          nextIndex = currentIndex >= 0 && currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }
        items[nextIndex]?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const pathname = usePathname() || '/';
  const isIndonesian = pathname.startsWith('/id');
  
  const enPath = isIndonesian ? (pathname.replace(/^\/id/, '') || '/') : pathname;
  const idPath = isIndonesian ? pathname : (pathname === '/' ? '/id/' : `/id${pathname}`);

  const biomes = [
    { id: 'cyber', icon: Terminal, label: 'CYBERNEON' },
    { id: 'oled', icon: Moon, label: 'OLED MIDNIGHT' },
    { id: 'terminal', icon: Monitor, label: 'SOLARIZED CRT' },
    { id: 'ocean', icon: Droplet, label: 'OCEAN' },
    { id: 'forest', icon: TreePine, label: 'FOREST' },
    { id: 'quantum', icon: Sparkles, label: 'QUANTUM' },
    { id: 'nebula', icon: Flame, label: 'NEBULA' },
  ] as const;

  return (
    <>
      <div 
        ref={containerRef}
        className="sys-settings-menu fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-[120px] lg:bottom-20 right-3.5 sm:right-6 z-[85] flex flex-col items-end gap-2"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="flex flex-col gap-1.5 sm:gap-2 bg-bg border border-border-subtle p-2.5 rounded-md shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] min-w-[180px] relative z-[1000]"
              role="menu"
              aria-label="System Settings Menu"
            >
              {/* Section 1: Biomes */}
              <div className="font-mono text-[7px] tracking-[0.2em] text-[#71717a] mb-1.5 uppercase font-bold px-1.5 opacity-90">
                SYS_BIOME
              </div>
              <div className="flex flex-col gap-1">
                {biomes.map(biome => (
                  <button
                    key={biome.id}
                    role="menuitem"
                    onClick={() => {
                      setCurrentBiome(biome.id);
                      setIsOpen(false);
                      window.dispatchEvent(new CustomEvent('selected-biome-change', { detail: biome.id }));
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 sm:py-1.5 text-[10px] sm:text-[9px] font-mono uppercase tracking-widest rounded-sm transition-colors justify-start min-h-[36px] sm:min-h-0 cursor-pointer ${currentBiome === biome.id ? 'bg-accent/20 text-accent font-bold' : 'text-text-3 hover:bg-bg-1 hover:text-accent'}`}
                  >
                    <biome.icon className="size-3.5 sm:size-3 shrink-0" />
                    {biome.label}
                  </button>
                ))}
              </div>

              {/* Separator */}
              <div className="border-t border-border-subtle/50 my-1.5 pt-1.5" />

              {/* Section 2: Languages */}
              <div className="font-mono text-[7px] tracking-[0.2em] text-[#71717a] mb-1.5 uppercase font-bold px-1.5 opacity-90 flex items-center gap-1">
                <Globe className="size-2 text-accent/60" /> COGNITIVE_LOCALE
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { id: 'en', label: 'ENGLISH', href: enPath, active: !isIndonesian },
                  { id: 'id', label: 'INDONESIAN', href: idPath, active: isIndonesian },
                ].map(lang => (
                  <Link
                    key={lang.id}
                    href={lang.href}
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-widest rounded-sm transition-colors justify-start ${lang.active ? 'bg-accent/20 text-accent font-bold' : 'text-text-3 hover:bg-bg-1 hover:text-accent'}`}
                  >
                    <Globe className="size-3 shrink-0" />
                    {lang.label}
                  </Link>
                ))}
              </div>

              {/* Separator */}
              <div className="border-t border-border-subtle/50 my-1.5 pt-1.5" />

              {/* Section 3: Audio Soundscape */}
              <div className="font-mono text-[7px] tracking-[0.2em] text-[#71717a] mb-1.5 uppercase font-bold px-1.5 opacity-90 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Volume2 className="size-2 text-accent/60" /> AUDIO_SOUNDSCAPE
                </span>
                {gameState.audioEnabled && (
                  <span className="text-[7px] text-accent animate-pulse font-mono tracking-normal">ACTIVE</span>
                )}
              </div>
              <button
                role="menuitemcheckbox"
                aria-checked={gameState.audioEnabled}
                onClick={() => gameEngine.toggleAudio()}
                className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-widest rounded-sm transition-all text-left ${
                  gameState.audioEnabled 
                    ? 'bg-accent/20 text-accent font-bold border border-accent/40 shadow-[0_0_10px_rgba(0,225,207,0.15)]' 
                    : 'text-text-3 hover:bg-bg-1 hover:text-accent border border-transparent'
                }`}
                title={gameState.audioEnabled ? "Mute Cyberpunk Soundscape" : "Enable Cyberpunk Soundscape"}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {gameState.audioEnabled ? (
                    <Volume2 className="size-3 shrink-0 text-accent animate-pulse" />
                  ) : (
                    <VolumeX className="size-3 shrink-0" />
                  )}
                  <span className="truncate">AUDIO SYNTH</span>
                </div>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0 font-bold ${
                  gameState.audioEnabled ? 'bg-accent text-bg' : 'bg-bg-1 text-text-3 border border-border-subtle'
                }`}>
                  {gameState.audioEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Separator */}
              <div className="border-t border-border-subtle/50 my-1.5 pt-1.5" />

              {/* Section 4: Sensory Protocol */}
              <div className="font-mono text-[7px] tracking-[0.2em] text-[#71717a] mb-1.5 uppercase font-bold px-1.5 opacity-90 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Shield className="size-2 text-accent/60" /> SENSORY_PROTOCOL
                </span>
                {isSensoryLockdown && (
                  <span className="text-[7px] text-accent animate-pulse font-mono tracking-normal">ACTIVE</span>
                )}
              </div>
              <button
                role="menuitemcheckbox"
                aria-checked={isSensoryLockdown}
                onClick={() => setIsSensoryLockdown(prev => !prev)}
                className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-widest rounded-sm transition-all text-left ${
                  isSensoryLockdown 
                    ? 'bg-accent/20 text-accent font-bold border border-accent/40 shadow-[0_0_10px_rgba(0,225,207,0.15)]' 
                    : 'text-text-3 hover:bg-bg-1 hover:text-accent border border-transparent'
                }`}
                title={isSensoryLockdown ? "Disable Sensory Lockdown" : "Enable Sensory Lockdown"}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isSensoryLockdown ? (
                    <EarOff className="size-3 shrink-0 text-accent" />
                  ) : (
                    <Shield className="size-3 shrink-0" />
                  )}
                  <span className="truncate">SENSORY LOCKDOWN</span>
                </div>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0 font-bold ${
                  isSensoryLockdown ? 'bg-accent text-bg' : 'bg-bg-1 text-text-3 border border-border-subtle'
                }`}>
                  {isSensoryLockdown ? 'ON' : 'OFF'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3 min-w-[42px] min-h-[42px] rounded-full border bg-bg-1 transition-all flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] outline-none focus:outline-none focus:ring-0 ${
            isOpen 
              ? 'border-accent text-accent scale-105 rotate-45' 
              : isSensoryLockdown
              ? 'border-accent/60 text-accent hover:border-accent'
              : 'border-border-subtle text-text-3 hover:text-accent hover:border-accent/30'
          }`}
          title={isSensoryLockdown ? "Override System Control Panel (Sensory Lockdown Active)" : gameState.audioEnabled ? "Override System Control Panel (Audio Active)" : "Override System Control Panel"}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Toggle System Control Panel menu"
        >
          <Settings2 className="size-4 sm:size-[18px]" />
          {isSensoryLockdown && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_6px_#00e1cf]" />
          )}
        </button>
      </div>

      {/* Sensory Lockdown Alert Toast */}
      <AnimatePresence>
        {showNotification && isSensoryLockdown && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="sys-settings-menu fixed bottom-[calc(9rem+env(safe-area-inset-bottom,0px))] lg:bottom-[136px] right-3.5 sm:right-6 z-[1000] bg-bg border border-accent p-3 sm:p-3.5 font-mono text-[9px] sm:text-[10px] w-64 sm:w-72 uppercase tracking-widest text-accent shadow-2xl backdrop-blur-md rounded-sm"
          >
            <div className="flex items-center justify-between mb-1.5 font-bold">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="animate-pulse shrink-0" />
                <span>SENSORY LOCKDOWN ACTIVE</span>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-text-3 hover:text-accent p-0.5 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X size={12} />
              </button>
            </div>
            <p className="text-text-2 normal-case text-[9px] leading-relaxed font-sans">
              environmental noise canceled. visual distractions disabled. pure focus.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

