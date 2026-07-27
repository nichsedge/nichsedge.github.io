import HomeClient from './home-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Ichsanul Amal | Data Engineer & System Architect (Cimahi, Bandung, Jakarta)',
  description: 'Data engineer & system architect specializing in scalable data lakes, high-throughput ETL/ELT pipelines, dbt models, BigQuery, and PostgreSQL performance optimization. Based in Cimahi, Indonesia.',
  keywords: [
    'Ichsanul Amal',
    'Nichsedge',
    'Data Engineer',
    'System Architect',
    'ETL Pipelines',
    'dbt Data Modeling',
    'BigQuery',
    'Apache Airflow',
    'PostgreSQL Optimization',
    'Data Engineer Indonesia',
    'Data Engineer Bandung',
    'Data Engineer Cimahi',
    'Data Engineer Jakarta',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io',
    languages: {
      'en': 'https://nichsedge.github.io',
      'id': 'https://nichsedge.github.io/id',
      'x-default': 'https://nichsedge.github.io',
    },
  },
  openGraph: {
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures. Based in Cimahi, Indonesia.',
    type: 'website',
    url: 'https://nichsedge.github.io',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
    alternateLocale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures.',
    creator: '@nichsedge',
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        breadcrumbs={[{ name: 'Home', item: 'https://nichsedge.github.io' }]}
      />
      <HomeClient />
    </>
  );
}
