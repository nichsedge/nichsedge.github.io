import { Metadata } from 'next';
import PayClient from './pay-client';

export const metadata: Metadata = {
  title: 'Payment & Transfer Methods | Ichsanul Amal',
  description: 'View and copy secure payment and transfer account details to transact with Ichsanul Amal.',
  openGraph: {
    title: 'Payment & Transfer Methods | Ichsanul Amal',
    description: 'View and copy secure payment and transfer account details to transact with Ichsanul Amal.',
    type: 'website',
    url: 'https://nichsedge.github.io/pay',
    siteName: 'NICHSEDGE',
  }
};

export default function PayPage() {
  return <PayClient />;
}
