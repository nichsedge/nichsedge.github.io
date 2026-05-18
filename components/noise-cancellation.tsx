'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, Headphones } from 'lucide-react';
import { motion } from 'motion/react';

export function NoiseCancellationWidget() {
  const [isActive, setIsActive] = useState(false);
  const [wave, setWave] = useState<number[]>([]);

  useEffect(() => {
    let animationId: number;
    let t = 0;

    const generateWave = () => {
      const targetWave = [];
      const variance = isActive ? 0.5 : 20; // Flatten the wave if active
      
      for (let i = 0; i < 40; i++) {
        const noise = (Math.random() - 0.5) * variance;
        const sine = Math.sin(t + i * 0.2) * (isActive ? 1 : 10);
        targetWave.push(50 + sine + noise);
      }
      
      setWave(targetWave);
      t += isActive ? 0.05 : 0.2; // Slower when calm

      animationId = requestAnimationFrame(() => {
        setTimeout(generateWave, 50);
      });
    };

    generateWave();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  return (
    <div className="mt-6 border-t border-border-subtle pt-6">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-text-3 mb-4">
        <div className="flex items-center gap-2">
           <Headphones size={14} className={isActive ? 'text-accent' : ''} /> 
           Active Noise Cancellation
        </div>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`px-3 py-1 flex items-center gap-2 border transition-all ${
            isActive ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-bg-1 border-border-subtle text-text-2 hover:border-accent hover:text-accent'
          }`}
        >
          <RefreshCw size={10} className={isActive ? 'animate-spin' : ''} />
          {isActive ? 'ENGAGED' : 'ENGAGE'}
        </button>
      </div>

      <div className="h-16 w-full bg-black/50 border border-border-subtle/50 rounded-sm relative overflow-hidden flex items-center">
         <div className={`absolute left-0 inline-flex transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'} z-10 w-full h-full bg-accent/5 pointer-events-none`} />
         <svg className="w-full h-full relative z-20" preserveAspectRatio="none" viewBox="0 0 400 100">
           <motion.path 
             animate={{ d: `M 0,${wave[0]} ${wave.map((y, i) => `L ${i * 10},${y}`).join(' ')}` }}
             transition={{ type: "tween", duration: 0.1, ease: "linear" }}
             fill="none" 
             stroke="var(--theme-accent, #00e1cf)" 
             strokeWidth="2"
             strokeOpacity={isActive ? 0.8 : 0.3}
           />
         </svg>
         
         <div className="absolute right-2 top-2 z-30 font-mono text-[8px] text-text-3 tracking-widest uppercase flex items-center gap-1 opacity-50">
            {isActive ? '0 dB (SILENT)' : '65 dB (CHAOS)'}
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-red-500 animate-pulse'}`} />
         </div>
      </div>
    </div>
  );
}
