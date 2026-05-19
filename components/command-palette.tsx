'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, Terminal, FileText, User, Github, Linkedin, Mail, ExternalLink, X, Zap, Loader2, Database, Code, Power, Network } from 'lucide-react';
import { useRouter } from 'next/navigation';
import resumeData from '@/data/cv.json';
import { getFallbackAuditReport } from '@/lib/ai-fallback';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const commands: CommandItem[] = [
    { id: 'home', label: 'Go to Home', icon: <Terminal size={14} />, category: 'Navigation', action: () => router.push('/') },
    { id: 'projects', label: 'View Projects', icon: <FileText size={14} />, category: 'Navigation', action: () => router.push('/projects') },
    { id: 'data-lake', label: 'Data Lake (SQL View)', icon: <Database size={14} />, category: 'Navigation', action: () => router.push('/data-lake') },
    { id: 'terminal', label: 'Open Terminal', icon: <Terminal size={14} />, category: 'Navigation', action: () => router.push('/terminal') },
    { id: 'referrals', label: 'View Referrals (Gateways)', icon: <Network size={14} />, category: 'Navigation', action: () => router.push('/referrals') },
    { id: 'dev-mode', label: 'Toggle Diagnostics (X-Ray)', icon: <Code size={14} />, category: 'System', action: () => document.body.classList.toggle('dev-mode') },
    { id: 'reboot', label: 'Reboot Master Node', icon: <Power size={14} />, category: 'System', action: () => { sessionStorage.removeItem('booted'); window.location.reload(); } },
    { id: 'garden', label: 'Open Digital Garden', icon: <ExternalLink size={14} />, category: 'External', action: () => window.open('https://nichsedge.github.io/digital-garden/', '_blank') },
    { id: 'github', label: 'GitHub Profile', icon: <Github size={14} />, category: 'Social', action: () => window.open(resumeData.profile.github, '_blank') },
    { id: 'linkedin', label: 'LinkedIn Profile', icon: <Linkedin size={14} />, category: 'Social', action: () => window.open(resumeData.profile.linkedin, '_blank') },
    { id: 'audit', label: 'Run System Audit', icon: <Zap size={14} />, category: 'AI', action: () => setAuditOpen(true) },
    { id: 'contact', label: 'Send Email', icon: <Mail size={14} />, category: 'Action', action: () => window.open(`mailto:${resumeData.profile.email}`, '_blank') },
  ];

  const [auditOpen, setAuditOpen] = useState(false);
  const [auditReport, setAuditReport] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);

  const runAudit = async () => {
    setIsAuditing(true);
    setAuditReport('');
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileData: {
            name: resumeData.profile.name,
            role: resumeData.profile.role,
            skills: [
              ...resumeData.skills.languages,
              ...resumeData.skills.platforms,
              ...resumeData.skills.infrastructure
            ],
            projects_count: '50+',
          }
        })
      });
      if (!res.ok) throw new Error("API Route offline");
      const data = await res.json();
      setAuditReport(data.report);
    } catch (e) {
      try {
        const report = getFallbackAuditReport({
          name: resumeData.profile.name,
          role: resumeData.profile.role,
          skills: [
            ...resumeData.skills.languages,
            ...resumeData.skills.platforms,
            ...resumeData.skills.infrastructure
          ],
          projects_count: '50+',
        });
        setAuditReport(report);
      } catch (err) {
        setAuditReport('CRITICAL_SYSTEM_ERROR: CONNECTION_TIMEOUT');
      }
    } finally {
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    if (auditOpen && !auditReport && !isAuditing) {
      runAudit();
    }
  }, [auditOpen]);

  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  // Reset selection index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-scroll active command into view
  useEffect(() => {
    if (isOpen) {
      const activeEl = document.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen]);

  // Reset selectedIndex to 0 when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(prev => !prev);
      return;
    }

    if (!isOpen) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
      setAuditOpen(false);
      return;
    }

    if (filteredCommands.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetCmd = filteredCommands[selectedIndex];
      if (targetCmd) {
        targetCmd.action();
        setIsOpen(false);
      }
    }
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-bg-1 border border-border-subtle p-2.5 rounded-sm text-text-3 hover:text-accent transition-all group shadow-xl"
      >
        <Command size={18} className="group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {auditOpen && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuditOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-[#09090b] border border-accent/30 p-8 shadow-[0_0_50px_rgba(0,225,207,0.1)]"
            >
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                   <Zap size={20} className="text-accent animate-pulse" />
                   <h2 className="font-mono text-lg font-bold text-text-0 tracking-widest">SYSTEM_AUDIT_LOG</h2>
                 </div>
                 <button onClick={() => setAuditOpen(false)} className="text-text-3 hover:text-accent">
                   <X size={20} />
                 </button>
              </div>

              <div className="font-mono text-[12px] leading-relaxed min-h-[300px] bg-black/50 p-6 border border-border-subtle overflow-y-auto max-h-[60vh]">
                {isAuditing ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                    <Loader2 size={32} className="text-accent animate-spin" />
                    <span className="text-accent animate-pulse tracking-[0.3em]">ANALYZING_KERNELS...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-text-1">
                    {auditReport}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <div className="font-mono text-[9px] text-text-3">
                   ENCRYPTION: AES-256-BIT
                </div>
                <button 
                  onClick={runAudit}
                  disabled={isAuditing}
                  className="px-4 py-2 bg-accent/10 border border-accent/40 text-accent font-mono text-[10px] hover:bg-accent/20 transition-all uppercase tracking-widest"
                >
                  Re-Run Diagnosis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full max-w-xl bg-bg border border-border-focus shadow-2xl overflow-hidden rounded-sm"
            >
              <div className="flex items-center px-4 py-3 border-b border-border-subtle">
                <Search size={16} className="text-text-3 mr-3" />
                <input 
                  autoFocus
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-[13px] text-text-0 focus:ring-0 placeholder:text-text-3 font-mono"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
                {filteredCommands.length > 0 ? (
                  <div className="space-y-1">
                    {Array.from(new Set(filteredCommands.map(c => c.category))).map(cat => (
                      <div key={cat}>
                        <div className="px-3 py-1.5 text-[9px] font-bold text-text-3 uppercase tracking-[0.2em]">{cat}</div>
                        {filteredCommands.filter(c => c.category === cat).map(cmd => {
                          const isSelected = filteredCommands[selectedIndex]?.id === cmd.id;
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => { cmd.action(); setIsOpen(false); }}
                              data-selected={isSelected}
                              className={`w-full flex items-center justify-between px-3 py-2 text-[12px] rounded-sm group transition-all font-mono text-left outline-none border ${
                                isSelected 
                                  ? 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_8px_rgba(0,225,207,0.1)]' 
                                  : 'text-text-2 hover:bg-bg-1 hover:text-accent border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {cmd.icon}
                                {cmd.label}
                              </div>
                              <span className={`text-[10px] text-text-3 uppercase transition-opacity ${
                                isSelected ? 'opacity-100 text-accent font-bold' : 'opacity-0 group-hover:opacity-100'
                              }`}>
                                Execute
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-[12px] text-text-3 font-mono">
                    No results found for &quot;{query}&quot;
                  </div>
                )}
              </div>
              
              <div className="px-4 py-3 border-t border-border-subtle bg-bg-1 flex justify-between items-center font-mono text-[9px] text-text-3">
                <div className="flex gap-3">
                  <span><span className="text-accent">↑↓</span> to navigate</span>
                  <span><span className="text-accent">↵</span> to select</span>
                </div>
                <div>ESC to close</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
