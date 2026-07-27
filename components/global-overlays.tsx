'use client';

/**
 * GlobalOverlays — Client Component wrapper for all non-critical global widgets.
 * Bundled here so next/dynamic({ ssr: false }) is valid inside a Client Component.
 */
import dynamic from 'next/dynamic';

const CommandPalette = dynamic(() => import('@/components/command-palette').then(m => m.CommandPalette), { ssr: false });
const SystemMonitor = dynamic(() => import('@/components/system-monitor').then(m => m.SystemMonitor), { ssr: false });
const CursorTracker = dynamic(() => import('@/components/cursor-tracker').then(m => m.CursorTracker), { ssr: false });
const SystemTicker = dynamic(() => import('@/components/system-ticker').then(m => m.SystemTicker), { ssr: false });
const BootSequence = dynamic(() => import('@/components/boot-sequence').then(m => m.BootSequence), { ssr: false });
const MainframeBypass = dynamic(() => import('@/components/mainframe-bypass').then(m => m.MainframeBypass), { ssr: false });
const FocusShield = dynamic(() => import('@/components/focus-shield').then(m => m.FocusShield), { ssr: false });
const NeuralNetworkBg = dynamic(() => import('@/components/neural-network-bg').then(m => m.NeuralNetworkBg), { ssr: false });
const EventStream = dynamic(() => import('@/components/event-stream').then(m => m.EventStream), { ssr: false });
const GeoRouting = dynamic(() => import('@/components/geo-routing').then(m => m.GeoRouting), { ssr: false });
const IngestionMetrics = dynamic(() => import('@/components/ingestion-metrics').then(m => m.IngestionMetrics), { ssr: false });
const ThreadAllocator = dynamic(() => import('@/components/thread-allocator').then(m => m.ThreadAllocator), { ssr: false });
const SystemStatsWidget = dynamic(() => import('@/components/system-stats-widget').then(m => m.SystemStatsWidget), { ssr: false });

export function GlobalOverlays() {
  return (
    <>
      <NeuralNetworkBg />
      <BootSequence />
      <MainframeBypass />
      <FocusShield />
      <EventStream />
      <GeoRouting />
      <IngestionMetrics />
      <ThreadAllocator />
      <SystemStatsWidget />
      <CommandPalette />
      <SystemMonitor />
      <CursorTracker />
      <SystemTicker />
    </>
  );
}
