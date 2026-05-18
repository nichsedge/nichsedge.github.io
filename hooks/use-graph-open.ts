'use client';

import { useState, useEffect } from 'react';

export function useGraphOpen() {
  const [isGraphOpen, setIsGraphOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Set initial state
    setIsGraphOpen(document.body.classList.contains('graph-open'));

    // Observe changes to document.body's class list
    const observer = new MutationObserver(() => {
      setIsGraphOpen(document.body.classList.contains('graph-open'));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isGraphOpen;
}
