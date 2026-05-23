// Re-creating the essential navbar component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, ZapOff } from 'lucide-react';

export function Navbar({ isNSM, toggleNSM }: { isNSM?: boolean, toggleNSM?: () => void }) {
  const pathname = usePathname() || '/';
  const isIndonesian = pathname.startsWith('/id');

  // Localize internal link resolution
  const localizedHref = (href: string) => {
    if (href.startsWith('http') || href.startsWith('mailto')) return href;
    if (isIndonesian) {
      return href === '/' ? '/id/' : `/id${href}`;
    }
    return href;
  };

  const links = [
    { name: isIndonesian ? 'beranda' : 'home', href: '/' },
    { name: isIndonesian ? 'karir' : 'work', href: '/work' },
    { name: isIndonesian ? 'proyek' : 'projects', href: '/projects' },
    { name: isIndonesian ? 'data lake' : 'data lake', href: '/data-lake' },
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
                className="hover:text-text-0 transition-colors group flex items-center whitespace-nowrap shrink-0"
              >
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity mr-1 font-bold">[</span>
                {link.name}
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-1 font-bold">]</span>
              </a>
            ) : (
              <Link href={localizedHref(link.href)} className="hover:text-text-0 transition-colors group flex items-center whitespace-nowrap shrink-0">
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity mr-1 font-bold">[</span>
                {link.name}
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-1 font-bold">]</span>
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 text-accent/60 shrink-0 ml-2 sm:ml-3">
        <Link 
          href={isIndonesian ? "/id/terminal/" : "/terminal"} 
          title={isIndonesian ? "Konsol Terminal" : "Terminal Console"}
          className="hover:text-accent transition-colors group flex items-center bg-accent/5 p-1 sm:px-2 sm:py-0.5 rounded-sm border border-accent/20 hover:border-accent/40 whitespace-nowrap"
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
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span className="hidden sm:inline">{isIndonesian ? 'Terminal' : 'Terminal'}</span>
        </Link>
        {toggleNSM && (
          <button 
            onClick={toggleNSM}
            title={isNSM ? "Disable Neural Link" : "Enable Neural Link"}
            className={`flex items-center gap-1.5 p-1 sm:px-2 sm:py-0.5 border rounded-sm transition-all whitespace-nowrap ${isNSM ? 'bg-accent/20 border-accent text-accent' : 'bg-bg-1 border-border-subtle hover:border-accent/40'}`}
          >
            {isNSM ? <Zap size={11} className="animate-pulse" /> : <ZapOff size={11} />}
            <span className="text-[9px] uppercase tracking-tighter hidden sm:inline">{isNSM ? 'NSM_ACTIVE' : 'SYNC_OFF'}</span>
          </button>
        )}
      </div>
    </nav>
  );
}

