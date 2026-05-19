'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Filter, HardDrive, Play, Activity } from 'lucide-react';

type Packet = { id: number; left: number; top: number; type: string };

export function LiveArchitecture() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState({ events: 0, anomalies: 0 });

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Setup a new packet entering the system
      const newPacket: Packet = {
        id: Date.now() + Math.random(),
        left: 0,
        top: 0,
        type: Math.random() > 0.9 ? 'anomaly' : 'standard'
      };

      setPackets(prev => [...prev.slice(-15), newPacket]); // keep last 15
      setMetrics(m => ({ ...m, events: m.events + 1, anomalies: m.anomalies + (newPacket.type === 'anomaly' ? 1 : 0) }));
    }, 800); // 800ms between packets

    return () => clearInterval(interval);
  }, [isActive]);

  const nodes = [
    { name: 'API Source', icon: <Database size={16} />, x: '10%' },
    { name: 'Kafka Topic', icon: <Activity size={16} />, x: '35%' },
    { name: 'Spark Job', icon: <Filter size={16} />, x: '60%' },
    { name: 'BigQuery', icon: <HardDrive size={16} />, x: '85%' },
  ];

  return (
    <div className="bg-bg-1 border border-border-subtle p-6 rounded-sm font-mono overflow-hidden relative">
      <div className="flex justify-between items-center mb-8 relative z-20">
        <div>
          <h3 className="text-[12px] text-text-0 uppercase tracking-widest font-bold flex items-center gap-2">
            System Architecture Simulation
          </h3>
          <p className="text-[10px] text-text-3 mt-1">Real-time data flow visualization</p>
        </div>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-sm text-[10px] uppercase tracking-widest transition-colors ${
            isActive ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-accent/10 border-accent/50 text-accent hover:bg-accent/20'
          }`}
        >
          <Play size={12} className={isActive ? "animate-pulse" : ""} />
          {isActive ? 'HALT_PIPELINE' : 'START_INGESTION'}
        </button>
      </div>

      <div className="relative h-40 border-y border-border-subtle/30 bg-bg mx-2 my-4 rounded flex items-center">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-[10%] right-[15%] h-[1px] bg-border-subtle -translate-y-1/2 z-0" />
        {isActive && (
           <div className="absolute top-1/2 left-[10%] right-[15%] h-[1px] bg-accent/30 shadow-[0_0_8px_rgba(0,225,207,0.5)] -translate-y-1/2 z-0 animate-pulse" />
        )}

        {/* Nodes */}
        {nodes.map((node) => (
          <div 
            key={node.name} 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            style={{ left: node.x }}
          >
            <div className={`w-10 h-10 rounded bg-bg-1 border flex items-center justify-center transition-colors ${isActive ? 'border-accent/50 text-accent shadow-[0_0_15px_rgba(0,225,207,0.15)]' : 'border-border-subtle text-text-3'}`}>
              {node.icon}
            </div>
            <div className="text-[9px] uppercase tracking-tighter text-text-3">{node.name}</div>
          </div>
        ))}

        {/* Animated Packets */}
        <AnimatePresence>
          {packets.map((packet) => (
            <motion.div
              key={packet.id}
              initial={{ left: '10%', opacity: 0, scale: 0 }}
              animate={{ left: '85%', opacity: [0, 1, 1, 0], scale: 1 }}
              transition={{ duration: 3, ease: 'linear' }}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full z-20 ${
                packet.type === 'anomaly' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-accent shadow-[0_0_10px_rgba(0,225,207,0.8)]'
              }`}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-8 mt-4 text-[10px] uppercase font-bold tracking-widest text-text-3">
        <div className="flex flex-col gap-1">
          <span className="opacity-50">Total_Events_Processed</span>
          <span className="text-accent text-[12px]">{metrics.events.toString().padStart(6, '0')}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="opacity-50">Detected_Anomalies</span>
          <span className="text-red-400 text-[12px]">{metrics.anomalies.toString().padStart(6, '0')}</span>
        </div>
        <div className="flex flex-col gap-1 ml-auto text-right">
          <span className="opacity-50">Throughput_Rate</span>
          <span className="text-text-1 text-[12px]">{isActive ? '1.2k req/s' : '0 req/s'}</span>
        </div>
      </div>
    </div>
  );
}
