import TerminalClient from './terminal-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terminal Interface | NICHSEDGE',
  description: 'An interactive CLI simulation displaying systems engineering, logs, terminal hacks, and communications with the Neural Ghost AI assistant.',
  openGraph: {
    title: 'Terminal Interface | NICHSEDGE',
    description: 'An interactive CLI simulation displaying systems engineering, logs, terminal hacks, and communications with the Neural Ghost AI assistant.',
    type: 'website',
    url: 'https://nichsedge.github.io/terminal',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terminal Interface | NICHSEDGE',
    description: 'An interactive CLI simulation displaying systems engineering, logs, terminal hacks, and communications with the Neural Ghost AI assistant.',
    creator: '@nichsedge',
  }
};

export default function TerminalPage() {
  return <TerminalClient />;
}
