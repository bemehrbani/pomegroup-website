import type { MetadataRoute } from 'next';
import { allVentures } from '@/lib/ventures-data';

const BASE_URL = 'https://www.pomegroup.studio';

export default function sitemap(): MetadataRoute.Sitemap {
  const ventureEntries = allVentures.map((venture) => ({
    url: `${BASE_URL}/ventures/${venture.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...ventureEntries,
  ];
}
