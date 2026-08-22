import WorkClient from './work-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Career Pipeline & Experience | Ichsanul Amal',
  description: 'Explore the professional trajectory of Ichsanul Amal at Krom Bank, Accenture, Telkomsel (NTI), Traveloka, and UI — building enterprise ETL pipelines, dbt data models, BigQuery warehouses, and AI agent frameworks.',
  keywords: [
    'Ichsanul Amal Work Experience',
    'Krom Bank Data Quality Engineer',
    'Accenture Data Engineer',
    'Telkomsel Database Engineer',
    'Traveloka Data Engineer',
    'ETL Pipelines',
    'dbt BigQuery',
    'Airflow Orchestration',
    'Data Governance Analyst',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/work',
    languages: {
      'en': 'https://nichsedge.github.io/work',
      'id': 'https://nichsedge.github.io/id/work',
      'x-default': 'https://nichsedge.github.io/work',
    },
  },
  openGraph: {
    title: 'Career Pipeline & Experience | Ichsanul Amal',
    description: 'Explore the professional trajectory of Ichsanul Amal at Accenture, Telkomsel, Traveloka, and UI — building enterprise ETL pipelines and data lakes.',
    type: 'website',
    url: 'https://nichsedge.github.io/work',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
    alternateLocale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Pipeline & Experience | Ichsanul Amal',
    description: 'Explore the professional trajectory of Ichsanul Amal building scalable data pipelines and analytics infrastructure.',
    creator: '@nichsedge',
  },
};

export default function WorkPage() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Work', item: 'https://nichsedge.github.io/work' },
        ]}
        itemList={[
          { name: 'Accenture - Data Engineering & Governance Analyst', description: 'Enterprise data platform governance, DQ validation & AI agent tools.' },
          { name: 'NTI (Telkomsel Project) - Database Engineer', description: 'Architected network measurement models using dbt, Airflow & PostgreSQL.' },
          { name: 'Traveloka - Data Engineer Intern', description: 'Kimball dimensional warehouse models on BigQuery & Airflow.' },
        ]}
      />
      <WorkClient />
    </>
  );
}
