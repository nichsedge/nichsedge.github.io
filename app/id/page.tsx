import HomeClient from '../home-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Ichsanul Amal | Data Engineer & System Architect (Cimahi, Bandung, Jakarta)',
  description: 'Data engineer spesialis data lake terukur, pipeline ETL/ELT berthroughput tinggi, pemodelan dbt, BigQuery, dan optimasi PostgreSQL. Berbasis di Cimahi, Jawa Barat, Indonesia.',
  keywords: [
    'Ichsanul Amal',
    'Nichsedge',
    'Data Engineer Indonesia',
    'Data Engineer Bandung',
    'Data Engineer Cimahi',
    'Data Engineer Jakarta',
    'Pipeline ETL',
    'dbt BigQuery',
    'PostgreSQL Specialist',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/id',
    languages: {
      'en': 'https://nichsedge.github.io',
      'id': 'https://nichsedge.github.io/id',
      'x-default': 'https://nichsedge.github.io',
    },
  },
  openGraph: {
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer spesialis data lake terukur, pipeline ETL berthroughput tinggi, dan arsitektur database tangguh. Berbasis di Cimahi, Indonesia.',
    type: 'website',
    url: 'https://nichsedge.github.io/id',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer spesialis data lake terukur, pipeline ETL berthroughput tinggi, dan arsitektur database tangguh.',
    creator: '@nichsedge',
  },
};

export default function HomeID() {
  return (
    <>
      <JsonLd
        breadcrumbs={[{ name: 'Beranda', item: 'https://nichsedge.github.io/id' }]}
      />
      <HomeClient locale="id" />
    </>
  );
}
