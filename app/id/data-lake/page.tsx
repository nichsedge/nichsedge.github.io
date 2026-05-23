import DataLakeClient from '../../data-lake/data-lake-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace SQL Data Lake | NICHSEDGE',
  description: 'Kueri secara langsung data resume, riwayat kerja, dan database keterampilan Ichsanul menggunakan kompiler kueri pseudo-SQL kustom dan workspace visualisasi.',
  openGraph: {
    title: 'Workspace SQL Data Lake | NICHSEDGE',
    description: 'Kueri secara langsung data resume, riwayat kerja, dan database keterampilan Ichsanul menggunakan kompiler kueri pseudo-SQL kustom dan workspace visualisasi.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/data-lake/',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workspace SQL Data Lake | NICHSEDGE',
    description: 'Kueri secara langsung data resume, riwayat kerja, dan database keterampilan Ichsanul menggunakan kompiler kueri pseudo-SQL kustom dan workspace visualisasi.',
    creator: '@nichsedge',
  }
};

export default function DataLakePageID() {
  return <DataLakeClient locale="id" />;
}
