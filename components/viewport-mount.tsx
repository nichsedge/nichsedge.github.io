'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ViewportMountProps {
  children: React.ReactNode;
  minHeightClass?: string;
  label?: string;
  rootMargin?: string;
}

/**
 * Defers mounting heavy WebGL / canvas visualizations until the container
 * approaches the viewport, avoiding unnecessary GPU context creation on initial load.
 */
export function ViewportMount({
  children,
  minHeightClass = 'min-h-[450px]',
  label = 'INITIALIZING_VIEWPORT...',
  rootMargin = '250px',
}: ViewportMountProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  if (mounted) {
    return <>{children}</>;
  }

  return (
    <div
      ref={hostRef}
      className={`w-full ${minHeightClass} border border-border-subtle bg-bg-1/60 rounded-sm flex items-center justify-center font-mono text-[11px] uppercase tracking-widest text-text-3`}
    >
      [{label}]
    </div>
  );
}
