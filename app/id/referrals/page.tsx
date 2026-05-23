import ReferralsClient from '../../referrals/referrals-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gateway Referensi & Ingesti | Ichsanul Amal',
  description: 'Hubungkan, daftarkan, dan sinkronkan dengan node afiliasi aman dan gateway layanan kognitif yang dikurasi oleh Ichsanul Amal.',
  openGraph: {
    title: 'Gateway Referensi & Ingesti | Ichsanul Amal',
    description: 'Hubungkan, daftarkan, dan sinkronkan dengan node afiliasi aman dan gateway layanan kognitif yang dikurasi oleh Ichsanul Amal.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/referrals/',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gateway Referensi & Ingesti | Ichsanul Amal',
    description: 'Hubungkan, daftarkan, dan sinkronkan dengan node afiliasi aman dan gateway layanan kognitif yang dikurasi oleh Ichsanul Amal.',
    creator: '@nichsedge',
  }
};

export default function ReferralsPageID() {
  return <ReferralsClient locale="id" />;
}
