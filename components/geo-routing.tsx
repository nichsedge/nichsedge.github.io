'use client';
import React, { useEffect, useRef } from 'react';
import { Globe, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useGraphOpen } from '@/hooks/use-graph-open';

export function GeoRouting() {
  const isGraphOpen = useGraphOpen();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 160;
    let height = 160;
    canvas.width = width;
    canvas.height = height;

    let time = 0;
    let animationId: number;

    const nodes = [
      { lat: 0.5, lon: 0.1 },
      { lat: -0.3, lon: 0.8 },
      { lat: 0.7, lon: -0.5 },
      { lat: -0.6, lon: -0.2 },
      { lat: 0.2, lon: 1.2 },
      { lat: 0.8, lon: 1.8 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const getAccentColor = () => {
        const style = getComputedStyle(document.body);
        return style.getPropertyValue('--theme-accent').trim() || '#00e1cf';
      };
      const accent = getAccentColor();

      const cx = width / 2;
      const cy = height / 2;
      const r = 60;

      // Draw wireframe globe
      ctx.strokeStyle = `${accent}33`;
      ctx.lineWidth = 1;

      // draw latitude lines
      for (let i = 1; i < 5; i++) {
        const yOffset = (i / 5 - 0.5) * r * 1.5;
        const radius = Math.sqrt(Math.max(0, r * r - yOffset * yOffset));
        ctx.beginPath();
        ctx.ellipse(cx, cy + yOffset, radius, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // draw longitude lines
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI + time * 0.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * Math.abs(Math.cos(angle)), r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw nodes and active links
      nodes.forEach((node, idx) => {
        const theta = node.lat * Math.PI;
        const phi = node.lon * Math.PI + time * 0.8;
        
        const x = cx + r * Math.sin(theta) * Math.cos(phi);
        const y = cy + r * Math.cos(theta);
        const z = r * Math.sin(theta) * Math.sin(phi);

        if (z > 0) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.fill();
          
          if (idx > 0 && Math.random() > 0.6) {
             const prev = nodes[idx - 1];
             const pTheta = prev.lat * Math.PI;
             const pPhi = prev.lon * Math.PI + time * 0.8;
             const px = cx + r * Math.sin(pTheta) * Math.cos(pPhi);
             const py = cy + r * Math.cos(pTheta);
             const pz = r * Math.sin(pTheta) * Math.sin(pPhi);
             
             if (pz > 0) {
                 ctx.beginPath();
                 ctx.moveTo(x, y);
                 // draw an arc
                 const cpx = (x + px) / 2;
                 const cpy = (y + py) / 2 - 20;
                 ctx.quadraticCurveTo(cpx, cpy, px, py);
                 ctx.strokeStyle = accent;
                 ctx.globalAlpha = 0.6;
                 ctx.stroke();
                 ctx.globalAlpha = 1.0;
             }
          }
        }
      });

      time += 0.02;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className={`fixed top-24 right-6 2xl:right-auto 2xl:left-[calc(50%+384px)] z-40 hidden xl:flex flex-col items-end 2xl:items-start gap-2 pointer-events-none w-64 hud-widget transition-all duration-300 ${
      isGraphOpen ? 'opacity-0 pointer-events-none translate-y-2 invisible' : 'opacity-100'
    }`}>
       <div className="bg-bg/40 backdrop-blur-md border border-border-subtle p-3 rounded-sm w-full">
         <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#71717a] mb-2 font-bold justify-between pb-1 border-b border-border-subtle/50 w-full">
            <span className="flex items-center gap-1.5"><Globe size={10} className="text-accent" /> Global Routing</span>
         </div>
         <canvas ref={canvasRef} className="block opacity-80 mix-blend-screen mx-auto" />
         
         <div className="mt-2 pt-2 border-t border-border-subtle/30 flex justify-between items-center w-full opacity-70">
            <span className="font-mono text-[8px] text-text-3">ASIA-SE1</span>
            <span className="font-mono text-[8px] text-accent flex items-center gap-1"><Activity size={8}/> 14ms</span>
         </div>
       </div>
    </div>
  );
}
