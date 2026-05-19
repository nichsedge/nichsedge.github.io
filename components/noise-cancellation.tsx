'use client';
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Headphones } from 'lucide-react';
import { motion } from 'motion/react';

export function NoiseCancellationWidget() {
  const [isActive, setIsActive] = useState(false);
  const [wave, setWave] = useState<number[]>([]);

  // Web Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Math helper for brown noise buffer synthesis
  const createBrownNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = 4 * ctx.sampleRate; // 4 seconds of unique noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise mathematical integration
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Amplify slightly for standard gain levels
    }
    return noiseBuffer;
  };

  const startAudio = async () => {
    try {
      // 1. Create or resume AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // 2. Setup master gain for smooth linear ramping fade-ins/outs
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 3. Setup Binaural Beats
      // Alpha Focus binaural wave: 145Hz in Left ear, 155Hz in Right ear (10Hz focus beat)
      const merger = ctx.createChannelMerger(2);

      const leftOsc = ctx.createOscillator();
      leftOsc.type = 'sine';
      leftOsc.frequency.setValueAtTime(145, ctx.currentTime);
      const leftGain = ctx.createGain();
      leftGain.gain.setValueAtTime(0.04, ctx.currentTime); // Keep beats subtle
      leftOsc.connect(leftGain);
      leftGain.connect(merger, 0, 0);
      leftOscRef.current = leftOsc;

      const rightOsc = ctx.createOscillator();
      rightOsc.type = 'sine';
      rightOsc.frequency.setValueAtTime(155, ctx.currentTime);
      const rightGain = ctx.createGain();
      rightGain.gain.setValueAtTime(0.04, ctx.currentTime);
      rightOsc.connect(rightGain);
      rightGain.connect(merger, 0, 1);
      rightOscRef.current = rightOsc;

      merger.connect(masterGain);

      // 4. Setup Brown Noise Generator
      const noiseBuffer = createBrownNoiseBuffer(ctx);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, ctx.currentTime); // Soothing base level
      noiseSource.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseSourceRef.current = noiseSource;

      // 5. Start audio nodes & smoothly fade in master volume over 1.2s
      leftOsc.start(0);
      rightOsc.start(0);
      noiseSource.start(0);

      masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1.2);
    } catch (err) {
      console.error('Failed to initialize active sensory isolation synthesizer:', err);
    }
  };

  const stopAudio = () => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;

    if (!ctx || !masterGain) return;

    try {
      // Smooth linear fade-out over 0.8s to prevent acoustic clicks
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.8);

      setTimeout(() => {
        try {
          noiseSourceRef.current?.stop();
          leftOscRef.current?.stop();
          rightOscRef.current?.stop();
        } catch {}

        try {
          ctx.close();
        } catch {}

        audioCtxRef.current = null;
        noiseSourceRef.current = null;
        leftOscRef.current = null;
        rightOscRef.current = null;
        masterGainRef.current = null;
      }, 850);
    } catch (err) {
      console.error('Failed to smoothly terminate acoustic waves:', err);
    }
  };

  // Manage Audio Engine Sync with user interaction State
  useEffect(() => {
    if (isActive) {
      startAudio();
    } else {
      stopAudio();
    }

    return () => {
      // Immediate cleanup on unmount
      if (audioCtxRef.current) {
        try {
          noiseSourceRef.current?.stop();
          leftOscRef.current?.stop();
          rightOscRef.current?.stop();
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, [isActive]);

  // Wave visual animation loop
  useEffect(() => {
    let animationId: number;
    let t = 0;

    const generateWave = () => {
      const targetWave = [];
      const variance = isActive ? 0.5 : 20; // Flatten the wave if active
      
      for (let i = 0; i < 40; i++) {
        const noise = (Math.random() - 0.5) * variance;
        const sine = Math.sin(t + i * 0.2) * (isActive ? 1 : 10);
        targetWave.push(50 + sine + noise);
      }
      
      setWave(targetWave);
      t += isActive ? 0.05 : 0.2; // Slower when calm

      animationId = requestAnimationFrame(() => {
        setTimeout(generateWave, 50);
      });
    };

    generateWave();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  return (
    <div className="mt-6 border-t border-border-subtle pt-6">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-text-3 mb-4">
        <div className="flex items-center gap-2">
           <Headphones size={14} className={isActive ? 'text-accent' : ''} /> 
           Active Noise Cancellation
        </div>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`px-3 py-1 flex items-center gap-2 border transition-all ${
            isActive ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-bg-1 border-border-subtle text-text-2 hover:border-accent hover:text-accent'
          }`}
        >
          <RefreshCw size={10} className={isActive ? 'animate-spin' : ''} />
          {isActive ? 'ENGAGED' : 'ENGAGE'}
        </button>
      </div>

      <div className="h-16 w-full bg-black/50 border border-border-subtle/50 rounded-sm relative overflow-hidden flex items-center">
         <div className={`absolute left-0 inline-flex transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'} z-10 w-full h-full bg-accent/5 pointer-events-none`} />
         <svg className="w-full h-full relative z-20" preserveAspectRatio="none" viewBox="0 0 400 100">
           <motion.path 
             animate={{ d: `M 0,${wave[0]} ${wave.map((y, i) => `L ${i * 10},${y}`).join(' ')}` }}
             transition={{ type: "tween", duration: 0.1, ease: "linear" }}
             fill="none" 
             stroke="var(--theme-accent, #00e1cf)" 
             strokeWidth="2"
             strokeOpacity={isActive ? 0.8 : 0.3}
           />
         </svg>
         
         <div className="absolute right-2 top-2 z-30 font-mono text-[8px] text-text-3 tracking-widest uppercase flex items-center gap-1 opacity-50">
            {isActive ? '0 dB (SILENT)' : '65 dB (CHAOS)'}
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-red-500 animate-pulse'}`} />
         </div>
      </div>
    </div>
  );
}
