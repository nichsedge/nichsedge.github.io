'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, ArrowRight, Loader2, Cpu, Database, Network } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getFallbackGhostResponse } from '@/lib/ai-fallback';
import { soundEngine } from '@/lib/audio';


type MetricPoint = {
  time: number;
  cpu: number;
  mem: number;
};

export function DataOracle({ locale = 'en' }: { locale?: 'en' | 'id' }) {
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

  const [isSpeaking, setIsSpeaking] = useState(false);

  const PRESETS = locale === 'id' ? [
    { label: '🔮 Prediksi Stack 5 Tahun', query: "Sebagai Oracle Data, prediksi 5 tahun ke depan karir saya berdasarkan stack saya (Spark, dbt, Airflow, GCP). Gunakan nada yang suportif namun futuristik. Maksimal 3 kalimat." },
    { label: '⚡ Arsitektur Stream Data', query: "Jelaskan bagaimana arsitektur Kafka + Spark + ClickHouse menangani 10 juta event per detik dengan latensi sub-detik." },
    { label: '📊 Ringkasan Keahlian Utama', query: "Rangkum keahlian utama dan pengalaman kerja Ichsanul Amal dalam 3 poin terbaik." }
  ] : [
    { label: '🔮 5-Year Stack Prediction', query: "As a Data Oracle, predict the next 5 years of my career based on my stack (Spark, dbt, Airflow, GCP). Use a supportive but futuristic tone. Max 3 sentences." },
    { label: '⚡ Streaming Architecture', query: "Explain how Kafka + Spark + ClickHouse handles 10 million events per second with sub-second SLA latency." },
    { label: '📊 Core Resume Highlights', query: "Summarize Ichsanul Amal's top data engineering skills and career highlights in 3 concise bullet points." }
  ];

  const requestPrediction = async (customQuery?: string) => {
    soundEngine.playChime();
    setIsLoading(true);
    setInsight(null);
    setStage(0);
    
    // Simulate thinking stages
    for(let i=0; i<3; i++) {
      setStage(i);
      await new Promise(r => setTimeout(r, 600));
    }

    const query = customQuery || (locale === 'id' 
      ? "Sebagai Oracle Data, prediksi 5 tahun ke depan karir saya berdasarkan stack saya (Spark, dbt, Airflow, GCP). Gunakan nada yang suportif namun futuristik. Maksimal 3 kalimat."
      : "As a Data Oracle, predict the next 5 years of my career based on my stack (Spark, dbt, Airflow, GCP). Use a supportive but futuristic tone. Max 3 sentences.");

    try {
      const res = await fetch('/api/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!res.ok) throw new Error("API Route offline");
      const data = await res.json();
      setStatus('LIVE');
      setInsight(data.response);
      soundEngine.playSuccessChord();
    } catch {
      setStatus('LOCAL');
      setInsight(getFallbackGhostResponse(query));
      soundEngine.playSuccessChord();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakText = () => {
    if (!insight || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(insight);
    utterance.rate = 1.0;
    utterance.pitch = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
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
              <Sparkles size={20} className="text-accent" /> {locale === 'id' ? 'Gunakan Oracle Data' : 'Use the Data Oracle'}
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
          <p className="text-[13px] text-text-3 font-light mb-6 max-w-lg leading-relaxed">
             {locale === 'id' 
               ? 'Hubungkan keahlian Anda saat ini ke masa depan. Mesin proyeksi neural kami menganalisis stack Anda untuk memprediksi gelombang evolusi data berikutnya.' 
               : 'Connect your current expertise to the future. Our neural projection engine analyzes your stack to predict the next wave of data evolution.'}
          </p>

          {/* Prompt Presets */}
          <div className="flex flex-wrap gap-2 mb-6">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => requestPrediction(preset.query)}
                disabled={isLoading}
                className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded border border-border-subtle bg-bg text-text-3 hover:border-accent/50 hover:text-accent transition-all cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {!insight && !isLoading ? (
            <button 
              onClick={() => requestPrediction()}
              className="flex items-center gap-4 bg-accent/10 border border-accent/40 px-6 py-3 rounded-sm group/btn hover:bg-accent/20 transition-all text-accent font-mono text-[11px] uppercase tracking-[0.2em] font-bold cursor-pointer"
            >
              {locale === 'id' ? 'Mulai Proyeksi' : 'Initiate Projection'} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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
               <div className="flex items-center justify-between mb-2">
                 <div className="text-[8px] text-accent uppercase tracking-[0.4em] font-bold flex items-center gap-1.5">
                   <span>PROJECTION_v4.2</span>
                   <span className="text-text-3 font-normal opacity-70">| 99.4% Vector Match</span>
                 </div>
                 <button
                   onClick={handleSpeakText}
                   className="text-[9px] uppercase tracking-widest text-accent hover:underline cursor-pointer flex items-center gap-1"
                 >
                   {isSpeaking ? '🔊 Stop Audio' : '🔊 Listen TTS'}
                 </button>
               </div>

               <p className="text-text-1">{insight}</p>

               <button 
                onClick={() => setInsight(null)}
                className="mt-6 text-[9px] uppercase tracking-widest text-text-3 hover:text-accent transition-colors block cursor-pointer"
               >
                 {locale === 'id' ? 'Hapus Buffer' : 'Wipe Buffer'}
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
