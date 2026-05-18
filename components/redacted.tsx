'use client';
import React from 'react';

export function Redacted({ children, info = "CLASSIFIED" }: { children: React.ReactNode, info?: string }) {
  return (
    <span className="relative inline-block group cursor-help transition-all duration-300 px-1.5 py-0.5 mx-1 align-bottom">
      {/* Black sharpie box */}
      <span className="absolute inset-0 bg-text-0 group-hover:bg-accent/10 border-b-2 border-text-0 group-hover:border-accent transition-colors duration-300 z-0" />
      
      {/* Hidden text that reveals on hover */}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10 text-accent font-mono text-[0.95em]">
        {children}
      </span>
      
      {/* Small classified text that disappears on hover */}
      <span className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 font-mono text-[7px] md:text-[8px] tracking-[0.2em] font-bold text-bg z-20 pointer-events-none">
        {info}
      </span>
    </span>
  );
}
