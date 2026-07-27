'use client';
import React, { useEffect, useRef } from 'react';

// Parsed accent colors for all biomes \u2014 avoids DOM class polling each frame
const BIOME_COLORS: Record<string, [number, number, number]> = {
  'biome-cyber':    [0,   225, 207],
  'biome-oled':     [245, 158, 11],
  'biome-terminal': [34,  197, 94],
  'biome-ocean':    [59,  130, 246],
  'biome-forest':   [34,  197, 94],
  'biome-quantum':  [245, 158, 11],
  'biome-nebula':   [217, 70,  239],
};

const ALL_BIOME_CLASSES = Object.keys(BIOME_COLORS);

function getCurrentColor(): [number, number, number] {
  const cls = document.documentElement.classList;
  for (const b of ALL_BIOME_CLASSES) {
    if (cls.contains(b)) return BIOME_COLORS[b];
  }
  return BIOME_COLORS['biome-cyber'];
}

export function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Fewer nodes on small screens
    const maxNodes = window.innerWidth < 768 ? 30 : 50;
    const maxDist = 140;
    const maxDistSq = maxDist * maxDist;

    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    let animationFrameId: number;
    let lastTime = 0;

    const draw = (time: number) => {
      // Cap at ~24 FPS
      if (time - lastTime < 42) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const [r, g, b] = getCurrentColor();
      ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const node2 = nodes[j];
          const dx = node.x - node2.x;
          const dy = node.y - node2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.15 * (1 - dist / maxDist)})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
    />
  );
}
