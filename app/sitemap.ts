import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nichsedge.github.io';
  const now = new Date();

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'monthly' as const, hasId: true },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const, hasId: false },
    { path: '/work', priority: 0.9, changeFrequency: 'monthly' as const, hasId: true },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const, hasId: true },
    { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' as const, hasId: false },
    { path: '/developers', priority: 0.8, changeFrequency: 'monthly' as const, hasId: false },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const, hasId: false },
    { path: '/privacy', priority: 0.7, changeFrequency: 'monthly' as const, hasId: false },
    { path: '/data-lake', priority: 0.8, changeFrequency: 'monthly' as const, hasId: true },
    { path: '/terminal', priority: 0.7, changeFrequency: 'monthly' as const, hasId: true },
    { path: '/referrals', priority: 0.6, changeFrequency: 'monthly' as const, hasId: true },
    { path: '/pay', priority: 0.5, changeFrequency: 'monthly' as const, hasId: true },
  ];

  const sitemapItems: MetadataRoute.Sitemap = [];

  // Emit paired EN/ID entries only for routes that actually exist under /id
  routes.forEach((route) => {
    const enUrl = `${baseUrl}${route.path}`;

    if (route.hasId) {
      const idUrl = `${baseUrl}/id${route.path}`;
      const alternates = {
        languages: {
          en: enUrl,
          id: idUrl,
          'x-default': enUrl,
        },
      };

      sitemapItems.push({
        url: enUrl,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates,
      });

      sitemapItems.push({
        url: idUrl,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates,
      });
    } else {
      sitemapItems.push({
        url: enUrl,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
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
