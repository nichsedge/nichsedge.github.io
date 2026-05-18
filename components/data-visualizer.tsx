'use client';
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DataVisualizer({ data }: { data: any[] }) {
  // Try to automatically find a string key for X-Axis and a numeric key for Y-Axis
  const config = useMemo(() => {
    if (!data || data.length === 0) return null;
    const sample = data[0];
    
    let xKey = null;
    let yKey = null;

    for (const key of Object.keys(sample)) {
      if (typeof sample[key] === 'number' && key !== 'id') {
        yKey = key;
      } else if (typeof sample[key] === 'string' && key !== 'id') {
        xKey = key;
      }
    }

    if (!xKey) xKey = Object.keys(sample)[0];
    return { xKey, yKey };
  }, [data]);

  if (!data || data.length === 0 || !config || !config.yKey) {
    return (
      <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-text-3 uppercase tracking-widest opacity-50">
        Incompatible data for visualization
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(161, 161, 170, 0.1)" vertical={false} />
          <XAxis 
            dataKey={config.xKey} 
            stroke="#a1a1aa" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickMargin={10}
          />
          <YAxis 
            stroke="#a1a1aa" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickMargin={10}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0, 225, 207, 0.05)' }}
            contentStyle={{ 
              backgroundColor: '#09090b', 
              border: '1px solid #27272a',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#d4d4d8'
            }}
            itemStyle={{ color: '#00e1cf' }}
          />
          <Bar 
            dataKey={config.yKey} 
            fill="#00e1cf" 
            radius={[2, 2, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
