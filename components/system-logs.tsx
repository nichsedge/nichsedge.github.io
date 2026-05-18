'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'success' | 'system';
}

export function SystemLogs() {
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const addLog = React.useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [...prev.slice(-19), newLog]);
  }, []);

  React.useEffect(() => {
    addLog('SYSTEM_BOOT_SEQUENCE_COMPLETE', 'success');
    addLog('NEURAL_LINK_ESTABLISHED', 'system');
    
    const initialLogs = [
      'SCANNING_PERIPHERAL_NODES...',
      'ENCRYPTING_DATA_STREAM...',
      'READY_FOR_INPUT'
    ];
    
    initialLogs.forEach((msg, i) => {
      setTimeout(() => addLog(msg), (i + 1) * 1500);
    });
  }, [addLog]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-72 h-80 bg-bg/80 backdrop-blur-md border border-border-subtle rounded-sm shadow-2xl flex flex-col mb-4 overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 border-b border-border-subtle bg-bg-1/50">
              <div className="font-mono text-[9px] text-accent uppercase tracking-widest flex items-center gap-2">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="size-2.5"
                >
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg> console.log()
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-3 hover:text-accent transition-colors"
              >
                <X size={12} />
              </button>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex-1 p-3 overflow-y-auto font-mono text-[10px] space-y-1.5 scrollbar-thin scrollbar-thumb-accent/20"
            >
              {logs.map(log => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-text-3 opacity-30 shrink-0">[{log.timestamp}]</span>
                  <span className={`${
                    log.type === 'success' ? 'text-green-400' : 
                    log.type === 'warn' ? 'text-yellow-400' : 
                    log.type === 'system' ? 'text-accent' : 
                    'text-text-2'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))}
              <div className="h-4 animate-pulse inline-block w-2 bg-accent opacity-50 ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all outline-none focus:outline-none focus:ring-0 ${
          isOpen ? 'bg-accent text-bg rotate-90' : 'bg-bg-1 border border-border-subtle text-text-3 hover:border-accent hover:text-accent shadow-xl'
        }`}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="size-4 sm:size-[18px]"
        >
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
        {!isOpen && (
           <span className="absolute top-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-accent rounded-full border-2 border-bg animate-bounce" />
        )}
      </button>
    </div>
  );
}
