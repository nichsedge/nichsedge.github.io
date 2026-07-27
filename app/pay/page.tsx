import { Metadata } from 'next';
import PayClient from './pay-client';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Payment & Transfer Methods | Ichsanul Amal',
  description: 'Secure payment channels, bank transfer gateways, and QRIS transaction details for consulting services with Ichsanul Amal.',
  keywords: [
    'Ichsanul Amal Payment Methods',
    'Bank Transfer Details',
    'QRIS Payment',
    'Consulting Invoicing',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/pay',
    languages: {
      'en': 'https://nichsedge.github.io/pay',
      'id': 'https://nichsedge.github.io/id/pay',
      'x-default': 'https://nichsedge.github.io/pay',
    },
  },
  openGraph: {
    title: 'Payment & Transfer Methods | Ichsanul Amal',
    description: 'Secure payment channels, bank transfer gateways, and QRIS transaction details.',
    type: 'website',
    url: 'https://nichsedge.github.io/pay',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
    alternateLocale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payment & Transfer Methods | Ichsanul Amal',
    description: 'Secure payment channels and bank transfer gateways.',
    creator: '@nichsedge',
  },
};

export default function PayPage() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Pay', item: 'https://nichsedge.github.io/pay' },
        ]}
      />
      <PayClient />
    </>
  );
}
