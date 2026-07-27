'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Server, Database, Layers, 
  Activity, CheckCircle2, AlertTriangle, Sliders
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface NodeItem {
  id: string;
  name: string;
  category: 'source' | 'transform' | 'destination';
  tech: string;
  icon: string;
  throughput: string;
  status: 'active' | 'lagging' | 'optimizing';
  latencyMs: number;
}

const INITIAL_NODES: NodeItem[] = [
  { id: 'src-1', name: 'Kafka Event Bus', category: 'source', tech: 'Apache Kafka', icon: '⚡', throughput: '1.2M req/sec', status: 'active', latencyMs: 2 },
  { id: 'src-2', name: 'Postgres CDC', category: 'source', tech: 'Debezium / Wal2json', icon: '🐘', throughput: '450k ops/sec', status: 'active', latencyMs: 5 },
  { id: 'src-3', name: 'S3 Data Lake', category: 'source', tech: 'Parquet / Iceberg', icon: '🪣', throughput: '12.4 GB/sec', status: 'active', latencyMs: 18 },
  { id: 'tx-1', name: 'Spark Processing', category: 'transform', tech: 'PySpark / Delta', icon: '🔥', throughput: '2.8M rows/sec', status: 'active', latencyMs: 42 },
  { id: 'tx-2', name: 'dbt Core Models', category: 'transform', tech: 'SQL / Jinja', icon: '🟧', throughput: 'Batch Transformed', status: 'active', latencyMs: 120 },
  { id: 'tx-3', name: 'DuckDB Engine', category: 'transform', tech: 'Vectorized C++', icon: '🦆', throughput: '8.4M rows/sec', status: 'active', latencyMs: 8 },
  { id: 'dst-1', name: 'BigQuery Warehouse', category: 'destination', tech: 'Google Cloud BQ', icon: '🔍', throughput: 'Petabyte Scale', status: 'active', latencyMs: 85 },
  { id: 'dst-2', name: 'ClickHouse OLAP', category: 'destination', tech: 'Real-time Analytics', icon: '⚡', throughput: '15M events/sec', status: 'active', latencyMs: 12 },
  { id: 'dst-3', name: 'Redis Cache', category: 'destination', tech: 'In-Memory Key/Val', icon: '🔴', throughput: '950k ops/sec', status: 'active', latencyMs: 1 },
];

