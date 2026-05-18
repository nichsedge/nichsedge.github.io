import WorkClient from './work-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Pipeline | Ichsanul Amal',
  description: 'Explore the professional trajectory of Ichsanul Amal, building scalable data pipelines, stored procedures, and analytics infra at Accenture and Traveloka.',
  openGraph: {
    title: 'Career Pipeline | Ichsanul Amal',
    description: 'Explore the professional trajectory of Ichsanul Amal, building scalable data pipelines, stored procedures, and analytics infra at Accenture and Traveloka.',
    type: 'website',
    url: 'https://nichsedge.github.io/work',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Pipeline | Ichsanul Amal',
    description: 'Explore the professional trajectory of Ichsanul Amal, building scalable data pipelines, stored procedures, and analytics infra at Accenture and Traveloka.',
    creator: '@nichsedge',
  }
};

export default function WorkPage() {
  return <WorkClient />;
}
