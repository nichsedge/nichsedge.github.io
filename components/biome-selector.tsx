'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, TreePine, Terminal, Settings2 } from 'lucide-react';

export function BiomeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBiome, setCurrentBiome] = useState<'cyber'|'ocean'|'forest'>('cyber');
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize biome from localStorage (safely on mount to avoid hydration mismatch)
  useEffect(() => {
    const savedBiome = localStorage.getItem('selected-biome') as 'cyber' | 'ocean' | 'forest' | null;
    if (savedBiome && ['cyber', 'ocean', 'forest'].includes(savedBiome)) {
      setCurrentBiome(savedBiome);
    }
  }, []);

  // Update body classes and save to localStorage
  useEffect(() => {
    document.documentElement.classList.remove('biome-cyber', 'biome-ocean', 'biome-forest');
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

  const biomes = [
    { id: 'cyber', icon: Terminal, label: 'CYBER' },
    { id: 'ocean', icon: Droplet, label: 'OCEAN' },
    { id: 'forest', icon: TreePine, label: 'FOREST' },
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
            className="flex flex-col gap-1.5 sm:gap-2 bg-bg border border-border-subtle p-1.5 sm:p-2 rounded-md shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]"
            role="menu"
            aria-label="Environmental Biome selection"
          >
            {biomes.map(biome => (
              <button
                key={biome.id}
                role="menuitem"
                onClick={() => {
                  setCurrentBiome(biome.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest rounded-sm transition-colors ${currentBiome === biome.id ? 'bg-accent/20 text-accent font-bold' : 'text-text-3 hover:bg-bg-1 hover:text-accent'}`}
              >
                <biome.icon className="size-3 sm:size-3.5" />
                {biome.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 sm:p-3 rounded-full border bg-bg-1 text-text-3 hover:text-accent transition-all flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] outline-none focus:outline-none focus:ring-0 ${isOpen ? 'border-accent text-accent scale-105 rotate-45' : 'border-border-subtle hover:border-accent/30'}`}
        title="Override Environmental Biome"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Toggle Environmental Biome menu"
      >
        <Settings2 className="size-4 sm:size-[18px]" />
      </button>
    </div>
  );
}

