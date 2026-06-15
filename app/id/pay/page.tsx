import { Metadata } from 'next';
import PayClient from '../../pay/pay-client';

export const metadata: Metadata = {
  title: 'Metode Pembayaran & Transfer | Ichsanul Amal',
  description: 'Lihat dan salin detail akun rekening pembayaran dan transfer secara aman untuk bertransaksi dengan Ichsanul Amal.',
  openGraph: {
    title: 'Metode Pembayaran & Transfer | Ichsanul Amal',
    description: 'Lihat dan salin detail akun rekening pembayaran dan transfer secara aman untuk bertransaksi dengan Ichsanul Amal.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/pay',
    siteName: 'NICHSEDGE',
  }
};

export default function PayIDPage() {
  return <PayClient locale="id" />;
}
