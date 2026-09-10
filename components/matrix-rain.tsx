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

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()<>{}[]/+=~';
    const isMobile = width < 640;
    const fontSize = isMobile ? 14 : 12;
    let columns = Math.floor(width / fontSize);

    // Spread raindrops randomly across vertical space so it's instantly active without delay
    let drops: number[] = Array.from({ length: columns }, () => 
      Math.floor(Math.random() * (height / fontSize))
    );

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // On Android / mobile, address bar collapse triggers minor height-only resizes.
      // Ignore small resizes so we don't wipe canvas and drop positions while scrolling.
      const widthChanged = Math.abs(newWidth - width) > 8;
      const heightChanged = Math.abs(newHeight - height) > 140;

      if (!widthChanged && !heightChanged) return;

      width = newWidth;
      height = newHeight;
      canvas.width = width;
      canvas.height = height;

      const newColumns = Math.floor(width / fontSize);
      if (newColumns !== columns) {
        const prevDrops = drops;
        columns = newColumns;
        drops = Array.from({ length: columns }, (_, i) => 
          prevDrops[i] ?? Math.floor(Math.random() * (height / fontSize))
        );
      }
    };
    window.addEventListener('resize', handleResize);

    const getAccentColor = () => {
      if (typeof window === 'undefined') return '#00e1cf';
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--theme-accent').trim() || '#00e1cf';
    };

    let accentColor = getAccentColor();

    const updateAccent = () => {
      accentColor = getAccentColor();
    };

    window.addEventListener('selected-biome-change', updateAccent);
    const observer = new MutationObserver(() => updateAccent());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    let animationFrameId: number;
    let lastTime = 0;
    let isRunning = false;

    const draw = (time: number) => {
      if (!isRunning) return;
      // Target ~30fps for smooth performance on mobile batteries
      if (time - lastTime < 33) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.fillStyle = 'rgba(9, 9, 11, 0.12)'; 
      ctx.fillRect(0, 0, width, height);

      // Standard CSS font string (Canvas 2D does not resolve CSS var() references)
      ctx.font = `${fontSize}px "JetBrains Mono", "Courier New", monospace`;
      ctx.textAlign = 'center';

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillStyle = Math.random() > 0.92 ? '#ffffff' : accentColor;
        ctx.fillText(text, i * fontSize + fontSize / 2, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    const updateVisibility = () => {
      const isDocVisible = typeof document !== 'undefined' ? !document.hidden : true;
      const isLockdown = typeof document !== 'undefined' ? document.body.classList.contains('sensory-lockdown') : false;
      const shouldRun = isDocVisible && !isLockdown;

      if (shouldRun && !isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(draw);
      } else if (!shouldRun && isRunning) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      }
    };

    const onVisibilityChange = () => updateVisibility();
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('toggle-sensory-lockdown', onVisibilityChange);

    updateVisibility();

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('selected-biome-change', updateAccent);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('toggle-sensory-lockdown', onVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-20 pointer-events-none opacity-45 sm:opacity-25 mix-blend-screen select-none"
    />
  );
}
