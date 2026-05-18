'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Shield } from 'lucide-react';

const LOG_MESSAGES = [
  "INITIALIZING_KERNEL",
  "LOADING_DATA_ENGINEERING_MODULES",
  "OPTIMIZING_PIPELINE_FLOW",
  "INJECTING_VIBE_CODE",
  "DISABLING_CAFFEINE_RECEPTORS",
  "ENFORCING_ZERO_NOISE_CRITERIA",
  "BOOTING_AIR_FRYER_PROTOCOL",
  "CHECKING_SYSTEM_INTEGRITY",
  "OATMEAL_INTAKE_VERIFIED",
  "SECURE_LAYER_ACTIVE",
];

export function SystemMonitor() {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.body.classList.contains('sensory-lockdown')) {
        return;
      }
      const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
      setLogs(prev => [...prev.slice(-4), `[${timestamp}] ${randomMsg}`]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-[80px] left-6 2xl:left-[calc(50%-640px)] z-50 hidden xl:block w-64 pointer-events-none">
      <div className="bg-bg/40 backdrop-blur-md border border-border-subtle p-3 rounded-sm font-mono text-[9px] text-text-3 space-y-1.5 overflow-hidden">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-border-subtle/50">
          <div className="flex items-center gap-1.5 uppercase font-bold tracking-widest text-[#71717a]">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="size-2.5 text-accent"
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg> System Monitor
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            LIVE
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px)' }} />

        <div ref={scrollRef} className="space-y-1">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={log + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="whitespace-nowrap truncate"
              >
                <span className="text-accent/60 mr-1">»</span>
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-3 pt-2 border-t border-border-subtle/30 grid grid-cols-2 gap-2 opacity-50">
          <div className="flex items-center gap-1">
             <Database size={8} /> 0.4TB_MEM
          </div>
          <div className="flex items-center gap-1 text-blue-400">
             <Shield size={8} /> H2O: GOOD
          </div>
        </div>
      </div>
    </div>
  );
}
