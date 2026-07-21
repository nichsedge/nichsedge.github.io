'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Server, Terminal, Cpu, AlertCircle, Search, X } from 'lucide-react';

import { Navbar } from '@/components/navbar';
import { InteractiveGrid } from '@/components/interactive-grid';
import { MatrixRain } from '@/components/matrix-rain';
import { TiltCard } from '@/components/tilt-card';
import { DecryptedText } from '@/components/decrypted-text';
import { useWideLayout } from '@/hooks/use-wide-layout';
import payData from '@/data/pay.json';

interface PayNode {
  id: string;
  name: string;
  category: string;
  number: string;
  recipient: string;
  details: string;
  details_id: string;
}

// Logo Components
const ShopeePayLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-sm select-none shrink-0" fill="currentColor">
    <rect width="100" height="100" rx="20" fill="#EE4D2D" />
    <path d="M50 25c-8 0-11 5-11 11v4h22v-4c0-6-3-11-11-11zm-8 15v-4c0-4 2-8 8-8s8 4 8 8v4h2z" fill="none" stroke="white" strokeWidth="4" />
    <path d="M28 40h44l-4 38H32z" fill="white" />
    <path d="M46 51c-2 0-3 1-3 2v1c0 1 1 1 3 2l3 1c4 1 5 3 5 6v1c0 3-2 5-6 5s-6-2-6-5h4c0 1 1 2 2 2s2-1 2-2v-1c0-1-1-1-3-2l-3-1c-4-1-5-3-5-6v-1c0-3 2-5 6-5s6 2 6 5h-4c0-1-1-2-2-2z" fill="#EE4D2D" />
  </svg>
);

const GoPayLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-sm select-none shrink-0" fill="currentColor">
    <rect width="100" height="100" rx="20" fill="#00AED6" />
    <circle cx="50" cy="50" r="22" fill="none" stroke="white" strokeWidth="8" />
    <circle cx="50" cy="50" r="10" fill="white" />
  </svg>
);

const OvoLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-sm select-none shrink-0" fill="currentColor">
    <rect width="100" height="100" rx="20" fill="#4C2A86" />
    <path d="M50 25c-13.8 0-25 11.2-25 25s11.2 25 25 25 25-11.2 25-25-11.2-25-25-25zm0 8c9.4 0 17 7.6 17 17s-7.6 17-17 17-17-7.6-17-17 7.6-17 17-17z" fill="white" />
    <circle cx="50" cy="50" r="9" fill="#15C29E" />
  </svg>
);

const MandiriLogo = () => (
  <svg viewBox="0 0 120 100" className="w-12 h-10 rounded-sm select-none shrink-0" fill="currentColor">
    <rect width="120" height="100" rx="20" fill="#003B7A" />
    <path d="M25 45c10-8 25-5 35 3s15 15 25 8c2-2 4-5 5-8H25v7z" fill="#F2A900" />
    <path d="M25 35c15-10 35-5 45 5s10 15 20 10c0-5 0-10-5-15H25v5z" fill="#1CACE4" />
    <path d="M45 60h4v15h-4zm8 0h4v15h-4zm8 0h4v15h-4zm12-5v5H41v-5l20-8z" fill="white" />
  </svg>
);

const BniLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 rounded-sm select-none shrink-0" fill="none">
    <rect width="100" height="100" rx="20" fill="#005A6F" />
    <circle cx="50" cy="50" r="24" fill="#E05B13" />
    <path d="M42 35h5v30h-5zm11 0h4l6 18V35h5v30h-4l-6-18v18h-5z" fill="white" />
  </svg>
);

const AladinLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 rounded-sm select-none shrink-0" fill="none">
    <rect width="100" height="100" rx="20" fill="#581B8C" />
    <path d="M30 50c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z" fill="none" stroke="white" strokeWidth="6" />
    <path d="M50 38c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12z" fill="#00C07F" />
  </svg>
);

const KromLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 rounded-sm select-none shrink-0" fill="none">
    <rect width="100" height="100" rx="20" fill="#3D0066" />
    <path d="M30 25h12v20l18-20h15L56 47l22 28H62L42 52v23H30z" fill="white" />
  </svg>
);

const JagoLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 rounded-sm select-none shrink-0" fill="none">
    <rect width="100" height="100" rx="20" fill="#1F5A4E" />
    <circle cx="50" cy="50" r="22" fill="#F8A51D" />
    <path d="M50 35v30M35 50h30" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const SuperbankLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 rounded-sm select-none shrink-0" fill="none">
    <rect width="100" height="100" rx="20" fill="#FFE500" />
    <path d="M30 35c0-5 4-9 9-9h22c5 0 9 4 9 9v6c0 5-4 9-9 9H39c-5 0-9 4-9 9v6c0 5 4 9 9 9h22c5 0 9-4 9-9" stroke="black" strokeWidth="10" strokeLinecap="round" />
  </svg>
);

