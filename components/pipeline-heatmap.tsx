'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export function PipelineHeatmap() {
  // Initialize to a stable default status (all empty) to prevent hydration mismatches
  const [days, setDays] = useState<{ id: number; status: string }[]>(() =>
    Array.from({ length: 90 }, (_, i) => ({ id: i, status: 'empty' }))
  );

  useEffect(() => {
    // Generate mock contribution data on client mount
    const generatedDays = Array.from({ length: 90 }, (_, i) => {
      // Fake "pipeline health" - mostly good, some warning (yellow), few failures (red)
      const val = Math.random();
      let status = 'success'; // 80%
      if (val > 0.8 && val <= 0.95) status = 'warning'; // 15%
      if (val > 0.95) status = 'error'; // 5%
      if (Math.random() > 0.9) status = 'empty'; // 10% no runs
      return { id: i, status };
    });
    setDays(generatedDays);
  }, []);

  const getColor = (status: string) => {
    switch(status) {
      case 'success': return 'bg-accent/80 border-accent';
      case 'warning': return 'bg-yellow-500/80 border-yellow-500';
      case 'error': return 'bg-red-500/80 border-red-500';
      default: return 'bg-bg border-border-subtle';
    }
  };

  return (
    <div className="bg-bg-1 border border-border-subtle p-6 rounded-sm w-full font-mono">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] text-text-0 uppercase tracking-widest flex items-center gap-2 font-bold">
          <Activity size={12} className="text-accent" /> PIPELINE_UPTIME_MATRIX (90d)
        </h3>
        <div className="text-[9px] text-text-3 flex items-center gap-3">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-accent" /> 99.9% </div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500" /> Retry </div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500" /> Fail </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-hidden">
        {/* We group into columns of 5 to simulate a simplified github grid */}
        {Array.from({ length: 18 }).map((_, col) => (
          <div key={col} className="flex flex-col gap-1">
            {Array.from({ length: 5 }).map((_, row) => {
              const day = days[col * 5 + row];
              if (!day) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (col * 5 + row) * 0.005 }}
                  viewport={{ once: true }}
                  key={day.id}
                  className={`w-3 md:w-4 h-3 md:h-4 border rounded-[1px] ${getColor(day.status)} hover:ring-1 hover:ring-text-0 transition-all`}
                  title={`Status: ${day.status.toUpperCase()}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[9px] text-text-3 uppercase tracking-tighter">
        <span>T-90 Days</span>
        <span>Today</span>
      </div>
    </div>
  );
}
