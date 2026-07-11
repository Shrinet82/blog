import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { getPostsByCategoryQuery } from "@/sanity/lib/queries";
import { Post } from "@/sanity/lib/types";
import ArticleCard from "@/components/ArticleCard";
import SortFilter from "@/components/SortFilter";

export const revalidate = 60; // Revalidate every 60 seconds

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sort?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;
  const sort = searchParams.sort || "newest";

  let posts: Post[] = [];
  try {
    posts = await client.fetch(getPostsByCategoryQuery, { categorySlug: slug });
  } catch (error) {
    console.error("Sanity category fetch error:", error);
  }

  if (!posts) {
    posts = [];
  }

  // Sanity already sorts by newest by default via the query
  // If user selected oldest, just reverse the array
  if (sort === "oldest") {
    posts.reverse();
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
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16">
      
      {/* Category Header with Filters */}
      <section className="mb-12 border-b border-outline-variant/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
            Category
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface">
            {categoryTitle}
          </h1>
        </div>
        <div>
          <SortFilter />
        </div>
      </section>

      {/* Main Content: 2/3 - 1/3 Split (Medium style) */}
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Main Feed (Left 2/3) */}
        <main className="lg:w-2/3">
          <div className="flex flex-col">
            {posts.length > 0 ? (
              posts.map((post) => (
                <ArticleCard key={post._id} post={post} variant="row" />
              ))
            ) : (
              <div className="py-12 text-on-surface-variant">
                <p className="text-lg">No articles found in this category.</p>
                <Link href="/" className="text-on-surface hover:underline text-sm mt-2 block">
                  Return to homepage
                </Link>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar (Right 1/3) */}
        <aside className="lg:w-1/3">
          <div className="sticky top-28">
            <div className="mb-6 border-b border-outline-variant/30 pb-4">
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                Discover more
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Constitutional Law', 'Current Affairs', 'General Studies', 'Criminal Law', 'Editorials'].map((tag) => (
                <Link key={tag} href={`/search?q=${tag}`} className="bg-surface-container-low text-on-surface-variant hover:bg-outline-variant/20 px-3 py-1.5 text-sm rounded-sm transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
