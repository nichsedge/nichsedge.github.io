import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NICHSEDGE // DATA ARCHIVE',
    short_name: 'NICHSEDGE',
    description: 'Data engineer and curious generalist building data systems and exploring the intersection of pipelines and ideas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#00e1cf',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
