import { Metadata } from 'next';
import PayClient from '../../pay/pay-client';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Metode Pembayaran & Transfer | Ichsanul Amal',
  description: 'Saluran pembayaran aman, rekening transfer bank, dan detail QRIS untuk layanan konsultasi teknik data Ichsanul Amal.',
  keywords: [
    'Metode Pembayaran Ichsanul Amal',
    'Transfer Bank',
    'QRIS',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/id/pay',
    languages: {
      'en': 'https://nichsedge.github.io/pay',
      'id': 'https://nichsedge.github.io/id/pay',
      'x-default': 'https://nichsedge.github.io/pay',
    },
  },
  openGraph: {
    title: 'Metode Pembayaran & Transfer | Ichsanul Amal',
    description: 'Saluran pembayaran aman, rekening transfer bank, dan detail QRIS.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/pay',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metode Pembayaran & Transfer | Ichsanul Amal',
    description: 'Saluran pembayaran aman dan rincian transaksi.',
    creator: '@nichsedge',
  },
};

export default function PayPageID() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Beranda', item: 'https://nichsedge.github.io/id' },
          { name: 'Pembayaran', item: 'https://nichsedge.github.io/id/pay' },
        ]}
      />
      <PayClient locale="id" />
    </>
  );
}
