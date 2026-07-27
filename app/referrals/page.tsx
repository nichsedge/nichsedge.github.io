import ReferralsClient from './referrals-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Referral Gateways & Developer Perks | Ichsanul Amal',
  description: 'Verified developer referral rewards, cloud infrastructure credits, and curated tools recommended by Ichsanul Amal.',
  keywords: [
    'Developer Referrals',
    'Cloud Credits',
    'Recommended Developer Tools',
    'Ichsanul Amal Referrals',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/referrals',
    languages: {
      'en': 'https://nichsedge.github.io/referrals',
      'id': 'https://nichsedge.github.io/id/referrals',
      'x-default': 'https://nichsedge.github.io/referrals',
    },
  },
  openGraph: {
    title: 'Referral Gateways & Developer Perks | Ichsanul Amal',
    description: 'Verified developer referral rewards, cloud infrastructure credits, and curated tools.',
    type: 'website',
    url: 'https://nichsedge.github.io/referrals',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
    alternateLocale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Referral Gateways & Developer Perks | Ichsanul Amal',
    description: 'Verified developer referral rewards and cloud credits.',
    creator: '@nichsedge',
  },
};

export default function ReferralsPage() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Referrals', item: 'https://nichsedge.github.io/referrals' },
        ]}
      />
      <ReferralsClient />
    </>
  );
}
