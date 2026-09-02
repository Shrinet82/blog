import Link from "next/link";
import { Post } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";

interface ArticleCardProps {
  post: Post;
  variant?: "grid" | "row" | "compact";
  citation?: string;
}

export default function ArticleCard({ post, variant = "grid", citation }: ArticleCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const shortDate = new Date(post.publishedAt)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    .toUpperCase();

  const categoryTitle = post.categories?.[0]?.title || "General";
  const postUrl = `/article/${post.slug.current}`;

  // Compact variant for sidebars (marginalia / trending)
  if (variant === "compact") {
    return (
      <Link href={postUrl} className="group block py-3.5 pl-4 border-l-2 border-outline-variant hover:border-primary transition-colors">
        {citation && <span className="block text-xs font-num text-primary mb-1">{citation}</span>}
        <span className="block font-body-lg italic text-body-md text-on-surface group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </span>
        <span className="block text-xs font-num text-on-surface-variant mt-1 uppercase">
          {categoryTitle} · {formattedDate}
        </span>
      </Link>
    );
  }

  // Row variant for the main feed (newspaper index style)
  if (variant === "row") {
    return (
      <Link href={postUrl} className="group grid grid-cols-1 sm:grid-cols-[74px_1fr] gap-2 sm:gap-4 py-5 border-b border-outline-variant">
        <div>
          {citation && <span className="block text-xs font-num text-primary">{citation}</span>}
          <span className="block text-xs font-num text-on-surface-variant mt-1.5">{shortDate}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex-1 max-w-2xl">
            <span className="block italic text-body-sm text-on-surface-variant mb-1.5">
              {categoryTitle}
            </span>
            <h3 className="text-lg font-display font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed max-w-[64ch]">
                {post.excerpt}
              </p>
            )}
            <span className="inline-block text-xs font-num text-on-surface-variant mt-2">
              5 min read
            </span>
          </div>
          {post.mainImage && (
            <div className="w-full md:w-40 aspect-[3/2] flex-shrink-0 bg-surface-variant overflow-hidden">
              <img
                src={urlForImage(post.mainImage)}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Grid variant for smaller blocks (like bottom of page)
  return (
    <Link href={postUrl} className="block group h-full">
      <div className="flex flex-col h-full">
        {post.mainImage && (
          <div className="w-full aspect-[16/9] mb-4 bg-surface-variant overflow-hidden">
            <img
              src={urlForImage(post.mainImage)}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
        )}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            {categoryTitle}
          </span>
        </div>
        <h3 className="text-lg font-bold font-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-on-surface-variant line-clamp-2 mt-auto">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