export function EtlDagArchitect({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const isID = locale === 'id';

  const [activeSources, setActiveSources] = useState<string[]>(['src-1', 'src-2']);
  const [activeTransforms, setActiveTransforms] = useState<string[]>(['tx-1', 'tx-3']);
  const [activeDestinations, setActiveDestinations] = useState<string[]>(['dst-1', 'dst-2']);


  const [targetThroughput, setTargetThroughput] = useState<number>(2500000); // 2.5M ops/sec
  const [simulating, setSimulating] = useState<boolean>(true);
  const [hasBackpressure, setHasBackpressure] = useState<boolean>(false);
  const [healthScore, setHealthScore] = useState<number>(99.8);
  const [rebalanceCount, setRebalanceCount] = useState<number>(0);

  // Live telemetry pulse
  useEffect(() => {
    if (!simulating) return;
    const interval = setInterval(() => {
      setHealthScore(prev => {
        const delta = (Math.random() - 0.48) * 0.4;
        const nextScore = Math.min(100, Math.max(92, prev + delta));
        return parseFloat(nextScore.toFixed(1));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [simulating]);

  const toggleNode = (node: NodeItem) => {
    soundEngine.playNodeConnect();
    if (node.category === 'source') {

      setActiveSources(prev => prev.includes(node.id) ? (prev.length > 1 ? prev.filter(i => i !== node.id) : prev) : [...prev, node.id]);
    } else if (node.category === 'transform') {
      setActiveTransforms(prev => prev.includes(node.id) ? (prev.length > 1 ? prev.filter(i => i !== node.id) : prev) : [...prev, node.id]);
    } else {
      setActiveDestinations(prev => prev.includes(node.id) ? (prev.length > 1 ? prev.filter(i => i !== node.id) : prev) : [...prev, node.id]);
    }
  };

  const handleSimulateBackpressure = () => {
    soundEngine.playGlitch();
    setHasBackpressure(true);
    setHealthScore(84.2);
    setTimeout(() => {
      soundEngine.playSuccessChord();
      setHasBackpressure(false);
      setHealthScore(99.6);
      setRebalanceCount(c => c + 1);
    }, 3500);
  };

  const formatOps = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M ops/sec`;
    return `${(val / 1000).toFixed(0)}K ops/sec`;
  };

  // Calculated metrics
  const estimatedLatency = Math.round(15 + (targetThroughput / 100000) * 0.8);
  const memoryUsageGb = (2.4 + (activeSources.length + activeTransforms.length + activeDestinations.length) * 1.8).toFixed(1);
  const partitionSkew = (0.2 + (hasBackpressure ? 4.8 : 0.1)).toFixed(2);

  return (
    <div className="bg-bg-1 border border-border-subtle rounded-md p-5 font-mono relative overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <h3 className="text-xs uppercase tracking-widest font-bold text-text-0">
              {isID ? 'Visualizador DAG ETL Interaktif' : 'Interactive Visual ETL DAG Architect'}
            </h3>
          </div>
          <p className="text-[10px] text-text-3 mt-1">
            {isID 
              ? 'Rancang, hubungkan, dan uji performa data pipeline skala tinggi secara real-time.' 
              : 'Design, connect, and benchmark high-throughput data pipeline architectures in real time.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateBackpressure}
            disabled={hasBackpressure}
            className={`px-3 py-1.5 text-[9px] uppercase tracking-wider rounded border transition-all flex items-center gap-1.5 cursor-pointer ${
              hasBackpressure 
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse' 
                : 'bg-bg border-border-subtle hover:border-accent/50 text-text-2 hover:text-accent'
            }`}
          >
            <AlertTriangle size={12} className={hasBackpressure ? 'text-amber-400' : ''} />
            <span>{hasBackpressure ? (isID ? 'Mengatasi Backpressure...' : 'Auto-Healing Backpressure...') : (isID ? 'Simulasi Backpressure' : 'Trigger Backpressure')}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playSuccessChord();
              setSimulating(!simulating);
            }}
            className="px-3 py-1.5 text-[9px] uppercase tracking-wider rounded bg-accent/10 border border-accent/30 hover:bg-accent/20 text-accent transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Activity size={12} className={simulating ? 'animate-spin' : ''} />
            <span>{simulating ? (isID ? 'Engine Aktif' : 'Engine Running') : (isID ? 'Jalankan Engine' : 'Start Engine')}</span>
          </button>
        </div>
      </div>

      {/* DAG Architecture Canvas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 relative">
        {/* Connection flow background pulse */}
        <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="30%" y1="50%" x2="40%" y2="50%" stroke="var(--theme-accent, #00e1cf)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <line x1="63%" y1="50%" x2="73%" y2="50%" stroke="var(--theme-accent, #00e1cf)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          </svg>
        </div>

        {/* Category 1: Sources */}
        <div className="bg-bg/60 border border-border-subtle p-3 rounded relative z-10">
          <div className="flex items-center justify-between mb-3 text-[9px] text-accent uppercase font-bold tracking-widest border-b border-border-subtle/50 pb-2">
            <span className="flex items-center gap-1.5"><Server size={11} /> {isID ? '01. Ingestion Sources' : '01. Ingestion Sources'}</span>
            <span className="text-text-3 font-normal">[{activeSources.length} Selected]</span>
          </div>

          <div className="space-y-2">
            {INITIAL_NODES.filter(n => n.category === 'source').map(node => {
              const active = activeSources.includes(node.id);
              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleNode(node)}
                  className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between ${
                    active 
                      ? 'bg-accent/15 border-accent text-text-0 shadow-[0_0_15px_rgba(0,225,207,0.15)]' 
                      : 'bg-bg/80 border-border-subtle/70 text-text-3 hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{node.icon}</span>
                    <div>
                      <div className="text-[10px] font-bold">{node.name}</div>
                      <div className="text-[8px] text-text-3">{node.tech}</div>
                    </div>
                  </div>
                  {active && <CheckCircle2 size={12} className="text-accent shrink-0" />}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Category 2: Transformations */}
        <div className="bg-bg/60 border border-border-subtle p-3 rounded relative z-10">
          <div className="flex items-center justify-between mb-3 text-[9px] text-accent uppercase font-bold tracking-widest border-b border-border-subtle/50 pb-2">
            <span className="flex items-center gap-1.5"><Layers size={11} /> {isID ? '02. Stream Transforms' : '02. Stream Transforms'}</span>
            <span className="text-text-3 font-normal">[{activeTransforms.length} Selected]</span>
          </div>

          <div className="space-y-2">
            {INITIAL_NODES.filter(n => n.category === 'transform').map(node => {
              const active = activeTransforms.includes(node.id);
              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleNode(node)}
                  className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between ${
                    active 
                      ? 'bg-accent/15 border-accent text-text-0 shadow-[0_0_15px_rgba(0,225,207,0.15)]' 
                      : 'bg-bg/80 border-border-subtle/70 text-text-3 hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{node.icon}</span>
                    <div>
                      <div className="text-[10px] font-bold">{node.name}</div>
                      <div className="text-[8px] text-text-3">{node.tech}</div>
                    </div>
                  </div>
                  {active && <CheckCircle2 size={12} className="text-accent shrink-0" />}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Category 3: Destinations */}
        <div className="bg-bg/60 border border-border-subtle p-3 rounded relative z-10">
          <div className="flex items-center justify-between mb-3 text-[9px] text-accent uppercase font-bold tracking-widest border-b border-border-subtle/50 pb-2">
            <span className="flex items-center gap-1.5"><Database size={11} /> {isID ? '03. Target Warehouses' : '03. Target Warehouses'}</span>
            <span className="text-text-3 font-normal">[{activeDestinations.length} Selected]</span>
          </div>

          <div className="space-y-2">
            {INITIAL_NODES.filter(n => n.category === 'destination').map(node => {
              const active = activeDestinations.includes(node.id);
              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleNode(node)}
                  className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between ${
                    active 
                      ? 'bg-accent/15 border-accent text-text-0 shadow-[0_0_15px_rgba(0,225,207,0.15)]' 
                      : 'bg-bg/80 border-border-subtle/70 text-text-3 hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{node.icon}</span>
                    <div>
                      <div className="text-[10px] font-bold">{node.name}</div>
                      <div className="text-[8px] text-text-3">{node.tech}</div>
                    </div>
                  </div>
                  {active && <CheckCircle2 size={12} className="text-accent shrink-0" />}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control Panel & Real-time Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-border-subtle bg-bg/40 p-3 rounded">
        {/* Throughput Slider */}
        <div className="lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[9px] uppercase tracking-wider text-text-2 flex items-center gap-1 font-bold">
              <Sliders size={11} className="text-accent" />
              {isID ? 'Target Throughput' : 'Target Throughput'}
            </label>
            <span className="text-[10px] font-bold text-accent">{formatOps(targetThroughput)}</span>
          </div>

          <input
            type="range"
            min={100000}
            max={10000000}
            step={100000}
            value={targetThroughput}
            onChange={(e) => {
              soundEngine.playClick(600);
              setTargetThroughput(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-bg border border-border-subtle rounded-lg appearance-none cursor-pointer accent-accent"
          />

          <div className="flex justify-between text-[8px] text-text-3 mt-1.5">
            <span>100K ops/s</span>
            <span>5M ops/s</span>
            <span>10M ops/s</span>
          </div>
        </div>

        {/* Live Telemetry Display */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-bg border border-border-subtle/80 p-2 rounded">
            <div className="text-[8px] uppercase tracking-widest text-text-3">{isID ? 'Kesehatan DAG' : 'DAG Health'}</div>
            <div className={`text-xs font-bold mt-1 ${healthScore > 95 ? 'text-accent' : 'text-amber-400'}`}>
              {healthScore}%
            </div>
            <div className="text-[7px] text-text-3 mt-0.5">{isID ? 'Beban Seimbang' : 'Zero Data Loss'}</div>
          </div>

          <div className="bg-bg border border-border-subtle/80 p-2 rounded">
            <div className="text-[8px] uppercase tracking-widest text-text-3">{isID ? 'Latensi P99' : 'P99 Latency'}</div>
            <div className="text-xs font-bold text-text-0 mt-1">{estimatedLatency} ms</div>
            <div className="text-[7px] text-text-3 mt-0.5">{isID ? 'End-to-End Pipeline' : 'End-to-End SLA'}</div>
          </div>

          <div className="bg-bg border border-border-subtle/80 p-2 rounded">
            <div className="text-[8px] uppercase tracking-widest text-text-3">{isID ? 'Memori Cluster' : 'Cluster RAM'}</div>
            <div className="text-xs font-bold text-text-0 mt-1">{memoryUsageGb} GB</div>
            <div className="text-[7px] text-text-3 mt-0.5">{isID ? 'Memory Allocation' : 'Auto-scaling'}</div>
          </div>

          <div className="bg-bg border border-border-subtle/80 p-2 rounded">
            <div className="text-[8px] uppercase tracking-widest text-text-3">{isID ? 'Skew Partisi' : 'Partition Skew'}</div>
            <div className={`text-xs font-bold mt-1 ${hasBackpressure ? 'text-amber-400' : 'text-text-0'}`}>{partitionSkew}</div>
            <div className="text-[7px] text-text-3 mt-0.5">{rebalanceCount} {isID ? 'Auto-heals' : 'Auto-heals'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
