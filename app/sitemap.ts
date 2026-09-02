import { MetadataRoute } from 'next'
import { client } from "@/sanity/lib/client";

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abhishalprakashan.com';

  // Fetch all dynamic routes from Sanity
  const posts = await client.fetch(
    `*[_type in ["currentAffairs", "caseLaw", "generalStudies"]] { "slug": slug.current, _updatedAt }`
  );
  const journals = await client.fetch(`*[_type == "journal"] { "slug": slug.current, _updatedAt }`);
  const actsLaws = await client.fetch(`*[_type == "actLaw"] { "slug": slug.current, _updatedAt }`);

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

  const actLawUrls = actsLaws.map((actLaw: any) => ({
    url: `${baseUrl}/acts-laws/${actLaw.slug}`,
    lastModified: new Date(actLaw._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Categories are synthesized per content type (see sanity/lib/queries.ts),
  // not a standalone Sanity document type, so they're listed statically here.
  const categoryUrls = ["current-affairs", "case-laws", "general-studies"].map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
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
    {
      url: `${baseUrl}/acts-laws`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...postUrls,
    ...journalUrls,
    ...actLawUrls,
    ...categoryUrls,
  ];
}
