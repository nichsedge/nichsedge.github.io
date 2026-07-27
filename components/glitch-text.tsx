'use client';

import React, { useState, useEffect, useCallback } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:\'",.<>/?';

export function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  const [glitchedText, setGlitchedText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setGlitchedText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setGlitchedText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  return (
    <span
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`inline-block ${className}`}
    >
      {glitchedText}
    </span>
  );
}
