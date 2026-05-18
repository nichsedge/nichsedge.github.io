'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function CursorTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    const handleDown = () => setClicked(true);
    const handleUp = () => setClicked(false);
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <>
      <motion.div 
        className="fixed pointer-events-none z-[9999] hidden md:flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        animate={{ 
          left: pos.x, 
          top: pos.y, 
          scale: clicked ? 0.8 : 1,
          rotate: clicked ? 45 : 0
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      >
         <div className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center relative">
            <div className="w-1 h-1 bg-accent/50 rounded-full" />
            <div className="absolute top-0 w-[1px] h-2 bg-accent/50" />
            <div className="absolute bottom-0 w-[1px] h-2 bg-accent/50" />
            <div className="absolute left-0 h-[1px] w-2 bg-accent/50" />
            <div className="absolute right-0 h-[1px] w-2 bg-accent/50" />
         </div>
      </motion.div>
      <motion.div 
        className="fixed pointer-events-none z-[9999] font-mono text-[8px] text-accent/60 hidden md:flex gap-2"
        animate={{ left: pos.x + 20, top: pos.y + 20 }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      >
        <div className="flex flex-col">
          <span>X: {pos.x.toString().padStart(4, '0')}</span>
          <span>Y: {pos.y.toString().padStart(4, '0')}</span>
        </div>
      </motion.div>
    </>
  );
}
