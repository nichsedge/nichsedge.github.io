'use client';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function BootSequence() {
  const [visible, setVisible] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    "ACPU BIOS - version 4.02",
    "Initializing memory allocation vectors...",
    "16384 MB RAM System RAM Passed",
    "Mounting /dev/sda1 on /root...",
    "Establishing neural uplink to gateway...",
    "Parsing encryption keys (AES-256)...",
    "Loading kernel extensions...",
    "[ OK ] Reached target System Architecture.",
    "Restoring environment variables...",
    "Welcome to NICHS-OS."
  ];

  useLayoutEffect(() => {
    if (sessionStorage.getItem('booted')) {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[i]]);
        setProgress(Math.floor((i / (bootLogs.length - 1)) * 100));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem('booted', 'true');
        }, 800);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#09090b] flex flex-col justify-end p-6 md:p-12 font-mono text-accent text-[11px] md:text-[13px] pointer-events-none overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 text-[10vw] md:text-[120px] font-bold select-none text-accent">
             BIOS
          </div>
          
          <div className="mb-8 space-y-1 relative z-10 max-h-[80vh] overflow-hidden">
            {logs.map((log, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={idx}
              >
                {log}
              </motion.div>
            ))}
            {logs.length < bootLogs.length && (
              <div className="w-2 h-4 bg-accent animate-pulse mt-1" />
            )}
          </div>
          
          <div className="w-full h-0.5 bg-accent/20 relative z-10 overflow-hidden">
            <div className="h-full bg-accent transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(0,225,207,0.8)]" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
