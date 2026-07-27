import React from 'react';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface JsonLdProps {
  breadcrumbs?: BreadcrumbItem[];
  faqs?: Array<{ question: string; answer: string }>;
  includePerson?: boolean;
  includeService?: boolean;
  itemList?: Array<{ name: string; description?: string; url?: string }>;
}

export function JsonLd({
  breadcrumbs,
  faqs,
  includePerson = true,
  includeService = true,
  itemList,
}: JsonLdProps) {
  const graph: Record<string, unknown>[] = [];

  if (includePerson) {
    graph.push({
      '@type': 'Person',
      '@id': 'https://nichsedge.github.io/#person',
      name: 'Ichsanul Amal',
      alternateName: ['Nichsedge', 'nichsedge'],
      url: 'https://nichsedge.github.io',
      image: 'https://nichsedge.github.io/icon.png',
      jobTitle: 'Data Engineer & System Architect',
      email: 'muhammad.ichsanul19@gmail.com',
      gender: 'Male',
      nationality: {
        '@type': 'Country',
        name: 'Indonesia',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cimahi',
        addressRegion: 'West Java',
        addressCountry: 'Indonesia',
      },
      worksFor: {
        '@type': 'Organization',
        name: 'Accenture',
        url: 'https://www.accenture.com',
      },
      alumniOf: [
        {
          '@type': 'EducationalOrganization',
          name: 'University of Indonesia',
          url: 'https://ui.ac.id',
        },
        {
          '@type': 'EducationalOrganization',
          name: 'SMA Negeri 4 Bandung',
        },
      ],
      sameAs: [
        'https://github.com/nichsedge',
        'https://www.linkedin.com/in/ichsanulamal19/',
        'https://twitter.com/nichsedge',
      ],
      knowsAbout: [
        'Data Engineering',
        'System Architecture',
        'ETL / ELT Pipelines',
        'dbt (data build tool)',
        'Apache Airflow',
        'Google BigQuery',
        'PostgreSQL Performance Tuning',
        'Python',
        'SQL & Stored Procedures',
        'Data Lakes',
        'Data Governance & Quality',
        'Agentic AI Integration',
      ],
    });
  }

  if (includeService) {
    graph.push({
      '@type': 'ProfessionalService',
      '@id': 'https://nichsedge.github.io/#service',
      name: 'Ichsanul Amal - Data Engineering & Systems Architecture Consulting',
      image: 'https://nichsedge.github.io/icon.png',
      url: 'https://nichsedge.github.io',
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cimahi',
        addressRegion: 'West Java',
        addressCountry: 'Indonesia',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -6.8722,
        longitude: 107.5414,
      },
      areaServed: [
        {
          '@type': 'AdministrativeArea',
          name: 'Cimahi',
        },
        {
          '@type': 'AdministrativeArea',
          name: 'Bandung',
        },
        {
          '@type': 'AdministrativeArea',
          name: 'Jakarta',
        },
        {
          '@type': 'Country',
          name: 'Indonesia',
        },
        {
          '@type': 'Place',
          name: 'Worldwide Remote',
        },
      ],
      description:
        'Enterprise-grade data engineering, pipeline automation, custom data warehousing, BigQuery & PostgreSQL query optimization, and system orchestration services based in Cimahi, West Java, Indonesia.',
    });
  }

  // WebSite & SearchAction Schema
  graph.push({
    '@type': 'WebSite',
    '@id': 'https://nichsedge.github.io/#website',
    url: 'https://nichsedge.github.io',
    name: 'NICHSEDGE // DATA ARCHIVE',
    description:
      'Data engineer and curious generalist building scalable data systems, pipelines, and data lakes.',
    inLanguage: ['en-US', 'id-ID'],
    publisher: {
      '@id': 'https://nichsedge.github.io/#person',
    },
  });

  // Breadcrumbs Schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `https://nichsedge.github.io/#breadcrumb-${breadcrumbs.length}`,
      itemListElement: breadcrumbs.map((bc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: bc.name,
        item: bc.item,
      })),
    });
  }

  // FAQ Schema
  const defaultFaqs = faqs || [
    {
      question: 'What is Ichsanul Amal’s primary engineering specialization?',
      answer:
        'Ichsanul Amal (Nichsedge) specializes in scalable data lakes, high-throughput ETL/ELT pipelines using Apache Airflow & dbt, BigQuery optimization, PostgreSQL database architecture, and Agentic AI workflow integrations.',
    },
    {
      question: 'Where is Ichsanul Amal located?',
      answer:
        'Ichsanul Amal is based in Cimahi, West Java, Indonesia (adjacent to Bandung & Jakarta), and works with both local and international clients globally via remote contracts.',
    },
    {
      question: 'How can I get in touch with Ichsanul Amal?',
      answer:
        'You can reach Ichsanul Amal via email at muhammad.ichsanul19@gmail.com, or connect via LinkedIn (linkedin.com/in/ichsanulamal19) and GitHub (github.com/nichsedge).',
    },
  ];

  graph.push({
    '@type': 'FAQPage',
    mainEntity: defaultFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });

  // ItemList Schema
  if (itemList && itemList.length > 0) {
    graph.push({
      '@type': 'ItemList',
      itemListElement: itemList.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        description: item.description,
        url: item.url,
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        }),
      }}
    />
  );
}
