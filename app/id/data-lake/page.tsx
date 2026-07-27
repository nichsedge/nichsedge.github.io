import DataLakeClient from '../../data-lake/data-lake-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Eksplorer Data Lake & SQL | Ichsanul Amal',
  description: 'Workbench kueri SQL interaktif dan visualisasi silsilah data. Jalankan kueri data lake, matriks keahlian, dan simulasi pipeline ETL Ichsanul Amal secara real-time.',
  keywords: [
    'Eksplorer Data Lake',
    'Workbench SQL Interaktif',
    'Simulasi Pipeline ETL',
    'Silsilah Data',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/id/data-lake',
    languages: {
      'en': 'https://nichsedge.github.io/data-lake',
      'id': 'https://nichsedge.github.io/id/data-lake',
      'x-default': 'https://nichsedge.github.io/data-lake',
    },
  },
  openGraph: {
    title: 'Eksplorer Data Lake & SQL | Ichsanul Amal',
    description: 'Workbench kueri SQL interaktif dan visualisasi silsilah data.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/data-lake',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eksplorer Data Lake & SQL | Ichsanul Amal',
    description: 'Workbench kueri SQL interaktif dan visualisasi silsilah data.',
    creator: '@nichsedge',
  },
};

export default function DataLakePageID() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Beranda', item: 'https://nichsedge.github.io/id' },
          { name: 'Data Lake', item: 'https://nichsedge.github.io/id/data-lake' },
        ]}
      />
      <DataLakeClient locale="id" />
    </>
  );
}
