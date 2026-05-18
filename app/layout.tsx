import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NICHSEDGE // DATA ARCHIVE',
  description: 'Data engineer and curious generalist building data systems and exploring the intersection of pipelines and ideas.',
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
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased selection:bg-accent/30 selection:text-text-0 pb-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ichsanul Amal",
              "url": "https://nichsedge.github.io",
              "jobTitle": "Data Engineer & System Architect",
              "email": "muhammad.ichsanul19@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cimahi",
                "addressRegion": "West Java",
                "addressCountry": "Indonesia"
              },
              "worksFor": {
                "@type": "Organization",
                "name": "Accenture"
              },
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "University of Indonesia"
              },
              "sameAs": [
                "https://github.com/nichsedge",
                "https://www.linkedin.com/in/ichsanulamal19/",
                "https://twitter.com/nichsedge"
              ],
              "knowsAbout": [
                "Data Engineering",
                "ETL Pipelines",
                "dbt",
                "Apache Airflow",
                "PostgreSQL",
                "BigQuery",
                "Python",
                "SQL",
                "Systems Architecture"
              ]
            })
          }}
        />
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
        <div className="relative z-10 min-h-screen border-x border-border-subtle max-w-[720px] mx-auto bg-bg shadow-2xl">
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
