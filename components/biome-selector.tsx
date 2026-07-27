'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, TreePine, Terminal, Settings2, Globe, Sparkles, Flame } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type BiomeType = 'cyber' | 'ocean' | 'forest' | 'quantum' | 'nebula';

export function BiomeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBiome, setCurrentBiome] = useState<BiomeType>('cyber');
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize biome from localStorage (safely on mount to avoid hydration mismatch)
  useEffect(() => {
    const savedBiome = localStorage.getItem('selected-biome') as BiomeType | null;
    if (savedBiome && ['cyber', 'ocean', 'forest', 'quantum', 'nebula'].includes(savedBiome)) {
      setCurrentBiome(savedBiome);
    }
  }, []);

  // Listen to external biome change events (e.g. from the Terminal console)
  useEffect(() => {
    const handleExternalBiomeChange = (e: Event) => {
      const customEvent = e as CustomEvent<BiomeType>;
      if (customEvent.detail && ['cyber', 'ocean', 'forest', 'quantum', 'nebula'].includes(customEvent.detail)) {
        setCurrentBiome(customEvent.detail);
      }
    };
    window.addEventListener('selected-biome-change', handleExternalBiomeChange as EventListener);
    return () => window.removeEventListener('selected-biome-change', handleExternalBiomeChange as EventListener);
  }, []);

  // Update body classes and save to localStorage
  useEffect(() => {
    document.documentElement.classList.remove('biome-cyber', 'biome-ocean', 'biome-forest', 'biome-quantum', 'biome-nebula');
    document.documentElement.classList.add(`biome-${currentBiome}`);
    localStorage.setItem('selected-biome', currentBiome);
  }, [currentBiome]);

  // Click outside to close & Escape key support
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
    { id: 'cyber', icon: Terminal, label: 'CYBER' },
    { id: 'ocean', icon: Droplet, label: 'OCEAN' },
    { id: 'forest', icon: TreePine, label: 'FOREST' },
    { id: 'quantum', icon: Sparkles, label: 'QUANTUM' },
    { id: 'nebula', icon: Flame, label: 'NEBULA' },
  ] as const;


  return (
    <div 
      ref={containerRef}
      className="fixed bottom-[136px] right-4 sm:right-6 z-[900] flex flex-col items-end gap-2"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="flex flex-col gap-1.5 sm:gap-2 bg-bg border border-border-subtle p-2.5 rounded-md shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] min-w-[150px]"
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
                  className={`flex items-center gap-2 px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-widest rounded-sm transition-colors justify-start ${currentBiome === biome.id ? 'bg-accent/20 text-accent font-bold' : 'text-text-3 hover:bg-bg-1 hover:text-accent'}`}
                >
                  <biome.icon className="size-3 shrink-0" />
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
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 sm:p-3 rounded-full border bg-bg-1 text-text-3 hover:text-accent transition-all flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] outline-none focus:outline-none focus:ring-0 ${isOpen ? 'border-accent text-accent scale-105 rotate-45' : 'border-border-subtle hover:border-accent/30'}`}
        title="Override System Control Panel"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Toggle System Control Panel menu"
      >
        <Settings2 className="size-4 sm:size-[18px]" />
      </button>
    </div>
  );
}

