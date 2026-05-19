'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Copy, Check, Zap, Server, Network, Terminal } from 'lucide-react';
import { TiltCard } from './tilt-card';
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

export function ReferralGateways() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    <div className="space-y-8">
      {/* Telemetry Control Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-bg-1/30 border border-border-subtle p-4 rounded-sm font-mono text-[10px] uppercase tracking-widest text-text-3">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Server size={12} className="text-accent animate-pulse" />
            <span>ACTIVE GATEWAYS: <strong className="text-text-1">{referralsData.length}</strong></span>
          </div>
          <div className="flex items-center gap-2 border-l border-border-subtle pl-6">
            <Network size={12} className="text-accent" />
            <span>ROUTING PROTOCOL: <strong className="text-text-1">HTTPS/SECURE</strong></span>
          </div>
          <div className="flex items-center gap-2 border-l border-border-subtle pl-6">
            <Terminal size={12} className="text-accent" />
            <span>INGESTION STATUS: <strong className="text-green-400">ONLINE</strong></span>
          </div>
        </div>
        <div className="text-[9px] text-accent/70 font-semibold animate-pulse">
          // CHANNELS READY FOR TELEMETRY ROUTING
        </div>
      </div>

      {/* Gateway Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {referralsData.map((node: Referral, index: number) => {
          const isCopied = copiedId === node.id;
          return (
            <TiltCard key={node.id}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full border border-border-subtle bg-bg-1/40 p-6 relative overflow-hidden group hover:border-accent/40 transition-colors flex flex-col justify-between"
              >
                {/* Background Cyber Glow Grid Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none">
                  {node.id === 'gemini' ? <Zap size={110} /> : <Network size={110} />}
                </div>

                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <span className="font-mono text-[9px] text-accent uppercase tracking-widest block mb-1">
                        [{node.category}]
                      </span>
                      <h3 className="text-lg font-bold text-text-0 tracking-wide font-sans flex items-center gap-2">
                        {node.name}
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      </h3>
                    </div>
                    <span className="font-mono text-[9px] px-2 py-0.5 bg-bg-1 border border-border-subtle rounded-sm text-text-3 select-none">
                      NODE_0{index + 1}
                    </span>
                  </div>

                  {/* Benefit Payload */}
                  <div className="font-mono text-[11px] leading-relaxed text-text-2 bg-bg/50 border-l-2 border-accent p-3 mb-6 relative overflow-hidden">
                    <span className="text-accent/60 block text-[9px] mb-1 font-bold uppercase tracking-wider">// PAYLOAD BENEFITS:</span>
                    {node.benefit}
                  </div>
                </div>

                {/* Connection Controls / Actions */}
                <div className="space-y-3 pt-2 relative z-10">
                  <div className="flex items-center justify-between text-[10px] font-mono border-t border-border-subtle/50 pt-3">
                    <span className="text-text-3">ROUTING CODE:</span>
                    <span className="text-text-1 font-bold truncate max-w-[200px]" title={node.code}>
                      {node.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Copy Link/Code */}
                    <button
                      onClick={() => handleCopy(node.code, node.id)}
                      className={`py-2 px-3 border font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer select-none rounded-sm ${
                        isCopied
                          ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                          : 'bg-bg border-border hover:border-accent hover:text-accent'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={12} className="shrink-0" />
                          <span>KEY_SAVED</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} className="shrink-0 group-hover:scale-110 transition-transform" />
                          <span>COPY_CODE</span>
                        </>
                      )}
                    </button>

                    {/* Open Direct Route */}
                    <a
                      href={node.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-accent text-bg hover:bg-white border border-transparent font-mono text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,225,207,0.3)] transition-all select-none rounded-sm"
                    >
                      <span>ESTABLISH_LINK</span>
                      <ExternalLink size={11} className="shrink-0" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
