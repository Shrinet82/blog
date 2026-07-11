import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { Post } from "@/sanity/lib/types";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  let posts: Post[] = [];
  try {
    if (query.trim()) {
      const groqQuery = `*[_type == "post" && (title match $searchQuery || excerpt match $searchQuery || body[].children[].text match $searchQuery)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        isLandmark,
        mainImage,
        author-> {
          name,
          role,
          image
        },
        categories[]-> {
          title,
          slug
        }
      }`;
      posts = await client.fetch(groqQuery, { searchQuery: `*${query}*` });
    }
  } catch (error) {
    console.error("Sanity search fetch error:", error);
  }

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      <section className="mb-10">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2">
          Search Results
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Showing results for &ldquo;<span className="text-primary font-semibold">{query}</span>&rdquo;
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-8 flex flex-col gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <ArticleCard key={post._id} post={post} variant="row" />
            ))
          ) : (
            <div className="border border-outline-variant rounded p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">
                search_off
              </span>
              <p className="text-body-lg font-body-lg">No matches found.</p>
              <p className="text-body-sm mt-1">Try checking your spelling or searching for a different precedent.</p>
              <Link href="/" className="text-secondary hover:underline text-body-sm mt-4 block">
                Return to homepage
              </Link>
            </div>
          )}
        </div>

        <aside className="md:col-span-4 flex flex-col gap-8">
          <div className="bg-surface border border-outline-variant rounded p-6 sticky top-24">
            <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4 flex items-center gap-2 pb-2 border-b border-outline-variant">
              <span className="material-symbols-outlined text-primary">gavel</span> Search Tips
            </h3>
            <ul className="space-y-4 text-body-sm font-body-sm text-on-surface-variant">
              <li>
                <strong>Keyword search:</strong> Try searching for key party names, laws, or articles (e.g. &quot;Article 21&quot; or &quot;Kesavananda&quot;).
              </li>
              <li>
                <strong>Precedents:</strong> Use citation styles or standard case terminology.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
