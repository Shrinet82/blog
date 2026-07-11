import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { getPostsQuery } from "@/sanity/lib/queries";
import { Post } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let posts: Post[] = [];

  try {
    posts = await client.fetch(getPostsQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
  }

  if (!posts) {
    posts = [];
  }

  // 1. Hero post (Landmark, or first item)
  const heroPost = posts.find((p) => p.isLandmark) || posts[0];

  // 2. Case Laws (latest 5 for the sidebar)
  const caseLaws = posts.filter(
    (p) =>
      p.categories?.some(
        (c) => c.slug.current === "case-laws" || c.slug.current === "constitutional-law"
      )
  ).slice(0, 5);

  const sidebarPosts = caseLaws.length > 0 ? caseLaws : posts.filter((p) => p._id !== heroPost?._id).slice(0, 5);

  // 3. Main Feed (exclude hero)
  const mainFeedPosts = posts.filter((p) => p._id !== heroPost?._id);

  const heroDate = heroPost
    ? new Date(heroPost.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      {/* Hero Section (Overlay Style) */}
      {heroPost && (
        <section className="mb-16">
          <Link
            href={`/article/${heroPost.slug.current}`}
            className="group block relative w-full h-[60vh] min-h-[400px] overflow-hidden bg-surface-variant flex items-end"
          >
            {heroPost.mainImage && (
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={urlForImage(heroPost.mainImage)}
                alt={heroPost.title}
              />
            )}
            
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            <div className="relative z-10 p-6 md:p-12 max-w-3xl">
              <div className="flex items-center mb-3 md:mb-4 space-x-3">
                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest">
                  {heroPost.categories?.[0]?.title || "Featured"}
                </span>
                <span className="text-white/70">•</span>
                <span className="text-[10px] md:text-xs text-white/80">{heroDate}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white mb-3 md:mb-4 leading-tight md:leading-tight group-hover:text-white/90 transition-colors line-clamp-4 sm:line-clamp-3">
                {heroPost.title}
              </h1>
              {heroPost.excerpt && (
                <p className="text-base md:text-lg text-white/80 line-clamp-2 leading-relaxed">
                  {heroPost.excerpt}
                </p>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Main Content: 2/3 - 1/3 Split */}
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Main Feed (Left 2/3) */}
        <main className="lg:w-2/3">
          <div className="mb-8 border-b border-outline-variant/30 pb-4">
            <h2 className="text-xl font-display font-bold text-on-surface">
              Latest from ABHISHAL
            </h2>
          </div>
          
          <div className="flex flex-col">
            {mainFeedPosts.length > 0 ? (
              mainFeedPosts.map((post) => (
                <ArticleCard key={post._id} post={post} variant="row" />
              ))
            ) : (
              <p className="text-on-surface-variant py-8">No articles found.</p>
            )}
          </div>
        </main>

        {/* Sidebar (Right 1/3) */}
        <aside className="lg:w-1/3">
          <div className="sticky top-28">
            <div className="mb-6 border-b border-outline-variant/30 pb-4">
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                Trending Case Laws
              </h2>
            </div>
            
            <div className="flex flex-col divide-y divide-outline-variant/10">
              {sidebarPosts.map((post) => (
                <ArticleCard key={post._id} post={post} variant="compact" />
              ))}
            </div>

            <div className="mt-12 mb-6 border-b border-outline-variant/30 pb-4">
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
