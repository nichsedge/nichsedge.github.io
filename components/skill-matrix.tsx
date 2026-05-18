'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import resumeData from '@/data/cv.json';

export function SkillMatrix() {
  const data = [
    { subject: 'Distributed Sys', A: 95, fullMark: 100 },
    { subject: 'Stream processing', A: 90, fullMark: 100 },
    { subject: 'Cloud Infra', A: 85, fullMark: 100 },
    { subject: 'Data Modeling', A: 95, fullMark: 100 },
    { subject: 'MLOps', A: 70, fullMark: 100 },
    { subject: 'Automation', A: 88, fullMark: 100 },
  ];

  return (
    <div className="h-[300px] w-full bg-bg-1/20 border border-border-subtle rounded-sm p-4 group">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[9px] text-accent uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          Neural_Competency_Index
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#71717a', fontSize: 9, fontFamily: 'var(--font-mono)' }} 
          />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#00e1cf"
            fill="#00e1cf"
            fillOpacity={0.15}
            isAnimationActive={true}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[8px] text-text-3 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
         <span>STABILITY_NOMINAL</span>
         <span>INDEX_v2.0</span>
      </div>
    </div>
  );
}
