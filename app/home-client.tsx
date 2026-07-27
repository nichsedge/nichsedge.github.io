'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Database, Github, Linkedin, Mail } from 'lucide-react';

import { Navbar } from '@/components/navbar';
import { SubNav } from '@/components/sub-nav';
import { SkillMatrix } from '@/components/skill-matrix';
import { CareerPipeline } from '@/components/career-pipeline';
import { KnowledgeGraph } from '@/components/knowledge-graph';
import { PipelineHeatmap } from '@/components/pipeline-heatmap';
import { DataOracle } from '@/components/data-oracle';
import { GlitchText } from '@/components/glitch-text';
import { MatrixRain } from '@/components/matrix-rain';
import { LiveArchitecture } from '@/components/live-architecture';
import { HumanRuntime } from '@/components/human-runtime';
import { DecryptedText } from '@/components/decrypted-text';
import { InteractiveGrid } from '@/components/interactive-grid';
import { DataPipeline } from '@/components/data-pipeline';
import { DataStreamSandbox } from '@/components/data-stream-sandbox';
import { StreamSimulator } from '@/components/stream-simulator';
import { DataLineageGraph } from '@/components/data-lineage-graph';

import resumeDataEN from '@/data/cv.json';
import resumeDataID from '@/data/cv_id.json';

