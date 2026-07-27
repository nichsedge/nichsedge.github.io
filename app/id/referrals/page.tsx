import ReferralsClient from '../../referrals/referrals-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Gateway Referral & Tool Pengembang | Ichsanul Amal',
  description: 'Hadiah referral pengembang terverifikasi, kredit infrastruktur cloud, dan alat teknis yang direkomendasikan oleh Ichsanul Amal.',
  keywords: [
    'Referral Pengembang',
    'Kredit Cloud',
    'Rekomendasi Tool Developer',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/id/referrals',
    languages: {
      'en': 'https://nichsedge.github.io/referrals',
      'id': 'https://nichsedge.github.io/id/referrals',
      'x-default': 'https://nichsedge.github.io/referrals',
    },
  },
  openGraph: {
    title: 'Gateway Referral & Tool Pengembang | Ichsanul Amal',
    description: 'Hadiah referral pengembang terverifikasi dan kredit cloud.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/referrals',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gateway Referral & Tool Pengembang | Ichsanul Amal',
    description: 'Hadiah referral pengembang terverifikasi dan kredit cloud.',
    creator: '@nichsedge',
  },
};

export default function ReferralsPageID() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Beranda', item: 'https://nichsedge.github.io/id' },
          { name: 'Referral', item: 'https://nichsedge.github.io/id/referrals' },
        ]}
      />
      <ReferralsClient locale="id" />
    </>
  );
}
