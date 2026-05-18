'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, ArrowUpRight, Cpu } from 'lucide-react';
import { useGraphOpen } from '@/hooks/use-graph-open';

export function IngestionMetrics() {
  const isGraphOpen = useGraphOpen();
  const [metrics, setMetrics] = useState({
    events: 42104,
    latency: 12,
    cpu: 45
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.body.classList.contains('sensory-lockdown')) {
        return;
      }
      setMetrics(prev => ({
        events: prev.events + Math.floor(Math.random() * 500),
        latency: Math.max(5, Math.min(40, prev.latency + (Math.random() - 0.5) * 5)),
        cpu: Math.max(10, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10))
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed top-24 left-6 2xl:left-[calc(50%-640px)] z-40 hidden xl:block w-64 pointer-events-none hud-widget transition-all duration-300 ${
      isGraphOpen ? 'opacity-0 pointer-events-none translate-y-2 invisible' : 'opacity-100'
    }`}>
       <div className="bg-bg/40 backdrop-blur-md border border-border-subtle p-3 rounded-sm">
         <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#71717a] mb-4 font-bold border-b border-border-subtle/50 pb-1">
            Cluster Metrics <Activity size={10} className="text-accent ml-auto" />
         </div>
         
         <div className="space-y-3">
           <div>
             <div className="flex justify-between font-mono text-[8px] text-text-3 mb-1 uppercase">
               <span>Ingestion Rate</span>
               <span className="text-accent flex items-center gap-0.5"><ArrowUpRight size={8}/> LIVE</span>
             </div>
             <div className="font-mono text-xl tracking-tighter text-text-1">
               {metrics.events.toLocaleString()}<span className="text-[10px] text-text-3 ml-1">msg/s</span>
             </div>
           </div>

           <div>
             <div className="flex justify-between font-mono text-[8px] text-text-3 mb-1 uppercase">
               <span>P99 Latency</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="flex-1 h-1 bg-border-subtle rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-yellow-500"
                   animate={{ width: `${(metrics.latency / 40) * 100}%` }}
                 />
               </div>
               <span className="font-mono text-[10px] text-text-2 w-8 text-right">{metrics.latency.toFixed(1)}ms</span>
             </div>
           </div>

           <div>
             <div className="flex justify-between font-mono text-[8px] text-text-3 mb-1 uppercase">
               <span>Cluster Load</span>
               <Cpu size={8} className="text-text-3"/>
             </div>
             <div className="flex items-center gap-2">
               <div className="flex-1 h-1 bg-border-subtle rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-accent"
                   animate={{ width: `${metrics.cpu}%` }}
                 />
               </div>
               <span className="font-mono text-[10px] text-text-2 w-8 text-right">{metrics.cpu.toFixed(0)}%</span>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
}
