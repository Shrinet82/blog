import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://abhishalprakashan.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/studio",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
