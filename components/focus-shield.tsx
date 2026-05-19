'use client';
import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, EarOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function FocusShield() {
  const [shieldActive, setShieldActive] = useState(false);

  useEffect(() => {
    if (shieldActive) {
      document.body.classList.add('sensory-lockdown');
    } else {
      document.body.classList.remove('sensory-lockdown');
    }
  }, [shieldActive]);

  return (
    <>
      <button 
        onClick={() => setShieldActive(!shieldActive)}
        title={shieldActive ? "Disable Sensory Lockdown" : "Enable Sensory Lockdown"}
        className={`fixed bottom-20 right-4 sm:right-6 z-[999] p-2 sm:p-3 rounded-full border transition-all outline-none focus:outline-none focus:ring-0 ${
          shieldActive 
            ? 'bg-accent/20 border-accent/50 text-accent shadow-[0_0_20px_rgba(0,225,207,0.3)] animate-pulse' 
            : 'bg-bg-1 border-border-subtle text-text-3 hover:text-accent hover:border-accent/30'
        }`}
      >
        {shieldActive ? <EarOff className="size-4 sm:size-[18px]" /> : <Shield className="size-4 sm:size-[18px]" />}
      </button>

      <AnimatePresence>
        {shieldActive && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-[136px] right-14 sm:right-20 z-[999] bg-bg border border-accent p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] w-56 sm:w-64 uppercase tracking-widest text-accent"
          >
            <div className="flex items-center gap-2 mb-2 font-bold">
              <ShieldAlert size={14} className="animate-pulse" /> SENSORY LOCKDOWN ACTIVE
            </div>
            <p className="text-text-2 lowercase text-[9px] leading-relaxed">
               environmental noise canceled. visual distractions disabled. pure focus.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
