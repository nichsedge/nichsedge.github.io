'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

export function TiltCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Max rotation 8 degrees for smooth, refined tilt
    const rotateYValue = ((mouseX / width) - 0.5) * 8;
    const rotateXValue = ((mouseY / height) - 0.5) * -8; 

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        perspective: 1000,
        transformStyle: isHovered ? 'preserve-3d' : 'flat',
        willChange: isHovered ? 'transform' : 'auto',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
      className={className}
    >
      <div 
        className="w-full h-full"
        style={{
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
