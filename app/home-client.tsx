'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Github, Linkedin, Mail, Cpu, Play, GitBranch, Terminal, Zap, Server, Sparkles, Activity, Bot } from 'lucide-react';

import { Navbar } from '@/components/navbar';
import { SubNav } from '@/components/sub-nav';
import { GlitchText } from '@/components/glitch-text';
import { LiveArchitecture } from '@/components/live-architecture';
import { HumanRuntime } from '@/components/human-runtime';
import { DecryptedText } from '@/components/decrypted-text';
import { InteractiveGrid } from '@/components/interactive-grid';
import { DataOracle } from '@/components/data-oracle';
import { DataPipeline } from '@/components/data-pipeline';

// Dynamic imports for heavy visualizer/canvas components to optimize initial JS bundle size
const MatrixRain = dynamic(() => import('@/components/matrix-rain').then(m => m.MatrixRain), { ssr: false });
const KnowledgeGraph = dynamic(() => import('@/components/knowledge-graph').then(m => m.KnowledgeGraph), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full border border-border-subtle bg-bg-1 flex items-center justify-center font-mono text-xs text-text-3">
      [INITIALIZING_NEURAL_GRAPH...]
    </div>
  )
});
const DataLineageGraph = dynamic(() => import('@/components/data-lineage-graph').then(m => m.DataLineageGraph), { ssr: false });
const DataStreamSandbox = dynamic(() => import('@/components/data-stream-sandbox').then(m => m.DataStreamSandbox), { ssr: false });
const StreamSimulator = dynamic(() => import('@/components/stream-simulator').then(m => m.StreamSimulator), { ssr: false });
const LaserPipelineRouter = dynamic(() => import('@/components/three/laser-pipeline-router').then(m => m.LaserPipelineRouter), { ssr: false });
const ServerRackExplorer = dynamic(() => import('@/components/three/server-rack-explorer').then(m => m.ServerRackExplorer), { ssr: false });
const KnowledgeConstellation = dynamic(() => import('@/components/three/knowledge-constellation').then(m => m.KnowledgeConstellation), { ssr: false });

import resumeDataEN from '@/data/cv.json';
import resumeDataID from '@/data/cv_id.json';

const FADE_UP = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function Section({ children, label, id, isNSM }: { children: React.ReactNode, label: string, id: string, isNSM?: boolean }) {
  return (
    <section id={id} className={`py-20 md:py-28 px-6 md:px-10 border-b border-border-subtle group transition-all duration-700 relative z-10 ${isNSM ? 'bg-bg/60 backdrop-blur-sm' : ''}`}>
      <div className="flex items-center gap-4 mb-12">
        <h2 className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] font-bold">
          <DecryptedText text={label} speed={20} />
        </h2>
        <div className="h-[1px] flex-1 bg-border-subtle group-hover:bg-accent/30 transition-colors" />
      </div>
      {children}
    </section>
  );
}

