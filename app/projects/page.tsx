import ProjectsClient from './projects-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Engineering Archive & Projects | Ichsanul Amal',
  description: 'A curated collection of open-source data engineering tools, financial analytics trackers, and system automation repositories built by Ichsanul Amal.',
  keywords: [
    'Ichsanul Amal Projects',
    'Data Engineering GitHub Repositories',
    'idx-bei financial data',
    'sansfinance tracker',
    'atracker',
    'Open Source Data Stack',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io/projects',
    languages: {
      'en': 'https://nichsedge.github.io/projects',
      'id': 'https://nichsedge.github.io/id/projects',
      'x-default': 'https://nichsedge.github.io/projects',
    },
  },
  openGraph: {
    title: 'Engineering Archive & Projects | Ichsanul Amal',
    description: 'A curated collection of open-source data engineering tools, financial analytics trackers, and system automation repositories.',
    type: 'website',
    url: 'https://nichsedge.github.io/projects',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
    alternateLocale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Archive & Projects | Ichsanul Amal',
    description: 'A curated collection of open-source data engineering tools and system repositories.',
    creator: '@nichsedge',
  },
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Projects', item: 'https://nichsedge.github.io/projects' },
        ]}
        itemList={[
          { name: 'idx-bei', description: 'Indonesian Stock Exchange financial data extraction and analysis pipeline.', url: 'https://github.com/nichsedge/idx-bei' },
          { name: 'sansfinance', description: 'Personal finance analytics and portfolio tracker platform.', url: 'https://github.com/nichsedge/sansfinance' },
          { name: 'atracker', description: 'Automated milestone and performance tracking tool for data workflows.', url: 'https://github.com/nichsedge/atracker' },
        ]}
      />
      <ProjectsClient />
    </>
  );
}
