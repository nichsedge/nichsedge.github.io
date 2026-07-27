import TerminalClient from './terminal-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Interactive CLI Terminal | Ichsanul Amal',
  description: 'Cyberpunk command-line shell interface. Execute interactive commands to inspect system logs, query engineering credentials, and inspect bio data of Ichsanul Amal.',
  keywords: [
    'Interactive CLI Terminal',
    'Cyberpunk Shell Interface',
    'Ichsanul Amal Terminal',
    'Developer Portfolio CLI',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/terminal',
    languages: {
      'en': 'https://nichsedge.github.io/terminal',
      'id': 'https://nichsedge.github.io/id/terminal',
      'x-default': 'https://nichsedge.github.io/terminal',
    },
  },
  openGraph: {
    title: 'Interactive CLI Terminal | Ichsanul Amal',
    description: 'Cyberpunk command-line shell interface. Execute interactive commands to inspect system logs and credentials.',
    type: 'website',
    url: 'https://nichsedge.github.io/terminal',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
    alternateLocale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive CLI Terminal | Ichsanul Amal',
    description: 'Cyberpunk command-line shell interface for data engineering archives.',
    creator: '@nichsedge',
  },
};

export default function TerminalPage() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Terminal', item: 'https://nichsedge.github.io/terminal' },
        ]}
      />
      <TerminalClient />
    </>
  );
}
