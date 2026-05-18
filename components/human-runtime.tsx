'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Users, Thermometer, BatteryCharging, AlertTriangle, Coffee, Terminal, Brain, LineChart, BookOpen, Activity, Mic, Circle } from 'lucide-react';
import { TiltCard } from './tilt-card';
import { NoiseCancellationWidget } from './noise-cancellation';

export function HumanRuntime() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
      {/* Constraints & Environment */}
      <TiltCard>
        <div className="h-full border border-border-subtle bg-bg-1/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Thermometer size={100} />
          </div>
          <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
            <Thermometer size={14} /> Runtime Environment
          </h3>
          
          <ul className="space-y-4 text-[12px] font-mono leading-relaxed text-text-2 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">→</span>
              <div>
                <strong className="text-text-0 block">I/O Hypersensitivity</strong>
                Open offices trigger immediate context-switching faults. Requires extreme silence for deep work and sleep (0dB target). Hybrid remote is tolerable. Can run indefinitely in isolated "hikikomori" mode if provisions (Food, WiFi, AI Tokens) are supplied.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">→</span>
              <div>
                <strong className="text-text-0 block">Preferred Biomes</strong>
                Low-density natural environments. Strongly aligned with hex codes <span className="text-blue-400">#0000FF (Ocean)</span> and <span className="text-green-500">#008000 (Forests)</span>.
              </div>
            </li>
          </ul>

          <NoiseCancellationWidget />
        </div>
      </TiltCard>

      {/* Fuel Requirements */}
      <TiltCard>
        <div className="h-full border border-border-subtle bg-bg-1/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BatteryCharging size={100} />
          </div>
          <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
            <BatteryCharging size={14} /> Fuel Intake Protocols
          </h3>
          
          <ul className="space-y-4 text-[12px] font-mono leading-relaxed text-text-2">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">→</span>
              <div>
                <strong className="text-text-0 block">Efficiency &gt; Flavor</strong>
                Extreme utilitarian approach to energy consumption. Perfectly content with bland, highly nutritious inputs: unflavored oatmeal, raw veg, zero-seasoning air-fried chicken, plain rice, and water.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-500 mt-0.5 shrink-0" size={14} />
              <div>
                <strong className="text-yellow-500 block">Known Hardware Incompatibilities</strong>
                Software loves Coffee and Sambal. Hardware actively rejects both. <br/>
                - <span className="text-text-3">Caffeine.exe</span>: Causes severe resource locking (Insomnia until 02:00 if ingested at 09:00).<br/>
                - <span className="text-text-3">Capsaicin.dll</span>: Frequently triggers internal system faults (Stomachache).
              </div>
            </li>
          </ul>
        </div>
      </TiltCard>

      {/* Allocated Compute */}
      <TiltCard>
        <div className="h-full border border-border-subtle bg-bg-1/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Cpu size={100} />
          </div>
          <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
            <Cpu size={14} /> Allocated Compute
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Vibe Coding', icon: Terminal },
              { label: 'Applied Philosophy', icon: Brain },
              { label: 'Financial Systems', icon: LineChart },
              { label: 'Literature Ingestion', icon: BookOpen },
            ].map((item) => (
              <span key={item.label} className="px-2 py-1.5 bg-bg border border-border-subtle text-accent text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
                <item.icon size={12} /> {item.label}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>

      {/* Multiplayer Modes */}
      <TiltCard>
        <div className="h-full border border-border-subtle bg-bg-1/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={100} />
          </div>
          <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
            <Users size={14} /> Multiplayer Modes
          </h3>
          
          <div className="flex flex-wrap gap-3">
            <span className="px-2 py-1.5 bg-bg border border-border-subtle text-text-2 hover:text-accent transition-colors text-[10px] font-mono uppercase tracking-widest border-l-2 border-l-accent flex items-center gap-2">
              <Activity size={12} /> Futsal / Mini Soccer
            </span>
            <span className="px-2 py-1.5 bg-bg border border-border-subtle text-text-2 hover:text-accent transition-colors text-[10px] font-mono uppercase tracking-widest border-l-2 border-l-accent flex items-center gap-2">
              <Mic size={12} /> Karaoke Execution
            </span>
            <span className="px-2 py-1.5 bg-bg border border-border-subtle text-text-2 hover:text-accent transition-colors text-[10px] font-mono uppercase tracking-widest border-l-2 border-l-yellow-500 flex items-center gap-2">
              <Circle size={12} /> Tennis [v0.1 / Noob Build]
            </span>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
