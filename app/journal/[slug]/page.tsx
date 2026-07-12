import { client } from "@/sanity/lib/client";
import { getJournalBySlugQuery } from "@/sanity/lib/queries";
import { Journal } from "@/sanity/lib/types";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

const PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8 rounded-sm overflow-hidden border border-outline-variant/30 max-h-[600px] flex justify-center bg-surface-variant/20">
          <img
            alt={value.alt || "Journal Image"}
            loading="lazy"
            src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${value.asset._ref.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg').replace('-jpeg', '.jpeg').replace('-webp', '.webp')}`}
            className="w-auto h-auto max-w-full max-h-[600px] object-contain"
          />
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-3xl font-display font-bold mt-12 mb-6 text-on-surface">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-display font-bold mt-8 mb-4 text-on-surface">{children}</h3>,
    normal: ({ children }: any) => <p className="text-lg text-on-surface-variant leading-relaxed mb-6 font-body">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 bg-surface-variant/20 italic text-xl text-on-surface font-body rounded-r-sm">
        {children}
      </blockquote>
    ),
  },
};

export default async function JournalPage({ params }: { params: { slug: string } }) {
  const journal: Journal | null = await client.fetch(getJournalBySlugQuery, { slug: params.slug });

  if (!journal) {
    notFound();
  }

  const formattedDate = journal.publishDate 
    ? new Date(journal.publishDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "";

  return (
    <article className="w-full max-w-3xl mx-auto px-margin-mobile md:px-0 py-12 md:py-20 min-h-screen">
      <Link href="/journals" className="inline-flex items-center text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-12">
        <span className="material-symbols-outlined mr-2 text-[18px]">arrow_back</span>
        Back to all journals
      </Link>

      <header className="mb-12 border-b border-outline-variant/30 pb-12">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-sm">
            Journal
          </span>
          {formattedDate && (
            <>
              <span className="text-on-surface-variant/50">•</span>
              <span className="text-sm font-medium text-on-surface-variant">{formattedDate}</span>
            </>
          )}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold text-on-surface mb-8 leading-[1.1]">
          {journal.title}
        </h1>

        <div className="bg-surface-variant/20 p-6 md:p-8 rounded-sm border-l-4 border-primary/50 mb-8">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">Abstract</h3>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            {journal.description}
          </p>
        </div>

        {journal.journalFileUrl && (
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={journal.journalFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-primary text-on-primary text-base font-bold rounded-sm hover:bg-primary/90 transition-all shadow-sm hover:shadow"
            >
              <span className="material-symbols-outlined mr-2">visibility</span>
              Read Full Document Online
            </a>
            <a
              href={`${journal.journalFileUrl}?dl=`}
              className="inline-flex items-center px-6 py-3 bg-surface text-on-surface text-base font-bold rounded-sm hover:bg-surface-variant/50 transition-colors border border-outline-variant"
            >
              <span className="material-symbols-outlined mr-2">download</span>
              Download PDF
            </a>
          </div>
        )}
      </header>

      {journal.body && journal.body.length > 0 && (
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-primary hover:prose-a:text-primary/80">
          <PortableText value={journal.body} components={PortableTextComponents} />
        </div>
      )}
    </article>
  );
}
