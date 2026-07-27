'use client';

import React, { useState } from 'react';
import { Play, Code, Database, Download, Check } from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import resumeDataEN from '@/data/cv.json';
import resumeDataID from '@/data/cv_id.json';


interface SqlWorkbenchProps {
  locale?: 'en' | 'id';
}

const PRESET_QUERIES = [
  {
    id: 'exp',
    label: 'Experience Stack',
    sql: 'SELECT role, company, period, tech_stack FROM experience WHERE tech_stack LIKE \'%Python%\' OR tech_stack LIKE \'%SQL%\';'
  },
  {
    id: 'skills',
    label: 'Skill Matrix Aggregation',
    sql: 'SELECT category, COUNT(*) AS total_items, STRING_AGG(item, \', \') AS items FROM skills GROUP BY category ORDER BY total_items DESC;'
  },
  {
    id: 'certs',
    label: 'Certifications Log',
    sql: 'SELECT title, issuer, date, credential_id FROM certificates ORDER BY date DESC;'
  },
  {
    id: 'telemetry',
    label: 'Realtime Pipeline Telemetry',
    sql: 'SELECT node_id, status, throughput_gb_sec, latency_p99_ms FROM pipeline_telemetry WHERE status = \'OPTIMAL\' ORDER BY latency_p99_ms ASC;'
  }
];

