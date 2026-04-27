import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/utils';
import { COLLECTIONS } from '@/data/collections';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();
  const staticRoutes = [
    '', '/live', '/watch', '/eats', '/gallery', '/shop',
    '/about', '/links', '/schedule', '/community', '/faq',
  ];
  const collectionRoutes = COLLECTIONS.map((c) => `/collections/${c.id}`);

  return [...staticRoutes, ...collectionRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
