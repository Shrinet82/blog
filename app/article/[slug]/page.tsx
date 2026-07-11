import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { getPostBySlugQuery } from "@/sanity/lib/queries";
import { Post } from "@/sanity/lib/types";
import ArticleReader from "@/components/ArticleReader";

export const revalidate = 60; // Revalidate every 60 seconds

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Dynamically generate SEO metadata based on the article content
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = params;
  let post: Post | null = null;

  try {
    post = await client.fetch(getPostBySlugQuery, { slug });
  } catch (error) {
    console.error("Sanity metadata fetch error:", error);
  }

  if (!post) {
    return {
      title: "Article Not Found | Lex Academia",
      description: "The requested legal article could not be found.",
    };
  }

  return {
    title: `${post.title} | Lex Academia`,
    description: post.excerpt || "Scholarly discipline for legal excellence.",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;
  let post: Post | null = null;

  try {
    post = await client.fetch(getPostBySlugQuery, { slug });
  } catch (error) {
    console.error("Sanity fetch error for article page:", error);
  }

  if (!post) {
    notFound();
  }

  return <ArticleReader post={post} />;
}
