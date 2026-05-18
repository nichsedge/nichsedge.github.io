'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, TreePine, Terminal, Settings2 } from 'lucide-react';

export function BiomeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBiome, setCurrentBiome] = useState<'cyber'|'ocean'|'forest'>('cyber');

  useEffect(() => {
    document.body.classList.remove('biome-cyber', 'biome-ocean', 'biome-forest');
    document.body.classList.add(`biome-${currentBiome}`);
  }, [currentBiome]);

  const biomes = [
    { id: 'cyber', icon: Terminal, label: 'CYBER' },
    { id: 'ocean', icon: Droplet, label: 'OCEAN' },
    { id: 'forest', icon: TreePine, label: 'FOREST' },
  ] as const;

  return (
    <div className="fixed bottom-[112px] sm:bottom-[136px] right-4 sm:right-6 z-[900] flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="flex flex-col gap-1.5 sm:gap-2 bg-bg border border-border-subtle p-1.5 sm:p-2 rounded-md"
          >
            {biomes.map(biome => (
              <button
                key={biome.id}
                onClick={() => setCurrentBiome(biome.id)}
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
        className="p-2 sm:p-3 rounded-full border border-border-subtle bg-bg-1 text-text-3 hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] outline-none focus:outline-none focus:ring-0"
        title="Override Environmental Biome"
      >
        <Settings2 className="size-4 sm:size-[18px]" />
      </button>
    </div>
  );
}
