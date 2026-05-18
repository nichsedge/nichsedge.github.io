'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGraphOpen } from '@/hooks/use-graph-open';

export function EventStream() {
  const isGraphOpen = useGraphOpen();
  const [events, setEvents] = useState<{ id: number, text: string, type: string }[]>([]);

  useEffect(() => {
    let idCounter = 0;

    const logEvent = (text: string, type: 'info' | 'warn' | 'click' | 'sys') => {
      if (document.body.classList.contains('sensory-lockdown')) {
        return;
      }
      setEvents(prev => {
        const next = [...prev, { id: idCounter++, text, type }];
        if (next.length > 5) return next.slice(next.length - 5);
        return next;
      });
    };

    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      let tag = target.tagName;
      logEvent(`EXEC: DOM.Click({ target: '${tag}', x: ${e.clientX}, y: ${e.clientY} })`, 'click');
    };

    const handleScroll = () => {
      if (Math.random() > 0.8) {
        logEvent(`SYS: Memory.Paging({ offset: ${window.scrollY}px })`, 'sys');
      }
    };

    // A random background sys event
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const fakeSysVars = ['CPU_TEMP', 'NET_THROUGHPUT', 'CACHE_HIT', 'SWAP_MEM'];
        const v = fakeSysVars[Math.floor(Math.random() * fakeSysVars.length)];
        logEvent(`INFO: Telemetry.Update({ ${v}: 'OK' })`, 'info');
      }
    }, 2000);

    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`fixed top-[340px] left-6 2xl:left-[calc(50%-640px)] z-[80] w-64 pointer-events-none hidden xl:block hud-widget transition-all duration-300 ${
      isGraphOpen ? 'opacity-0 pointer-events-none translate-y-2 invisible' : 'opacity-100'
    }`}>
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-text-3 mb-2 bg-bg/50 px-2 py-1 rounded-sm border border-border-subtle backdrop-blur-sm w-fit">
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
          </svg> Live System Telemetry
        </div>
       <div className="space-y-1">
         <AnimatePresence>
           {events.map(ev => (
             <motion.div 
               key={ev.id}
               initial={{ opacity: 0, x: -10, scale: 0.95 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className={`font-mono text-[9px] px-2 py-1 bg-bg-1/80 border border-border-subtle rounded-sm backdrop-blur-md shadow-sm ${
                 ev.type === 'click' ? 'text-accent border-accent/20' : 
                 ev.type === 'sys' ? 'text-text-2' : 
                 'text-text-3 font-light'
               }`}
             >
               {ev.text}
             </motion.div>
           ))}
         </AnimatePresence>
       </div>
    </div>
  );
}
