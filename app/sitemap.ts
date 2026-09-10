import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nichsedge.github.io';
  const now = new Date();

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/work', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/developers', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/data-lake', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/terminal', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/referrals', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/pay', priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  const sitemapItems: MetadataRoute.Sitemap = [];

  // English & Indonesian paired routes with hreflang alternates
  routes.forEach((route) => {
    const enUrl = `${baseUrl}${route.path}`;
    const idUrl = `${baseUrl}/id${route.path}`;

    sitemapItems.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: enUrl,
          id: idUrl,
          'x-default': enUrl,
        },
      },
    });

    sitemapItems.push({
      url: idUrl,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: enUrl,
          id: idUrl,
          'x-default': enUrl,
        },
      },
    });
  });

  // Static AI & Machine-readable resources
  const staticDocs = [
    '/llms.txt',
    '/llms-full.txt',
    '/index.md',
    '/auth.md',
    '/pricing.md',
    '/openapi.json',
    '/.well-known/ard.json',
    '/.well-known/agent-card.json',
    '/.well-known/api-catalog',
  ];

  staticDocs.forEach((doc) => {
    sitemapItems.push({
      url: `${baseUrl}${doc}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  return sitemapItems;
}
