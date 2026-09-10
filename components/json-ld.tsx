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

  // Organization Schema (Top-level business identity per Ora completeness check)
  graph.push({
    '@type': 'Organization',
    '@id': 'https://nichsedge.github.io/#organization',
    name: 'NICHSEDGE',
    legalName: 'Ichsanul Amal (NICHSEDGE Consulting)',
    url: 'https://nichsedge.github.io',
    logo: 'https://nichsedge.github.io/icon.png',
    image: 'https://nichsedge.github.io/icon.png',
    description: 'Specialized enterprise data engineering, BigQuery analytics optimization, and Model Context Protocol (MCP) integrations.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cimahi',
      addressRegion: 'West Java',
      postalCode: '40512',
      addressCountry: 'Indonesia',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'muhammad.ichsanul19@gmail.com',
        url: 'https://nichsedge.github.io/contact',
        availableLanguage: ['English', 'Indonesian'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'muhammad.ichsanul19@gmail.com',
        url: 'https://nichsedge.github.io/pricing',
        availableLanguage: ['English', 'Indonesian'],
      },
    ],
    sameAs: [
      'https://github.com/nichsedge',
      'https://linkedin.com/in/ichsanulamal19',
      'https://twitter.com/nichsedge',
    ],
  });

  if (includePerson) {
    graph.push({
      '@type': 'Person',
      '@id': 'https://nichsedge.github.io/#person',
      name: 'Ichsanul Amal',
      alternateName: ['Nichsedge', 'nichsedge', 'Muhammad Ichsanul Amal'],
      url: 'https://nichsedge.github.io',
      image: 'https://nichsedge.github.io/icon.png',
      jobTitle: 'Data Quality Engineer & System Architect',
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
        name: 'Krom Bank Indonesia',
        url: 'https://krom.id',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Jakarta',
          addressCountry: 'Indonesia',
        },
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
        'https://linkedin.com/in/ichsanulamal19',
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
        'Model Context Protocol (MCP)',
        'WebMCP',
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
        { '@type': 'AdministrativeArea', name: 'Cimahi' },
        { '@type': 'AdministrativeArea', name: 'Bandung' },
        { '@type': 'AdministrativeArea', name: 'Jakarta' },
        { '@type': 'Country', name: 'Indonesia' },
        { '@type': 'Place', name: 'Worldwide Remote' },
      ],
      description:
        'Enterprise data engineering, pipeline automation, custom data warehousing, BigQuery & PostgreSQL query optimization, and Model Context Protocol (MCP) integrations based in Cimahi, Indonesia.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Engineering Services Catalog',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Open Source Community Tier',
            description: 'Public repositories, open ETL templates, and machine-readable specs.',
            price: '0.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://nichsedge.github.io/pricing',
          },
          {
            '@type': 'Offer',
            name: 'Technical Architecture Audit',
            description: 'Deep-dive review of BigQuery slot consumption, dbt models, and PostgreSQL indexing.',
            price: '1500.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://nichsedge.github.io/pricing',
          },
          {
            '@type': 'Offer',
            name: 'Contract Data Engineering Retainer',
            description: 'Dedicated monthly retainer for production lakehouse builds and streaming pipelines.',
            price: '6500.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://nichsedge.github.io/pricing',
          },
          {
            '@type': 'Offer',
            name: 'Model Context Protocol (MCP) Integration',
            description: 'Custom MCP server engineering, WebMCP integration, and agent discovery setups.',
            price: '2500.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://nichsedge.github.io/pricing',
          },
        ],
      },
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
      '@id': 'https://nichsedge.github.io/#organization',
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
        'Ichsanul Amal (Nichsedge) specializes in scalable data lakes, high-throughput ETL/ELT pipelines using Apache Airflow & dbt, BigQuery optimization, PostgreSQL database architecture, and Model Context Protocol (MCP) integrations.',
    },
    {
      question: 'Where is Ichsanul Amal located?',
      answer:
        'Ichsanul Amal is based in Cimahi, West Java, Indonesia (adjacent to Bandung & Jakarta), and works with local and international clients globally via remote contracts.',
    },
    {
      question: 'How can I get in touch with Ichsanul Amal?',
      answer:
        'You can reach Ichsanul Amal via email at muhammad.ichsanul19@gmail.com, or connect via LinkedIn (linkedin.com/in/ichsanulamal19) and GitHub (github.com/nichsedge).',
    },
    {
      question: 'What consulting tiers are available?',
      answer:
        'Services include Open Source free resources ($0), Technical Architecture Audits ($1,500 flat rate), Data Engineering Retainers ($85/hr or $6,500/mo), and Model Context Protocol (MCP) integrations ($2,500/milestone).',
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
