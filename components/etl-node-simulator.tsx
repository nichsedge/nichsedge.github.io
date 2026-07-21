'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Zap, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

type NodeStage = {
  id: string;
  label: string;
  sublabel: string;
  xRatio: number; // 0 to 1
  color: string;
  status: 'OPTIMAL' | 'DEGRADED' | 'HEALING' | 'ALERT';
};

const INITIAL_NODES: NodeStage[] = [
  { id: 'kafka', label: 'KAFKA_STREAM', sublabel: 'Ingestion Engine', xRatio: 0.12, color: '#00e1cf', status: 'OPTIMAL' },
  { id: 'spark', label: 'PYSPARK_CLUSTER', sublabel: 'Dist. Processing', xRatio: 0.35, color: '#3b82f6', status: 'OPTIMAL' },
  { id: 'dbt', label: 'DBT_TRANSFORM', sublabel: 'SCD Type-2 Vault', xRatio: 0.58, color: '#a855f7', status: 'OPTIMAL' },
  { id: 'iceberg', label: 'ICEBERG_STORE', sublabel: 'Parquet Lakehouse', xRatio: 0.82, color: '#10b981', status: 'OPTIMAL' },
];

export function EtlNodeSimulator({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NodeStage[]>(INITIAL_NODES);
  const [throughput, setThroughput] = useState(128400); // events / sec
  const [latency, setLatency] = useState(14); // ms
  const [errorRate, setErrorRate] = useState(0.01); // %
  const [chaosState, setChaosState] = useState<'SURGE' | 'DRIFT' | 'OOM' | 'NORMAL'>('NORMAL');
  const [dlqCount, setDlqCount] = useState(0);

  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    speed: number;
    stageIndex: number;
    isRogue: boolean;
    size: number;
  }>>([]);

  const chaosRef = useRef(chaosState);

  useEffect(() => {
    chaosRef.current = chaosState;
  }, [chaosState]);


  // Chaos Trigger Handlers
  const triggerSurge = () => {
    soundEngine.playChime(880, 0.4);
    setChaosState('SURGE');
    setThroughput(850000);
    setLatency(68);
    setTimeout(() => {
      setChaosState('NORMAL');
      setThroughput(128400);
      setLatency(14);
    }, 4000);
  };

  const triggerDrift = () => {
    soundEngine.playModemHandshake();
    setChaosState('DRIFT');
    setErrorRate(8.4);
    setNodes(prev => prev.map(n => n.id === 'dbt' ? { ...n, status: 'ALERT' } : n));
    setTimeout(() => {
      setChaosState('NORMAL');
      setErrorRate(0.01);
      setNodes(prev => prev.map(n => n.id === 'dbt' ? { ...n, status: 'OPTIMAL' } : n));
    }, 4000);
  };

  const triggerOOM = () => {
    soundEngine.playClick(200, 0.3);
    setChaosState('OOM');
    setNodes(prev => prev.map(n => n.id === 'spark' ? { ...n, status: 'HEALING' } : n));
    setLatency(240);
    setTimeout(() => {
      soundEngine.playChime(1046, 0.5);
      setChaosState('NORMAL');
      setLatency(14);
      setNodes(prev => prev.map(n => n.id === 'spark' ? { ...n, status: 'OPTIMAL' } : n));
    }, 3500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Initialize initial particles
    const createParticle = () => ({
      x: width * 0.12,
      y: height * 0.5 + (Math.random() - 0.5) * 20,
      speed: Math.random() * 2 + 2,
      stageIndex: 0,
      isRogue: chaosRef.current === 'DRIFT' && Math.random() < 0.35,
      size: Math.random() * 2 + 2,
    });

    for (let i = 0; i < 60; i++) {
      particlesRef.current.push({
        ...createParticle(),
        x: width * 0.12 + Math.random() * (width * 0.7),
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Node coordinates
      const nodeXList = INITIAL_NODES.map(n => width * n.xRatio);
      const nodeY = height * 0.5;

      // Draw background connection pipes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(nodeXList[0], nodeY);
      ctx.lineTo(nodeXList[nodeXList.length - 1], nodeY);
      ctx.stroke();

      // Draw Rogue DLQ Branch if DRIFT chaos
      const dlqX = width * 0.58;
      const dlqY = height * 0.82;
      ctx.strokeStyle = chaosRef.current === 'DRIFT' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.05)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(nodeXList[2], nodeY);
      ctx.lineTo(dlqX, dlqY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw DLQ Node
      ctx.fillStyle = chaosRef.current === 'DRIFT' ? '#ef4444' : '#52525b';
      ctx.font = '9px monospace';
      ctx.fillText(`[DLQ SINK: ${dlqCount} ERR]`, dlqX - 35, dlqY + 16);

      // Spawn extra particles if SURGE
      const spawnRate = chaosRef.current === 'SURGE' ? 5 : 1;
      for (let s = 0; s < spawnRate; s++) {
        if (Math.random() < 0.4) {
          particlesRef.current.push(createParticle());
        }
      }

      // Update & Render Particles
      particlesRef.current.forEach((p, idx) => {
        const currentTargetX = nodeXList[Math.min(p.stageIndex + 1, nodeXList.length - 1)];

        if (chaosRef.current === 'OOM' && p.stageIndex === 1) {
          // Stalled at Spark node
          p.x += Math.random() - 0.5;
        } else if (p.isRogue && p.stageIndex === 2) {
          // Divert to DLQ
          p.x += (dlqX - p.x) * 0.05;
          p.y += (dlqY - p.y) * 0.05;
          if (Math.abs(p.x - dlqX) < 4 && Math.abs(p.y - dlqY) < 4) {
            setDlqCount(c => c + 1);
            particlesRef.current.splice(idx, 1);
            return;
          }
        } else {
          p.x += p.speed * (chaosRef.current === 'SURGE' ? 2 : 1);
          if (p.x >= currentTargetX && p.stageIndex < nodeXList.length - 1) {
            p.stageIndex += 1;
          }
        }

        // Remove offscreen
        if (p.x >= nodeXList[nodeXList.length - 1]) {
          particlesRef.current.splice(idx, 1);
          return;
        }

        // Draw particle
        ctx.fillStyle = p.isRogue ? '#ef4444' : (chaosRef.current === 'SURGE' ? '#00e1cf' : '#3b82f6');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (chaosRef.current === 'SURGE') {
          ctx.shadowColor = '#00e1cf';
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }
      });

      // Draw Nodes
      INITIAL_NODES.forEach((n, i) => {
        const nx = nodeXList[i];
        const isTarget = nodes[i].status !== 'OPTIMAL';

        // Outer Ring Pulse
        ctx.strokeStyle = isTarget ? '#ef4444' : n.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(nx, nodeY, 18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(9, 9, 11, 0.9)';
        ctx.beginPath();
        ctx.arc(nx, nodeY, 17, 0, Math.PI * 2);
        ctx.fill();

        // Node Label
        ctx.fillStyle = isTarget ? '#ef4444' : '#e4e4e7';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, nx, nodeY - 26);

        ctx.fillStyle = '#71717a';
        ctx.font = '8px monospace';
        ctx.fillText(n.sublabel, nx, nodeY + 30);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [nodes, dlqCount]);

  return (
    <div className="w-full bg-bg-1/80 border border-border-subtle rounded-sm overflow-hidden p-4 relative group">
      {/* Header telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-border-subtle font-mono text-[10px]">
        <div className="flex items-center gap-2 text-text-0 font-bold uppercase tracking-wider">
          <Activity size={14} className="text-accent animate-pulse" />
          <span>{locale === 'id' ? 'SIMULATOR PIPELINE ETL REAL-TIME' : 'REAL-TIME ETL PIPELINE SIMULATOR'}</span>
        </div>

        <div className="flex items-center gap-4 text-text-2 text-[9px] uppercase tracking-widest">
          <div>
            THROUGHPUT: <span className={`font-bold ${chaosState === 'SURGE' ? 'text-accent animate-pulse' : 'text-text-0'}`}>{throughput.toLocaleString()} evt/s</span>
          </div>
          <div>
            LATENCY: <span className={`font-bold ${chaosState === 'OOM' ? 'text-red-400 animate-pulse' : 'text-text-0'}`}>{latency} ms</span>
          </div>
          <div>
            FAULT_RATE: <span className={`font-bold ${chaosState === 'DRIFT' ? 'text-amber-400' : 'text-text-0'}`}>{errorRate}%</span>
          </div>
        </div>
      </div>

      {/* Canvas Node Graph */}
      <div className="h-[220px] w-full relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Chaos Controls */}
      <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 font-mono text-[9px]">
        <span className="text-text-3 uppercase tracking-widest flex items-center gap-1.5">
          <Zap size={12} className="text-accent" />
          {locale === 'id' ? 'INJEKSI INSIEN CHAOS:' : 'CHAOS FAULT INJECTION:'}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerSurge}
            disabled={chaosState !== 'NORMAL'}
            className="px-2.5 py-1 border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent rounded-sm transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Zap size={10} />
            <span>{locale === 'id' ? 'INJEKSI SURGE 10M' : 'INJECT 10M SURGE'}</span>
          </button>

          <button
            onClick={triggerDrift}
            disabled={chaosState !== 'NORMAL'}
            className="px-2.5 py-1 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-sm transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <AlertTriangle size={10} />
            <span>{locale === 'id' ? 'SIMULASI SCHEMA DRIFT' : 'SIMULATE SCHEMA DRIFT'}</span>
          </button>

          <button
            onClick={triggerOOM}
            disabled={chaosState !== 'NORMAL'}
            className="px-2.5 py-1 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-sm transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <ShieldAlert size={10} />
            <span>{locale === 'id' ? 'TRIGGER WORKER OOM' : 'TRIGGER WORKER OOM'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
