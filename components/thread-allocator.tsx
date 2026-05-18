'use client';
import React, { useState, useEffect } from 'react';
import { Network, Server } from 'lucide-react';
import { motion } from 'motion/react';
import { useGraphOpen } from '@/hooks/use-graph-open';

export function ThreadAllocator() {
  const isGraphOpen = useGraphOpen();
  const [threads, setThreads] = useState([
    { id: 'T-01', name: 'UI_RENDER', load: 80 },
    { id: 'T-02', name: 'TCP_STREAM', load: 45 },
    { id: 'T-03', name: 'SYS_TICKER', load: 12 },
    { id: 'T-04', name: 'NEURAL_NET', load: 92 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.body.classList.contains('sensory-lockdown')) {
        return;
      }
      setThreads(prev => 
        prev.map(t => {
          let change = (Math.random() - 0.5) * 30;
          let newLoad = Math.max(5, Math.min(100, t.load + change));
          return { ...t, load: newLoad };
        })
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed top-[360px] right-6 2xl:right-auto 2xl:left-[calc(50%+384px)] z-40 hidden xl:flex flex-col items-end 2xl:items-start gap-2 pointer-events-none w-64 hud-widget transition-all duration-300 ${
      isGraphOpen ? 'opacity-0 pointer-events-none translate-y-2 invisible' : 'opacity-100'
    }`}>
       <div className="bg-bg/40 backdrop-blur-md border border-border-subtle p-3 rounded-sm w-full">
         <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#71717a] mb-4 font-bold border-b border-border-subtle/50 pb-1 w-full justify-between">
            <span className="flex items-center gap-1"><Server size={10} className="text-text-3"/> Active Threads</span>
            <Network size={10} className="text-accent" />
         </div>
         
         <div className="space-y-3 w-full">
           {threads.map(thread => (
             <div key={thread.id}>
               <div className="flex justify-between font-mono text-[8px] text-text-3 mb-1 uppercase">
                 <span>{thread.name}</span>
                 <span className={thread.load > 85 ? 'text-red-500' : 'text-accent'}>{Math.round(thread.load)}%</span>
               </div>
               <div className="w-full h-1 bg-border-subtle rounded-full overflow-hidden">
                 <motion.div 
                   className={`h-full ${thread.load > 85 ? 'bg-red-500' : 'bg-accent'}`}
                   animate={{ width: `${thread.load}%` }}
                   transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                 />
               </div>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
}
