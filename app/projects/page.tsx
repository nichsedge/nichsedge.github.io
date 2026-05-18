import ProjectsClient from './projects-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Archive | Ichsanul Amal',
  description: 'A filtered collection of open-source projects, experiments, and production-grade tools built for the modern data stack by Ichsanul Amal.',
  openGraph: {
    title: 'Engineering Archive | Ichsanul Amal',
    description: 'A filtered collection of open-source projects, experiments, and production-grade tools built for the modern data stack by Ichsanul Amal.',
    type: 'website',
    url: 'https://nichsedge.github.io/projects',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Archive | Ichsanul Amal',
    description: 'A filtered collection of open-source projects, experiments, and production-grade tools built for the modern data stack by Ichsanul Amal.',
    creator: '@nichsedge',
  }
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
