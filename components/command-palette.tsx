'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Terminal, FileText, Github, Linkedin, Mail, ExternalLink, X, Zap, Loader2, Database, Code, Power, Network, Brain, Trash2, CreditCard, Volume2, Sparkles } from 'lucide-react';

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

  // Unified AI Q&A States
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [aiStatus, setAiStatus] = useState<'LIVE' | 'LOCAL' | null>(null);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const PRESET_PROMPTS = [
    "⚡ Summarize Tech Stack",
    "📊 Data Lake Schema",
    "🚀 Top Repositories",
    "💼 Career Highlights"
  ];

  const speakText = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check backend AI availability on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/ghost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '' })
        });
        if (res.ok) {
          const data = await res.json();
          setAiStatus(data.status);
        } else {
          setAiStatus('LOCAL');
        }
      } catch {
        setAiStatus('LOCAL');
      }
    };
    checkStatus();
  }, []);

  // Auto-scroll chat terminal to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isAsking]);

  const handleAiAsk = async (text: string) => {
    if (!text.trim()) return;
    setIsChatMode(true);
    const userMsg = text.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery(''); // Clear search box for subsequent inputs
    setIsAsking(true);

    try {
      const res = await fetch('/api/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      });
      if (!res.ok) throw new Error("API Route offline");
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
      setAiStatus(data.status);
    } catch {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "CRITICAL_CONNECTION_ERROR: Could not establish a secure uplink to the cognitive core. Fallback mode is active." 
      }]);
      setAiStatus('LOCAL');
    } finally {
      setIsAsking(false);
    }
  };

  const commands: CommandItem[] = [
    { id: 'home', label: 'Go to Home', icon: <Terminal size={14} />, category: 'Navigation', action: () => router.push('/') },
    { id: 'projects', label: 'View Projects', icon: <FileText size={14} />, category: 'Navigation', action: () => router.push('/projects') },
    { id: 'data-lake', label: 'Data Lake (SQL View)', icon: <Database size={14} />, category: 'Navigation', action: () => router.push('/data-lake') },
    { id: 'terminal', label: 'Open Terminal Console', icon: <Terminal size={14} />, category: 'Navigation', action: () => router.push('/terminal') },
    { id: 'referrals', label: 'View Referrals (Gateways)', icon: <Network size={14} />, category: 'Navigation', action: () => router.push('/referrals') },
    { id: 'pay', label: 'Show Pay / Transfer Node', icon: <CreditCard size={14} />, category: 'Navigation', action: () => router.push('/pay') },
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
    } catch {
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
      } catch {
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

  // Handle open command palette event from other components (like Navbar)
  useEffect(() => {
    const handleOpenPaletteEvent = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-command-palette', handleOpenPaletteEvent);
    return () => window.removeEventListener('open-command-palette', handleOpenPaletteEvent);
  }, []);

  // Filter regular commands and prepend AI consultation if query exists
  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  if (query.trim().length > 0) {
    filteredCommands.unshift({
      id: 'ai-ask',
      label: `Ask Neural Oracle: "${query}"`,
      icon: <Brain size={14} className="text-accent animate-pulse" />,
      category: 'Neural AI',
      action: () => handleAiAsk(query)
    });
  }

  // Reset selected index when query shifts
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-scroll active command into view
  useEffect(() => {
    if (isOpen && !isChatMode) {
      const activeEl = document.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen, isChatMode]);

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

    if (isChatMode) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (query.trim().length > 0) {
          handleAiAsk(query);
        }
      }
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
        if (targetCmd.id !== 'ai-ask') {
          setIsOpen(false);
        }
      }
    }
  }, [isOpen, filteredCommands, selectedIndex, isChatMode, query]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleClose = () => {
    setIsOpen(false);
    setAuditOpen(false);
  };

  const handleResetChat = () => {
    setChatHistory([]);
    setIsChatMode(false);
    setQuery('');
  };

  return (
    <>
      {/* Glowing Neural Oracle Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        title="Consult Neural Oracle & Search Commands (Ctrl+K)"
        className="fixed bottom-6 right-4 sm:right-6 z-40 bg-[#09090b]/90 border border-accent/30 p-2.5 sm:p-3.5 rounded-full text-accent hover:text-text-0 hover:bg-accent/10 transition-all flex items-center justify-center group shadow-[0_0_20px_rgba(0,225,207,0.15)] hover:shadow-[0_0_25px_rgba(0,225,207,0.35)] hover:scale-105 duration-300 outline-none focus:outline-none focus:ring-0"
      >
        <div className="relative flex items-center justify-center">
          <Brain className="size-4 sm:size-[19px] group-hover:scale-110 transition-transform text-accent" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
        </div>
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
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full max-w-xl bg-[#09090b]/95 backdrop-blur-xl border border-accent/25 shadow-[0_0_60px_rgba(0,225,207,0.07)] overflow-hidden rounded-sm"
            >
              {/* Header Input with AI Connection Indicator */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle/30 bg-black/20">
                <div className="flex items-center flex-1 mr-3">
                  {isChatMode ? (
                    <Brain size={14} className="text-accent mr-3 animate-pulse" />
                  ) : (
                    <Search size={14} className="text-text-3 mr-3" />
                  )}
                  <input 
                    autoFocus
                    placeholder={
                      isChatMode 
                        ? "Ask a follow-up about career, repos, or referrals..." 
                        : "Ask about me or search a command..."
                    }
                    className="flex-1 bg-transparent border-none outline-none text-[13px] text-text-0 focus:ring-0 placeholder:text-text-3/60 font-mono tracking-wide"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                
                {/* AI Connection State Badge */}
                {aiStatus !== null && (
                  <span className={`font-mono text-[8px] font-bold tracking-widest px-2.5 py-0.5 border ${
                    aiStatus === 'LIVE' 
                      ? 'border-accent/40 text-accent bg-accent/5' 
                      : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'
                  }`}>
                    {aiStatus === 'LIVE' ? 'COGNITIVE_CORE: ONLINE' : 'LOCAL_EMULATION: ACTIVE'}
                  </span>
                )}
              </div>

              {/* Quick Preset Prompts Bar when input is active */}
              {!isChatMode && query === '' && (
                <div className="px-4 py-2 bg-black/40 border-b border-border-subtle/20 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9px] text-text-3 font-mono uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Sparkles size={10} className="text-accent" /> Quick Prompts:
                  </span>
                  {PRESET_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAiAsk(prompt.replace(/^[^\w]+/, ''))}
                      className="px-2 py-0.5 bg-accent/5 hover:bg-accent/15 border border-accent/20 rounded text-[9px] text-accent font-mono transition-all hover:scale-105"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Body Content: Command List vs Chat Area */}
              <div className="max-h-[300px] overflow-y-auto p-4 scrollbar-thin">
                {isChatMode ? (
                  /* Conversational Terminal Mode */
                  <div className="space-y-4">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className="font-mono text-[12px] leading-relaxed">
                        <div className={`flex items-start gap-2 ${
                          msg.role === 'user' ? 'text-accent font-semibold' : 'text-text-1'
                        }`}>
                          <span className="opacity-60 select-none">
                            {msg.role === 'user' ? '↳ [USER]:' : '↳ [ORACLE]:'}
                          </span>
                          <div className="whitespace-pre-wrap flex-1 bg-black/35 p-2.5 border border-border-subtle/10 rounded-sm relative group">
                            {msg.content}

                            {msg.role === 'assistant' && (
                              <button
                                onClick={() => speakText(msg.content, i)}
                                title="Speech Synthesizer Readout"
                                className={`absolute top-2 right-2 p-1 rounded transition-all ${
                                  speakingIndex === i ? 'text-accent bg-accent/20 animate-pulse' : 'text-text-3 hover:text-accent opacity-0 group-hover:opacity-100'
                                }`}
                              >
                                <Volume2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isAsking && (
                      <div className="flex items-center gap-2 font-mono text-[10px] text-accent animate-pulse py-2">
                        <Loader2 size={12} className="animate-spin text-accent" />
                        <span>ESTABLISHING_NEURAL_CHANNEL...</span>
                      </div>
                    )}
                    
                    <div ref={chatEndRef} />
                  </div>
                ) : (
                  /* Standard Command Palette Mode */
                  filteredCommands.length > 0 ? (
                    <div className="space-y-1">
                      {Array.from(new Set(filteredCommands.map(c => c.category))).map(cat => (
                        <div key={cat}>
                          <div className="px-3 py-1.5 text-[8px] font-bold text-text-3/80 uppercase tracking-[0.25em]">{cat}</div>
                          {filteredCommands.filter(c => c.category === cat).map(cmd => {
                            const isSelected = filteredCommands[selectedIndex]?.id === cmd.id;
                            const isAiCmd = cmd.id === 'ai-ask';
                            return (
                              <button
                                key={cmd.id}
                                onClick={() => { cmd.action(); if (!isAiCmd) setIsOpen(false); }}
                                data-selected={isSelected}
                                className={`w-full flex items-center justify-between px-3 py-2 text-[12px] rounded-sm group transition-all font-mono text-left outline-none border ${
                                  isSelected 
                                    ? isAiCmd 
                                      ? 'bg-accent/15 text-accent border-accent/40 shadow-[0_0_12px_rgba(0,225,207,0.1)]' 
                                      : 'bg-accent/10 text-accent border-accent/20 shadow-[0_0_12px_rgba(0,225,207,0.05)]'
                                    : 'text-text-2 hover:bg-white/[0.02] hover:text-accent border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`transition-transform duration-300 ${
                                    isSelected ? 'scale-110 text-accent' : 'text-text-3 group-hover:text-accent'
                                  }`}>
                                    {cmd.icon}
                                  </span>
                                  <span className="tracking-wide">{cmd.label}</span>
                                </div>
                                <span className={`text-[9px] text-text-3 uppercase tracking-wider transition-opacity ${
                                  isSelected ? 'opacity-100 text-accent font-bold' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                  {isAiCmd ? 'Consult' : 'Execute'}
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
                  )
                )}
              </div>

              {/* Bottom Instructions / Reset Actions Bar */}
              <div className="px-4 py-2.5 border-t border-border-subtle/30 bg-black/40 flex justify-between items-center font-mono text-[8px] sm:text-[9px] text-text-3 uppercase tracking-wider">
                {isChatMode ? (
                  <div className="flex gap-4 items-center">
                    <button 
                      onClick={handleResetChat} 
                      className="text-yellow-500 hover:text-yellow-400 hover:underline flex items-center gap-1 transition-colors outline-none focus:outline-none cursor-pointer"
                    >
                      <Trash2 size={10} /> [EXIT_CHAT / RESET_BUFFER]
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <span><span className="text-accent font-bold">↑↓</span> to navigate</span>
                    <span><span className="text-accent font-bold">↵</span> to select</span>
                  </div>
                )}
                <div>ESC to close</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
