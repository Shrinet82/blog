import Link from "next/link";
import { Post } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";

interface ArticleCardProps {
  post: Post;
  variant?: "grid" | "row" | "compact";
}

export default function ArticleCard({ post, variant = "grid" }: ArticleCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const categoryTitle = post.categories?.[0]?.title || "General";
  const postUrl = `/article/${post.slug.current}`;
  
  // Compact variant for sidebars
  if (variant === "compact") {
    return (
      <Link href={postUrl} className="group block py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
              {categoryTitle}
            </span>
            <h3 className="text-body-md font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-1 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-xs text-outline font-normal">
              {formattedDate}
            </p>
          </div>
          {post.mainImage && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-surface-variant overflow-hidden">
              <img
                src={urlForImage(post.mainImage)}
                alt={post.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Row variant for the main feed (Medium style)
  if (variant === "row") {
    return (
      <Link href={postUrl} className="block group py-8 border-b border-outline-variant/20 last:border-0">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
          <div className="flex-1 order-2 md:order-1 max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {categoryTitle}
              </span>
              <span className="text-xs text-outline font-normal">
                {formattedDate}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-headline-sm text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-base text-on-surface-variant line-clamp-3 leading-relaxed mb-4">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-full">
                5 min read
              </span>
            </div>
          </div>
          {post.mainImage && (
            <div className="order-1 md:order-2 w-full md:w-48 lg:w-56 aspect-[3/2] flex-shrink-0 bg-surface-variant overflow-hidden">
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
