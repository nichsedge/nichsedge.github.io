import HomeClient from './home-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ichsanul Amal | Data Engineer & System Architect',
  description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures. Currently driving operations.',
  openGraph: {
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures. Currently driving operations.',
    type: 'website',
    url: 'https://nichsedge.github.io',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures. Currently driving operations.',
    creator: '@nichsedge',
  }
};

export default function Home() {
  return <HomeClient />;
}
