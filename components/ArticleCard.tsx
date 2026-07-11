import Link from "next/link";
import { Post } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";

interface ArticleCardProps {
  post: Post;
  variant?: "grid" | "row";
}

export default function ArticleCard({ post, variant = "grid" }: ArticleCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const categoryTitle = post.categories?.[0]?.title || "General";
  const postUrl = `/article/${post.slug.current}`;

  if (variant === "row") {
    return (
      <Link href={postUrl} className="block group">
        <div className="bg-surface border border-outline-variant p-6 rounded hover:border-primary transition-colors duration-200 flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-surface-variant text-on-surface text-label-md font-label-md px-2 py-0.5 rounded uppercase">
                {categoryTitle}
              </span>
              <span className="text-body-sm font-body-sm text-on-surface-variant">
                {formattedDate}
              </span>
            </div>
            <h2 className="text-headline-sm font-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-body-md font-body-md text-on-surface-variant line-clamp-3">
                {post.excerpt}
              </p>
            )}
          </div>
          {post.mainImage && (
            <div className="hidden md:block w-48 h-32 flex-shrink-0 bg-surface-container-high border border-outline-variant rounded overflow-hidden relative">
              <img
                src={urlForImage(post.mainImage)}
                alt={post.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={postUrl} className="block group h-full">
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-DEFAULT hover:border-primary transition-colors duration-200 cursor-pointer flex flex-col h-full shadow-sm hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-surface-container-low text-on-surface-variant px-2 py-1 text-label-md font-label-md rounded-DEFAULT uppercase">
            {categoryTitle}
          </span>
          <span className="text-label-md font-label-md text-outline font-normal">
            {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-body-md font-body-md text-on-surface-variant line-clamp-2 mt-auto">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
