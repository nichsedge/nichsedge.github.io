'use client';

import { useSyncExternalStore } from 'react';
import { soundEngine } from '@/lib/audio';

const STORAGE_KEY = 'nsm-active';

export function getNSMState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setNSM(active: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, String(active));
    if (active) {
      soundEngine.playModemHandshake();
      document.body.classList.add('nsm-active');
    } else {
      soundEngine.playClick(500);
      document.body.classList.remove('nsm-active');
    }
    window.dispatchEvent(new CustomEvent('nsm-change', { detail: { active } }));
  } catch {
    // Ignore storage errors in restrictive environments
  }
}

export function toggleNSM() {
  const current = getNSMState();
  setNSM(!current);
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('nsm-change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('nsm-change', callback);
    window.removeEventListener('storage', callback);
  };
}

// Global keystroke listener for "NSM" easter egg across the entire application
if (typeof window !== 'undefined') {
  let sequence = '';
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target as HTMLElement)?.isContentEditable
    ) {
      return;
    }
    sequence += e.key.toLowerCase();
    if (sequence.length > 3) {
      sequence = sequence.slice(-3);
    }
    if (sequence === 'nsm') {
      toggleNSM();
      sequence = '';
    }
  });
}

export function useNSM() {
  const isNSM = useSyncExternalStore(
    subscribe,
    getNSMState,
    () => false
  );

  return { isNSM, toggleNSM, setNSM };
}
