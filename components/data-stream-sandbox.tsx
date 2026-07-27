'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Activity, Play, Pause, Zap, ShieldAlert, Code2, Copy, Check, Terminal
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface StreamSource {
  id: string;
  name: string;
  category: 'IoT' | 'E-Commerce' | 'Financial' | 'LLM';
  rate: number; // msg/sec
  payloadExample: Record<string, any>;
  color: string;
}

interface ProcessingEngine {
  id: string;
  name: string;
  type: 'Stream' | 'Batch' | 'Micro-batch';
  windowSize: string;
  transformation: string;
  color: string;
}

interface StorageSink {
  id: string;
  name: string;
  format: 'Iceberg (Parquet)' | 'PostgreSQL' | 'ClickHouse' | 'Kafka Topic';
  color: string;
}

const SOURCES: StreamSource[] = [
  {
    id: 'iot',
    name: 'IoT Telemetry Fleet',
    category: 'IoT',
    rate: 25000,
    payloadExample: { device_id: 'sensor_982', temp_c: 42.8, pressure_psi: 101.3, timestamp: '2026-07-27T19:24:00Z' },
    color: '#00e1cf'
  },
  {
    id: 'clickstream',
    name: 'E-Commerce Clickstream',
    category: 'E-Commerce',
    rate: 45000,
    payloadExample: { user_id: 'usr_8819', event: 'checkout_completed', cart_total: 249.50, geo: 'US-EAST' },
    color: '#3b82f6'
  },
  {
    id: 'fintech',
    name: 'Financial Ledger Feed',
    category: 'Financial',
    rate: 18000,
    payloadExample: { txn_id: 'tx_99481a', amount: 1420.00, currency: 'USD', risk_score: 0.02 },
    color: '#a855f7'
  },
  {
    id: 'llm',
    name: 'LLM Token Telemetry',
    category: 'LLM',
    rate: 12000,
    payloadExample: { model: 'gemini-3-flash', prompt_tokens: 1048, completion_tokens: 284, latency_ms: 18.2 },
    color: '#10b981'
  }
];

const ENGINES: ProcessingEngine[] = [
  {
    id: 'pyspark',
    name: 'Apache Spark Streaming',
    type: 'Micro-batch',
    windowSize: '10s Sliding Window',
    transformation: 'SCD Type-2 Deduplication & Anomaly Filtering',
    color: '#3b82f6'
  },
  {
    id: 'flink',
    name: 'Apache Flink Stateful Stream',
    type: 'Stream',
    windowSize: 'Tumtum 5s Window',
    transformation: 'Complex Event Processing (CEP) & Low-Latency Joining',
    color: '#00e1cf'
  },
  {
    id: 'dbt',
    name: 'dbt Core Transformation',
    type: 'Batch',
    windowSize: 'Incremental Model',
    transformation: 'Star-Schema Dimensional Modeling & Quality Contracts',
    color: '#a855f7'
  }
];

const SINKS: StorageSink[] = [
  { id: 'iceberg', name: 'Apache Iceberg Lakehouse', format: 'Iceberg (Parquet)', color: '#10b981' },
  { id: 'postgres', name: 'PostgreSQL OLTP Node', format: 'PostgreSQL', color: '#f59e0b' },
  { id: 'clickhouse', name: 'ClickHouse Real-time Analytics', format: 'ClickHouse', color: '#ec4899' }
];