const FADE_UP = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function Section({ children, label, id, isNSM }: { children: React.ReactNode, label: string, id: string, isNSM?: boolean }) {
  return (
    <section id={id} className={`py-16 md:py-24 px-6 border-b border-border-subtle group transition-all duration-700 relative z-10 ${isNSM ? 'bg-bg/60 backdrop-blur-sm' : ''}`}>
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
    { name: 'Arsitektur', href: '#architecture' },
    { name: 'Karir', href: '#work' },
    { name: 'Jaringan_Saraf', href: '#skills' },
    { name: 'Oracle', href: '#oracle' },
    { name: 'Runtime', href: '#human-runtime' },
  ] : [
    { name: 'Architecture', href: '#architecture' },
    { name: 'Pipeline', href: '#work' },
    { name: 'Neural_Net', href: '#skills' },
    { name: 'Oracle', href: '#oracle' },
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
      <section className="pt-24 pb-16 px-6 relative overflow-hidden group">
        <InteractiveGrid />
        <div className="absolute top-10 right-10 opacity-10 -rotate-12 select-none pointer-events-none group-hover:blur-sm transition-all duration-1000">
          <Database size={400} strokeWidth={0.5} className={isNSM ? 'text-accent animate-pulse' : ''} />
        </div>
        
        <motion.div {...FADE_UP} className="relative z-20">
          <button 
            onClick={() => setIsNSM(!isNSM)} 
            className="flex items-center gap-2 font-mono text-[10px] text-text-3 uppercase tracking-widest mb-6 hover:text-accent hover:cursor-pointer transition-colors outline-none text-left"
          >
             <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
             {isNSM ? (locale === 'id' ? 'NEURAL_LINK_TERSINKRONISASI' : 'NEURAL_LINK_SYNCHRONIZED') : (locale === 'id' ? 'MEMBUAT_LINK... OK (Klik untuk Sinkronisasi)' : 'ESTABLISHING_LINK... OK (Click to Sync)')}
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-text-0 leading-tight mb-8 tracking-tight">
            <GlitchText text={locale === 'id' ? 'Saya membangun sistem' : resumeData.profile.tagline.split(' ').slice(0, 4).join(' ')} />{' '}
            <span className="text-accent underline decoration-accent/20 underline-offset-4">
              {locale === 'id' ? 'pemrosesan' : resumeData.profile.tagline.split(' ')[4]}
            </span>{' '}
            {locale === 'id' ? 'dan' : 'and'}{' '}
            <span className="text-accent underline decoration-accent/20 underline-offset-4">
              {locale === 'id' ? 'transformasi data.' : resumeData.profile.tagline.split(' ')[6]}
            </span>{' '}
            {locale === 'id' ? '' : resumeData.profile.tagline.split(' ')[7]}
          </h1>
          <p className="text-[14px] leading-relaxed text-text-2 mb-10 max-w-[500px] font-light">
            {locale === 'id' ? (
              <>Saya {resumeData.profile.name}, seorang {resumeData.profile.role} yang berspesialisasi dalam {resumeData.profile.specialization} Saat ini saya sedang {resumeData.profile.currentFocus}</>
            ) : (
              <>I’m {resumeData.profile.name}, a {resumeData.profile.role} specializing in {resumeData.profile.specialization} Currently {resumeData.profile.currentFocus}.</>
            )}
          </p>
          
          <div className="flex flex-wrap gap-6 items-center">
            <motion.a 
              href="#work" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-accent text-bg font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(0,225,207,0.4)] transition-all flex items-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                {locale === 'id' ? 'Buka Arsip' : 'Access Archive'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>
            <div className="flex gap-5 items-center">
              <motion.a whileHover={{ y: -2, color: 'var(--theme-accent, #00e1cf)' }} href={resumeData.profile.github} className="text-text-3 transition-colors"><Github size={20} /></motion.a>
              <motion.a whileHover={{ y: -2, color: 'var(--theme-accent, #00e1cf)' }} href={resumeData.profile.linkedin} className="text-text-3 transition-colors"><Linkedin size={20} /></motion.a>
              <motion.a whileHover={{ y: -2, color: 'var(--theme-accent, #00e1cf)' }} href={`mailto:${resumeData.profile.email}`} className="text-text-3 transition-colors"><Mail size={20} /></motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* The ETL Engine Visual & Sandbox */}
      <section id="architecture" className="px-6 pb-16 space-y-8">
         <DataPipeline />
         <StreamSimulator locale={locale} />
         <DataLineageGraph locale={locale} />
         <DataStreamSandbox locale={locale} />
      </section>

      {/* Career Pipeline */}
      <Section id="work" label={locale === 'id' ? '01 — pipeline karir' : '01 — career pipeline'} isNSM={isNSM}>
        <div className="mb-12">
           <CareerPipeline locale={locale} />
        </div>
        <div className="mb-16">
           <PipelineHeatmap />
        </div>
        <div className="mb-16">
           <LiveArchitecture />
        </div>
      </Section>

      {/* Expertise Graph */}
      <Section id="skills" label={locale === 'id' ? '02 — jaringan saraf' : '02 — neural network'} isNSM={isNSM}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-[14px] leading-relaxed text-text-3 font-light mb-6">
              {locale === 'id' ? (
                <>Lanskap teknis saya adalah jaringan alat dan protokol yang saling terhubung. Saya berspesialisasi dalam menjembatani <span className="text-text-1 font-medium">Software Engineering</span> dan <span className="text-text-1 font-medium">Strategi Data</span>.</>
              ) : (
                <>My technical landscape is an interconnected web of tools and protocols. I specialize in the bridge between <span className="text-text-1 font-medium">Software Engineering</span> and <span className="text-text-1 font-medium">Data Strategy</span>.</>
              )}
            </p>
            <div className="space-y-4">
              <SkillMatrix />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-bg-1 p-3 md:p-4 border border-border-subtle group hover:border-accent/30 transition-colors">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-accent mb-2">{locale === 'id' ? 'Bahasa' : 'Languages'}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.languages.slice(0, 4).map(s => <span key={s} className="text-[10px] font-mono text-text-3">{s}</span>)}
                  </div>
                </div>
                <div className="bg-bg-1 p-3 md:p-4 border border-border-subtle group hover:border-accent/30 transition-colors">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-accent mb-2">Cloud</div>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.infrastructure.slice(0, 4).map(s => <span key={s} className="text-[10px] font-mono text-text-3">{s}</span>)}
                  </div>
                </div>
                <div className="bg-bg-1 p-3 md:p-4 border border-border-subtle group hover:border-accent/30 transition-colors">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-accent mb-2">IDE</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(resumeData.skills.ides || []).slice(0, 4).map(s => <span key={s} className="text-[10px] font-mono text-text-3">{s}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[400px]">
             <KnowledgeGraph />
          </div>
        </div>
      </Section>

      {/* Data Oracle */}
      <Section id="oracle" label={locale === 'id' ? '03 — oracle data (AI)' : '03 — data oracle (AI)'} isNSM={isNSM}>
         <DataOracle locale={locale} />
      </Section>

      {/* Human Runtime Environment */}
      <Section id="human-runtime" label={locale === 'id' ? '04 — lingkungan runtime manusia' : '04 — human runtime environment'} isNSM={isNSM}>
         <HumanRuntime locale={locale} />
      </Section>

      <footer className="py-12 border-t border-border-subtle bg-bg-1 px-6">
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
