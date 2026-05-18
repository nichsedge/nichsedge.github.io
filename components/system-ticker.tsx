'use client';
import React from 'react';

const LOGS = [
  "INGEST: Kafka Topic 'transaction_events' offset 892314",
  "TRANSFORM: dbt run 'core_models' success in 24.3s",
  "STORAGE: BigQuery partition '2026-05-16' optimized",
  "ALERT: Anomaly detected in 'payment_gateway_latency'. Resolving...",
  "SYNC: Postgres WAL streaming to Data Lake active",
  "COMPUTE: Spark Cluster scaled to 14 nodes",
  "ORCHESTRATION: Airflow DAG 'daily_finance_rollup' triggered",
  "SECURITY: IAM token refreshed for Service Account 0x48A...",
  "EXTRACT: MySQL binlog replication lag < 100ms",
  "SERVE: Redis cache hit ratio 98.4%",
];

export function SystemTicker() {
  const timestamp = React.useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-6 bg-bg border-t border-border-subtle flex items-center overflow-hidden z-50 text-[10px] font-mono whitespace-nowrap text-text-3 pointer-events-none shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
      <div className="flex animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
        {[...LOGS, ...LOGS, ...LOGS, ...LOGS].map((log, i) => (
          <span key={i} className="mx-8 flex items-center">
            <span className="text-accent/60 mr-2 opacity-60">[{timestamp}]</span>
            {log}
          </span>
        ))}
      </div>
    </div>
  );
}
