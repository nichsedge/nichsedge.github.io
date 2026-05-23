import WorkClient from '../../work/work-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pipeline Karir | Ichsanul Amal',
  description: 'Telusuri perjalanan karir profesional Ichsanul Amal dalam membangun pipeline data berskala tinggi, stored procedure, dan infrastruktur analitis di Accenture dan Traveloka.',
  openGraph: {
    title: 'Pipeline Karir | Ichsanul Amal',
    description: 'Telusuri perjalanan karir profesional Ichsanul Amal dalam membangun pipeline data berskala tinggi, stored procedure, dan infrastruktur analitis di Accenture dan Traveloka.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/work/',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pipeline Karir | Ichsanul Amal',
    description: 'Telusuri perjalanan karir profesional Ichsanul Amal dalam membangun pipeline data berskala tinggi, stored procedure, dan infrastruktur analitis di Accenture dan Traveloka.',
    creator: '@nichsedge',
  }
};

export default function WorkPageID() {
  return <WorkClient locale="id" />;
}
