'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Cpu, 
  Users, 
  Thermometer, 
  BatteryCharging, 
  AlertTriangle, 
  Terminal, 
  Brain, 
  LineChart, 
  BookOpen, 
  Coffee,
  Flame,
  Activity,
  Radio,
  Wifi,
  VolumeX,
  Zap,
  Mic,
  Target
} from 'lucide-react';
import { TiltCard } from './tilt-card';
import { SubsystemId } from './three/human-runtime-scanner';

const HumanRuntimeScanner = dynamic(
  () => import('./three/human-runtime-scanner').then((m) => m.HumanRuntimeScanner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] sm:h-[440px] border border-border-subtle bg-bg-1/40 flex items-center justify-center font-mono text-[10px] text-text-3 uppercase tracking-widest">
        <span className="animate-pulse">INITIALIZING_3D_CYBERNETIC_SCANNER...</span>
      </div>
    ),
  }
);

export function HumanRuntime({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const isID = locale === 'id';
  const [activeSubsystem, setActiveSubsystem] = useState<SubsystemId>('overview');
  const [sensoryShieldEngaged, setSensoryShieldEngaged] = useState(false);

  return (
    <div className="space-y-6 pb-8">
      {/* 3D Cybernetic Bio-Scanner Viewport */}
      <HumanRuntimeScanner
        locale={locale}
        activeSubsystem={activeSubsystem}
        onSubsystemChange={setActiveSubsystem}
        sensoryShieldEngaged={sensoryShieldEngaged}
        onToggleSensoryShield={() => setSensoryShieldEngaged((prev) => !prev)}
      />

      {/* Specifications & Hardware Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 01 // Constraints & Environment */}
        <div 
          onClick={() => setActiveSubsystem('sensory')}
          className="cursor-pointer transition-all"
        >
          <TiltCard>
            <div className={`h-full border bg-bg-1/50 p-6 relative overflow-hidden group transition-colors flex flex-col justify-between ${
              activeSubsystem === 'sensory' ? 'border-accent shadow-[0_0_15px_rgba(0,225,207,0.1)]' : 'border-border-subtle'
            }`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Thermometer size={100} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold flex items-center gap-2">
                    <Thermometer size={14} /> {isID ? '01 // Lingkungan Runtime' : '01 // Runtime Environment'}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-accent/30 text-accent bg-accent/5 flex items-center gap-1">
                    <VolumeX size={10} /> 0 dB TARGET
                  </span>
                </div>

                <div className="space-y-3 text-[12px] font-mono leading-relaxed text-text-2 mb-5">
                  <div className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 font-bold">→</span>
                    <div>
                      <strong className="text-text-0">{isID ? 'Sensitivitas Konteks' : 'Context Sensitivity'}</strong>: {isID 
                        ? 'Memerlukan keheningan total untuk deep work. Berjalan optimal dalam mode terisolasi selama WiFi, perbekalan & AI token tercukupi.'
                        : 'Requires extreme silence for deep work. Runs optimally in isolated mode when food, WiFi, and AI tokens are supplied.'}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 font-bold">→</span>
                    <div>
                      <strong className="text-text-0">{isID ? 'Bioma Optimal' : 'Optimal Biomes'}</strong>: {isID
                        ? 'Alam kepadatan rendah (#0000FF Laut & #008000 Hutan) untuk mencegah cognitive throttle.'
                        : 'Low-density nature (#0000FF Ocean & #008000 Forest) to prevent cognitive throttling.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro-Illustration: Acoustic Waveform & Sensory Isolation */}
              <div className="border border-border-subtle/60 bg-black/40 rounded-sm p-3 font-mono">
                <div className="flex items-center justify-between text-[9px] text-text-3 uppercase tracking-widest mb-2">
                  <span className="flex items-center gap-1.5 text-accent">
                    <Radio size={11} className="animate-pulse" />
                    {isID ? 'ISOLASI AKUSTIK' : 'ACOUSTIC ISOLATION'}
                  </span>
                  <span className="text-text-3 font-mono">ACTIVE ATTENUATION</span>
                </div>
                
                {/* Visualizer bars */}
                <div className="h-9 flex items-end justify-between gap-[3px] px-1 py-1 bg-bg-0/60 rounded border border-border-subtle/30 overflow-hidden">
                  {[18, 28, 45, 20, 60, 35, 15, 75, 40, 22, 50, 30, 15, 65, 38, 20, 48, 25, 12, 35].map((val, idx) => (
                    <div 
                      key={idx}
                      className="flex-1 bg-accent/60 rounded-t-[1px] transition-all duration-300"
                      style={{ 
                        height: `${val}%`,
                        opacity: 0.35 + (idx % 3) * 0.25,
                        animation: `pulse 1.${(idx % 5) + 3}s infinite ease-in-out alternate`
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[8px] text-text-3 mt-1.5">
                  <span>FREQ: 20Hz - 20kHz</span>
                  <span className="text-accent font-bold">AMBIENT NOISE: DAMPENED</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* 02 // Fuel Requirements */}
        <div 
          onClick={() => setActiveSubsystem('fuel')}
          className="cursor-pointer transition-all"
        >
          <TiltCard>
            <div className={`h-full border bg-bg-1/50 p-6 relative overflow-hidden group transition-colors flex flex-col justify-between ${
              activeSubsystem === 'fuel' ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-border-subtle'
            }`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <BatteryCharging size={100} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold flex items-center gap-2">
                    <BatteryCharging size={14} /> {isID ? '02 // Protokol Bahan Bakar' : '02 // Fuel Protocols'}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-amber-500/30 text-amber-400 bg-amber-500/5 flex items-center gap-1">
                    <Zap size={10} /> UTILITARIAN
                  </span>
                </div>

                <div className="space-y-3 text-[12px] font-mono leading-relaxed text-text-2 mb-5">
                  <div className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 font-bold">→</span>
                    <div>
                      <strong className="text-text-0">{isID ? 'Nutrisi Fungsional' : 'Functional Nutrition'}</strong>: {isID
                        ? 'Prioritas efisiensi di atas rasa. Asupan hambar berprotein tinggi: oatmeal polos, ayam kukus/air-fryer, nasi putih & air.'
                        : 'Prioritizes metabolic efficiency over flavor. Bland, high-protein fuel: plain oats, unseasoned chicken, rice & water.'}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="text-amber-400 mt-0.5 shrink-0" size={13} />
                    <div>
                      <strong className="text-amber-400">{isID ? 'Inkompatibilitas Hardware' : 'Hardware Incompatibilities'}</strong>: {isID
                        ? 'Software menyukai Kopi & Sambal, namun hardware menolak keduanya (insomnia & gangguan lambung).'
                        : 'Software craves Coffee & Spice, but hardware rejects both (insomnia & GI distress).'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro-Illustration: Metabolic Fuel Gauge */}
              <div className="border border-border-subtle/60 bg-black/40 rounded-sm p-3 font-mono">
                <div className="flex items-center justify-between text-[9px] text-text-3 uppercase tracking-widest mb-2">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Activity size={11} className="animate-pulse" />
                    {isID ? 'STATUS METABOLISME' : 'METABOLIC STATUS'}
                  </span>
                  <span className="text-amber-400 font-bold">98% EFFICIENCY</span>
                </div>

                {/* Progress bars & badges */}
                <div className="space-y-2">
                  <div className="h-2 w-full bg-bg-0/80 rounded-full border border-border-subtle/40 overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-amber-500 via-accent to-emerald-400 w-[94%] rounded-full animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-text-3 bg-bg-0/60 px-2 py-1 rounded border border-border-subtle/30 min-w-0">
                      <Coffee size={11} className="text-amber-400 shrink-0" />
                      <span className="truncate">Caffeine: <span className="text-amber-400">Lock</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-text-3 bg-bg-0/60 px-2 py-1 rounded border border-border-subtle/30 min-w-0">
                      <Flame size={11} className="text-red-400 shrink-0" />
                      <span className="truncate">Capsaicin: <span className="text-red-400">Fault</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* 03 // Allocated Compute - Quad-Core */}
        <div 
          onClick={() => setActiveSubsystem('compute')}
          className="cursor-pointer transition-all"
        >
          <TiltCard>
            <div className={`h-full border bg-bg-1/50 p-6 relative overflow-hidden group transition-colors flex flex-col justify-between ${
              activeSubsystem === 'compute' ? 'border-accent shadow-[0_0_15px_rgba(0,225,207,0.1)]' : 'border-border-subtle'
            }`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Cpu size={100} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold flex items-center gap-2">
                    <Cpu size={14} /> {isID ? '03 // Alokasi Komputasi' : '03 // Allocated Compute'}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-accent/30 text-accent bg-accent/5">
                    QUAD-CORE SYNC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5 font-mono text-[11px]">
                  <div className="border border-border-subtle/70 bg-bg/50 p-2 rounded-sm flex items-start gap-2">
                    <Terminal size={13} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-text-0 font-bold block">Core 0 · Vibe Coding</span>
                      <span className="text-text-3 text-[10px] leading-tight block">
                        {isID ? 'AI orchestration & fast builds' : 'AI orchestration & rapid flow'}
                      </span>
                    </div>
                  </div>
                  <div className="border border-border-subtle/70 bg-bg/50 p-2 rounded-sm flex items-start gap-2">
                    <Brain size={13} className="text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-text-0 font-bold block">Core 1 · Applied Stoic</span>
                      <span className="text-text-3 text-[10px] leading-tight block">
                        {isID ? 'Stabilitas mental & low entropy' : 'Mental stability & zero panic'}
                      </span>
                    </div>
                  </div>
                  <div className="border border-border-subtle/70 bg-bg/50 p-2 rounded-sm flex items-start gap-2">
                    <LineChart size={13} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-text-0 font-bold block">Core 2 · Financials</span>
                      <span className="text-text-3 text-[10px] leading-tight block">
                        {isID ? 'Likuiditas & alokasi modal' : 'Liquidity & risk models'}
                      </span>
                    </div>
                  </div>
                  <div className="border border-border-subtle/70 bg-bg/50 p-2 rounded-sm flex items-start gap-2">
                    <BookOpen size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-text-0 font-bold block">Core 3 · Literature</span>
                      <span className="text-text-3 text-[10px] leading-tight block">
                        {isID ? 'Batch ingesti teks (450 WPM)' : 'High-rate text parsing (450 WPM)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro-Illustration: 4-Core Neural Activity Matrix */}
              <div className="border border-border-subtle/60 bg-black/40 rounded-sm p-3 font-mono">
                <div className="flex items-center justify-between text-[9px] text-text-3 uppercase tracking-widest mb-2">
                  <span className="flex items-center gap-1.5 text-accent">
                    <Activity size={11} className="animate-pulse" />
                    THREAD_ACTIVITY_MONITOR
                  </span>
                  <span className="text-text-3">PARALLEL EXEC</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {[
                    { label: 'C0', load: '88%', color: 'bg-accent', text: 'text-accent' },
                    { label: 'C1', load: '42%', color: 'bg-blue-400', text: 'text-blue-400' },
                    { label: 'C2', load: '65%', color: 'bg-amber-400', text: 'text-amber-400' },
                    { label: 'C3', load: '25%', color: 'bg-emerald-400', text: 'text-emerald-400' },
                  ].map((c) => (
                    <div key={c.label} className="bg-bg-0/60 p-1 sm:p-1.5 rounded border border-border-subtle/30 text-center">
                      <div className="flex justify-between text-[8px] text-text-3 mb-1">
                        <span>{c.label}</span>
                        <span className={c.text}>{c.load}</span>
                      </div>
                      <div className="h-1.5 bg-bg-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${c.color} rounded-full transition-all duration-500`}
                          style={{ width: c.load }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* 04 // Multiplayer Protocols */}
        <div 
          onClick={() => setActiveSubsystem('multiplayer')}
          className="cursor-pointer transition-all"
        >
          <TiltCard>
            <div className={`h-full border bg-bg-1/50 p-6 relative overflow-hidden group transition-colors flex flex-col justify-between ${
              activeSubsystem === 'multiplayer' ? 'border-accent shadow-[0_0_15px_rgba(0,225,207,0.1)]' : 'border-border-subtle'
            }`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Users size={100} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-accent text-[12px] uppercase tracking-widest font-bold flex items-center gap-2">
                    <Users size={14} /> {isID ? '04 // Protokol Multipemain' : '04 // Multiplayer Protocols'}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-accent/30 text-accent bg-accent/5 flex items-center gap-1">
                    <Wifi size={10} /> P2P HANDSHAKE
                  </span>
                </div>

                {/* 3 Illustrated Protocol Panels */}
                <div className="space-y-3 mb-5 font-mono">
                  {/* 1. Futsal: Kinetic Cardio & Sprint Mesh */}
                  <div className="border border-border-subtle/70 bg-bg/60 p-2.5 rounded-sm hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Activity size={12} className="text-emerald-400" />
                        <span className="text-text-0 text-[11px] font-bold">Futsal // Kinetic Flush</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase font-bold">
                        UDP MESH
                      </span>
                    </div>

                    {/* SVG Pitch & Sprint Trajectory Vector */}
                    <div className="my-1.5 overflow-hidden rounded border border-emerald-500/20 bg-emerald-950/20 p-2">
                      <div className="flex justify-between items-center text-[8px] font-mono text-emerald-400/80 mb-1">
                        <span className="font-bold">VO2 MAX: 165 BPM</span>
                        <span className="text-emerald-400 font-bold">SPRINT DISSIPATION</span>
                      </div>
                      <svg viewBox="0 0 280 26" className="w-full h-6" preserveAspectRatio="none">
                        {/* Court Pitch Schematic */}
                        <rect x="2" y="2" width="276" height="22" rx="2" fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth="1" />
                        <line x1="140" y1="2" x2="140" y2="24" stroke="rgba(52,211,153,0.2)" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="140" cy="13" r="6" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
                        <rect x="2" y="7" width="12" height="12" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
                        <rect x="266" y="7" width="12" height="12" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
                        {/* Dynamic Sprint Trajectory Vector */}
                        <path d="M 24 16 Q 90 4, 140 14 T 252 8" fill="none" stroke="rgba(52,211,153,0.85)" strokeWidth="1.5" strokeDasharray="3 3" />
                        <circle cx="252" cy="8" r="2.5" fill="#34d399" />
                      </svg>
                    </div>

                    <p className="text-[10px] text-text-3 leading-snug">
                      {isID
                        ? 'Interupsi kardio intensif; membersihkan cache stres mental & fragmentasi kognitif.'
                        : 'High-intensity cardio sprint; flushes mental stress cache & cognitive fragmentation.'}
                    </p>
                  </div>

                  {/* 2. Karaoke: Decibel Resonance & Harmonic Waves */}
                  <div className="border border-border-subtle/70 bg-bg/60 p-2.5 rounded-sm hover:border-blue-400/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Mic size={12} className="text-blue-400" />
                        <span className="text-text-0 text-[11px] font-bold">Karaoke // Acoustic Resonance</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 border border-blue-400/30 text-blue-400 bg-blue-500/10 uppercase font-bold">
                        HIGH BAUD
                      </span>
                    </div>

                    {/* SVG Radial Waves & Sound Spectrum */}
                    <div className="my-1.5 overflow-hidden rounded border border-blue-400/20 bg-blue-950/20 p-2">
                      <div className="flex justify-between items-center text-[8px] font-mono text-blue-400/80 mb-1">
                        <span className="font-bold">94 dB // 80Hz-1.1kHz</span>
                        <span className="text-blue-400 font-bold">DOPAMINE PEAK</span>
                      </div>
                      <svg viewBox="0 0 280 26" className="w-full h-6" preserveAspectRatio="none">
                        {/* Concentric acoustic ripples */}
                        <circle cx="28" cy="13" r="4" fill="none" stroke="rgba(96,165,250,0.8)" strokeWidth="1.2" />
                        <circle cx="28" cy="13" r="9" fill="none" stroke="rgba(96,165,250,0.4)" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="28" cy="13" r="14" fill="none" stroke="rgba(96,165,250,0.2)" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="28" cy="13" r="2" fill="#60a5fa" />
                        
                        {/* Sound Spectrum Frequency Bars */}
                        {[6, 12, 18, 22, 16, 10, 20, 18, 12, 16, 22, 14, 8, 18, 12].map((h, i) => (
                          <line 
                            key={i} 
                            x1={64 + i * 14} 
                            y1={13 - h / 2} 
                            x2={64 + i * 14} 
                            y2={13 + h / 2} 
                            stroke="rgba(96,165,250,0.75)" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                          />
                        ))}
                      </svg>
                    </div>

                    <p className="text-[10px] text-text-3 leading-snug">
                      {isID
                        ? 'Resonansi akustik multi-oktaf bersama peer cluster; memaksimalkan output dopamin.'
                        : 'Multi-octave acoustic resonance across peer cluster; maximizes social dopamine throughput.'}
                    </p>
                  </div>

                  {/* 3. Tennis: Trajectory Arc & Physics Curve */}
                  <div className="border border-border-subtle/70 bg-bg/60 p-2.5 rounded-sm hover:border-amber-400/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Target size={12} className="text-amber-400" />
                        <span className="text-text-0 text-[11px] font-bold">Tennis // Trajectory AI</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 border border-amber-400/30 text-amber-400 bg-amber-500/10 uppercase font-bold">
                        v0.1 BETA
                      </span>
                    </div>

                    {/* SVG Parabolic Arc & Ball Flight Physics */}
                    <div className="my-1.5 overflow-hidden rounded border border-amber-400/20 bg-amber-950/20 p-2">
                      <div className="flex justify-between items-center text-[8px] font-mono text-amber-400/80 mb-1">
                        <span className="font-bold">ACCURACY: 38%</span>
                        <span className="text-amber-400 font-bold">TOPSPIN CURVE</span>
                      </div>
                      <svg viewBox="0 0 280 26" className="w-full h-6" preserveAspectRatio="none">
                        {/* Baseline court */}
                        <line x1="6" y1="22" x2="274" y2="22" stroke="rgba(251,191,36,0.3)" strokeWidth="1" />
                        {/* Net */}
                        <line x1="140" y1="11" x2="140" y2="22" stroke="rgba(251,191,36,0.8)" strokeWidth="2" />
                        <rect x="138" y="10" width="4" height="2" fill="rgba(251,191,36,0.9)" />
                        {/* Parabolic Topspin Arc */}
                        <path d="M 20 20 Q 85 3, 140 9 T 248 20" fill="none" stroke="rgba(251,191,36,0.85)" strokeWidth="1.5" strokeDasharray="3 2" />
                        {/* Bounce point */}
                        <ellipse cx="248" cy="22" rx="4" ry="1" fill="none" stroke="rgba(251,191,36,0.6)" />
                        <circle cx="248" cy="19" r="2" fill="#fbbf24" />
                      </svg>
                    </div>

                    <p className="text-[10px] text-text-3 leading-snug">
                      {isID
                        ? 'Pelatihan model prediksi trayektori bola; sedang dalam tahap kalibrasi coaching awal.'
                        : 'Ball trajectory prediction model in training; undergoing early coaching calibration.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom: Unified P2P Mesh Ping / Handshake Status */}
              <div className="border border-border-subtle/60 bg-black/40 rounded-sm p-2.5 font-mono">
                <div className="flex items-center justify-between text-[9px] text-text-3 uppercase tracking-widest mb-1.5">
                  <span className="flex items-center gap-1.5 text-accent font-bold">
                    <Wifi size={11} className="animate-pulse shrink-0" />
                    {isID ? 'STATUS PEER-TO-PEER' : 'PEER-TO-PEER STATUS'}
                  </span>
                  <span className="text-emerald-400 font-bold text-[8px] sm:text-[9px]">3 PROTOCOLS LINKED</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-[8px] text-text-3">
                  <span>PACKET LOSS: TOLERATED</span>
                  <span className="text-text-2">LATENCY: &lt;15ms</span>
                  <span className="text-accent font-bold">SYNC: ACTIVE</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}

