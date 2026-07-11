import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { getPostsByCategoryQuery } from "@/sanity/lib/queries";
import { Post } from "@/sanity/lib/types";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 60; // Revalidate every 60 seconds

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  let posts: Post[] = [];
  try {
    posts = await client.fetch(getPostsByCategoryQuery, { categorySlug: slug });
  try {
    posts = await client.fetch(getPostsByCategoryQuery, { categorySlug: slug });
  } catch (error) {
    console.error("Sanity category fetch error:", error);
  }

  if (!posts) {
    posts = [];
  }

  // Format human-readable title based on category slug
  const titleMap: Record<string, string> = {
    "case-laws": "Case Laws",
    "constitutional-law": "Constitutional Law",
    "current-affairs": "Daily Current Affairs",
    "general-studies": "General Studies",
    "legal-theory": "Legal Theory",
  };
  const categoryTitle = titleMap[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      {/* Category Header with Filters */}
      <section className="mb-10">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-4">
          Category: {categoryTitle}
        </h1>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column - Articles */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <ArticleCard key={post._id} post={post} variant="row" />
            ))
          ) : (
            <div className="border border-outline-variant rounded p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">
                folder_open
              </span>
              <p className="text-body-lg font-body-lg">No articles found in this category.</p>
              <Link href="/" className="text-secondary hover:underline text-body-sm mt-2 block">
                Return to homepage
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
