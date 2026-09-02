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

  const year = new Date().getFullYear();
  const citationFor = (post: Post) => {
    const index = posts.findIndex((p) => p._id === post._id);
    return `[${year}] ABHISHAL ${posts.length - index}`;
  };

  // 1. Lead post (Landmark, or first item)
  const heroPost = posts.find((p) => p.isLandmark) || posts[0];

  // 2. Case Laws (latest 5 for the marginalia)
  const caseLaws = posts.filter(
    (p) =>
      p.categories?.some(
        (c) => c.slug.current === "case-laws" || c.slug.current === "constitutional-law"
      )
  ).slice(0, 5);

  const sidebarPosts = caseLaws.length > 0 ? caseLaws : posts.filter((p) => p._id !== heroPost?._id).slice(0, 5);

  // 3. Main index (exclude lead)
  const mainFeedPosts = posts.filter((p) => p._id !== heroPost?._id);

  const heroDate = heroPost
    ? new Date(heroPost.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-9 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-[2.15fr_1fr] gap-10 md:gap-14">
        <div>
          {/* Lead article */}
          {heroPost && (
            <article className="mb-9">
              <Link href={`/article/${heroPost.slug.current}`} className="group block">
                <span className="block text-xs font-num text-primary mb-2.5">
                  {citationFor(heroPost)}
                </span>
                <span className="italic text-on-surface-variant text-sm block mb-2">
                  {heroPost.categories?.[0]?.title || "Featured"}
                </span>
                <h1 className="font-display font-semibold text-2xl md:text-3xl leading-snug text-on-surface mb-1 group-hover:text-primary transition-colors">
                  {heroPost.title}
                </h1>
                {heroPost.mainImage && (
                  <div className="w-full aspect-[16/9] my-4 bg-surface-variant overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={urlForImage(heroPost.mainImage)}
                      alt={heroPost.title}
                    />
                  </div>
                )}
                {heroPost.excerpt && (
                  <p className="text-base leading-loose max-w-[66ch] mb-3 pl-4 border-l-2 border-outline-variant text-on-surface">
                    {heroPost.excerpt}
                  </p>
                )}
                <span className="block text-sm italic text-on-surface-variant mb-1.5">
                  {heroDate} · 5 min read
                </span>
                <span className="inline-block text-sm font-medium font-num text-on-surface border-b border-on-surface group-hover:text-primary group-hover:border-primary transition-colors">
                  पूरा लेख पढ़ें · Read full article
                </span>
              </Link>
            </article>
          )}

          {/* Index of latest articles */}
          <div className="flex items-baseline gap-3.5 mb-1 pb-0">
            <span className="text-xs font-num text-primary tracking-wide whitespace-nowrap">§ 2</span>
            <h2 className="font-display font-semibold text-lg text-on-surface flex-1 pb-2 border-b-2 border-on-surface">
              नवीनतम लेख · Latest Articles
            </h2>
          </div>

          <div className="flex flex-col">
            {mainFeedPosts.length > 0 ? (
              mainFeedPosts.map((post) => (
                <ArticleCard key={post._id} post={post} variant="row" citation={citationFor(post)} />
              ))
            ) : (
              <p className="text-on-surface-variant py-8">No articles found.</p>
            )}
          </div>
        </div>

        {/* Marginalia (sidebar) */}
        <aside className="md:border-l md:border-outline-variant md:pl-9">
          <div className="sticky top-28">
            <div className="flex items-baseline gap-3.5 mb-1">
              <span className="text-xs font-num text-primary tracking-wide whitespace-nowrap">§ 3</span>
              <h2 className="font-display font-semibold text-base text-on-surface flex-1 pb-2 border-b-2 border-on-surface">
                प्रचलित वाद · Trending Cases
              </h2>
            </div>

            <div className="flex flex-col">
              {sidebarPosts.map((post) => (
                <ArticleCard key={post._id} post={post} variant="compact" citation={citationFor(post)} />
              ))}
            </div>

            <div className="mt-8 pt-5 border-t border-outline-variant">
              <h3 className="font-display font-semibold text-sm text-on-surface mb-2.5 pb-1.5 border-b border-on-surface">
                ABHISHAL के बारे में
              </h3>
              <p className="text-sm leading-relaxed text-on-surface-variant mb-2.5">
                विधि छात्रों, अधिवक्ताओं व शोधार्थियों के लिए दैनिक समसामयिक विश्लेषण, ऐतिहासिक निर्णय और संवैधानिक विधि पर एक अकादमिक मंच।
              </p>
              <Link href="/about" className="text-sm font-medium font-num border-b border-on-surface hover:text-primary hover:border-primary transition-colors">
                और जानें · Learn more
              </Link>
            </div>

            <div className="mt-8 pt-5 border-t border-outline-variant">
              <h3 className="font-display font-semibold text-sm text-on-surface mb-2.5 pb-1.5 border-b border-on-surface">
                विषय · Topics
              </h3>
              <p className="text-sm leading-loose text-on-surface-variant">
                {['Constitutional Law', 'Current Affairs', 'General Studies', 'Criminal Law', 'Editorials'].map((tag, i) => (
                  <span key={tag}>
                    {i > 0 && <span className="text-outline-variant mx-1.5">/</span>}
                    <Link href={`/search?q=${tag}`} className="hover:text-primary transition-colors border-b border-transparent hover:border-primary">
                      {tag}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