export function DataStreamSandbox({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const [selectedSource, setSelectedSource] = useState<StreamSource>(SOURCES[0]);
  const [selectedEngine, setSelectedEngine] = useState<ProcessingEngine>(ENGINES[0]);
  const [selectedSink, setSelectedSink] = useState<StorageSink>(SINKS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [chaosMode, setChaosMode] = useState<'NORMAL' | 'SURGE' | 'DRIFT' | 'BACKPRESSURE'>('NORMAL');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'code' | 'payload'>('visualizer');

  // Real-time telemetry meters
  const [processedEvents, setProcessedEvents] = useState(1482090);
  const [currentLatency, setCurrentLatency] = useState(12); // ms
  const [bufferUsage, setBufferUsage] = useState(24); // %
  const [errorRate, setErrorRate] = useState(0.01); // %

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; speed: number; progress: number; size: number; color: string; isGlitch: boolean }>>([]);

  // Trigger sound feedback
  const handleSourceSelect = (src: StreamSource) => {
    soundEngine.playClick(600);
    setSelectedSource(src);
  };

  const handleEngineSelect = (eng: ProcessingEngine) => {
    soundEngine.playClick(750);
    setSelectedEngine(eng);
  };

  const handleSinkSelect = (snk: StorageSink) => {
    soundEngine.playClick(900);
    setSelectedSink(snk);
  };

  const triggerChaos = (mode: 'SURGE' | 'DRIFT' | 'BACKPRESSURE') => {
    soundEngine.playModemHandshake();
    setChaosMode(mode);
    if (mode === 'SURGE') {
      setCurrentLatency(85);
      setBufferUsage(88);
      setErrorRate(1.8);
    } else if (mode === 'DRIFT') {
      setErrorRate(6.4);
      setCurrentLatency(42);
    } else if (mode === 'BACKPRESSURE') {
      setBufferUsage(96);
      setCurrentLatency(120);
    }

    setTimeout(() => {
      soundEngine.playChime(1046, 0.4);
      setChaosMode('NORMAL');
      setCurrentLatency(12);
      setBufferUsage(24);
      setErrorRate(0.01);
    }, 4500);
  };

  // Canvas particle stream animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Node positions (Source -> Engine -> Sink)
    const sourceX = width * 0.15;
    const engineX = width * 0.50;
    const sinkX = width * 0.85;
    const centerY = height * 0.5;

    // Spawn stream particles
    const spawnParticle = () => {
      if (!isPlaying) return;
      const isGlitch = chaosMode !== 'NORMAL' && Math.random() < 0.3;
      particlesRef.current.push({
        x: sourceX,
        y: centerY + (Math.random() * 20 - 10),
        speed: 0.008 + Math.random() * 0.006 + (chaosMode === 'SURGE' ? 0.01 : 0),
        progress: 0,
        size: Math.random() * 2.5 + 2,
        color: isGlitch ? '#ef4444' : selectedSource.color,
        isGlitch
      });
    };

    const interval = setInterval(spawnParticle, 120);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Connection Lines (Glowing Stream Paths)
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      // Line 1: Source to Engine
      const grad1 = ctx.createLinearGradient(sourceX, centerY, engineX, centerY);
      grad1.addColorStop(0, selectedSource.color + '88');
      grad1.addColorStop(1, selectedEngine.color + '88');
      ctx.strokeStyle = grad1;
      ctx.beginPath();
      ctx.moveTo(sourceX, centerY);
      ctx.lineTo(engineX, centerY);
      ctx.stroke();

      // Line 2: Engine to Sink
      const grad2 = ctx.createLinearGradient(engineX, centerY, sinkX, centerY);
      grad2.addColorStop(0, selectedEngine.color + '88');
      grad2.addColorStop(1, selectedSink.color + '88');
      ctx.strokeStyle = grad2;
      ctx.beginPath();
      ctx.moveTo(engineX, centerY);
      ctx.lineTo(sinkX, centerY);
      ctx.stroke();

      ctx.setLineDash([]);

      // Draw Particles
      particlesRef.current.forEach((p) => {
        p.progress += p.speed;

        if (p.progress <= 0.5) {
          // Moving from Source to Engine
          const t = p.progress / 0.5;
          p.x = sourceX + (engineX - sourceX) * t;
        } else {
          // Moving from Engine to Sink
          const t = (p.progress - 0.5) / 0.5;
          p.x = engineX + (sinkX - engineX) * t;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y + Math.sin(p.progress * Math.PI * 4) * 3, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Particle Glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Remove completed particles
      particlesRef.current = particlesRef.current.filter((p) => p.progress < 1);

      // Draw Stage Nodes
      const drawNode = (x: number, y: number, label: string, sub: string, color: string, isActive: boolean) => {
        ctx.fillStyle = '#09090b';
        ctx.strokeStyle = color;
        ctx.lineWidth = isActive ? 2 : 1;

        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (isActive) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Inner Core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Text Label below
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + 42);
      };

      drawNode(sourceX, centerY, selectedSource.name.split(' ')[0], 'SOURCE', selectedSource.color, true);
      drawNode(engineX, centerY, selectedEngine.name.split(' ')[0], 'ENGINE', selectedEngine.color, true);
      drawNode(sinkX, centerY, selectedSink.name.split(' ')[0], 'SINK', selectedSink.color, true);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedSource, selectedEngine, selectedSink, isPlaying, chaosMode]);

  // Periodic counters tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const delta = Math.floor(selectedSource.rate / 10 + (Math.random() * 500 - 250));
      setProcessedEvents((prev) => prev + Math.max(100, delta));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, selectedSource]);

  // Code generator
  const generatedCode = useMemo(() => {
    if (selectedEngine.id === 'pyspark') {
      return `# PySpark Structured Streaming Pipeline
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, expr, window
from pyspark.sql.types import StructType, StringType, DoubleType, TimestampType

spark = SparkSession.builder \\
    .appName("NichsEdge_${selectedSource.id.toUpperCase()}_Stream") \\
    .config("spark.sql.extensions", "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions") \\
    .getOrCreate()

# 1. Read Stream from Kafka Source (${selectedSource.name})
raw_stream = spark.readStream \\
    .format("kafka") \\
    .option("kafka.bootstrap.servers", "cluster.nichsedge.io:9092") \\
    .option("subscribe", "telemetry.${selectedSource.id}") \\
    .option("startingOffsets", "latest") \\
    .load()

# 2. Apply Transformation (${selectedEngine.transformation})
parsed_stream = raw_stream \\
    .selectExpr("CAST(value AS STRING) as json_payload") \\
    .select(from_json(col("json_payload"), schema).alias("data")) \\
    .select("data.*") \\
    .withWatermark("timestamp", "10 seconds") \\
    .groupBy(window(col("timestamp"), "${selectedEngine.windowSize.split(' ')[0]}")) \\
    .count()

# 3. Write Stream to ${selectedSink.name}
query = parsed_stream.writeStream \\
    .format("${selectedSink.id === 'iceberg' ? 'iceberg' : 'jdbc'}") \\
    .outputMode("append") \\
    .option("checkpointLocation", "s3a://checkpoints/${selectedSource.id}") \\
    .start("lakehouse.prod.${selectedSource.id}_summary")

query.awaitTermination()`;
    } else if (selectedEngine.id === 'flink') {
      return `-- Apache Flink SQL Stateful Streaming Engine
CREATE TABLE ${selectedSource.id}_input_stream (
    payload STRING,
    event_time TIMESTAMP(3),
    WATERMARK FOR event_time AS event_time - INTERVAL '5' SECOND
) WITH (
    'connector' = 'kafka',
    'topic' = 'telemetry.${selectedSource.id}',
    'properties.bootstrap.servers' = 'cluster.nichsedge.io:9092',
    'format' = 'json'
);

-- State windowed transformation & deduplication
CREATE VIEW processed_${selectedSource.id} AS
SELECT 
    TUMBLE_START(event_time, INTERVAL '5' SECOND) AS window_start,
    COUNT(*) AS total_events,
    AVG(CAST(JSON_VALUE(payload, '$.temp_c') AS DOUBLE)) AS avg_metric
FROM ${selectedSource.id}_input_stream
GROUP BY TUMBLE(event_time, INTERVAL '5' SECOND);

-- Sink to ${selectedSink.name}
INSERT INTO ${selectedSink.id === 'postgres' ? 'postgres_db' : 'iceberg_catalog'}.${selectedSource.id}_sink
SELECT * FROM processed_${selectedSource.id};`;
    } else {
      return `-- dbt Incremental Model (${selectedSink.name})
{{ config(
    materialized='incremental',
    unique_key='id',
    incremental_strategy='merge',
    cluster_by=['event_date']
) }}

WITH raw_events AS (
    SELECT 
        *,
        CAST(event_time AS DATE) AS event_date
    FROM {{ source('raw_lakehouse', '${selectedSource.id}_raw') }}
    {% if is_incremental() %}
      WHERE event_time > (SELECT MAX(event_time) FROM {{ this }})
    {% endif %}
),

transformed AS (
    SELECT 
        id,
        event_date,
        payload:user_id::STRING AS user_id,
        payload:event::STRING AS event_name,
        CURRENT_TIMESTAMP() AS updated_at
    FROM raw_events
)

SELECT * FROM transformed;`;
    }
  }, [selectedSource, selectedEngine, selectedSink]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    soundEngine.playChime(1200, 0.2);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full bg-[#09090b]/90 border border-border-subtle rounded-md overflow-hidden shadow-2xl backdrop-blur-md font-mono text-xs my-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg/80">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-[1px] bg-border-subtle mx-1" />
          <span className="font-bold text-accent tracking-wider uppercase text-[11px] flex items-center gap-2">
            <Activity size={14} className="animate-pulse" />
            {locale === 'id' ? 'WORKBENCH PIPELINE DATA REAL-TIME' : 'REAL-TIME DATA STREAM WORKBENCH'}
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-3 py-1.5 rounded transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              activeTab === 'visualizer'
                ? 'bg-accent/20 text-accent border border-accent/40 shadow-[0_0_15px_rgba(0,225,207,0.2)]'
                : 'text-text-3 hover:text-text-1'
            }`}
          >
            <Activity size={12} /> {locale === 'id' ? 'Visualisasi' : 'Topology View'}
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-accent/20 text-accent border border-accent/40 shadow-[0_0_15px_rgba(0,225,207,0.2)]'
                : 'text-text-3 hover:text-text-1'
            }`}
          >
            <Code2 size={12} /> {locale === 'id' ? 'Kode Generator' : 'Code Generator'}
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`px-3 py-1.5 rounded transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              activeTab === 'payload'
                ? 'bg-accent/20 text-accent border border-accent/40 shadow-[0_0_15px_rgba(0,225,207,0.2)]'
                : 'text-text-3 hover:text-text-1'
            }`}
          >
            <Terminal size={12} /> {locale === 'id' ? 'Payload Stream' : 'Payload Schema'}
          </button>
        </div>
      </div>

      {/* Selector Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-border-subtle bg-[#0c0d12]/50">
        {/* Source Selector */}
        <div>
          <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold block mb-2 flex items-center justify-between">
            <span>1. {locale === 'id' ? 'Sumber Ingesti Stream' : 'Ingestion Source'}</span>
            <span className="text-accent text-[9px] font-mono">{selectedSource.rate.toLocaleString()} msg/s</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SOURCES.map((src) => (
              <button
                key={src.id}
                onClick={() => handleSourceSelect(src)}
                className={`p-2.5 rounded border text-left transition-all ${
                  selectedSource.id === src.id
                    ? 'border-accent bg-accent/10 text-text-0 shadow-[0_0_10px_rgba(0,225,207,0.15)]'
                    : 'border-border-subtle bg-bg/40 text-text-3 hover:border-text-3'
                }`}
              >
                <div className="font-bold text-[11px] truncate" style={{ color: selectedSource.id === src.id ? src.color : undefined }}>
                  {src.name}
                </div>
                <div className="text-[9px] text-text-3 mt-0.5">{src.category} Feed</div>
              </button>
            ))}
          </div>
        </div>

        {/* Engine Selector */}
        <div>
          <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold block mb-2 flex items-center justify-between">
            <span>2. {locale === 'id' ? 'Mesin Pemrosesan Engine' : 'Stream Processing Engine'}</span>
            <span className="text-accent text-[9px] font-mono">{selectedEngine.type}</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {ENGINES.map((eng) => (
              <button
                key={eng.id}
                onClick={() => handleEngineSelect(eng)}
                className={`p-2.5 rounded border text-left transition-all ${
                  selectedEngine.id === eng.id
                    ? 'border-accent bg-accent/10 text-text-0 shadow-[0_0_10px_rgba(0,225,207,0.15)]'
                    : 'border-border-subtle bg-bg/40 text-text-3 hover:border-text-3'
                }`}
              >
                <div className="font-bold text-[11px] flex items-center justify-between" style={{ color: selectedEngine.id === eng.id ? eng.color : undefined }}>
                  <span>{eng.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{eng.type}</span>
                </div>
                <div className="text-[9px] text-text-3 truncate mt-0.5">{eng.transformation}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sink Selector */}
        <div>
          <label className="text-[10px] text-text-3 uppercase tracking-wider font-semibold block mb-2 flex items-center justify-between">
            <span>3. {locale === 'id' ? 'Penyimpanan Sink' : 'Storage Sink Target'}</span>
            <span className="text-accent text-[9px] font-mono">{selectedSink.format.split(' ')[0]}</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {SINKS.map((snk) => (
              <button
                key={snk.id}
                onClick={() => handleSinkSelect(snk)}
                className={`p-2.5 rounded border text-left transition-all ${
                  selectedSink.id === snk.id
                    ? 'border-accent bg-accent/10 text-text-0 shadow-[0_0_10px_rgba(0,225,207,0.15)]'
                    : 'border-border-subtle bg-bg/40 text-text-3 hover:border-text-3'
                }`}
              >
                <div className="font-bold text-[11px]" style={{ color: selectedSink.id === snk.id ? snk.color : undefined }}>
                  {snk.name}
                </div>
                <div className="text-[9px] text-text-3 mt-0.5">Format: {snk.format}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'visualizer' && (
        <div className="p-6 relative">
          {/* Canvas Stream Flow */}
          <div className="relative w-full h-[220px] bg-black/40 rounded border border-border-subtle overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Floating Live Controls overlay */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1 bg-bg/80 hover:bg-bg border border-border-subtle rounded text-[10px] font-bold text-text-1 flex items-center gap-1.5 transition-all"
              >
                {isPlaying ? <Pause size={12} className="text-amber-400" /> : <Play size={12} className="text-emerald-400" />}
                {isPlaying ? (locale === 'id' ? 'PAUSE STREAM' : 'PAUSE STREAM') : (locale === 'id' ? 'RESUME STREAM' : 'RESUME STREAM')}
              </button>

              <div className="h-4 w-[1px] bg-border-subtle" />

              {/* Chaos Injection Buttons */}
              <button
                onClick={() => triggerChaos('SURGE')}
                disabled={chaosMode !== 'NORMAL'}
                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[9px] font-bold flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <Zap size={10} /> {locale === 'id' ? 'TRIGGER TRAFFIC SURGE' : 'TRIGGER TRAFFIC SURGE'}
              </button>
              <button
                onClick={() => triggerChaos('DRIFT')}
                disabled={chaosMode !== 'NORMAL'}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-bold flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <ShieldAlert size={10} /> {locale === 'id' ? 'SCHEMA DRIFT' : 'INJECT SCHEMA DRIFT'}
              </button>
            </div>
          </div>

          {/* Telemetry Gauge Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-3 bg-bg/50 border border-border-subtle rounded">
              <div className="text-[9px] text-text-3 uppercase tracking-wider">{locale === 'id' ? 'Total Event Diproses' : 'Processed Telemetry'}</div>
              <div className="text-lg font-bold text-accent font-mono mt-1">{processedEvents.toLocaleString()}</div>
              <div className="text-[9px] text-emerald-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                +{selectedSource.rate.toLocaleString()} / sec
              </div>
            </div>

            <div className="p-3 bg-bg/50 border border-border-subtle rounded">
              <div className="text-[9px] text-text-3 uppercase tracking-wider">{locale === 'id' ? 'End-to-End Latency' : 'End-to-End Latency'}</div>
              <div className={`text-lg font-bold font-mono mt-1 ${currentLatency > 50 ? 'text-rose-400' : 'text-text-0'}`}>
                {currentLatency} ms
              </div>
              <div className="text-[9px] text-text-3 mt-0.5">SLA Limit: 50 ms</div>
            </div>

            <div className="p-3 bg-bg/50 border border-border-subtle rounded">
              <div className="text-[9px] text-text-3 uppercase tracking-wider">{locale === 'id' ? 'Buffer Utilization' : 'Stream Buffer Fill'}</div>
              <div className="text-lg font-bold text-text-0 font-mono mt-1">{bufferUsage}%</div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${bufferUsage > 80 ? 'bg-rose-500' : 'bg-accent'}`} 
                  style={{ width: `${bufferUsage}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-bg/50 border border-border-subtle rounded">
              <div className="text-[9px] text-text-3 uppercase tracking-wider">{locale === 'id' ? 'Rasio Error / DLQ' : 'DLQ Error Rate'}</div>
              <div className={`text-lg font-bold font-mono mt-1 ${errorRate > 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {errorRate}%
              </div>
              <div className="text-[9px] text-text-3 mt-0.5">Zero Data Loss Policy</div>
            </div>
          </div>
        </div>
      )}

      {/* Code Tab View */}
      {activeTab === 'code' && (
        <div className="p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">
              {selectedEngine.name} — {selectedSource.name} to {selectedSink.name}
            </div>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-accent/10 hover:bg-accent/20 border border-accent/40 text-accent rounded text-[10px] font-bold flex items-center gap-1.5 transition-all"
            >
              {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copiedCode ? (locale === 'id' ? 'TERSIMPAN!' : 'COPIED!') : (locale === 'id' ? 'SALIN KODE' : 'COPY CODE')}
            </button>
          </div>
          <pre className="p-4 bg-black/80 border border-border-subtle rounded text-[11px] text-text-1 font-mono overflow-x-auto max-h-[300px] leading-relaxed select-all">
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}

      {/* Payload Tab View */}
      {activeTab === 'payload' && (
        <div className="p-6">
          <div className="text-[10px] text-text-3 uppercase tracking-wider font-semibold mb-3">
            {selectedSource.name} — Sample Streaming Record JSON
          </div>
          <pre className="p-4 bg-black/80 border border-border-subtle rounded text-[11px] text-accent font-mono overflow-x-auto leading-relaxed">
            <code>{JSON.stringify(selectedSource.payloadExample, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
