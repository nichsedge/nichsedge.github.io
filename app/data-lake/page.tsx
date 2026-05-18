import DataLakeClient from './data-lake-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Lake SQL Workspace | NICHSEDGE',
  description: 'Directly query Ichsanul\'s resume, work history, and skills database using a custom pseudo-SQL query compiler and visualization workspace.',
  openGraph: {
    title: 'Data Lake SQL Workspace | NICHSEDGE',
    description: 'Directly query Ichsanul\'s resume, work history, and skills database using a custom pseudo-SQL query compiler and visualization workspace.',
    type: 'website',
    url: 'https://nichsedge.github.io/data-lake',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Lake SQL Workspace | NICHSEDGE',
    description: 'Directly query Ichsanul\'s resume, work history, and skills database using a custom pseudo-SQL query compiler and visualization workspace.',
    creator: '@nichsedge',
  }
};

export default function DataLakePage() {
  return <DataLakeClient />;
}
