"use client";

import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import { Post } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";

interface ArticleReaderProps {
  post: Post;
}

interface HeadingItem {
  text: string;
  id: string;
}

export default function ArticleReader({ post }: ArticleReaderProps) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");

  // Extract headings for Table of Contents
  const headings: HeadingItem[] =
    post.body
      ?.filter((block: any) => block._type === "block" && block.style === "h2")
      .map((block: any) => {
        const text = block.children?.map((c: any) => c.text).join("") || "";
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        return { text, id };
      }) || [];

  // Reading progress bar logic
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy logic to highlight current heading in TOC
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -60% 0px", // Trigger when heading is in the upper part of the screen
        threshold: 0.1,
      }
    );

    headings.forEach((heading: HeadingItem) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Custom Portable Text rendering components to match HTML design system
  const portableTextComponents = {
    block: {
      h2: ({ children, value }: any) => {
        const text = value.children?.map((c: any) => c.text).join("") || "";
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        return (
          <h2
            id={id}
            className="text-headline-sm font-headline-sm text-on-surface mt-10 mb-4 font-bold font-sans tracking-tight scroll-mt-24"
          >
            {children}
          </h2>
        );
      },
      blockquote: ({ children }: any) => (
        <blockquote className="my-8 pl-6 border-l-[3px] border-[#2563EB] bg-[#F8FAFC] py-4 pr-4 text-body-md font-body-md italic text-[#334155] rounded-r">
          {children}
        </blockquote>
      ),
      normal: ({ children }: any) => <p className="mt-4">{children}</p>,
    },
    list: {
      bullet: ({ children }: any) => <ul className="list-none space-y-3 mt-4 ml-2">{children}</ul>,
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="flex items-start">
          <span className="text-[#2563EB] mr-3 mt-1">•</span>
          <span>{children}</span>
        </li>
      ),
    },
    types: {
      image: ({ value }: any) => {
        if (!value) return null;
        return (
          <div className="w-full my-8 overflow-hidden rounded border border-outline-variant">
            <img src={urlForImage(value)} alt="Embedded Content" className="w-full object-cover" />
          </div>
        );
      },
    },
  };

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        className="reading-progress h-[2px] bg-[#2563EB] fixed top-0 left-0 z-[60]"
        style={{ width: `${progress}%` }}
      ></div>

      <main className="flex-grow flex w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 gap-gutter relative">
        {/* Sticky Table of Contents Sidebar */}
        {headings.length > 0 && (
          <aside className="hidden lg:flex flex-col w-64 gap-y-4 py-4 bg-surface-container-low sticky top-24 rounded-lg border-l border-outline-variant h-fit">
            <div className="px-4 pb-2 border-b border-outline-variant mb-2">
              <h3 className="text-label-lg font-label-lg font-bold text-on-surface">
                Table of Contents
              </h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Article Sections</p>
            </div>
            <nav className="flex flex-col gap-1">
              {headings.map((heading) => {
                const isActive = activeId === heading.id;
                return (
                  <a
                    key={heading.id}
                    className={`flex items-center gap-3 py-2 px-4 transition-all duration-200 text-label-lg font-label-lg border-l-2 ${
                      isActive
                        ? "text-primary font-bold border-primary bg-surface-container-high"
                        : "text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                    href={`#${heading.id}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isActive ? "balance" : "menu_book"}
                    </span>
                    <span className="truncate">{heading.text}</span>
                  </a>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content Article */}
        <article className="flex-1 max-w-content-width mx-auto pb-24">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex text-label-md font-label-md text-on-surface-variant mb-6">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              {post.categories?.[0] && (
                <li>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                    <a
                      href={`/category/${post.categories[0].slug.current}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.categories[0].title}
                    </a>
                  </div>
                </li>
              )}
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-[#F1F5F9] text-[#334155] rounded text-label-md font-label-md uppercase tracking-wider border border-[#E2E8F0]">
                {post.categories?.[0]?.title || "Publication"}
              </span>
              {post.isLandmark && (
                <span className="px-2 py-1 bg-[#F1F5F9] text-[#334155] rounded text-label-md font-label-md uppercase tracking-wider border border-[#E2E8F0]">
                  Landmark
                </span>
              )}
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 py-4 border-y border-[#E2E8F0]">
              {post.author.image ? (
                <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-[#E2E8F0]">
                  <img
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                    src={urlForImage(post.author.image)}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-[#E2E8F0] text-sm font-bold">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-label-md font-label-md text-on-surface">{post.author.name}</div>
                <div className="text-label-md font-label-md text-on-surface-variant font-normal">
                  {post.author.role} • Published {formattedDate}
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="p-2 border border-[#E2E8F0] rounded hover:border-primary transition-colors bg-white">
                  <span className="material-symbols-outlined text-[20px] text-on-surface">
                    bookmark_add
                  </span>
                </button>
                <button className="p-2 border border-[#E2E8F0] rounded hover:border-primary transition-colors bg-white">
                  <span className="material-symbols-outlined text-[20px] text-on-surface">share</span>
                </button>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div className="prose-serif text-body-lg font-body-lg text-[#1E293B] leading-[1.8] space-y-8">
            {post.mainImage && (
              <div className="w-full h-64 md:h-96 bg-surface-variant rounded border border-[#E2E8F0] mb-8 overflow-hidden relative">
                <img
                  src={urlForImage(post.mainImage)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Render body using custom PortableText mapping */}
            {post.body && post.body.length > 0 ? (
              <PortableText value={post.body} components={portableTextComponents} />
            ) : (
              <p className="italic text-on-surface-variant">No body content has been written yet.</p>
            )}
          </div>
        </article>
      </main>
    </>
  );
}