export default function HomeClient({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const resumeData = locale === 'id' ? resumeDataID : resumeDataEN;
  const [isNSM, setIsNSM] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [activeArchTab, setActiveArchTab] = React.useState<'3d-laser' | '3d-cluster' | 'live-arch' | 'pipeline' | 'stream' | 'lineage' | 'sql' | 'oracle'>('3d-laser');
  const [skills3DView, setSkills3DView] = React.useState(true);

  const archTabs = [
    { id: '3d-laser', label: locale === 'id' ? 'Laser 3D' : '3D Laser', icon: Zap },
    { id: '3d-cluster', label: locale === 'id' ? 'Cluster 3D' : '3D Cluster', icon: Server },
    { id: 'live-arch', label: locale === 'id' ? 'Aliran Live' : 'Live Flow', icon: Activity },
    { id: 'pipeline', label: locale === 'id' ? 'DAG Canvas' : 'DAG Canvas', icon: Cpu },
    { id: 'stream', label: locale === 'id' ? 'Simulasi Stream' : 'Stream Sim', icon: Play },
    { id: 'lineage', label: locale === 'id' ? 'Silsilah Data' : 'Lineage DAG', icon: GitBranch },
    { id: 'sql', label: locale === 'id' ? 'Sandbox SQL' : 'SQL Sandbox', icon: Terminal },
    { id: 'oracle', label: locale === 'id' ? 'Oracle AI' : 'AI Oracle', icon: Bot },
  ] as const;

  React.useEffect(() => {
    if (isNSM) {
      setShowOverlay(true);
      const timer = setTimeout(() => setShowOverlay(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowOverlay(false);
    }
  }, [isNSM]);

  const subNavItems = locale === 'id' ? [
    { name: 'Jaringan_Saraf', href: '#skills' },
    { name: 'Arsitektur', href: '#architecture' },
    { name: 'Runtime', href: '#human-runtime' },
  ] : [
    { name: 'Neural_Net', href: '#skills' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Runtime', href: '#human-runtime' },
  ];

  React.useEffect(() => {
    let sequence = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      sequence += e.key.toLowerCase();
      if (sequence.length > 3) {
        sequence = sequence.slice(-3);
      }
      
      if (sequence === 'nsm') {
        setIsNSM(prev => !prev);
        sequence = '';
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen relative">
      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#09090b]/95 border-2 border-accent text-accent px-8 py-4 font-mono text-xs uppercase tracking-widest text-center shadow-[0_0_40px_rgba(0,225,207,0.3)] backdrop-blur-md rounded-sm"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span>{locale === 'id' ? '[ALERTI: NEURAL LINK TERSINKRONISASI]' : '[ALERT: NEURAL LINK SYNCHRONIZED]'}</span>
            </div>
            <div className="text-[9px] text-text-3 mt-1.5">{locale === 'id' ? 'gangguan interferensi matriks diaktifkan' : 'ambient matrix interference activated'}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <MatrixRain active={isNSM} />
      
      <Navbar isNSM={isNSM} toggleNSM={() => setIsNSM(!isNSM)} />
      <SubNav items={subNavItems} />
      
      {/* Hero */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 md:px-10 relative overflow-hidden group">
        <InteractiveGrid />
        
        {/* Subtle Cybernetic Background Compass / HUD Watermark */}
        <div className="absolute top-1/2 -right-16 -translate-y-1/2 opacity-[0.04] select-none pointer-events-none group-hover:opacity-[0.07] transition-all duration-1000">
          <Cpu size={500} strokeWidth={0.5} className={isNSM ? 'text-accent animate-pulse' : ''} />
        </div>
        
        <motion.div {...FADE_UP} className="relative z-20 max-w-[780px]">
          {/* Top Status & Mission Telemetry Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-text-3">
            <span className="flex items-center gap-2 px-2 sm:px-2.5 py-1 bg-bg-1/90 border border-border-subtle rounded-sm text-text-2 shadow-sm">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
              <span className="w-1.5 h-1.5 bg-accent rounded-full -ml-3.5" />
              <span>SYS_ID // ICHSANUL AMAL</span>
            </span>
            <span className="hidden sm:inline text-border-subtle">•</span>
            <span className="text-text-3">
              NODE: BANDUNG [-6.872°, 107.542°]
            </span>
            <span className="hidden sm:inline text-border-subtle">•</span>
            <button 
              onClick={() => setIsNSM(!isNSM)} 
              className="px-2 py-0.5 border border-accent/30 text-accent hover:bg-accent/10 transition-colors rounded-sm cursor-pointer"
            >
              {isNSM ? '[MATRIX: ACTIVE]' : '[SYNC NEURAL LINK]'}
            </button>
          </div>

          {/* High-Taste Futuristic Headline (Rock-solid Responsive) */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-text-0 leading-[1.15] mb-5 sm:mb-6 tracking-tight font-mono break-words">
            {locale === 'id' ? (
              <>
                <GlitchText text="Rekayasa Sistem Data Deterministik" />{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-teal-300 to-emerald-400">
                  & Integritas Zero-Entropy.
                </span>
              </>
            ) : (
              <>
                <GlitchText text="Architecting Deterministic Data Engines" />{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-teal-300 to-emerald-400">
                  & Zero-Entropy Pipelines.
                </span>
              </>
            )}
          </h1>

          {/* Authentic, Punchy Persona Description */}
          <p className="text-[13px] sm:text-[14px] leading-relaxed text-text-2 mb-6 sm:mb-7 max-w-[660px] font-mono">
            {locale === 'id' ? (
              <>
                Fokus pada eliminasi <span className="text-text-0 font-medium">data rot</span> sebelum meracuni analitik kritis, mengorkestrasi pipeline terdistribusi skala besar (GCP, BigQuery, dbt, Spark), dan merajut keandalan data deterministik dengan kecepatan vibe coding bertenaga AI.
              </>
            ) : (
              <>
                Focused on purging <span className="text-text-0 font-medium">data rot</span> before it poisons downstream analytics, orchestrating large-scale distributed pipelines (GCP, BigQuery, dbt, Spark), and fusing deterministic reliability with AI-native vibe coding.
              </>
            )}
          </p>

          {/* Live Micro-HUD Telemetry Banner (Responsive 2x2 on Mobile, 4x1 on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 sm:mb-8 font-mono text-[10px] p-2.5 sm:p-3 bg-bg-1/70 border border-border-subtle rounded-sm backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <div className="border-r border-border-subtle/50 pr-2">
              <span className="text-text-3 block text-[8px] sm:text-[9px] uppercase tracking-wider">01 // FOCUS</span>
              <span className="text-accent font-bold text-[9px] sm:text-[10px]">DATA INTEGRITY</span>
            </div>
            <div className="sm:border-r border-border-subtle/50 pr-2">
              <span className="text-text-3 block text-[8px] sm:text-[9px] uppercase tracking-wider">02 // ARCHITECTURE</span>
              <span className="text-emerald-400 font-bold text-[9px] sm:text-[10px]">ZERO-ENTROPY</span>
            </div>
            <div className="border-r border-border-subtle/50 pr-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle/30">
              <span className="text-text-3 block text-[8px] sm:text-[9px] uppercase tracking-wider">03 // STACK</span>
              <span className="text-text-1 font-bold truncate block text-[9px] sm:text-[10px]">GCP · DBT · SPARK</span>
            </div>
            <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle/30">
              <span className="text-text-3 block text-[8px] sm:text-[9px] uppercase tracking-wider">04 // EXECUTION</span>
              <span className="text-amber-400 font-bold text-[9px] sm:text-[10px]">AI ORCHESTRATION</span>
            </div>
          </div>

          {/* Action CTAs (Mobile-Friendly Thumb Tap Targets) */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
            <motion.a 
              href={locale === 'id' ? '/id/work/' : '/work/'} 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-accent text-bg font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_25px_rgba(0,225,207,0.5)] transition-all flex items-center justify-center gap-2 group relative overflow-hidden rounded-sm w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                {locale === 'id' ? 'Akses Arsip Karir' : 'Access Career Archive'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>

            <motion.a 
              href="#skills"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-3 border border-border-subtle hover:border-accent bg-bg-1/80 text-text-2 hover:text-accent font-mono text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-sm w-full sm:w-auto"
            >
              <Sparkles size={13} className="text-accent" />
              <span>{locale === 'id' ? 'Jelajahi 3D Galaxy ↓' : 'Explore 3D Galaxy ↓'}</span>
            </motion.a>

            <div className="flex gap-5 items-center justify-center sm:justify-start sm:ml-auto pt-2 sm:pt-0">
              <motion.a whileHover={{ y: -2, color: 'var(--theme-accent, #00e1cf)' }} href={resumeData.profile.github} target="_blank" rel="noopener noreferrer" className="text-text-3 hover:text-accent transition-colors p-1" title="GitHub"><Github size={18} /></motion.a>
              <motion.a whileHover={{ y: -2, color: 'var(--theme-accent, #00e1cf)' }} href={resumeData.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-3 hover:text-accent transition-colors p-1" title="LinkedIn"><Linkedin size={18} /></motion.a>
              <motion.a whileHover={{ y: -2, color: 'var(--theme-accent, #00e1cf)' }} href={`mailto:${resumeData.profile.email}`} className="text-text-3 hover:text-accent transition-colors p-1" title="Email"><Mail size={18} /></motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Expertise Graph & 3D Celestial Constellation (Placed First) */}
      <Section id="skills" label={locale === 'id' ? '01 — jaringan saraf' : '01 — neural network'} isNSM={isNSM}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="text-[10px] sm:text-[11px] font-mono text-text-3">
            {locale === 'id' ? 'Pilih mode tampilan graf:' : 'Select graph visualization mode:'}
          </div>
          <div className="flex items-center gap-1 bg-bg-1 p-1 rounded border border-border-subtle self-start sm:self-auto">
            <button
              onClick={() => setSkills3DView(true)}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                skills3DView 
                  ? 'bg-accent text-bg font-bold shadow-[0_0_10px_rgba(0,225,207,0.3)]' 
                  : 'text-text-3 hover:text-text-1'
              }`}
            >
              <Sparkles size={11} />
              <span>3D GALAXY</span>
            </button>
            <button
              onClick={() => setSkills3DView(false)}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                !skills3DView 
                  ? 'bg-accent text-bg font-bold shadow-[0_0_10px_rgba(0,225,207,0.3)]' 
                  : 'text-text-3 hover:text-text-1'
              }`}
            >
              <GitBranch size={11} />
              <span>2D GRAPH</span>
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="relative min-h-[540px] md:min-h-[600px] w-full">
             {skills3DView ? (
               <KnowledgeConstellation locale={locale} />
             ) : (
               <KnowledgeGraph />
             )}
          </div>
        </div>
      </Section>

      {/* The ETL Engine Visual & Sandbox Workbench */}
      <section id="architecture" className="px-6 py-12 md:py-16 border-b border-border-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>{locale === 'id' ? '02 // ARSITEKTUR // MEJA KERJA SISTEM' : '02 // ARCHITECTURE // SYSTEM WORKBENCH'}</span>
            </div>
            <p className="font-mono text-[11px] text-text-3">
              {locale === 'id' ? 'Instrumen pemrosesan & visualisasi data terdistribusi:' : 'Distributed data processing & telemetry engines:'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full bg-bg-1/80 p-1.5 rounded border border-border-subtle backdrop-blur-sm">
            {archTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeArchTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveArchTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-accent text-bg font-bold shadow-[0_0_12px_rgba(0,225,207,0.3)]'
                      : 'text-text-3 hover:text-text-1 hover:bg-white/5'
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="transition-all duration-300 min-h-[450px]">
          {activeArchTab === '3d-laser' && <LaserPipelineRouter locale={locale} />}
          {activeArchTab === '3d-cluster' && <ServerRackExplorer locale={locale} />}
          {activeArchTab === 'live-arch' && <LiveArchitecture locale={locale} />}
          {activeArchTab === 'pipeline' && <DataPipeline locale={locale} />}
          {activeArchTab === 'stream' && <StreamSimulator locale={locale} />}
          {activeArchTab === 'lineage' && <DataLineageGraph locale={locale} />}
          {activeArchTab === 'sql' && <DataStreamSandbox locale={locale} />}
          {activeArchTab === 'oracle' && <DataOracle locale={locale} />}
        </div>
      </section>

      {/* Human Runtime Environment */}
      <Section id="human-runtime" label={locale === 'id' ? '03 — lingkungan runtime manusia' : '03 — human runtime environment'} isNSM={isNSM}>
         <HumanRuntime locale={locale} />
      </Section>

      <footer className="pt-12 pb-24 sm:pb-16 border-t border-border-subtle bg-bg-1 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-[9px] text-text-3 flex items-center gap-4">
            <span><DecryptedText text="© 2026 NICHSEDGE" /></span>
            <span className="opacity-20">|</span>
            <span className="animate-pulse flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-accent" /> {locale === 'id' ? 'SISTEM_STABIL' : 'SYSTEM_STABLE'}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-end">
             <a href="#" className="font-mono text-[9px] uppercase tracking-widest text-text-3 hover:text-accent">{locale === 'id' ? 'Gulir_ke_Atas' : 'Scroll_to_Top'}</a>
             <span className="font-mono text-[8px] uppercase tracking-widest text-text-3 opacity-20">{locale === 'id' ? 'Telur Paskah: Ketik \'NSM\'' : 'Easter Egg: Type \'NSM\''}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
