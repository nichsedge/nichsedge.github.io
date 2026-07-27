import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/json-ld';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nichsedge.github.io'),
  title: {
    default: 'NICHSEDGE // Ichsanul Amal | Data Engineer & System Architect',
    template: '%s // NICHSEDGE',
  },
  description: 'Ichsanul Amal (Nichsedge) is a Data Engineer & System Architect specializing in scalable data lakes, high-throughput ETL pipelines, dbt modeling, BigQuery, and PostgreSQL optimization based in Cimahi, Indonesia.',
  keywords: [
    'Data Engineering',
    'Systems Architecture',
    'ETL Pipelines',
    'ELT Data Pipelines',
    'BigQuery Optimization',
    'dbt Data Modeling',
    'Apache Airflow',
    'PostgreSQL Database Architecture',
    'Python SQL Engineering',
    'Ichsanul Amal',
    'Nichsedge',
    'Data Engineer Indonesia',
    'Data Engineer Bandung',
    'Data Engineer Cimahi',
    'Data Engineer Jakarta',
    'Agentic AI Workflows',
  ],
  authors: [{ name: 'Ichsanul Amal', url: 'https://nichsedge.github.io' }],
  creator: 'Ichsanul Amal',
  publisher: 'Ichsanul Amal',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'NICHSEDGE // Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures. Based in Cimahi, West Java, Indonesia.',
    url: 'https://nichsedge.github.io',
    siteName: 'NICHSEDGE // DATA ARCHIVE',
    locale: 'en_US',
    alternateLocale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NICHSEDGE // Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures.',
    creator: '@nichsedge',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://nichsedge.github.io',
    languages: {
      'en': 'https://nichsedge.github.io',
      'id': 'https://nichsedge.github.io/id',
      'x-default': 'https://nichsedge.github.io',
    },
  },
  other: {
    'geo.region': 'ID-JB',
    'geo.placename': 'Cimahi, West Java, Indonesia',
    'geo.position': '-6.8722;107.5414',
    'ICBM': '-6.8722, 107.5414',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport = {
  themeColor: '#00e1cf',
  width: 'device-width',
  initialScale: 1,
};

import { CommandPalette } from '@/components/command-palette';
import { SystemMonitor } from '@/components/system-monitor';
import { CursorTracker } from '@/components/cursor-tracker';
import { SystemTicker } from '@/components/system-ticker';
import { BootSequence } from '@/components/boot-sequence';
import { MainframeBypass } from '@/components/mainframe-bypass';
import { ScrollProgress } from '@/components/scroll-progress';
import { FocusShield } from '@/components/focus-shield';
import { NeuralNetworkBg } from '@/components/neural-network-bg';
import { BiomeSelector } from '@/components/biome-selector';
import { EventStream } from '@/components/event-stream';
import { GeoRouting } from '@/components/geo-routing';
import { IngestionMetrics } from '@/components/ingestion-metrics';
import { ThreadAllocator } from '@/components/thread-allocator';
import { SystemStatsWidget } from '@/components/system-stats-widget';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="antialiased selection:bg-accent/30 selection:text-text-0 pb-6">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('selected-biome');
                  if (saved && ['cyber', 'ocean', 'forest'].includes(saved)) {
                    document.documentElement.classList.add('biome-' + saved);
                  } else {
                    document.documentElement.classList.add('biome-cyber');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
        <JsonLd />
        <NeuralNetworkBg />
        <BootSequence />
        <MainframeBypass />
        <ScrollProgress />
        <FocusShield />
        <BiomeSelector />
        <EventStream />
        <GeoRouting />
        <IngestionMetrics />
        <ThreadAllocator />
        <SystemStatsWidget />
        <div className="noise-overlay" />
        <div id="main-layout-container" className="relative z-10 min-h-screen border-x border-border-subtle max-w-[720px] mx-auto bg-bg shadow-2xl">
          {children}
          <CursorTracker />
          <CommandPalette />
          <SystemMonitor />
          <SystemTicker />
        </div>
      </body>
    </html>
  );
}
