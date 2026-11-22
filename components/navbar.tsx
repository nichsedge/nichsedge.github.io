'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, ZapOff, ExternalLink, Search } from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import { useNSM } from '@/lib/nsm';

const ID_SUPPORTED_ROUTES = new Set(['/', '/work', '/projects', '/data-lake', '/terminal', '/referrals', '/pay']);

export function Navbar({ isNSM: propIsNSM, toggleNSM: propToggleNSM }: { isNSM?: boolean, toggleNSM?: () => void } = {}) {
  const globalNSM = useNSM();
  const isNSM = propIsNSM !== undefined ? propIsNSM : globalNSM.isNSM;
  const toggleNSM = propToggleNSM !== undefined ? propToggleNSM : globalNSM.toggleNSM;
  const pathname = usePathname() || '/';
  const isIndonesian = pathname === '/id' || pathname.startsWith('/id/');

  // Normalize current route without locale prefix and trailing slash for active comparisons
  const normalizedCurrent = (() => {
    const stripped = isIndonesian ? (pathname.replace(/^\/id(?=\/|$)/, '') || '/') : pathname;
    return stripped.length > 1 && stripped.endsWith('/') ? stripped.slice(0, -1) : stripped;
  })();

  // Localize internal link resolution with consistent trailing slash matching next.config.mjs
  const localizedHref = (href: string) => {
    if (href.startsWith('http') || href.startsWith('mailto')) return href;
    const normalized = href === '/' ? '/' : (href.endsWith('/') ? href : `${href}/`);
    if (isIndonesian) {
      return normalized === '/' ? '/id/' : `/id${normalized}`;
    }
    return normalized;
  };

  // Locale toggle target: preserve current route if Indonesian version exists, else fall back to /id/
  const localeSwitchHref = isIndonesian
    ? (normalizedCurrent === '/' ? '/' : `${normalizedCurrent}/`)
    : (ID_SUPPORTED_ROUTES.has(normalizedCurrent)
        ? (normalizedCurrent === '/' ? '/id/' : `/id${normalizedCurrent}/`)
        : '/id/');

  const links = [
    { name: isIndonesian ? 'beranda' : 'home', href: '/', match: '/' },
    { name: isIndonesian ? 'karir' : 'work', href: '/work/', match: '/work' },
    { name: isIndonesian ? 'proyek' : 'projects', href: '/projects/', match: '/projects' },
    { name: 'data lake', href: '/data-lake/', match: '/data-lake' },
    { name: isIndonesian ? 'kebun digital' : 'garden', href: 'https://nichsedge.github.io/digital-garden/', external: true },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-bg/85 backdrop-blur-md border-b border-border-subtle font-mono text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 min-w-0 mr-2 sm:mr-3 mask-scroll-fade">
        {links.map((link) => {
          const isActive = !link.external && normalizedCurrent === link.match;
          return (
            <React.Fragment key={link.href}>
              {link.external ? (
                <a 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title={isIndonesian ? "Kebun Digital (Tautan Eksternal)" : "Digital Garden (External Link)"}
                  onClick={() => soundEngine.playClick(900)}
                  className="text-text-2 hover:text-text-0 transition-colors group flex items-center whitespace-nowrap shrink-0 py-1"
                >
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity mr-1 font-bold">[</span>
                  <span>{link.name}</span>
                  <ExternalLink size={10} className="ml-1 opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all shrink-0" />
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-1 font-bold">]</span>
                </a>
              ) : (
                <Link 
                  href={localizedHref(link.href)} 
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => soundEngine.playClick(900)}
                  className={`transition-colors group flex items-center whitespace-nowrap shrink-0 py-1 ${
                    isActive ? 'text-text-0 font-bold' : 'text-text-2 hover:text-text-0'
                  }`}
                >
                  <span className={`text-accent transition-opacity mr-1 font-bold ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>[</span>
                  {link.name}
                  <span className={`text-accent transition-opacity ml-1 font-bold ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>]</span>
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 text-accent/80 shrink-0 ml-2 sm:ml-3">
        <Link
          href={localeSwitchHref}
          onClick={() => soundEngine.playClick(850)}
          title={isIndonesian ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          className="px-1.5 py-0.5 rounded-sm border border-border-subtle bg-bg-1 text-text-2 hover:text-accent hover:border-accent/40 transition-colors whitespace-nowrap shrink-0"
        >
          {isIndonesian ? 'EN' : 'ID'}
        </Link>
        <button 
          onClick={() => {
            soundEngine.playClick(1100);
            window.dispatchEvent(new CustomEvent('open-command-palette'));
          }}
          title={isIndonesian ? "Cari & Tanya Oracle AI (Ctrl+K)" : "Search & Ask AI Oracle (Ctrl+K)"}
          className="hover:text-accent transition-colors group flex items-center bg-accent/10 px-2 py-0.5 rounded-sm border border-accent/25 hover:border-accent/50 whitespace-nowrap cursor-pointer"
        >
          <Search size={12} className="sm:mr-1.5 shrink-0" />
          <span className="hidden sm:inline">{isIndonesian ? 'Cari / AI' : 'Search / AI'}</span>
          <span className="hidden md:inline ml-1.5 opacity-60 text-[10px] font-mono">⌘K</span>
        </button>
        <button 
          onClick={toggleNSM}
          title={isNSM ? "Disable Neural Link" : "Enable Neural Link"}
          aria-pressed={isNSM}
          className={`flex items-center gap-1.5 p-1 sm:px-2 sm:py-0.5 border rounded-sm transition-all whitespace-nowrap cursor-pointer ${isNSM ? 'bg-accent/20 border-accent text-accent' : 'bg-bg-1 border-border-subtle text-text-3 hover:text-accent hover:border-accent/40'}`}
        >
          {isNSM ? <Zap size={11} /> : <ZapOff size={11} />}
          <span className="text-[10px] uppercase tracking-tighter hidden sm:inline">{isNSM ? 'NSM' : 'SYNC'}</span>
        </button>
      </div>
    </nav>
  );
}


