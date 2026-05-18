'use client';

import React from 'react';
import { Play, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

interface MediaProps {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
}

export function MediaViewer({ type, url, thumbnail, alt }: MediaProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (type === 'video' && videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, type]);

  return (
    <div 
      className="relative aspect-video bg-bg-1 border border-border-subtle overflow-hidden rounded-sm group/media cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {type === 'image' ? (
        <div className="relative w-full h-full">
          <Image
            src={url}
            alt={alt || "Media"}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
            referrerPolicy="no-referrer"
            onLoadingComplete={() => setIsLoaded(true)}
          />
          {!isLoaded && (
             <div className="absolute inset-0 flex items-center justify-center bg-bg-1 animate-pulse">
                <ImageIcon size={20} className="text-text-3 opacity-20" />
             </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={url}
            poster={thumbnail}
            muted
            loop
            playsInline
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 bg-bg/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent backdrop-blur-sm">
              <Play size={16} fill="currentColor" />
            </div>
          </div>
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute top-2 right-2 flex gap-1 items-center opacity-0 group-hover/media:opacity-100 transition-opacity">
        <div className="px-1.5 py-0.5 bg-bg/80 backdrop-blur-md border border-border-subtle rounded-sm font-mono text-[8px] text-text-3 uppercase tracking-widest flex items-center gap-1">
          {type === 'video' ? <Play size={8} /> : <ImageIcon size={8} />}
          {type}
        </div>
        <div className="p-1 bg-accent/20 border border-accent/40 rounded-sm text-accent backdrop-blur-md hover:bg-accent/30 transition-colors">
          <Maximize2 size={10} />
        </div>
      </div>

      {!isHovered && type === 'video' && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-accent/30 w-full overflow-hidden">
           <motion.div 
             className="h-full bg-accent"
             initial={{ x: "-100%" }}
             animate={{ x: "0%" }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           />
        </div>
      )}
    </div>
  );
}
