'use client';
import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const hexAddress = useTransform(scrollYProgress, [0, 1], [0x0000, 0xFFFF]);
  const [hexString, setHexString] = React.useState('0x0000');

  React.useEffect(() => {
    return hexAddress.on('change', (v) => {
      setHexString(`0x${Math.floor(v).toString(16).padStart(4, '0').toUpperCase()}`);
    });
  }, [hexAddress]);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-2 md:w-4 bg-bg-1 z-[60] pointer-events-none border-l border-border-subtle flex flex-col justify-between items-center py-4">
       <motion.div 
         className="absolute top-0 right-0 left-0 bg-accent origin-top opacity-50 shadow-[0_0_10px_#00e1cf]"
         style={{ scaleY, height: '100%' }}
       />
       {/* Small hex markers */}
       <div className="w-1 h-1 rounded-full bg-accent/30 z-10" />
       <div className="w-1 h-3 bg-accent/30 z-10" />
       <div className="w-1 h-1 rounded-full bg-accent/30 z-10" />
       
       <div className="absolute top-1/2 -translate-y-1/2 -rotate-90 right-2 md:right-4 font-mono text-[8px] text-accent uppercase tracking-[0.3em] font-bold whitespace-nowrap opacity-50 hidden lg:block">
         PTR: {hexString}
       </div>
    </div>
  );
}
