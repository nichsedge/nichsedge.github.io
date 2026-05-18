'use client';

import React, { useState, useEffect } from 'react';

export function GlitchText({ text, className = '' }: { text: string, className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [glitchedText, setGlitchedText] = useState(text);

  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:\'",.<>/?';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isHovered) {
      let iteration = 0;
      interval = setInterval(() => {
        setGlitchedText(
          text
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return glyphs[Math.floor(Math.random() * glyphs.length)];
            })
            .join('')
        );
        
        if (iteration >= text.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
    } else {
      setGlitchedText(text);
    }

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-block ${className}`}
    >
      {glitchedText}
    </span>
  );
}