export function InteractiveSqlWorkbench({ locale = 'en' }: SqlWorkbenchProps) {
  const isID = locale === 'id';
  const resumeData = isID ? resumeDataID : resumeDataEN;

  const [activeDialect, setActiveDialect] = useState<'duckdb' | 'postgres' | 'snowflake' | 'bigquery'>('duckdb');
  const [currentSql, setCurrentSql] = useState<string>(PRESET_QUERIES[0].sql);
  const [executing, setExecuting] = useState<boolean>(false);
  const [queryMetrics, setQueryMetrics] = useState<{ executionMs: number; rowsScanned: number; memoryKb: number } | null>({
    executionMs: 1.14,
    rowsScanned: 1250,
    memoryKb: 48
  });

  const [activeTab, setActiveTab] = useState<'results' | 'plan'>('results');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Derive tabular results based on query key matching
  const getQueryResult = () => {
    const queryLower = currentSql.toLowerCase();
    if (queryLower.includes('experience')) {
      return resumeData.work.map(w => ({
        role: w.role,
        company: w.company,
        tech_stack: w.tech.slice(0, 4).join(', ')
      }));
    }
    if (queryLower.includes('skills')) {
      return [
        { category: 'Languages', total_items: resumeData.skills.languages.length, items: resumeData.skills.languages.join(', ') },
        { category: 'Platforms', total_items: resumeData.skills.platforms.length, items: resumeData.skills.platforms.join(', ') },
        { category: 'Infrastructure', total_items: resumeData.skills.infrastructure.length, items: resumeData.skills.infrastructure.join(', ') },
        { category: 'IDE/Tools', total_items: (resumeData.skills.ides || []).length, items: (resumeData.skills.ides || []).join(', ') }
      ];
    }
    if (queryLower.includes('certificates')) {
      return (resumeData.certificates || []).map(c => ({
        title: c.title,
        issuer: c.issuer,
        date: c.date,
        credential_id: c.credential_id || 'N/A'
      }));
    }
    // Default telemetry mock data
    return [
      { node_id: 'kafka-ingest-01', status: 'OPTIMAL', throughput_gb_sec: '4.8 GB/s', latency_p99_ms: '2.1 ms' },
      { node_id: 'spark-transform-04', status: 'OPTIMAL', throughput_gb_sec: '12.2 GB/s', latency_p99_ms: '14.8 ms' },
      { node_id: 'duckdb-vector-02', status: 'OPTIMAL', throughput_gb_sec: '18.4 GB/s', latency_p99_ms: '0.8 ms' },
      { node_id: 'clickhouse-olap-01', status: 'OPTIMAL', throughput_gb_sec: '22.0 GB/s', latency_p99_ms: '4.2 ms' }
    ];
  };

  const results = getQueryResult();

  const handleRunQuery = () => {
    soundEngine.playSqlExecute();
    setExecuting(true);
    setTimeout(() => {
      setQueryMetrics({
        executionMs: parseFloat((Math.random() * 1.5 + 0.4).toFixed(2)),
        rowsScanned: Math.floor(Math.random() * 5000 + 1200),
        memoryKb: Math.floor(Math.random() * 120 + 32)
      });
      setExecuting(false);
    }, 300);
  };

  const handleDownloadCsv = () => {
    soundEngine.playChime();
    const headers = Object.keys(results[0] || {}).join(',');
    const rows = results.map(row => Object.values(row).map(v => `"${v}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nichsedge_query_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="bg-bg-1 border border-border-subtle rounded-md p-5 font-mono shadow-2xl my-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Database size={15} className="text-accent" />
          <h3 className="text-xs uppercase tracking-widest font-bold text-text-0">
            {isID ? 'Workbench SQL & Simulator Query DuckDB' : 'DuckDB Vectorized SQL Workbench'}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[9px] text-text-3">
          <div className="flex bg-bg-2 border border-border-subtle rounded p-0.5">
            {(['duckdb', 'postgres', 'snowflake', 'bigquery'] as const).map(d => (
              <button
                key={d}
                onClick={() => {
                  soundEngine.playClick(800);
                  setActiveDialect(d);
                }}
                className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider transition-colors cursor-pointer ${
                  activeDialect === d ? 'bg-accent text-bg font-bold' : 'text-text-3 hover:text-text-1'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>ENGINE: {activeDialect.toUpperCase()}_WASM</span>
        </div>
      </div>

      {/* Query Presets */}
      <div className="flex flex-wrap gap-2 my-4">
        {PRESET_QUERIES.map(q => (
          <button
            key={q.id}
            onClick={() => {
              soundEngine.playClick(750);
              setCurrentSql(q.sql);
            }}
            className={`px-2.5 py-1 text-[9px] uppercase tracking-wider rounded border transition-all cursor-pointer ${
              currentSql === q.sql
                ? 'bg-accent/20 border-accent text-accent font-bold'
                : 'bg-bg border-border-subtle text-text-3 hover:border-accent/40 hover:text-text-0'
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Interactive SQL Editor Console */}
      <div className="relative bg-bg border border-border-subtle rounded overflow-hidden mb-4">
        <div className="flex justify-between items-center bg-bg-1/80 px-3 py-1.5 border-b border-border-subtle text-[9px] text-text-3">
          <div className="flex items-center gap-1.5">
            <Code size={11} className="text-accent" />
            <span>SQL_CONSOLE.sql</span>
          </div>
          <span>UTF-8</span>
        </div>
        <textarea
          value={currentSql}
          onChange={(e) => setCurrentSql(e.target.value)}
          rows={3}
          className="w-full bg-bg text-text-1 p-3 text-[11px] font-mono leading-relaxed focus:outline-none resize-none selection:bg-accent/30"
          spellCheck={false}
        />
        <div className="flex justify-between items-center px-3 py-2 border-t border-border-subtle/50 bg-bg-1/40">
          <div className="text-[9px] text-text-3">
            {isID ? 'Tekan [Jalankan Query] untuk komputasi tervektorisasi.' : 'Press [Run Query] for vectorized execution.'}
          </div>
          <button
            onClick={handleRunQuery}
            disabled={executing}
            className="px-4 py-1.5 bg-accent text-bg text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white hover:shadow-[0_0_15px_rgba(0,225,207,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Play size={12} fill="currentColor" className={executing ? 'animate-spin' : ''} />
            <span>{executing ? (isID ? 'Mengeksekusi...' : 'Executing...') : (isID ? 'Jalankan Query' : 'Run Query')}</span>
          </button>
        </div>
      </div>

      {/* Execution Telemetry Metrics */}
      {queryMetrics && (
        <div className="grid grid-cols-3 gap-3 mb-4 bg-bg/50 border border-border-subtle/60 p-2.5 rounded text-[9px]">
          <div>
            <span className="text-text-3">{isID ? 'Waktu Eksekusi:' : 'Execution Time:'}</span>
            <span className="text-accent font-bold ml-1.5">{queryMetrics.executionMs} ms</span>
          </div>
          <div>
            <span className="text-text-3">{isID ? 'Baris Di-Scan:' : 'Rows Scanned:'}</span>
            <span className="text-text-0 font-bold ml-1.5">{queryMetrics.rowsScanned.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-text-3">{isID ? 'Alokasi RAM:' : 'Memory Allocated:'}</span>
            <span className="text-text-0 font-bold ml-1.5">{queryMetrics.memoryKb} KB</span>
          </div>
        </div>
      )}

      {/* Output Results Table & Plan */}
      <div className="border border-border-subtle rounded overflow-hidden bg-bg">
        <div className="flex justify-between items-center px-3 py-2 bg-bg-1 border-b border-border-subtle">
          <div className="flex gap-3 text-[9px] uppercase tracking-wider font-bold">
            <button
              onClick={() => setActiveTab('results')}
              className={`cursor-pointer pb-0.5 border-b-2 transition-colors ${
                activeTab === 'results' ? 'border-accent text-accent' : 'border-transparent text-text-3 hover:text-text-0'
              }`}
            >
              {isID ? 'Hasil Output Query' : 'Query Output Results'} ({results.length})
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`cursor-pointer pb-0.5 border-b-2 transition-colors ${
                activeTab === 'plan' ? 'border-accent text-accent' : 'border-transparent text-text-3 hover:text-text-0'
              }`}
            >
              {isID ? 'Rencana Eksekusi (EXPLAIN)' : 'Execution Plan (EXPLAIN)'}
            </button>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-text-3 hover:text-accent border border-border-subtle hover:border-accent/40 px-2 py-0.5 rounded cursor-pointer transition-all"
          >
            {downloadSuccess ? <Check size={10} className="text-accent" /> : <Download size={10} />}
            <span>{downloadSuccess ? 'Downloaded!' : 'CSV Export'}</span>
          </button>
        </div>

        {activeTab === 'results' ? (
          <div className="overflow-x-auto max-h-[220px]">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-bg-1/60 border-b border-border-subtle/80 text-text-3 uppercase tracking-wider text-[8px]">
                  {Object.keys(results[0] || {}).map((col) => (
                    <th key={col} className="p-2 font-bold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <tr key={idx} className="border-b border-border-subtle/40 hover:bg-accent/5 transition-colors">
                    {Object.values(row).map((val, cellIdx) => (
                      <td key={cellIdx} className="p-2 text-text-2 font-mono whitespace-nowrap">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-3 text-[9px] space-y-2 text-text-2 bg-bg/80">
            <div className="text-accent uppercase font-bold tracking-widest text-[8px]">
              PHYSICAL EXECUTION PLAN (DUCKDB VECTOR ENGINE)
            </div>
            <div className="p-2 bg-bg-1 border border-border-subtle/60 rounded space-y-1">
              <div>└─ 📊 AGGREGATE (HashGroupBy)</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;└─ 🔍 FILTER (ScanPredicate: active = true)</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ 🚀 VECTOR_SCAN (ChunkSize: 2048, ColumnPruning: true)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
