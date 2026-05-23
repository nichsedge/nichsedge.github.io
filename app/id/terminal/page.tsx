import TerminalClient from '../../terminal/terminal-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Antarmuka Terminal | NICHSEDGE',
  description: 'Simulasi CLI interaktif yang menampilkan systems engineering, log sistem, peretasan terminal, dan komunikasi dengan asisten Neural Ghost AI.',
  openGraph: {
    title: 'Antarmuka Terminal | NICHSEDGE',
    description: 'Simulasi CLI interaktif yang menampilkan systems engineering, log sistem, peretasan terminal, dan komunikasi dengan asisten Neural Ghost AI.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/terminal/',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Antarmuka Terminal | NICHSEDGE',
    description: 'Simulasi CLI interaktif yang menampilkan systems engineering, log sistem, peretasan terminal, dan komunikasi dengan asisten Neural Ghost AI.',
    creator: '@nichsedge',
  }
};

export default function TerminalPageID() {
  return <TerminalClient locale="id" />;
}
