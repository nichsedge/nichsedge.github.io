'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GitBranch, Database, ShieldAlert, Code2, Layers } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface LineageNode {
  id: string;
  name: string;
  layer: 'bronze' | 'silver' | 'gold' | 'consumption';
  type: string;
  columns: string[];
  upstream: string[];
  sqlSnippet: string;
}

const LINEAGE_DATA: LineageNode[] = [
  // Bronze
  {
    id: 'raw_events',
    name: 'raw_events',
    layer: 'bronze',
    type: 'Kafka Sink (S3)',
    columns: ['user_id', 'event_name', 'payload', 'ingest_time'],
    upstream: [],
    sqlSnippet: 'CREATE EXTERNAL TABLE bronze.raw_events (\n  user_id STRING,\n  event_name STRING,\n  payload SUPER,\n  ingest_time TIMESTAMP\n) LOCATION "s3://lakehouse/bronze/raw_events/";'
  },
  {
    id: 'cdc_users',
    name: 'cdc_users',
    layer: 'bronze',
    type: 'Postgres CDC (Debezium)',
    columns: ['user_id', 'email', 'country_code', 'updated_at'],
    upstream: [],
    sqlSnippet: 'CREATE EXTERNAL TABLE bronze.cdc_users (\n  user_id STRING,\n  email STRING,\n  country_code STRING,\n  updated_at TIMESTAMP\n) LOCATION "s3://lakehouse/bronze/cdc_users/";'
  },

  // Silver
  {
    id: 'dim_users',
    name: 'dim_users',
    layer: 'silver',
    type: 'Iceberg Silver Table',
    columns: ['user_id', 'hashed_email', 'country', 'is_active'],
    upstream: ['cdc_users'],
    sqlSnippet: 'CREATE TABLE silver.dim_users AS\nSELECT \n  user_id,\n  sha256(email) AS hashed_email,\n  UPPER(country_code) AS country,\n  TRUE AS is_active\nFROM bronze.cdc_users;'
  },
  {
    id: 'fct_events',
    name: 'fct_events',
    layer: 'silver',
    type: 'Iceberg Silver Table',
    columns: ['event_id', 'user_id', 'action', 'event_date'],
    upstream: ['raw_events'],
    sqlSnippet: 'CREATE TABLE silver.fct_events AS\nSELECT\n  uuid() AS event_id,\n  user_id,\n  event_name AS action,\n  DATE(ingest_time) AS event_date\nFROM bronze.raw_events;'
  },

  // Gold
  {
    id: 'mart_retention',
    name: 'mart_user_retention',
    layer: 'gold',
    type: 'Snowflake Mart',
    columns: ['user_id', 'retention_score', 'active_days_30d'],
    upstream: ['dim_users', 'fct_events'],
    sqlSnippet: 'CREATE TABLE gold.mart_user_retention AS\nSELECT \n  u.user_id,\n  COUNT(DISTINCT e.event_date) / 30.0 AS retention_score,\n  COUNT(DISTINCT e.event_date) AS active_days_30d\nFROM silver.dim_users u\nJOIN silver.fct_events e ON u.user_id = e.user_id\nGROUP BY 1;'
  },

  // Consumption
  {
    id: 'looker_dashboard',
    name: 'Executive Churn Dashboard',
    layer: 'consumption',
    type: 'Looker / Tableau',
    columns: ['User Churn Rate', 'Retention Cohorts', 'MAU Metrics'],
    upstream: ['mart_retention'],
    sqlSnippet: '-- Connected to gold.mart_user_retention via BI Engine driver'
  },
  {
    id: 'ml_feature_store',
    name: 'ML Feature Store (Feast)',
    layer: 'consumption',
    type: 'Feast ML Store',
    columns: ['user_retention_score_30d', 'is_churn_risk'],
    upstream: ['mart_retention'],
    sqlSnippet: 'feature_view:\n  name: user_churn_features\n  entities: [user_id]\n  features:\n    - name: retention_score\n      schema: Float64'
  }
];

