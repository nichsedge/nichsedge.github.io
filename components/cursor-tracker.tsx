'use client';
import React, { useEffect, useRef } from 'react';

export function CursorTracker() {
  const crosshairRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let isClicked = false;

    const update = (x: number, y: number) => {
      if (crosshairRef.current) {
        crosshairRef.current.style.transform = `translate(${x - 16}px, ${y - 16}px) ${isClicked ? 'scale(0.8) rotate(45deg)' : 'scale(1)'}`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${x + 20}px, ${y + 20}px)`;
      }
      if (xRef.current) xRef.current.textContent = `X: ${String(x).padStart(4, '0')}`;
      if (yRef.current) yRef.current.textContent = `Y: ${String(y).padStart(4, '0')}`;
    };

    const handleMove = (e: MouseEvent) => update(e.clientX, e.clientY);
    const handleDown = () => {
      isClicked = true;
      if (crosshairRef.current) crosshairRef.current.style.transform += ' scale(0.8) rotate(45deg)';
    };
    const handleUp = () => {
      isClicked = false;
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleDown, { passive: true });
    window.addEventListener('mouseup', handleUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <>
      <div
        ref={crosshairRef}
        className="fixed pointer-events-none z-[9999] hidden md:flex items-center justify-center will-change-transform"
        style={{ top: 0, left: 0, transition: 'transform 80ms linear' }}
      >
        <div className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center relative">
          <div className="w-1 h-1 bg-accent/50 rounded-full" />
          <div className="absolute top-0 w-[1px] h-2 bg-accent/50" />
          <div className="absolute bottom-0 w-[1px] h-2 bg-accent/50" />
          <div className="absolute left-0 h-[1px] w-2 bg-accent/50" />
          <div className="absolute right-0 h-[1px] w-2 bg-accent/50" />
        </div>
      </div>
      <div
        ref={labelRef}
        className="fixed pointer-events-none z-[9999] font-mono text-[8px] text-accent/60 hidden md:flex gap-2 will-change-transform"
        style={{ top: 0, left: 0, transition: 'transform 100ms linear' }}
      >
        <div className="flex flex-col">
          <span ref={xRef}>X: 0000</span>
          <span ref={yRef}>Y: 0000</span>
        </div>
      </div>
    </>
  );
}
