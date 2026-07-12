import { MetadataRoute } from 'next'
import { client } from "@/sanity/lib/client";

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abhishalprakashan.com';

  // Fetch all dynamic routes from Sanity
  const posts = await client.fetch(`*[_type == "post"] { "slug": slug.current, _updatedAt }`);
  const journals = await client.fetch(`*[_type == "journal"] { "slug": slug.current, _updatedAt }`);
  const categories = await client.fetch(`*[_type == "category"] { "slug": slug.current }`);

  // Map Sanity documents to Sitemap URLs
  const postUrls = posts.map((post: any) => ({
    url: `${baseUrl}/article/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const journalUrls = journals.map((journal: any) => ({
    url: `${baseUrl}/journal/${journal.slug}`,
    lastModified: new Date(journal._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const categoryUrls = categories.map((category: any) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Combine static and dynamic routes
  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/journals`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...postUrls,
    ...journalUrls,
    ...categoryUrls,
  ];
}
