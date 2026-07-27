import WorkClient from '../../work/work-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Pipeline Karir & Pengalaman | Ichsanul Amal',
  description: 'Telusuri perjalanan karir profesional Ichsanul Amal di Accenture, Telkomsel (NTI), Traveloka, dan UI — membangun pipeline data ETL berskala enterprise, model dbt, dan infrastruktur analitis.',
  keywords: [
    'Pengalaman Kerja Ichsanul Amal',
    'Data Engineer Accenture',
    'Database Engineer Telkomsel',
    'Data Engineer Traveloka',
    'Pipeline ETL',
    'dbt BigQuery',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/id/work',
    languages: {
      'en': 'https://nichsedge.github.io/work',
      'id': 'https://nichsedge.github.io/id/work',
      'x-default': 'https://nichsedge.github.io/work',
    },
  },
  openGraph: {
    title: 'Pipeline Karir & Pengalaman | Ichsanul Amal',
    description: 'Telusuri perjalanan karir profesional Ichsanul Amal di Accenture, Telkomsel, Traveloka, dan UI.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/work',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pipeline Karir & Pengalaman | Ichsanul Amal',
    description: 'Telusuri perjalanan karir profesional Ichsanul Amal dalam membangun pipeline data berskala tinggi.',
    creator: '@nichsedge',
  },
};

export default function WorkPageID() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Beranda', item: 'https://nichsedge.github.io/id' },
          { name: 'Karir', item: 'https://nichsedge.github.io/id/work' },
        ]}
      />
      <WorkClient locale="id" />
    </>
  );
}
