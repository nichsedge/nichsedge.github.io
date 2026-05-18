'use client';
import React, { useEffect, useRef, useState } from 'react';

export function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState(0);

  useEffect(() => {
    const updateGrid = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      const size = 30; // 30px per square
      const cols = Math.floor(width / size);
      const rows = Math.floor(height / size);
      // Fill the area slightly overflowing
      setBoxes((cols + 1) * (rows + 1));
    };

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden flex flex-wrap z-0 opacity-[0.04] pointer-events-none">
      {Array.from({ length: boxes }).map((_, i) => (
        <div 
          key={i} 
          className="w-[30px] h-[30px] border-[0.5px] border-accent/30 transition-colors duration-1000 hover:duration-0 hover:bg-accent pointer-events-auto"
        />
      ))}
    </div>
  );
}
