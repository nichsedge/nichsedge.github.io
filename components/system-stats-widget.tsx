'use client';

import React from 'react';
import { Activity, Zap, HardDrive, Wifi } from 'lucide-react';
import { generateSystemStats, SystemStats as ISystemStats } from '@/lib/data-hub';

export function SystemStatsWidget() {
  const [stats, setStats] = React.useState<ISystemStats | null>(null);

  React.useEffect(() => {
    setStats(generateSystemStats());
    const interval = setInterval(() => {
      if (document.body.classList.contains('sensory-lockdown')) {
        return;
      }
      setStats(generateSystemStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="fixed top-[18px] right-6 2xl:right-auto 2xl:left-[calc(50%+384px)] z-50 hidden xl:flex items-center gap-4 bg-bg/40 backdrop-blur-md px-3.5 py-1.5 border border-border-subtle rounded-sm font-mono text-[9px] text-text-3 uppercase tracking-tighter select-none shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-1.5 font-bold tracking-widest text-accent/80 pr-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span>SYS_OK</span>
      </div>
      <div className="h-3 w-px bg-border-subtle/50" />
      <div className="flex items-center gap-1.5 group">
        <Activity size={10} className="text-accent group-hover:animate-pulse" />
        <span className="opacity-50">LATENCY:</span>
        <span className="text-accent">{stats.latency}</span>
      </div>
      <div className="h-3 w-px bg-border-subtle/50" />
      <div className="flex items-center gap-1.5 group">
        <Zap size={10} className="text-accent group-hover:scale-125 transition-transform" />
        <span className="opacity-50">THROUGHPUT:</span>
        <span className="text-accent">{stats.throughput}</span>
      </div>
      <div className="h-3 w-px bg-border-subtle/50 hidden 2xl:block" />
      <div className="flex items-center gap-1.5 group hidden 2xl:flex">
        <HardDrive size={10} className="text-accent" />
        <span className="opacity-50">LOAD:</span>
        <span className="text-accent">{stats.cpuLoad}</span>
      </div>
      <div className="h-3 w-px bg-border-subtle/50 hidden 2xl:block" />
      <div className="flex items-center gap-1.5 group hidden 2xl:flex">
        <Wifi size={10} className="text-accent" />
        <span className="opacity-50">NODES:</span>
        <span className="text-accent">{stats.activeNodes}</span>
      </div>
    </div>
  );
}
