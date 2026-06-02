'use client';

import React from 'react';
import { Play, Image as ImageIcon, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [isExpanded, setIsExpanded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (type === 'video' && videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => { });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, type]);

  // Lock body scroll when expanded
  React.useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  // Keyboard close on escape key
  React.useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={alt || `Expand ${type}`}
        onClick={() => setIsExpanded(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(true);
          }
        }}
        className="relative aspect-video bg-bg-1 border border-border-subtle overflow-hidden rounded-sm group/media cursor-pointer outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {type === 'image' ? (
          <div className="relative w-full h-full">
            <Image
              src={url}
              alt={alt || "Media"}
              fill
              className={`object-contain bg-black/40 transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoaded(true)}
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
              className={`w-full h-full object-contain bg-black/40 transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
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

      {/* Expanded Lightbox Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-sm bg-bg-1/80 border border-border-subtle text-text-1 hover:text-accent hover:border-accent/40 transition-colors backdrop-blur-md z-[60] cursor-pointer outline-none focus-visible:border-accent"
              title="Close"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[80vh] w-full aspect-video flex items-center justify-center"
            >
              {type === 'image' ? (
                <div className="relative w-full h-full">
                  <Image
                    src={url}
                    alt={alt || "Media"}
                    fill
                    className="object-contain"
                    referrerPolicy="no-referrer"
                    priority
                  />
                </div>
              ) : (
                <video
                  src={url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-w-full max-h-[80vh] object-contain rounded-sm"
                />
              )}

              {alt && (
                <div className="absolute bottom-[-40px] left-0 right-0 text-center font-mono text-[10px] text-text-2 uppercase tracking-wider">
                  {alt}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