const renderLogos = (id: string) => {
  switch (id) {
    case 'ewallets':
      return (
        <div className="flex gap-2 items-center">
          <ShopeePayLogo />
          <GoPayLogo />
          <OvoLogo />
        </div>
      );
    case 'mandiri':
      return <MandiriLogo />;
    case 'bni':
      return <BniLogo />;
    case 'aladin':
      return <AladinLogo />;
    case 'krom':
      return <KromLogo />;
    case 'jago':
      return <JagoLogo />;
    case 'superbank':
      return <SuperbankLogo />;
    default:
      return null;
  }
};

export default function PayClient({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  useWideLayout('lg');
  const [isNSM, setIsNSM] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = async (number: string, id: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy account details', err);
    }
  };

  const translations = {
    title: locale === 'id' ? 'Detail Pembayaran' : 'Payment Details',
    subtitle: locale === 'id' ? 'Metode Transfer & Akun' : 'Transfer Methods & Accounts',
    desc: locale === 'id' 
      ? 'Daftar terverifikasi untuk rekening bank dan e-wallet. Pilih salah satu rute pembayaran di bawah ini dan salin nomor akun untuk menyelesaikan transaksi Anda.'
      : 'A verified list of bank accounts and e-wallets. Choose a payment method below and copy the account number to complete your transaction.',
    status: locale === 'id' ? 'Status' : 'Status',
    totalNodes: locale === 'id' ? 'Metode Aktif' : 'Active Methods',
    integrity: locale === 'id' ? 'Keamanan Rute' : 'Route Security',
    limitLabel: locale === 'id' ? 'Kecepatan Transfer' : 'Transfer Speed',
    routingCode: locale === 'id' ? 'NOMOR AKUN' : 'ACCOUNT NUMBER',
    recipientLabel: locale === 'id' ? 'ATAS NAMA' : 'RECIPIENT NAME',
    payloadDesc: locale === 'id' ? 'INFORMASI:' : 'INFORMATION:',
    saved: locale === 'id' ? 'TERSALIN' : 'SAVED',
    copy: locale === 'id' ? 'SALIN' : 'COPY',
    secure: locale === 'id' ? 'Transfer Aman' : 'Secure Transfer',
    active: locale === 'id' ? 'Aktif' : 'Active',
    methodsCount: locale === 'id' ? `${payData.length} Metode` : `${payData.length} Methods`,
    instant: locale === 'id' ? 'Instan' : 'Instant',
    searchPlaceholder: locale === 'id' ? 'cari berdasarkan nama, bank, nomor akun...' : 'search by name, bank, account number...',
    noResultsTitle: locale === 'id' ? 'Tidak Ada Hasil' : 'No Results Found',
    noResultsDesc: locale === 'id' ? 'Metode pembayaran tidak ditemukan. Silakan masukkan kata kunci pencarian lainnya.' : 'No matching payment methods found. Please enter a different keyword.',
    resetSearch: locale === 'id' ? 'Reset Pencarian' : 'Reset Search',
  };

  const filteredNodes = payData.filter((node: PayNode) => {
    const query = searchQuery.toLowerCase();
    return (
      node.name.toLowerCase().includes(query) ||
      node.category.toLowerCase().includes(query) ||
      node.number.toLowerCase().includes(query) ||
      node.recipient.toLowerCase().includes(query) ||
      node.details.toLowerCase().includes(query) ||
      node.details_id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen relative bg-bg">
      <MatrixRain active={isNSM} />
      <Navbar isNSM={isNSM} toggleNSM={() => setIsNSM(!isNSM)} />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative z-20">
        
        {/* Background Grid Accent */}
        <InteractiveGrid />

        {/* Hero Title */}
        <div className="relative mb-12 border-b border-border-subtle pb-8">
          <div className="absolute top-0 right-0 font-mono text-[9px] text-text-3 text-right hidden md:block">
            <span>SYS_LOC: /PAY</span><br/>
            <span className="text-accent">STATUS: READY</span>
          </div>

          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] font-bold block mb-3">
            <DecryptedText text={locale === 'id' ? "06 — INFORMASI TRANSFER FINANSIAL" : "06 — FINANCIAL TRANSFER INFO"} speed={25} />
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-text-0 tracking-tight font-sans mb-4">
            {translations.title} <span className="text-accent underline decoration-accent/20 underline-offset-4">{translations.subtitle}</span>
          </h1>
          <p className="text-[13px] leading-relaxed text-text-3 max-w-[600px] font-light">
            {translations.desc}
          </p>
        </div>

        {/* Telemetry Status Bar */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: translations.status, value: translations.active, icon: Server, color: 'text-green-400' },
            { label: translations.totalNodes, value: translations.methodsCount, icon: Cpu, color: 'text-accent' },
            { label: translations.integrity, value: translations.secure, icon: Terminal, color: 'text-accent' },
            { label: translations.limitLabel, value: translations.instant, icon: AlertCircle, color: 'text-accent' }
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

        {/* Search Controller */}
        <div className="relative z-10 border border-border-subtle bg-bg-1/25 p-4 rounded-sm mb-10">
          <div className="relative w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/60 flex items-center gap-1.5 font-mono text-[10px]">
              <Search size={14} className="text-accent" />
              <span className="opacity-60">SEARCH &gt;</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translations.searchPlaceholder}
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
        </div>

        {/* Listings Grid */}
        <div className="relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredNodes.length > 0 ? (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNodes.map((node: PayNode) => {

                  const isCopied = copiedId === node.id;
                  return (
                    <TiltCard key={node.id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="h-full border border-border-subtle bg-bg-1/45 p-6 relative overflow-hidden group hover:border-accent/40 transition-colors flex flex-col justify-between"
                      >
                        {/* Background Cyber Grid Accent */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none">
                          {renderLogos(node.id)}
                        </div>

                        <div>
                          {/* Header metadata */}
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div>
                              <span className="font-mono text-[9px] text-accent uppercase tracking-widest block mb-1">
                                {node.category}
                              </span>
                              <h3 className="text-base font-bold text-text-0 tracking-wide font-sans flex items-center gap-2">
                                {node.name}
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                </span>
                              </h3>
                            </div>
                            <div className="p-1 shrink-0">
                              {renderLogos(node.id)}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="font-mono text-[10px] leading-relaxed text-text-2 bg-bg/60 border-l border-accent p-3 mb-6 relative overflow-hidden">
                            <span className="text-accent/60 block text-[8px] mb-1 font-bold uppercase tracking-wider">// {translations.payloadDesc}</span>
                            {locale === 'id' ? node.details_id : node.details}
                          </p>
                        </div>

                        {/* Recipient Details & Copy actions */}
                        <div className="space-y-3 pt-2 relative z-10 border-t border-border-subtle/50">
                          <div className="flex justify-between items-center text-[10px] font-mono gap-1">
                            <span className="text-text-3">{translations.recipientLabel}:</span>
                            <span className="text-text-1 font-bold tracking-wide uppercase">
                              {node.recipient}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2 pt-1">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-text-3">{translations.routingCode}:</span>
                              <span className="text-text-0 font-bold tracking-widest text-xs select-all">
                                {node.number}
                              </span>
                            </div>

                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopy(node.number, node.id)}
                              className={`py-2 px-3 border font-mono text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none rounded-sm w-full ${
                                isCopied
                                  ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                                  : 'bg-bg border-border hover:border-accent hover:text-accent'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check size={11} className="shrink-0" />
                                  <span>{translations.saved}</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} className="shrink-0 group-hover:scale-110 transition-transform" />
                                  <span>{translations.copy}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </TiltCard>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-red-500/20 bg-red-500/5 p-8 text-center rounded-sm font-mono max-w-lg mx-auto"
              >
                <AlertCircle className="text-red-500 mx-auto mb-4" size={32} />
                <h3 className="text-red-400 text-[12px] uppercase tracking-widest font-bold mb-2">
                  {translations.noResultsTitle}
                </h3>
                <p className="text-text-3 text-[10px] leading-relaxed mb-4">
                  {translations.noResultsDesc}
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white transition-colors uppercase text-[9px] tracking-widest"
                >
                  {translations.resetSearch}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Warning Notice */}
        <div className="relative z-10 border border-yellow-500/20 bg-yellow-500/5 p-4 rounded-sm font-mono text-[10px] leading-relaxed text-text-3 mt-10 flex gap-3 items-start">
          <AlertCircle className="text-yellow-500 shrink-0" size={16} />
          <div>
            <span className="text-yellow-500 font-bold block mb-1">// IMPORTANT:</span>
            {locale === 'id' 
              ? 'Verifikasi nama penerima sebelum menyelesaikan transfer. Pastikan nama penerima sesuai dengan detail di atas.'
              : 'Please verify the recipient name before completing the transfer. Make sure it matches the account details shown above.'
            }
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border-subtle bg-bg-1/40 px-6 relative z-10 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-[9px] text-text-3 flex items-center gap-4">
            <span>© 2026 NICHSEDGE</span>
            <span className="opacity-20">|</span>
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-accent" /> {locale === 'id' ? 'SISTEM AKTIF' : 'SYSTEM ACTIVE'}
            </span>
          </div>
          <div>
            <a href="#" className="font-mono text-[9px] uppercase tracking-widest text-text-3 hover:text-accent">
              {locale === 'id' ? 'Gulir ke Atas' : 'Scroll to Top'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
