'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Copy, Check, Zap, Server, Network, Terminal, Search, X, ShieldAlert, Cpu } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { InteractiveGrid } from '@/components/interactive-grid';
import { MatrixRain } from '@/components/matrix-rain';
import { TiltCard } from '@/components/tilt-card';
import { DecryptedText } from '@/components/decrypted-text';
import referralsData from '@/data/referrals.json';

interface Referral {
  id: string;
  name: string;
  category: string;
  code: string;
  link: string;
  benefit: string;
  status: string;
}

export default function ReferralsClient() {
  const [isNSM, setIsNSM] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all categories dynamically from JSON
  const categories = ['ALL', ...Array.from(new Set(referralsData.map(node => node.category)))];

  // Search and Filter Ingestion Logic
  const filteredNodes = referralsData.filter((node: Referral) => {
    const matchesSearch = 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || node.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy telemetry key', err);
    }
  };

  return (
    <div className="min-h-screen relative bg-bg">
      <MatrixRain active={isNSM} />
      <Navbar isNSM={isNSM} toggleNSM={() => setIsNSM(!isNSM)} />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative z-20">
        
        {/* Background Grid Accent */}
        <InteractiveGrid />

        {/* Cyber Hero Title */}
        <div className="relative mb-12 border-b border-border-subtle pb-8">
          <div className="absolute top-0 right-0 font-mono text-[9px] text-text-3 text-right hidden md:block">
            <span>SYS_LOC: /REFERRALS</span><br/>
            <span className="text-accent animate-pulse">TELEMETRY_LINK: CONNECTED</span>
          </div>

          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] font-bold block mb-3">
            <DecryptedText text="05 — PORTAL PIPELINE" speed={25} />
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-text-0 tracking-tight font-sans mb-4">
            Ingestion <span className="text-accent underline decoration-accent/20 underline-offset-4">Gateways</span>
          </h1>
          <p className="text-[13px] leading-relaxed text-text-3 max-w-[600px] font-light">
            A comprehensive terminal list of secure affiliate routes, software trials, and cognitive workspace portals. Sync with channels below to download benefit payloads.
          </p>
        </div>

        {/* Dashboard Status Telemetry Bar */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Ingestion Status', value: 'ONLINE', icon: Server, color: 'text-green-400' },
            { label: 'Total Channels', value: referralsData.length, icon: Network, color: 'text-accent' },
            { label: 'Filtered Portals', value: filteredNodes.length, icon: Cpu, color: 'text-accent' },
            { label: 'Active Category', value: selectedCategory, icon: Terminal, color: 'text-accent' }
          ].map((stat, i) => (
            <div key={i} className="border border-border-subtle bg-bg-1/40 p-4 font-mono rounded-sm select-none relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={48} />
              </div>
              <span className="text-[9px] uppercase tracking-widest text-text-3 block mb-1">{stat.label}</span>
              <div className="flex items-center gap-2">
                <stat.icon size={12} className={stat.color} />
                <span className="text-[12px] font-bold text-text-0">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters Controller */}
        <div className="relative z-10 border border-border-subtle bg-bg-1/25 p-4 rounded-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* Console Input Search Bar */}
            <div className="relative w-full md:flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/60 flex items-center gap-1.5 font-mono text-[10px]">
                <Search size={14} className="text-accent" />
                <span className="opacity-40">// QUERY &gt;</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search portals by name, benefits, keywords..."
                className="w-full pl-28 pr-10 py-3 bg-bg-1 border border-border-subtle focus:border-accent text-text-1 font-mono text-[12px] rounded-sm outline-none transition-all placeholder:text-text-3/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 hover:text-accent transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Ingestion Speed Indicators (Mock) */}
            <div className="hidden lg:flex items-center gap-4 font-mono text-[9px] tracking-wider text-text-3 shrink-0 border-l border-border-subtle pl-4">
              <div>
                BANDWIDTH: <span className="text-text-0">1.2 GB/S</span>
              </div>
              <div className="h-4 w-[1px] bg-border-subtle" />
              <div>
                CONTEXT: <span className="text-accent animate-pulse">SYNCED</span>
              </div>
            </div>
          </div>

          {/* Dynamic Cyber Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none font-mono text-[9px]">
            <span className="text-text-3 uppercase tracking-widest mr-2 select-none shrink-0">// CATEGORIES:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 border rounded-sm transition-all select-none uppercase tracking-widest shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-accent/15 border-accent text-accent shadow-[0_0_10px_rgba(0,225,207,0.1)]'
                    : 'bg-bg-1 border-border-subtle text-text-3 hover:border-accent/30 hover:text-text-1'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portal Listings */}
        <div className="relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredNodes.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredNodes.map((node: Referral, index: number) => {
                  const isCopied = copiedId === node.id;
                  return (
                    <TiltCard key={node.id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="h-full border border-border-subtle bg-bg-1/45 p-6 relative overflow-hidden group hover:border-accent/40 transition-colors flex flex-col justify-between"
                      >
                        {/* Background Cyber Grid Accent */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none">
                          <Cpu size={90} />
                        </div>

                        <div>
                          {/* Header metadata */}
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div>
                              <span className="font-mono text-[9px] text-accent uppercase tracking-widest block mb-1">
                                [{node.category}]
                              </span>
                              <h3 className="text-base font-bold text-text-0 tracking-wide font-sans flex items-center gap-2">
                                {node.name}
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                </span>
                              </h3>
                            </div>
                            <span className="font-mono text-[8px] px-1.5 py-0.5 bg-bg-1 border border-border-subtle rounded-sm text-text-3 select-none">
                              ROUTE_0{index + 1}
                            </span>
                          </div>

                          {/* Benefit payload description */}
                          <p className="font-mono text-[10px] leading-relaxed text-text-2 bg-bg/60 border-l border-accent p-3 mb-6 relative overflow-hidden">
                            <span className="text-accent/60 block text-[8px] mb-1 font-bold uppercase tracking-wider">// PAYLOAD BENEFITS:</span>
                            {node.benefit}
                          </p>
                        </div>

                        {/* Connection Route Actions */}
                        <div className="space-y-3 pt-2 relative z-10">
                          <div className="flex items-center justify-between text-[9px] font-mono border-t border-border-subtle/50 pt-3">
                            <span className="text-text-3">ROUTING CODE:</span>
                            <span className="text-text-1 font-bold truncate max-w-[150px]" title={node.code}>
                              {node.code}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-1">
                            {/* Copy Link Code */}
                            <button
                              onClick={() => handleCopy(node.code, node.id)}
                              className={`py-2 px-2.5 border font-mono text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none rounded-sm ${
                                isCopied
                                  ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                                  : 'bg-bg border-border hover:border-accent hover:text-accent'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check size={11} className="shrink-0" />
                                  <span>SAVED</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} className="shrink-0 group-hover:scale-110 transition-transform" />
                                  <span>COPY</span>
                                </>
                              )}
                            </button>

                            {/* Establish Link Gate */}
                            <a
                              href={node.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2 px-2.5 bg-accent text-bg hover:bg-white border border-transparent font-mono text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:shadow-[0_0_12px_rgba(0,225,207,0.25)] transition-all select-none rounded-sm"
                            >
                              <span>ROUTE</span>
                              <ExternalLink size={10} className="shrink-0" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    </TiltCard>
                  );
                })}
              </motion.div>
            ) : (
              /* Immersive Retro Cyberpunk Search Fallback Warning */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-red-500/20 bg-red-500/5 p-8 text-center rounded-sm font-mono max-w-lg mx-auto"
              >
                <ShieldAlert className="text-red-500 mx-auto mb-4 animate-bounce" size={32} />
                <h3 className="text-red-400 text-[12px] uppercase tracking-widest font-bold mb-2">
                  [ERROR: NO PORTAL SIGNATURES MATCHED]
                </h3>
                <p className="text-text-3 text-[10px] leading-relaxed">
                  The current ingestion query: <strong className="text-red-400">"{searchQuery}"</strong> did not yield matching channel routes in <span className="text-text-1">referrals.json</span>. Re-enter query telemetry or reset filters.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                  className="mt-4 px-4 py-2 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white transition-colors uppercase text-[9px] tracking-widest"
                >
                  Reset Telemetry Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Cyber Footer */}
      <footer className="py-12 border-t border-border-subtle bg-bg-1/40 px-6 relative z-10 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-[9px] text-text-3 flex items-center gap-4">
            <span>© 2026 NICHSEDGE</span>
            <span className="opacity-20">|</span>
            <span className="animate-pulse flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-accent" /> SYSTEM_STABLE
            </span>
          </div>
          <div>
            <a href="#" className="font-mono text-[9px] uppercase tracking-widest text-text-3 hover:text-accent">Scroll_to_Top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
