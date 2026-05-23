import ProjectsClient from '../../projects/projects-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arsip Engineering | Ichsanul Amal',
  description: 'Koleksi proyek open-source terkurasi, eksperimen, dan alat tingkat produksi yang dibangun untuk modern data stack oleh Ichsanul Amal.',
  openGraph: {
    title: 'Arsip Engineering | Ichsanul Amal',
    description: 'Koleksi proyek open-source terkurasi, eksperimen, dan alat tingkat produksi yang dibangun untuk modern data stack oleh Ichsanul Amal.',
    type: 'website',
    url: 'https://nichsedge.github.io/id/projects/',
    siteName: 'NICHSEDGE',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arsip Engineering | Ichsanul Amal',
    description: 'Koleksi proyek open-source terkurasi, eksperimen, dan alat tingkat produksi yang dibangun untuk modern data stack oleh Ichsanul Amal.',
    creator: '@nichsedge',
  }
};

export default function ProjectsPageID() {
  return <ProjectsClient locale="id" />;
}
