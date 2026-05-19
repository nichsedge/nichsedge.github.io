'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, ArrowRight, Loader2, Cpu, Database, Network } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getFallbackGhostResponse } from '@/lib/ai-fallback';

type MetricPoint = {
  time: number;
  cpu: number;
  mem: number;
};

export function DataOracle() {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [status, setStatus] = useState<'LIVE' | 'LOCAL' | null>(null);
  const [metrics, setMetrics] = useState<MetricPoint[]>(Array.from({length: 10}).map((_, i) => ({ time: i, cpu: 10, mem: 20 })));

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMetrics(prev => {
        const next = [...prev.slice(1), { 
          time: prev[prev.length - 1].time + 1, 
          cpu: Math.random() * 80 + 20, 
          mem: Math.random() * 40 + 50 
        }];
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const requestPrediction = async () => {
    setIsLoading(true);
    setInsight(null);
    setStage(0);
    
    // Simulate thinking stages
    for(let i=0; i<3; i++) {
      setStage(i);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const query = "As a Data Oracle, predict the next 5 years of my career based on my stack (Spark, dbt, Airflow, GCP). Use a supportive but futuristic tone. Max 3 sentences.";
      const res = await fetch('/api/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!res.ok) throw new Error("API Route offline");
      const data = await res.json();
      setStatus('LIVE');
      setInsight(data.response);
    } catch {
      setStatus('LOCAL');
      setInsight(getFallbackGhostResponse("As a Data Oracle, predict the next 5 years of my career based on my stack (Spark, dbt, Airflow, GCP). Use a supportive but futuristic tone. Max 3 sentences."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-1 border border-border-subtle p-8 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <Brain size={120} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-xl font-bold text-text-0 flex items-center gap-3">
              <Sparkles size={20} className="text-accent" /> Use the Data Oracle
            </h3>
            {status && (
              <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                status === 'LIVE' 
                  ? 'border-green-500/30 text-green-400 bg-green-500/5 shadow-[0_0_8px_rgba(34,197,94,0.1)]' 
                  : 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5'
              }`}>
                [{status === 'LIVE' ? 'LIVE_COGNITIVE_CORE' : 'LOCAL_EMULATION'}]
              </span>
            )}
          </div>
          <p className="text-[13px] text-text-3 font-light mb-8 max-w-lg leading-relaxed">
             Connect your current expertise to the future. Our neural projection engine analyzes your stack to predict the next wave of data evolution.
          </p>

          {!insight && !isLoading ? (
            <button 
              onClick={requestPrediction}
              className="flex items-center gap-4 bg-accent/10 border border-accent/40 px-6 py-3 rounded-sm group/btn hover:bg-accent/20 transition-all text-accent font-mono text-[11px] uppercase tracking-[0.2em] font-bold"
            >
              Initiate Projection <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          ) : isLoading ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Loader2 size={24} className="text-accent animate-spin" />
                <div className="font-mono text-[10px] text-accent uppercase tracking-widest animate-pulse">
                  {["SCANNING_STACK", "MARKET_CROSS_SYNC", "GENESIS_PROJECTION"][stage]}...
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-black/40 border-l-2 border-accent font-mono text-[13px] leading-relaxed relative overflow-hidden"
            >
               <div className="absolute top-2 right-4 text-[8px] opacity-20 uppercase tracking-[0.4em] font-bold">PROJECTION_v4.2</div>
               <p className="text-text-1">{insight}</p>
               <button 
                onClick={() => setInsight(null)}
                className="mt-6 text-[9px] uppercase tracking-widest text-text-3 hover:text-accent transition-colors block"
               >
                 Wipe Buffer
               </button>
            </motion.div>
          )}
        </div>

      </div>

      {/* Real-time Graph below main area */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full border border-border-subtle bg-black/50 p-4 rounded-sm mt-8 overflow-hidden"
          >
             <div className="font-mono text-[9px] text-text-3 mb-4 tracking-widest uppercase flex justify-between">
               <span className="text-accent flex items-center gap-2"><Cpu size={12}/> System Load (CPU/Memory)</span>
               <span className="animate-pulse flex gap-1">
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                 <div className="w-1.5 h-1.5 bg-accent rounded-full" />
               </span>
             </div>
             <div className="h-[120px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00e1cf" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00e1cf" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <Area type="monotone" dataKey="cpu" stroke="#00e1cf" fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                    <Area type="monotone" dataKey="mem" stroke="#ef4444" fillOpacity={1} fill="url(#colorMem)" isAnimationActive={false} />
                  </AreaChart>
               </ResponsiveContainer>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock Stats */}
      <div className="mt-12 pt-8 border-t border-border-subtle/30 grid grid-cols-2 md:grid-cols-3 gap-8">
         {[
           { label: 'Projection_Accuracy', val: '98.4%', icon: <Cpu size={12} /> },
           { label: 'Data_Throughput', val: '2.1 TB/s', icon: <Database size={12} /> },
           { label: 'Neural_Nodes', val: '12,402', icon: <Network size={12} /> },
         ].map(stat => (
           <div key={stat.label} className="space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[8px] text-text-3 uppercase tracking-tighter">
                 {stat.icon} {stat.label}
              </div>
              <div className="text-[12px] font-bold text-text-1">{stat.val}</div>
           </div>
         ))}
      </div>
    </div>
  );
}
