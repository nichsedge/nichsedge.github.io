'use client';

// Re-creating the essential navbar component
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, ZapOff, ExternalLink } from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import { useNSM } from '@/lib/nsm';

export function Navbar({ isNSM: propIsNSM, toggleNSM: propToggleNSM }: { isNSM?: boolean, toggleNSM?: () => void } = {}) {
  const globalNSM = useNSM();
  const isNSM = propIsNSM !== undefined ? propIsNSM : globalNSM.isNSM;
  const toggleNSM = propToggleNSM !== undefined ? propToggleNSM : globalNSM.toggleNSM;
  const pathname = usePathname() || '/';
  const isIndonesian = pathname.startsWith('/id');

  // Localize internal link resolution with consistent trailing slash matching next.config.ts
  const localizedHref = (href: string) => {
    if (href.startsWith('http') || href.startsWith('mailto')) return href;
    const normalized = href === '/' ? '/' : (href.endsWith('/') ? href : `${href}/`);
    if (isIndonesian) {
      return normalized === '/' ? '/id/' : `/id${normalized}`;
    }
    return normalized;
  };

  const links = [
    { name: isIndonesian ? 'beranda' : 'home', href: '/' },
    { name: isIndonesian ? 'karir' : 'work', href: '/work/' },
    { name: isIndonesian ? 'proyek' : 'projects', href: '/projects/' },
    { name: isIndonesian ? 'data lake' : 'data lake', href: '/data-lake/' },
    { name: isIndonesian ? 'kebun digital' : 'garden', href: 'https://nichsedge.github.io/digital-garden/', external: true },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 py-3 bg-bg/80 backdrop-blur-md border-b border-border-subtle font-mono text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 min-w-0 mr-2 sm:mr-3">
        {links.map((link) => (
          <React.Fragment key={link.href}>
            {link.external ? (
              <a 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                title={isIndonesian ? "Kebun Digital (Tautan Eksternal)" : "Digital Garden (External Link)"}
                onClick={() => soundEngine.playClick(900)}
                className="hover:text-text-0 transition-colors group flex items-center whitespace-nowrap shrink-0"
              >
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity mr-1 font-bold">[</span>
                <span>{link.name}</span>
                <ExternalLink size={10} className="ml-1 opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all shrink-0" />
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-1 font-bold">]</span>
              </a>
            ) : (
              <Link 
                href={localizedHref(link.href)} 
                onClick={() => soundEngine.playClick(900)}
                className="hover:text-text-0 transition-colors group flex items-center whitespace-nowrap shrink-0"
              >
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity mr-1 font-bold">[</span>
                {link.name}
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-1 font-bold">]</span>
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 text-accent/60 shrink-0 ml-2 sm:ml-3">
        <button 
          onClick={() => {
            soundEngine.playClick(1100);
            window.dispatchEvent(new CustomEvent('open-command-palette'));
          }}
          title={isIndonesian ? "Cari Telemetri (Ctrl+K)" : "Search Telemetry (Ctrl+K)"}
          className="hover:text-accent transition-colors group flex items-center bg-accent/5 px-2 py-0.5 rounded-sm border border-accent/20 hover:border-accent/40 whitespace-nowrap cursor-pointer"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="size-3 sm:size-2.5 sm:mr-1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="hidden sm:inline">{isIndonesian ? 'Cari' : 'Search'}</span>
          <span className="hidden md:inline ml-1.5 opacity-40 text-[8px] font-mono">[Ctrl+K]</span>
        </button>
        <button 
          onClick={toggleNSM}
          title={isNSM ? "Disable Neural Link" : "Enable Neural Link"}
          className={`flex items-center gap-1.5 p-1 sm:px-2 sm:py-0.5 border rounded-sm transition-all whitespace-nowrap cursor-pointer ${isNSM ? 'bg-accent/20 border-accent text-accent' : 'bg-bg-1 border-border-subtle hover:border-accent/40'}`}
        >
          {isNSM ? <Zap size={11} className="animate-pulse" /> : <ZapOff size={11} />}
          <span className="text-[9px] uppercase tracking-tighter hidden sm:inline">{isNSM ? 'NSM_ACTIVE' : 'SYNC_OFF'}</span>
        </button>
      </div>
    </nav>
  );
}


