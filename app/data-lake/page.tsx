import DataLakeClient from './data-lake-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Data Lake & SQL Explorer | Ichsanul Amal',
  description: 'Interactive SQL query workbench and data lineage visualizer. Query Ichsanul Amal’s data lake, skill matrices, ETL DAG simulations, and system telemetry directly in real time.',
  keywords: [
    'Data Lake Explorer',
    'Interactive SQL Workbench',
    'ETL DAG Visualizer',
    'Data Lineage Graph',
    'Ichsanul Amal Skill Matrix',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/data-lake',
    languages: {
      'en': 'https://nichsedge.github.io/data-lake',
      'id': 'https://nichsedge.github.io/id/data-lake',
      'x-default': 'https://nichsedge.github.io/data-lake',
    },
  },
  openGraph: {
    title: 'Data Lake & SQL Explorer | Ichsanul Amal',
    description: 'Interactive SQL query workbench and data lineage visualizer. Query Ichsanul Amal’s data lake and skill matrices in real time.',
    type: 'website',
    url: 'https://nichsedge.github.io/data-lake',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
    alternateLocale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Lake & SQL Explorer | Ichsanul Amal',
    description: 'Interactive SQL query workbench and data lineage visualizer.',
    creator: '@nichsedge',
  },
};

export default function DataLakePage() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Data Lake', item: 'https://nichsedge.github.io/data-lake' },
        ]}
      />
      <DataLakeClient />
    </>
  );
}
