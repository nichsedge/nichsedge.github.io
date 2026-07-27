'use client';

import React, { useEffect, useRef } from 'react';

export function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 12;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array.from({ length: columns }).fill(1) as number[];

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }).fill(1) as number[];
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let lastTime = 0;

    const draw = (time: number) => {
      if (time - lastTime < 33) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.fillStyle = 'rgba(9, 9, 11, 0.1)'; 
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px var(--font-mono, monospace)`;
      ctx.textAlign = 'center';

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00e1cf';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen"
    />
  );
}
