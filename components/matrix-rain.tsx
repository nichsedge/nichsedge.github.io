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

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array.from({ length: columns }).fill(1) as number[];

    let animationFrameId: number;

    const draw = () => {
      // Fade effect to create trailing tails
      ctx.fillStyle = 'rgba(9, 9, 11, 0.1)'; 
      ctx.fillRect(0, 0, width, height);

      // Green/Accent text
      ctx.fillStyle = '#00e1cf';
      ctx.font = `${fontSize}px var(--font-mono, monospace)`;
      ctx.textAlign = 'center';

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        
        // Randomly make some characters brighter
        if (Math.random() > 0.95) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#00e1cf';
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

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
