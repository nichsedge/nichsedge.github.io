import ProjectsClient from '../../projects/projects-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Arsip Proyek Teknik & Open Source | Ichsanul Amal',
  description: 'Koleksi proyek open-source, eksperimen teknik data, dan alat otomatisasi sistem yang dibangun oleh Ichsanul Amal.',
  keywords: [
    'Proyek Ichsanul Amal',
    'Repository Data Engineering',
    'idx-bei',
    'sansfinance',
    'atracker',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/id/projects',
    languages: {
      'en': 'https://nichsedge.github.io/projects',
      'id': 'https://nichsedge.github.io/id/projects',
      'x-default': 'https://nichsedge.github.io/projects',
    },
  },
  openGraph: {
    title: 'Arsip Proyek Teknik & Open Source | Ichsanul Amal',
    description: 'Koleksi proyek open-source, eksperimen teknik data, dan alat otomatisasi sistem.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/projects',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arsip Proyek Teknik & Open Source | Ichsanul Amal',
    description: 'Koleksi proyek open-source, eksperimen teknik data, dan alat otomatisasi sistem.',
    creator: '@nichsedge',
  },
};

export default function ProjectsPageID() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Beranda', item: 'https://nichsedge.github.io/id' },
          { name: 'Proyek', item: 'https://nichsedge.github.io/id/projects' },
        ]}
      />
      <ProjectsClient locale="id" />
    </>
  );
}
