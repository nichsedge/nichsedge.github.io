'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Database, Cog, Layout, Terminal, Server } from 'lucide-react';

export function CareerPipeline({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const steps = [
    {
      id: 'source',
      label: locale === 'id' ? 'Sumber Data Mentah' : 'Raw Data Sources',
      icon: <Database size={16} />,
      color: 'text-text-3',
      items: ['PostgreSQL', 'Oracle', 'Hive', 'Web Scraping']
    },
    {
      id: 'transform',
      label: locale === 'id' ? 'Mesin Transformasi' : 'Transformation Engine',
      icon: <Cog size={16} />,
      color: 'text-accent',
      items: ['dbt', 'Python', 'Apache Spark', 'SQL']
    },
    {
      id: 'orchestrate',
      label: locale === 'id' ? 'Orkestrasi' : 'Orchestration',
      icon: <Server size={16} />,
      color: 'text-text-2',
      items: ['Apache Airflow', 'Cron Jobs', 'Bash Scripts']
    },
    {
      id: 'output',
      label: locale === 'id' ? 'Penyimpanan Analitis' : 'Analytical Storage',
      icon: <Layout size={16} />,
      color: 'text-accent',
      items: ['BigQuery', 'Snowflake', 'Dashboards']
    }
  ];

  return (
    <div className="w-full py-8 overflow-x-auto">
      <div className="min-w-[800px] flex items-start justify-between relative px-4">
        <div className="absolute top-[40px] left-0 right-0 h-[1px] bg-border-subtle -z-10" />
        
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center gap-4 w-1/4 relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`w-12 h-12 rounded-sm border border-border-subtle bg-bg-1 flex items-center justify-center ${step.color} relative z-10 shadow-sm`}
            >
              {step.icon}
              {idx < steps.length - 1 && (
                <div className="absolute top-1/2 -right-full w-full h-[1px] bg-gradient-to-r from-border-subtle to-transparent -z-10" />
              )}
            </motion.div>

            <div className="text-center group">
              <h4 className="font-mono text-[10px] text-text-0 uppercase tracking-widest mb-2 font-bold">{step.label}</h4>
              <div className="flex flex-wrap justify-center gap-1.5">
                {step.items.map(item => (
                  <span key={item} className="px-1.5 py-0.5 bg-bg-1 border border-border-subtle text-[9px] text-text-3 font-mono rounded-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute -top-6 font-mono text-[9px] text-text-3 opacity-30">
              0{idx + 1}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 px-4 py-3 bg-accent/5 border border-dashed border-accent/20 rounded-sm">
        <p className="font-mono text-[10px] text-accent flex items-center gap-2">
          <Terminal size={12} />
          <span>{locale === 'id' ? 'STATUS_SISTEM: OK' : 'SYSTEM_STATUS: OK'}</span>
          <span className="opacity-40">|</span>
          <span>LATENCY: 14ms</span>
          <span className="opacity-40">|</span>
          <span className="animate-pulse">● {locale === 'id' ? 'PIPELINE_AKTIF' : 'PIPELINE_ACTIVE'}</span>
        </p>
      </div>
    </div>
  );
}
