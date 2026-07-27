'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Zap, AlertTriangle, RefreshCw, Activity, Cpu, Layers } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface StreamPacket {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  type: 'click' | 'cdc' | 'iot' | 'api';
  color: string;
  stage: number; // 0: source->kafka, 1: kafka->flink, 2: flink->sink
}

export function StreamSimulator({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const [isRunning, setIsRunning] = useState(true);
  const [throughput, setThroughput] = useState(15000); // msgs/sec
  const [hasBackpressure, setHasBackpressure] = useState(false);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [processedCount, setProcessedCount] = useState(1482090);
  const [consumerLag, setConsumerLag] = useState(140);
  const [p99Latency, setP99Latency] = useState(4.2);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const packetsRef = useRef<StreamPacket[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Trigger Traffic Spike
  const handleSpike = () => {
    soundEngine.playStreamSpike();
    setThroughput(prev => Math.min(100000, prev * 2.5));
    setTimeout(() => {
      setThroughput(15000);
    }, 4000);
  };

  // Toggle Backpressure
  const toggleBackpressure = () => {
    soundEngine.playAlertSound();
    setHasBackpressure(prev => !prev);
  };

  // Trigger Partition Rebalance
  const triggerRebalance = () => {
    soundEngine.playGlitch();
    setIsRebalancing(true);
    setTimeout(() => setIsRebalancing(false), 2500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let packetIdCounter = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 180;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stages = [
      { xRatio: 0.12, label: 'Ingestion' },
      { xRatio: 0.38, label: 'Kafka Topic' },
      { xRatio: 0.65, label: 'Flink Stream' },
      { xRatio: 0.90, label: 'Iceberg Lake' }
    ];

    const typeColors = {
      click: '#00e1cf',
      cdc: '#a78bfa',
      iot: '#f59e0b',
      api: '#3b82f6'
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // Draw connection lines
      ctx.lineWidth = 2;
      ctx.strokeStyle = hasBackpressure ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 225, 207, 0.25)';
      ctx.setLineDash([6, 6]);

      for (let i = 0; i < stages.length - 1; i++) {
        const startX = stages[i].xRatio * w;
        const endX = stages[i + 1].xRatio * w;
        ctx.beginPath();
        ctx.moveTo(startX, centerY);
        ctx.lineTo(endX, centerY);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw Node Pillars
      stages.forEach((stg, i) => {
        const x = stg.xRatio * w;
        const isCurrentActive = i === 1 && hasBackpressure;

        ctx.fillStyle = isCurrentActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(24, 24, 27, 0.8)';
        ctx.strokeStyle = isCurrentActive ? '#ef4444' : (i === 2 && isRebalancing ? '#f59e0b' : '#00e1cf');
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.roundRect(x - 30, centerY - 35, 60, 70, 8);
        ctx.fill();
        ctx.stroke();

        // Node Label
        ctx.font = '10px monospace';
        ctx.fillStyle = isCurrentActive ? '#ef4444' : '#a1a1aa';
        ctx.textAlign = 'center';
        ctx.fillText(stg.label, x, centerY + 50);
      });

      // Spawn packets if running
      if (isRunning && Math.random() < throughput / 40000) {
        const types: Array<'click' | 'cdc' | 'iot' | 'api'> = ['click', 'cdc', 'iot', 'api'];
        const selectedType = types[Math.floor(Math.random() * types.length)];
        packetsRef.current.push({
          id: packetIdCounter++,
          x: stages[0].xRatio * w,
          y: centerY + (Math.random() * 20 - 10),
          targetX: stages[1].xRatio * w,
          targetY: centerY,
          speed: (hasBackpressure ? 1.2 : 3.5) + Math.random() * 1.5,
          type: selectedType,
          color: typeColors[selectedType],
          stage: 0
        });
      }

      // Update & Draw Packets
      const nextPackets: StreamPacket[] = [];
      packetsRef.current.forEach(p => {
        const currentStageTargetX = stages[p.stage + 1]?.xRatio * w;
        const speed = hasBackpressure && p.stage === 1 ? p.speed * 0.25 : p.speed;

        p.x += speed;

        if (p.x >= currentStageTargetX) {
          p.stage += 1;
          if (p.stage < stages.length - 1) {
            nextPackets.push(p);
          } else {
            // Reached sink
            setProcessedCount(prev => prev + 1);
          }
        } else {
          nextPackets.push(p);
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      packetsRef.current = nextPackets.slice(-120); // Cap particles

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, throughput, hasBackpressure, isRebalancing]);

  // Telemetry metric updater loop
  useEffect(() => {
    const interval = setInterval(() => {
      setConsumerLag(prev => {
        const delta = hasBackpressure ? Math.floor(Math.random() * 80 + 30) : Math.floor(Math.random() * 20 - 15);
        return Math.max(12, prev + delta);
      });
      setP99Latency(prev => {
        const target = hasBackpressure ? 42.5 : 3.8 + Math.random() * 1.2;
        return Number((prev * 0.8 + target * 0.2).toFixed(1));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasBackpressure]);

  return (
    <div className="bg-bg-1 border border-border-subtle p-6 rounded-lg font-mono relative overflow-hidden shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <h3 className="text-xs uppercase tracking-widest text-accent font-bold">
              {locale === 'id' ? 'Simulasi Pemrosesan Stream Real-Time' : 'Real-Time Stream Engine & Backpressure Simulator'}
            </h3>
          </div>
          <p className="text-[11px] text-text-3 font-sans mt-1">
            {locale === 'id'
              ? 'Arsitektur event streaming high-throughput (Kafka → Flink → Iceberg) dengan simulasi lonjakan beban & backpressure.'
              : 'High-throughput event streaming topology (Kafka → Flink → Iceberg) with live backpressure & stress-testing.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1.5 bg-bg-2 border border-border-subtle hover:border-accent text-[10px] text-text-1 flex items-center gap-1.5 transition-all"
          >
            {isRunning ? <Pause size={12} className="text-yellow-400" /> : <Play size={12} className="text-accent" />}
            {isRunning ? (locale === 'id' ? 'JEDA' : 'PAUSE') : (locale === 'id' ? 'MULAI' : 'RESUME')}
          </button>

          <button
            onClick={handleSpike}
            className="px-3 py-1.5 bg-accent/10 border border-accent/40 text-accent hover:bg-accent hover:text-bg text-[10px] flex items-center gap-1.5 transition-all"
          >
            <Zap size={12} />
            {locale === 'id' ? 'LONJAKAN TRAFIK (+250%)' : 'TRAFFIC SPIKE (+250%)'}
          </button>

          <button
            onClick={toggleBackpressure}
            className={`px-3 py-1.5 border text-[10px] flex items-center gap-1.5 transition-all ${
              hasBackpressure
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                : 'bg-bg-2 border-border-subtle text-text-3 hover:border-red-400 hover:text-red-400'
            }`}
          >
            <AlertTriangle size={12} />
            {hasBackpressure ? (locale === 'id' ? 'BACKPRESSURE: AKTIF' : 'BACKPRESSURE: ACTIVE') : (locale === 'id' ? 'TES BACKPRESSURE' : 'SIMULATE BACKPRESSURE')}
          </button>

          <button
            onClick={triggerRebalance}
            className="px-3 py-1.5 bg-bg-2 border border-border-subtle hover:border-purple-400 text-text-3 hover:text-purple-400 text-[10px] flex items-center gap-1.5 transition-all"
          >
            <RefreshCw size={12} className={isRebalancing ? 'animate-spin' : ''} />
            {locale === 'id' ? 'REBALANS PARTISI' : 'REBALANCE PARTITIONS'}
          </button>
        </div>
      </div>

      {/* Live Canvas View */}
      <div className="relative border border-border-subtle bg-[#08080a] rounded-md overflow-hidden mb-6">
        <canvas ref={canvasRef} className="w-full block" />

        {/* Rebalance overlay */}
        {isRebalancing && (
          <div className="absolute inset-0 bg-bg/70 backdrop-blur-xs flex items-center justify-center font-mono text-xs text-purple-400 gap-2">
            <RefreshCw size={14} className="animate-spin" />
            <span>{locale === 'id' ? '[KAFKA CONSUMER GROUP REBALANCING...]' : '[KAFKA CONSUMER GROUP REBALANCING...]'}</span>
          </div>
        )}
      </div>

      {/* Throughput Slider & Live Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Slider */}
        <div className="bg-bg-2 p-3 border border-border-subtle rounded-md md:col-span-1">
          <div className="flex justify-between items-center text-[10px] text-text-3 mb-1.5">
            <span>{locale === 'id' ? 'Beban Target:' : 'Target Rate:'}</span>
            <span className="text-accent font-bold">{throughput.toLocaleString()} msg/s</span>
          </div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={throughput}
            onChange={e => {
              soundEngine.playClick(600 + Number(e.target.value) / 100, 0.02);
              setThroughput(Number(e.target.value));
            }}
            className="w-full accent-accent cursor-pointer h-1.5 bg-bg rounded-lg"
          />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-3 md:col-span-3">
          <div className="bg-bg-2 p-3 border border-border-subtle rounded-md">
            <div className="text-[9px] text-text-3 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Activity size={10} className="text-accent" /> {locale === 'id' ? 'Total Diproses' : 'Processed Events'}
            </div>
            <div className="text-sm font-bold text-text-0">{processedCount.toLocaleString()}</div>
          </div>

          <div className={`bg-bg-2 p-3 border rounded-md ${hasBackpressure ? 'border-red-500/50 bg-red-950/20' : 'border-border-subtle'}`}>
            <div className="text-[9px] text-text-3 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers size={10} className={hasBackpressure ? 'text-red-400' : 'text-yellow-400'} /> {locale === 'id' ? 'Lag Konsumen' : 'Consumer Lag'}
            </div>
            <div className={`text-sm font-bold ${hasBackpressure ? 'text-red-400 animate-pulse' : 'text-text-0'}`}>
              {consumerLag.toLocaleString()} <span className="text-[9px] font-normal text-text-3">msgs</span>
            </div>
          </div>

          <div className="bg-bg-2 p-3 border border-border-subtle rounded-md">
            <div className="text-[9px] text-text-3 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Cpu size={10} className="text-accent" /> P99 Latency
            </div>
            <div className="text-sm font-bold text-text-0">
              {p99Latency} <span className="text-[9px] font-normal text-text-3">ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
