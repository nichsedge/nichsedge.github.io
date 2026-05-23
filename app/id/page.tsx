import HomeClient from '../home-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ichsanul Amal | Data Engineer & System Architect (Cimahi, Bandung, Jakarta)',
  description: 'Data engineer yang spesialis dalam data lake terukur, pipeline ETL berthroughput tinggi, dan arsitektur database tangguh. Berbasis di Cimahi, Indonesia.',
  openGraph: {
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer yang spesialis dalam data lake terukur, pipeline ETL berthroughput tinggi, dan arsitektur database tangguh. Berbasis di Cimahi, Indonesia.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer yang spesialis dalam data lake terukur, pipeline ETL berthroughput tinggi, dan arsitektur database tangguh. Berbasis di Cimahi, Indonesia.',
    creator: '@nichsedge',
  }
};

export default function HomeID() {
  return <HomeClient locale="id" />;
}
