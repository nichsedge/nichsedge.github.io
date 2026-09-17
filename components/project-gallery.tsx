'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

/** Only privacy-reviewed, running-app captures belong in the screenshot manifest. */
export interface ProjectScreenshot {
  url: string;
  caption: string;
}

const copy = {
  en: {
    gallery: 'Screenshots',
    open: 'Open full-size screenshot',
    select: 'Show screenshot',
    previous: 'Previous screenshot',
    next: 'Next screenshot',
    close: 'Close gallery',
    unavailable: 'Screenshot could not be loaded.',
    keys: 'Use the left and right arrow keys to browse. Press Escape to close.',
  },
  id: {
    gallery: 'Tangkapan layar',
    open: 'Buka tangkapan layar ukuran penuh',
    select: 'Tampilkan tangkapan layar',
    previous: 'Tangkapan layar sebelumnya',
    next: 'Tangkapan layar berikutnya',
    close: 'Tutup galeri',
    unavailable: 'Tangkapan layar tidak dapat dimuat.',
    keys: 'Gunakan tombol panah kiri dan kanan untuk menjelajah. Tekan Escape untuk menutup.',
  },
};

type Labels = typeof copy.en;
const focusStyle = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const controlStyle = `min-h-11 min-w-11 inline-flex items-center justify-center rounded-sm border border-border-subtle bg-bg-1 text-text-1 hover:text-accent hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed ${focusStyle}`;

function ScreenshotImage({ screenshot, alt, sizes, unavailable }: {
  screenshot: ProjectScreenshot;
  alt: string;
  sizes: string;
  unavailable: string;
}) {
  const [failed, setFailed] = useState(false);
  // Public asset URLs need the same optional deployment prefix as the app routes.
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const src = screenshot.url.startsWith('/') && !screenshot.url.startsWith('//')
    ? `${basePath}${screenshot.url}`
    : screenshot.url;

  if (failed) {
    return <span role="status" className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-text-2">{unavailable}</span>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      loading="lazy"
      className="object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function GalleryDialog({ projectName, screenshots, selected, onSelect, onDismiss, returnFocus, labels }: {
  projectName: string;
  screenshots: readonly ProjectScreenshot[];
  selected: number;
  onSelect: (index: number) => void;
  onDismiss: () => void;
  returnFocus: React.RefObject<HTMLElement | null>;
  labels: Labels;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const screenshot = screenshots[selected];
  const move = (delta: number) => onSelect((selected + delta + screenshots.length) % screenshots.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal(); // Native top layer, focus containment, and background inertness.
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
    };
  }, [returnFocus]);

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-keys`}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'Tab') {
          const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          move(event.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
      className="m-auto h-[92dvh] max-h-[92dvh] w-[96vw] max-w-[96vw] overflow-hidden rounded-sm border border-border-subtle bg-bg p-3 text-text-0 shadow-2xl backdrop:bg-black/85 sm:p-5"
    >
      <div className="flex h-full min-h-0 flex-col gap-3">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <h2 id={`${id}-title`} className="min-w-0 break-words font-mono text-sm">{projectName} — {labels.gallery}</h2>
          <button ref={closeRef} type="button" onClick={onDismiss} aria-label={labels.close} className={`${controlStyle} shrink-0`}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <p id={`${id}-keys`} className="sr-only">{labels.keys}</p>
        <figure className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="relative min-h-0 flex-1 bg-bg-1">
            <ScreenshotImage key={screenshot.url} screenshot={screenshot} alt={`${projectName} — ${screenshot.caption}`} sizes="96vw" unavailable={labels.unavailable} />
          </div>
          <figcaption aria-live="polite" aria-atomic="true" className="max-h-[20dvh] shrink-0 overflow-y-auto break-words text-center text-sm text-text-2">
            <span className="mr-2 font-mono text-accent">{selected + 1} / {screenshots.length}</span>
            {screenshot.caption}
          </figcaption>
        </figure>
        <div className="flex shrink-0 justify-center gap-3">
          <button type="button" onClick={() => move(-1)} disabled={screenshots.length < 2} aria-label={labels.previous} className={controlStyle}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => move(1)} disabled={screenshots.length < 2} aria-label={labels.next} className={controlStyle}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

export function ProjectGallery({ projectName, screenshots, locale = 'en' }: {
  projectName: string;
  screenshots: readonly ProjectScreenshot[];
  locale?: 'en' | 'id';
}) {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dismiss = useCallback(() => setExpanded(false), []);
  const labels = copy[locale];
  // Handle an empty/replaced manifest gracefully without inventing a cover.
  const index = selected < screenshots.length ? selected : 0;
  const screenshot = screenshots[index];
  if (!screenshot) return null;

  return (
    <section aria-label={`${projectName} — ${labels.gallery}`} className="min-w-0 space-y-3" data-project-gallery={projectName}>
      <figure>
        <button
          type="button"
          aria-label={`${labels.open}: ${projectName} — ${screenshot.caption}`}
          aria-haspopup="dialog"
          onClick={(event) => {
            triggerRef.current = event.currentTarget;
            setExpanded(true);
          }}
          className={`relative block aspect-video w-full overflow-hidden rounded-sm border border-border-subtle bg-bg ${focusStyle}`}
        >
          <ScreenshotImage key={screenshot.url} screenshot={screenshot} alt={`${projectName} — ${screenshot.caption}`} sizes="(min-width: 768px) 45vw, 90vw" unavailable={labels.unavailable} />
          <span aria-hidden="true" className="absolute bottom-2 right-2 rounded-sm border border-border-subtle bg-bg/90 p-2 text-accent"><Maximize2 size={16} /></span>
        </button>
        <figcaption aria-live="polite" aria-atomic="true" className="mt-2 break-words text-xs leading-relaxed text-text-2">
          <span className="mr-2 font-mono text-accent">{index + 1} / {screenshots.length}</span>
          {screenshot.caption}
        </figcaption>
      </figure>
      {screenshots.length > 1 && (
        <div role="group" aria-label={labels.select} className="flex gap-2 overflow-x-auto p-1">
          {screenshots.map((item, itemIndex) => (
            <button
              key={item.url}
              type="button"
              aria-label={`${labels.select} ${itemIndex + 1}: ${item.caption}`}
              aria-pressed={itemIndex === index}
              onClick={() => setSelected(itemIndex)}
              className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-sm border-2 bg-bg ${focusStyle} ${itemIndex === index ? 'border-accent' : 'border-border-subtle hover:border-text-3'}`}
            >
              <ScreenshotImage screenshot={item} alt="" sizes="96px" unavailable={labels.unavailable} />
            </button>
          ))}
        </div>
      )}
      {expanded && (
        <GalleryDialog projectName={projectName} screenshots={screenshots} selected={index} onSelect={setSelected} onDismiss={dismiss} returnFocus={triggerRef} labels={labels} />
      )}
    </section>
  );
}
