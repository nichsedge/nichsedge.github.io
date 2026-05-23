'use client';
import React, { useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
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
      { name: 'CMH', lat: 0.45, lon: 0.82 },  // Cimahi
      { name: 'BDG', lat: 0.48, lon: 0.86 },  // Bandung
      { name: 'JKT', lat: 0.41, lon: 0.72 },  // Jakarta
      { name: 'SIN', lat: 0.32, lon: 0.58 },  // Singapore
      { name: 'SUB', lat: 0.54, lon: 1.05 },  // Surabaya
      { name: 'IKN', lat: 0.28, lon: 1.28 },  // Balikpapan / Nusantara
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
          // Draw active connection lines
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.fill();
          
          // Draw text label on canvas
          ctx.fillStyle = `${accent}cc`;
          ctx.font = 'bold 7px var(--font-mono), monospace';
          ctx.fillText(node.name, x + 5, y - 2);
          
          if (idx > 0 && Math.random() > 0.4) {
             const prev = nodes[idx - 1];
             const pTheta = prev.lat * Math.PI;
             const pPhi = prev.lon * Math.PI + time * 0.8;
             const px = cx + r * Math.sin(pTheta) * Math.cos(pPhi);
             const py = cy + r * Math.cos(pTheta);
             const pz = r * Math.sin(pTheta) * Math.sin(pPhi);
             
             if (pz > 0) {
                  ctx.beginPath();
                  ctx.moveTo(x, y);
                  const cpx = (x + px) / 2;
                  const cpy = (y + py) / 2 - 15;
                  ctx.quadraticCurveTo(cpx, cpy, px, py);
                  ctx.strokeStyle = accent;
                  ctx.globalAlpha = 0.5;
                  ctx.stroke();
                  ctx.globalAlpha = 1.0;
             }
          }
        }
      });

      // High-performance DOM status readout updates (avoiding React re-renders)
      const nodeEl = document.getElementById('geo-routing-node');
      const pingEl = document.getElementById('geo-routing-ping');
      if (nodeEl && pingEl) {
        const cycle = Math.floor(time * 0.3) % nodes.length;
        const activeNode = nodes[cycle];
        const nextNode = nodes[(cycle + 1) % nodes.length];
        nodeEl.innerText = `${activeNode.name} >> ${nextNode.name}`;
        
        const simulatedPing = Math.floor(Math.sin(time * 2) * 2 + 8) + (cycle * 2);
        pingEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-2 h-2 animate-pulse mr-1 inline-block"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>${simulatedPing}ms`;
      }

      time += 0.015;
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
            <span className="flex items-center gap-1.5"><Globe size={10} className="text-accent" /> Geo Routing Ingestion</span>
         </div>
         <canvas ref={canvasRef} className="block opacity-85 mix-blend-screen mx-auto" />
         
         <div className="mt-2 pt-2 border-t border-border-subtle/30 flex justify-between items-center w-full opacity-70">
            <span id="geo-routing-node" className="font-mono text-[8px] text-text-3">CMH &gt;&gt; JKT</span>
            <span id="geo-routing-ping" className="font-mono text-[8px] text-accent flex items-center gap-1">6ms</span>
         </div>
       </div>
    </div>
  );
}
