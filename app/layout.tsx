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

// Static imports — small, critical-path components safe in a Server Component
import { ScrollProgress } from '@/components/scroll-progress';
import { BiomeSelector } from '@/components/biome-selector';
// GlobalOverlays is a Client Component — all ssr:false dynamic imports live there
import { GlobalOverlays } from '@/components/global-overlays';

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
                  var valid = ['cyber','oled','terminal','ocean','forest','quantum','nebula'];
                  document.documentElement.classList.add('biome-' + (valid.includes(saved) ? saved : 'cyber'));
                  
                  if (!sessionStorage.getItem('booted')) {
                    document.documentElement.classList.add('is-booting');
                    setTimeout(function() {
                      document.documentElement.classList.remove('is-booting');
                    }, 5000);
                  }
                } catch (e) {}
              })();
            `
          }}
        />
        <JsonLd />
        <ScrollProgress />
        <BiomeSelector />
        <GlobalOverlays />
        <div className="noise-overlay" />
        <div id="main-layout-container" className="relative z-10 min-h-screen border-x border-border-subtle max-w-[720px] mx-auto bg-bg shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
