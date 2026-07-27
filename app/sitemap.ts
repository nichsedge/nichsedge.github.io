import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nichsedge.github.io';
  const now = new Date();

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'monthly' as const },
    { path: '/work', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
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

  // Additional static AI resources
  sitemapItems.push(
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  );

  return sitemapItems;
}
