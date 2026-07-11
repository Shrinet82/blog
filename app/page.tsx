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

  // Segment posts:
  // 1. Hero post (Landmark, or first item)
  const heroPost = posts.find((p) => p.isLandmark) || posts[0];

  // 2. Case Laws (latest 3 for the sidebar)
  const caseLaws = posts.filter(
    (p) =>
      p.categories?.some(
        (c) => c.slug.current === "case-laws" || c.slug.current === "constitutional-law"
      )
  ).slice(0, 3);

  // If we don't have enough case laws, fill with latest non-hero posts
  const sidebarPosts = caseLaws.length > 0 ? caseLaws : posts.filter((p) => p._id !== heroPost?._id).slice(0, 3);

  // 3. Recent Publications (exclude hero, show up to 3)
  const recentPublications = posts.filter((p) => p._id !== heroPost?._id).slice(0, 3);

  const heroDate = heroPost
    ? new Date(heroPost.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-16">
        {heroPost && (
          <Link
            href={`/article/${heroPost.slug.current}`}
            className="md:col-span-8 group cursor-pointer"
          >
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-label-md font-label-md rounded-DEFAULT uppercase tracking-wider">
                  {heroPost.categories?.[0]?.title || "Daily Current Affairs"}
                </span>
                <span className="text-body-sm font-body-sm text-outline">{heroDate}</span>
              </div>
              
              {heroPost.mainImage ? (
                <div className="relative w-full aspect-video mb-6 overflow-hidden rounded-DEFAULT border border-outline-variant">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={urlForImage(heroPost.mainImage)}
                    alt={heroPost.title}
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video mb-6 overflow-hidden rounded-DEFAULT border border-outline-variant bg-surface-variant flex items-center justify-center">
                  <span className="text-on-surface-variant">No Image Available</span>
                </div>
              )}

              <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-3 group-hover:text-secondary transition-colors">
                {heroPost.title}
              </h1>
              {heroPost.excerpt && (
                <p className="text-body-lg font-body-lg text-on-surface-variant line-clamp-3">
                  {heroPost.excerpt}
                </p>
              )}
            </div>
          </Link>
        )}

        {/* Sidebar Precedents */}
        <div className="md:col-span-4 flex flex-col pt-8 md:pt-0 border-t md:border-t-0 md:border-l border-outline-variant md:pl-gutter">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-headline-sm font-headline-sm text-on-surface border-b-2 border-primary pb-1 inline-block">
              Latest Case Laws
            </h2>
            <Link
              href="/category/case-laws"
              className="text-label-md font-label-md text-secondary hover:text-primary transition-colors flex items-center cursor-pointer"
            >
              View All{" "}
              <span className="material-symbols-outlined ml-1" style={{ fontSize: "16px" }}>
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="flex flex-col space-y-6">
            {sidebarPosts.map((post, idx) => (
              <div key={post._id}>
                {idx > 0 && <hr className="border-outline-variant border-opacity-50 mb-6" />}
                <Link href={`/article/${post.slug.current}`} className="group block cursor-pointer">
                  <span className="text-label-md font-label-md text-secondary block mb-1">
                    {post.categories?.[0]?.title || "Precedent"}
                  </span>
                  <h3 className="text-body-md font-body-md font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-1">
                    {post.title}
                  </h3>
                  <p className="text-label-md font-label-md text-outline font-normal">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-outline-variant w-full mb-12" />

      {/* Grid of Recent Publications */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-headline-md font-headline-md text-on-surface">Recent Publications</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {recentPublications.map((post) => (
            <ArticleCard key={post._id} post={post} variant="grid" />
          ))}
        </div>
      </section>
    </div>
  );
}
