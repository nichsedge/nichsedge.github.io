'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  ChevronRight, 
  Server, 
  Database, 
  Cpu, 
  Workflow, 
  History,
  ArrowUpRight,
  Code2,
  Layers,
  Network
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { SubNav } from '@/components/sub-nav';
import { MediaViewer } from '@/components/media-viewer';
import { GlitchText } from '@/components/glitch-text';
import { DecryptedText } from '@/components/decrypted-text';

import resumeData from '@/data/cv.json';

interface Period {
  start: string;
  end: string | null;
}

interface ProjectItem {
  role: string;
  period: Period;
  shortDescription: string;
  fullDescription: string;
  tech: string[];
  impact: string[];
  media?: {
    type: string;
    url: string;
    thumbnail?: string;
  } | null;
}

interface WorkItem {
  company: string;
  role: string;
  period: Period;
  shortDescription: string;
  fullDescription: string;
  tech: string[];
  impact: string[];
  media?: {
    type: string;
    url: string;
    thumbnail?: string;
  } | null;
  projects?: ProjectItem[];
}

function formatPeriod(period: Period, yearOnly = false): string {
  if (!period) return '';
  
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr || dateStr === 'Present') return 'Present';
    const parts = dateStr.split('-');
    const year = parts[0];
    if (yearOnly) return year;
    
    if (parts.length < 2) return dateStr;
    const month = parseInt(parts[1], 10);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${months[month - 1]} ${year}`;
  };
  
  return `${formatDate(period.start)} — ${formatDate(period.end)}`;
}

const FADE_UP = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function WorkClient() {
  const [isNSM, setIsNSM] = React.useState(false);
  const work = resumeData.work as unknown as WorkItem[];
  const { narrative, profile } = resumeData;

  const subNavItems = [
    { name: 'Overview', href: '#overview' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Philosophy', href: '#philosophy' },
  ];

  React.useEffect(() => {
    let sequence = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      sequence += e.key.toLowerCase();
      if (sequence.length > 3) sequence = sequence.slice(-3);
      if (sequence === 'nsm') {
        setIsNSM(prev => !prev);
        sequence = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-bg relative selection:bg-accent/30 selection:text-accent">
      <Navbar isNSM={isNSM} toggleNSM={() => setIsNSM(!isNSM)} />
      <SubNav items={subNavItems} />
      
      {/* Background Subtle Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00e1cf_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <main className="relative z-10 pt-24 pb-32 px-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <section id="overview" className="mb-24">
          <motion.div {...FADE_UP} className="space-y-6">
            <div className="flex items-center gap-2 font-mono text-[10px] text-accent uppercase tracking-[0.3em]">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(0,225,207,0.5)]" />
              <DecryptedText text="SYS_OPERATIONS // CAREER_TRAJECTORY" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-text-0 tracking-tighter leading-none mb-8">
              Enabling systems to <span className="text-accent italic font-light"><GlitchText text="think" /></span> and <span className="text-accent italic font-light"><GlitchText text="scale" /></span>.
            </h1>

            <div className="grid md:grid-cols-2 gap-12 pt-8">
              <p className="text-[15px] text-text-2 leading-relaxed font-light">
                My work exists at the friction point between messy real-world data and clean, actionable intelligence. I specialize in building the "nervous systems" of modern organizations—the pipelines, warehouses, and streaming engines that turn noise into signal. 
              </p>
              <div className="bg-bg-1/40 border border-border-subtle p-6 rounded-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 font-mono text-[9px] text-text-3 uppercase mb-4 tracking-widest">
                  <Cpu size={12} /> Technical Core
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 font-mono text-[11px] text-accent/80">
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-accent rounded-full"/> DISTRIBUTED_SYS</div>
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-accent rounded-full"/> STREAM_PROCESSING</div>
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-accent rounded-full"/> CLOUD_INFRA</div>
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-accent rounded-full"/> DATA_MODELING</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Career Timeline */}
        <section id="timeline" className="space-y-12">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-xl font-bold text-text-0 tracking-tight flex items-center gap-3">
              <History className="text-accent" size={20} /> Professional Archive
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border-subtle to-transparent" />
          </div>

          <motion.div 
            variants={STAGGER_CONTAINER}
            initial="initial"
            animate="animate"
            className="space-y-24"
          >
            {work.map((role, idx) => (
              <motion.div 
                key={`${role.company}-${role.role}-${idx}`}
                variants={FADE_UP}
                className="group relative grid md:grid-cols-12 gap-8 md:gap-4"
              >
                {/* Timeline Connector */}
                {idx !== work.length - 1 && (
                  <div className="hidden md:block absolute left-[30px] top-[40px] bottom-[-60px] w-px bg-border-subtle group-hover:bg-accent/40 transition-colors" />
                )}

                {/* Period & Circle */}
                <div className="md:col-span-3 flex md:flex-col items-start gap-4">
                  <div className="relative">
                    <div className="w-[60px] h-[60px] rounded-full border border-border-subtle flex items-center justify-center bg-bg group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(0,225,207,0.2)] transition-all shrink-0">
                      <span className="text-[10px] font-mono text-text-3 group-hover:text-accent">{formatPeriod(role.period).split(' ')[0]}</span>
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-text-3 tracking-[0.2em] md:pt-4">
                    {formatPeriod(role.period)}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-9 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text-0 mb-1 group-hover:text-accent transition-colors flex items-center gap-3">
                      {role.company} <ArrowUpRight className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-accent" size={16} />
                    </h3>
                    <p className="font-mono text-[11px] text-accent/80 uppercase tracking-widest">{role.role}</p>
                  </div>

                  <p className="text-[14px] text-text-2 leading-relaxed font-light font-sans max-w-2xl">
                    {role.fullDescription}
                  </p>

                  {role.media && (
                    <div className="max-w-xl">
                      <MediaViewer 
                        type={role.media.type as 'image' | 'video'} 
                        url={role.media.url} 
                        thumbnail={role.media.thumbnail}
                        alt={`${role.company} architecture`}
                      />
                    </div>
                  )}

                  {/* Impact Points */}
                  <div className="space-y-3 pt-2">
                    {role.impact.map((point, i) => (
                      <div key={i} className="flex items-start gap-3 group/item">
                        <Terminal size={12} className="mt-1 text-text-3 group-hover/item:text-accent shrink-0" />
                        <p className="text-[13px] text-text-3 group-hover/item:text-text-2 transition-colors">{point}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {role.tech.map(t => (
                      <span key={t} className="px-2 py-1 bg-bg-1 border border-border-subtle rounded-sm font-mono text-[9px] text-text-3 group-hover:border-accent/40 group-hover:text-accent transition-all uppercase">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Projects/Sub-roles */}
                  {role.projects && role.projects.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-border-subtle/50 space-y-8">
                      <div className="flex items-center gap-2 font-mono text-[9px] text-accent uppercase tracking-widest">
                        <Layers size={12} className="animate-pulse" />
                        <span>NEURAL_NODE_SUBSECTIONS // ACTIVE_PROJECTS</span>
                      </div>
                      
                      <div className="relative pl-6 border-l border-border-subtle/60 space-y-10">
                        {role.projects.map((project, pIdx) => (
                          <div key={`${project.role}-${pIdx}`} className="relative group/project space-y-3">
                            {/* Connector dot */}
                            <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full border border-border-subtle bg-bg group-hover/project:border-accent group-hover/project:shadow-[0_0_8px_rgba(0,225,207,0.4)] transition-all" />
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                              <h4 className="text-[16px] font-bold text-text-0 group-hover/project:text-accent transition-colors">
                                {project.role}
                              </h4>
                              <span className="font-mono text-[9px] text-text-3 uppercase tracking-wider">{formatPeriod(project.period)}</span>
                            </div>
                            
                            <p className="text-[13px] text-text-2 leading-relaxed font-light font-sans max-w-xl">
                              {project.fullDescription}
                            </p>

                            {project.media && (
                              <div className="max-w-md my-3">
                                <MediaViewer 
                                  type={project.media.type as 'image' | 'video'} 
                                  url={project.media.url} 
                                  thumbnail={project.media.thumbnail}
                                  alt={`${project.role} media`}
                                />
                              </div>
                            )}

                            {/* Project Impact */}
                            {project.impact && project.impact.length > 0 && (
                              <div className="space-y-2 pl-1 pt-1">
                                {project.impact.map((point, i) => (
                                  <div key={i} className="flex items-start gap-2.5 group/pitem">
                                    <Terminal size={10} className="mt-1 text-text-3 group-hover/pitem:text-accent shrink-0 opacity-80" />
                                    <p className="text-[12px] text-text-3 group-hover/pitem:text-text-2 transition-colors">{point}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Project Tech */}
                            {project.tech && project.tech.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {project.tech.map(t => (
                                  <span key={t} className="px-1.5 py-0.5 bg-bg-1 border border-border-subtle/50 rounded-sm font-mono text-[8px] text-text-3 uppercase tracking-tighter hover:border-accent/30 hover:text-accent transition-all">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Narrative Section */}
        <section id="philosophy" className="mt-48 pt-24 border-t border-border-subtle">
           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="max-w-3xl"
           >
              <h2 className="text-3xl font-bold text-text-0 mb-10 italic">The "Why" Behind the Pipes.</h2>
              <div className="space-y-8 text-text-2 text-[15px] leading-relaxed font-light">
                <p>
                  {narrative.intro}
                </p>
                <p>
                  My philosophy on data engineering is simple: **{narrative.philosophy.split('**')[1]}**. {narrative.philosophy.split('**')[2]}
                </p>
                <p>
                  {narrative.conclusion}
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-bg-1/40 border border-border-subtle rounded-sm hover:border-accent/30 transition-colors">
                  <Network className="text-accent mb-4" size={24} />
                  <h4 className="font-bold text-text-0 mb-2">Systems Thinking</h4>
                  <p className="text-[13px] text-text-3">I don't just build pipelines; I architect ecosystems where data flows naturally and predictably.</p>
                </div>
                <div className="p-6 bg-bg-1/40 border border-border-subtle rounded-sm hover:border-accent/30 transition-colors">
                  <Layers className="text-accent mb-4" size={24} />
                  <h4 className="font-bold text-text-0 mb-2">Pragmatic Ops</h4>
                  <p className="text-[13px] text-text-3">Stability is a feature. I prioritize observability and self-healing mechanisms in every build.</p>
                </div>
              </div>
           </motion.div>
        </section>
      </main>

      <footer className="py-24 border-t border-border-subtle bg-bg-1 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-4">
             <div className="font-mono text-[10px] text-accent tracking-[0.4em] uppercase">Ready to connect?</div>
             <h3 className="text-3xl font-bold text-text-0 tracking-tight">Let's build something systemic.</h3>
          </div>
          <div className="flex gap-8 font-mono text-[11px] text-text-3 uppercase tracking-widest">
            <a href={`mailto:${profile.email}`} className="hover:text-accent transition-colors">{profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
