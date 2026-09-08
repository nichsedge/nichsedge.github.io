'use client';

import { useEffect } from 'react';

/**
 * Custom React hook to dynamically toggle wider layouts.
 * Appends the appropriate wide-layout classes on mount and handles automatic cleanup on unmount.
 * 
 * @param size 'md' (1000px), 'lg' (1200px), 'xl' (1400px), or boolean (defaults to 'lg')
 */
let wideLayoutRefCount = 0;

export function useWideLayout(size: 'md' | 'lg' | 'xl' | boolean = true) {
  useEffect(() => {
    if (!size) return;
    
    const className = typeof size === 'string' ? `wide-layout-${size}` : 'wide-layout-lg';
    wideLayoutRefCount++;
    document.body.classList.add('wide-layout', className);
    
    return () => {
      wideLayoutRefCount = Math.max(0, wideLayoutRefCount - 1);
      document.body.classList.remove(className);
      if (wideLayoutRefCount === 0) {
        document.body.classList.remove('wide-layout');
      }
    };
  }, [size]);
}

