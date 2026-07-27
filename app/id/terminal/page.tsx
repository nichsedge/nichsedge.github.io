import TerminalClient from '../../terminal/terminal-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Antarmuka Terminal CLI | Ichsanul Amal',
  description: 'Antarmuka shell baris perintah cyberpunk interaktif. Jalankan perintah untuk memeriksa log sistem, kredensial teknik, dan profil data Ichsanul Amal.',
  keywords: [
    'Terminal CLI Interaktif',
    'Shell Cyberpunk',
    'Terminal Ichsanul Amal',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/id/terminal',
    languages: {
      'en': 'https://nichsedge.github.io/terminal',
      'id': 'https://nichsedge.github.io/id/terminal',
      'x-default': 'https://nichsedge.github.io/terminal',
    },
  },
  openGraph: {
    title: 'Antarmuka Terminal CLI | Ichsanul Amal',
    description: 'Antarmuka shell baris perintah cyberpunk interaktif.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/terminal',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Antarmuka Terminal CLI | Ichsanul Amal',
    description: 'Antarmuka shell baris perintah cyberpunk interaktif.',
    creator: '@nichsedge',
  },
};

export default function TerminalPageID() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Beranda', item: 'https://nichsedge.github.io/id' },
          { name: 'Terminal', item: 'https://nichsedge.github.io/id/terminal' },
        ]}
      />
      <TerminalClient locale="id" />
    </>
  );
}
