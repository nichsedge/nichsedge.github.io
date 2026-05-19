'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

export function MainframeBypass() {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setTriggered(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!triggered) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[999999] bg-[#09090b] text-red-500 font-mono p-8 overflow-hidden pointer-events-auto flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDkwOTBiIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMyNzI3MmEiLz4KPC9zdmc+')] opacity-20" />
        <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-center relative z-10 space-y-6"
        >
          <div className="flex justify-center mb-8">
            <ShieldAlert size={120} className="animate-[pulse_1s_infinite]" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
            CRITICAL OVERRIDE
          </h1>
          <p className="text-xl md:text-2xl tracking-widest uppercase">
            Root Access Granted. Security Protocols Disabled.
          </p>
          
          <div className="mt-12 text-left bg-black/50 p-6 border border-red-500/30 max-w-2xl mx-auto rounded-sm overflow-hidden h-64 relative">
             <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-[pulse_0.5s_infinite]" />
             <div className="space-y-2 text-[12px] opacity-80 leading-relaxed overflow-hidden h-full">
               {Array.from({length: 15}).map((_, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                 >
                   &gt; Dumping sector 0x{Math.floor(Math.random()*1000000).toString(16).toUpperCase()}... OK<br/>
                   &gt; Bypassing firewall node {i}... SUCCESS
                 </motion.div>
               ))}
             </div>
          </div>
          
          <button 
            onClick={() => setTriggered(false)}
            className="mt-12 px-8 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors uppercase tracking-widest font-bold"
          >
            RESTORE SYSTEM
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
