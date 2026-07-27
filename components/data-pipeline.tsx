'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Database, Filter, ArrowRight } from 'lucide-react';
import { EtlNodeSimulator } from '@/components/etl-node-simulator';
import { EtlDagArchitect } from '@/components/etl-dag-architect';

export function DataPipeline({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'architect' | 'entropy'>('architect');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== 'entropy') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const getAccentColor = () => {
       const style = getComputedStyle(document.body);
       return style.getPropertyValue('--theme-accent').trim() || '#00e1cf';
    };

    const particles: { x: number, y: number, vx: number, vy: number, targetX: number, targetY: number, size: number, type: 'raw' | 'processed' }[] = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
       const cols = 15;
       const col = i % cols;
       const row = Math.floor(i / cols);
       const targetX = width / 2 - (cols * 15) / 2 + col * 15;
       const targetY = height / 2 - 40 + row * 15;

       particles.push({
         x: Math.random() * width,
         y: Math.random() * height,
         vx: (Math.random() - 0.5) * 2,
         vy: (Math.random() - 0.5) * 2,
         targetX,
         targetY,
         size: Math.random() * 1.5 + 1,
         type: 'raw'
       });
    }

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const accent = getAccentColor();

      particles.forEach((p, idx) => {
        if (isProcessing) {
          p.x += (p.targetX - p.x) * 0.1;
          p.y += (p.targetY - p.y) * 0.1;
          p.type = 'processed';
        } else {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          p.type = 'raw';
        }

        ctx.fillStyle = isProcessing ? accent : 'rgba(161, 161, 170, 0.4)';
        
        ctx.beginPath();
        if (isProcessing) {
          ctx.rect(p.x, p.y, p.size * 1.5, p.size * 1.5);
        } else {
           ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();
        
        if (isProcessing && idx % 15 !== 14 && idx < particles.length - 1) {
           const next = particles[idx + 1];
           ctx.beginPath();
           ctx.moveTo(p.x + p.size, p.y + p.size/2);
           ctx.lineTo(next.x, next.y + next.size/2);
           ctx.strokeStyle = accent;
           ctx.globalAlpha = 0.1;
           ctx.stroke();
           ctx.globalAlpha = 1;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isProcessing, activeTab]);

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('architect')}
            className={`px-3 py-1 font-mono text-[10px] uppercase tracking-widest rounded transition-all cursor-pointer ${
              activeTab === 'architect'
                ? 'bg-accent text-bg font-bold shadow-[0_0_12px_rgba(0,225,207,0.3)]'
                : 'text-text-3 hover:text-accent bg-bg-1'
            }`}
          >
            {locale === 'id' ? 'Architect DAG Canvas' : 'Architect DAG Canvas'}
          </button>

          <button
            onClick={() => setActiveTab('entropy')}
            className={`px-3 py-1 font-mono text-[10px] uppercase tracking-widest rounded transition-all cursor-pointer ${
              activeTab === 'entropy'
                ? 'bg-accent text-bg font-bold shadow-[0_0_12px_rgba(0,225,207,0.3)]'
                : 'text-text-3 hover:text-accent bg-bg-1'
            }`}
          >
            {locale === 'id' ? 'Engine Partikel Entropi' : 'Chaos Particle Engine'}
          </button>
        </div>

        <span className="hidden sm:inline font-mono text-[9px] text-accent/60 tracking-widest">
          SYS_PIPELINE_V3.8
        </span>
      </div>

      {activeTab === 'architect' ? (
        <EtlDagArchitect locale={locale} />
      ) : (
        <div className="space-y-6">
          <EtlNodeSimulator locale={locale} />

          <div className="w-full relative bg-bg-1/50 border border-border-subtle rounded-sm overflow-hidden h-[260px]">
             <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center z-10 border-b border-border-subtle bg-bg-1/80 backdrop-blur-sm">
               <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-3">
                 <Database size={14} /> {locale === 'id' ? 'Mesin Entropi Ke Kejelasan' : 'Chaos to Clarity Particle Engine'}
               </div>
               <button 
                 onMouseEnter={() => setIsProcessing(true)}
                 onMouseLeave={() => setIsProcessing(false)}
                 onTouchStart={(e) => { e.preventDefault(); setIsProcessing(true); }}
                 onTouchEnd={() => setIsProcessing(false)}
                 className={`px-3 py-1 font-mono text-[10px] uppercase tracking-widest border transition-all flex items-center gap-2 ${
                   isProcessing 
                     ? 'bg-accent/20 border-accent/50 text-accent shadow-[0_0_15px_rgba(0,225,207,0.3)]' 
                     : 'bg-bg border-border-subtle text-text-2 hover:border-accent hover:text-accent'
                 }`}
               >
                 <Filter size={12} /> {isProcessing ? (locale === 'id' ? 'Mengekstrak...' : 'Extracting...') : (locale === 'id' ? 'Tahan untuk ETL' : 'Hold to ETL')}
               </button>
             </div>

             <canvas ref={canvasRef} className="w-full h-full block" />
             
             <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
               <div className={`font-mono text-[9px] uppercase tracking-widest transition-colors ${isProcessing ? 'text-text-3' : 'text-accent animate-pulse font-bold'}`}>
                 RAW / UNSTRUCTURED ENTROPY
               </div>
               <div className="text-text-3/50"><ArrowRight size={14} /></div>
               <div className={`font-mono text-[9px] uppercase tracking-widest transition-colors ${isProcessing ? 'text-accent animate-[pulse_0.5s_infinite] font-bold shadow-accent' : 'text-text-3'}`}>
                 STRUCTURED ANALYTICAL DATA
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}


