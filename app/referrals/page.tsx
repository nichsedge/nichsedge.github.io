import { Metadata } from 'next';
import ReferralsClient from './referrals-client';

export const metadata: Metadata = {
  title: 'Referrals & Ingestion Gateways | Ichsanul Amal',
  description: 'Connect, register, and sync with secure affiliate nodes and cognitive service gateways curated by Ichsanul Amal.',
  openGraph: {
    title: 'Referrals & Ingestion Gateways | Ichsanul Amal',
    description: 'Connect, register, and sync with secure affiliate nodes and cognitive service gateways curated by Ichsanul Amal.',
    type: 'website',
    url: 'https://nichsedge.github.io/referrals',
    siteName: 'NICHSEDGE',
  }
};

export default function ReferralsPage() {
  return <ReferralsClient />;
}
