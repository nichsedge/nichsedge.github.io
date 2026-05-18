'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface SubNavItem {
  name: string;
  href: string;
}

interface SubNavProps {
  items: SubNavItem[];
}

export function SubNav({ items }: SubNavProps) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!items || items.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -65% 0px', // Optimize detection trigger zone
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const matchingItem = items.find((item) => item.href === `#${id}`);
          if (matchingItem) {
            setActiveItem(matchingItem.name);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    items.forEach((item) => {
      if (item.href.startsWith('#')) {
        const el = document.getElementById(item.href.slice(1));
        if (el) {
          observer.observe(el);
        }
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="sticky top-[56px] z-40 w-full bg-bg/60 backdrop-blur-sm border-b border-border-subtle/50 px-6 py-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center min-w-max md:min-w-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-text-3 uppercase tracking-widest shrink-0">
            <ChevronRight size={10} className="text-accent" />
            <span>Local_Jump</span>
          </div>
          <div className="h-3 w-px bg-border-subtle" />
          <div className="flex items-center gap-5">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveItem(item.name)}
                className="group relative py-1 shrink-0"
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-3 group-hover:text-accent transition-colors">
                  {item.name}
                </span>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-px bg-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: activeItem === item.name ? 1 : 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