export function DataLineageGraph({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('mart_retention');
  const [selectedColumn, setSelectedColumn] = useState<string>('user_id');
  const [simulatingBreakingChange, setSimulatingBreakingChange] = useState<boolean>(false);

  const selectedNode = LINEAGE_DATA.find(n => n.id === selectedNodeId) || LINEAGE_DATA[4];

  // Calculate upstream and downstream nodes for selected node
  const getUpstreamNodes = (nodeId: string): string[] => {
    const node = LINEAGE_DATA.find(n => n.id === nodeId);
    if (!node) return [];
    let direct = [...node.upstream];
    node.upstream.forEach(upId => {
      direct = [...direct, ...getUpstreamNodes(upId)];
    });
    return Array.from(new Set(direct));
  };

  const getDownstreamNodes = (nodeId: string): string[] => {
    const down = LINEAGE_DATA.filter(n => n.upstream.includes(nodeId)).map(n => n.id);
    let allDown = [...down];
    down.forEach(dId => {
      allDown = [...allDown, ...getDownstreamNodes(dId)];
    });
    return Array.from(new Set(allDown));
  };

  const upstreamIds = getUpstreamNodes(selectedNodeId);
  const downstreamIds = getDownstreamNodes(selectedNodeId);

  const handleSelectNode = (node: LineageNode) => {
    soundEngine.playNodeConnect();
    setSelectedNodeId(node.id);
    if (node.columns.length > 0) {
      setSelectedColumn(node.columns[0]);
    }
  };

  const handleSimulateBreakingChange = () => {
    soundEngine.playAlertSound();
    setSimulatingBreakingChange(prev => !prev);
  };

  const layers: Array<{ id: 'bronze' | 'silver' | 'gold' | 'consumption'; title: string; color: string }> = [
    { id: 'bronze', title: locale === 'id' ? 'Layer Bronze (Mentah)' : 'Bronze (Raw Ingest)', color: '#f59e0b' },
    { id: 'silver', title: locale === 'id' ? 'Layer Silver (Bersih)' : 'Silver (Clean & Transformed)', color: '#00e1cf' },
    { id: 'gold', title: locale === 'id' ? 'Layer Gold (Mart)' : 'Gold (Data Marts)', color: '#a78bfa' },
    { id: 'consumption', title: locale === 'id' ? 'Layer Konsumsi (BI/ML)' : 'Consumption (BI & ML)', color: '#3b82f6' }
  ];

  return (
    <div className="bg-bg-1 border border-border-subtle p-6 rounded-lg font-mono shadow-xl relative overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-accent" />
            <h3 className="text-xs uppercase tracking-widest text-accent font-bold">
              {locale === 'id' ? 'Visualizer Silsilah Data (Column-Level Lineage)' : 'Column-Level Data Lineage & Impact Analyzer'}
            </h3>
          </div>
          <p className="text-[11px] text-text-3 font-sans mt-1">
            {locale === 'id'
              ? 'Lacak alur data end-to-end dari sumber mentah hingga mart analitik & model ML, serta simulasi dampak perubahan skema.'
              : 'End-to-end lineage tracing from raw ingestion to analytics gold marts & ML feature stores with breaking change simulation.'}
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleSimulateBreakingChange}
          className={`px-3 py-1.5 border text-[10px] font-bold flex items-center gap-2 transition-all ${
            simulatingBreakingChange
              ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
              : 'bg-bg-2 border-border-subtle text-text-2 hover:border-red-400 hover:text-red-400'
          }`}
        >
          <ShieldAlert size={14} />
          {simulatingBreakingChange
            ? (locale === 'id' ? 'SIMULASI ANOMALI SKEMA: AKTIF' : 'SIMULATE COLUMN DEPRECATION: ACTIVE')
            : (locale === 'id' ? 'SIMULASI ANOMALI SKEMA' : 'TEST SCHEMA BREAKING CHANGE')}
        </button>
      </div>

      {/* Lineage Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {layers.map(l => {
          const nodesInLayer = LINEAGE_DATA.filter(n => n.layer === l.id);
          return (
            <div key={l.id} className="bg-[#09090b] border border-border-subtle p-3 rounded-md">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border-subtle/50">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-[10px] uppercase font-bold text-text-2 tracking-wider">{l.title}</span>
              </div>

              <div className="space-y-3">
                {nodesInLayer.map(node => {
                  const isSelected = node.id === selectedNodeId;
                  const isUpstream = upstreamIds.includes(node.id);
                  const isDownstream = downstreamIds.includes(node.id);
                  const isBroken = simulatingBreakingChange && (isSelected || isDownstream);

                  return (
                    <motion.div
                      key={node.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectNode(node)}
                      className={`p-3 border rounded-md cursor-pointer transition-all relative ${
                        isBroken
                          ? 'border-red-500/80 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                          : isSelected
                          ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(0,225,207,0.2)]'
                          : isUpstream
                          ? 'border-emerald-500/50 bg-emerald-950/10'
                          : isDownstream
                          ? 'border-blue-500/50 bg-blue-950/10'
                          : 'border-border-subtle bg-bg-2 hover:border-text-3'
                      }`}
                    >
                      {/* Status indicator badges */}
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] text-text-3 font-sans uppercase tracking-wider">{node.type}</span>
                        {isBroken ? (
                          <span className="text-[8px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded">BREAKING</span>
                        ) : isUpstream ? (
                          <span className="text-[8px] text-emerald-400 font-bold">UPSTREAM</span>
                        ) : isDownstream ? (
                          <span className="text-[8px] text-blue-400 font-bold">DOWNSTREAM</span>
                        ) : isSelected ? (
                          <span className="text-[8px] text-accent font-bold">FOCUS</span>
                        ) : null}
                      </div>

                      <div className="text-xs font-bold text-text-0 mb-2 flex items-center gap-1.5">
                        <Database size={12} className={isSelected ? 'text-accent' : 'text-text-3'} />
                        <span>{node.name}</span>
                      </div>

                      {/* Column list tags */}
                      <div className="flex flex-wrap gap-1">
                        {node.columns.map(col => {
                          const isColSelected = col === selectedColumn && isSelected;
                          return (
                            <span
                              key={col}
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedColumn(col);
                                handleSelectNode(node);
                              }}
                              className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                                isColSelected
                                  ? 'bg-accent text-bg font-bold border-accent'
                                  : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                              }`}
                            >
                              {col}
                            </span>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details & Blast Radius SQL Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Node Metadata & Impact Summary */}
        <div className="bg-bg-2 p-4 border border-border-subtle rounded-md md:col-span-1">
          <div className="text-[10px] text-text-3 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers size={12} className="text-accent" /> {locale === 'id' ? 'Detail Simpul' : 'Node Inspector'}
          </div>

          <div className="text-sm font-bold text-text-0 mb-1">{selectedNode.name}</div>
          <div className="text-[10px] text-accent mb-4">{selectedNode.type}</div>

          <div className="space-y-2 text-[10px] border-t border-border-subtle pt-3">
            <div className="flex justify-between">
              <span className="text-text-3">{locale === 'id' ? 'Simpul Upstream:' : 'Direct Upstream:'}</span>
              <span className="text-emerald-400 font-bold">{selectedNode.upstream.length > 0 ? selectedNode.upstream.join(', ') : 'None (Ingestion Source)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-3">{locale === 'id' ? 'Dampak Downstream:' : 'Blast Radius Impact:'}</span>
              <span className="text-blue-400 font-bold">{downstreamIds.length} downstream node(s)</span>
            </div>
          </div>

          {simulatingBreakingChange && (
            <div className="mt-4 p-3 bg-red-950/40 border border-red-500/50 rounded-md text-[10px] text-red-300">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-red-400">
                <ShieldAlert size={14} /> {locale === 'id' ? 'Laporan Anomali Skema' : 'Schema Deprecation Alert'}
              </div>
              {locale === 'id'
                ? `Perubahan nama atau penghapusan kolom "${selectedColumn}" di ${selectedNode.name} akan merusak ${downstreamIds.length} pipeline downstream & dashboard!`
                : `Deprecating column "${selectedColumn}" in ${selectedNode.name} will break ${downstreamIds.length} downstream pipeline(s) & dashboards!`}
            </div>
          )}
        </div>

        {/* SQL & Transformation Definition */}
        <div className="bg-bg-2 p-4 border border-border-subtle rounded-md md:col-span-2 relative">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[10px] text-text-3 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 size={12} className="text-accent" /> {locale === 'id' ? 'Definisi DDL / Dbt Model SQL' : 'DDL & Transformation Definition'}
            </div>
            <span className="text-[9px] text-text-3 font-mono">SQL / dbt</span>
          </div>

          <pre className="p-3 bg-[#08080a] border border-border-subtle text-[11px] font-mono text-emerald-400 rounded-md overflow-x-auto leading-relaxed max-h-[160px]">
            {selectedNode.sqlSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
