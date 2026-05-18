import HomeClient from './home-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ichsanul Amal | Data Engineer & System Architect',
  description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures. Currently driving operations at Accenture.',
  openGraph: {
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures. Currently driving operations at Accenture.',
    type: 'website',
    url: 'https://nichsedge.github.io',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures. Currently driving operations at Accenture.',
    creator: '@nichsedge',
  }
};

export default function Home() {
  return <HomeClient />;
}
