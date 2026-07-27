import { client } from "@/sanity/lib/client";
import { getActsLawsQuery } from "@/sanity/lib/queries";
import { ActLaw } from "@/sanity/lib/types";
import Link from "next/link";

export const revalidate = 60;

export default async function ActsLawsPage() {
  const actsLaws: ActLaw[] = await client.fetch(getActsLawsQuery).catch(() => []);

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 min-h-screen">
      <header className="mb-12 border-b border-outline-variant/30 pb-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-4">Acts & Laws</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Official Acts and Laws published or analyzed by ABHISHAL. Read or download the full text below.
        </p>
      </header>

      {actsLaws.length === 0 ? (
        <div className="text-center py-20 bg-surface-variant/20 rounded-sm">
          <p className="text-on-surface-variant">No Acts or Laws published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {actsLaws.map((act) => (
            <article key={act._id} className="bg-surface border border-outline-variant/30 rounded-sm p-6 md:p-8 hover:bg-surface-variant/10 transition-colors flex flex-col md:flex-row md:items-start gap-6">
              
              <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-surface-variant rounded-full text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl">gavel</span>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">
                    Act / Law
                  </span>
                  {act.publishDate && (
                    <>
                      <span className="text-on-surface-variant/50">•</span>
                      <span className="text-xs text-on-surface-variant">
                        {new Date(act.publishDate).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </>
                  )}
                </div>
                
                <h2 className="text-2xl font-display font-bold text-on-surface mb-3 hover:text-primary transition-colors">
                  <Link href={`/acts-laws/${act.slug.current}`}>
                    {act.title}
                  </Link>
                </h2>
                
                <p className="text-body-md text-on-surface-variant leading-relaxed mb-6">
                  {act.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/acts-laws/${act.slug.current}`}
                    className="inline-flex items-center px-5 py-2 bg-primary text-on-primary text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors"
                  >
                    Read Full Synopsis & Document
                  </Link>
                  {act.actFileUrl && (
                    <a
                      href={`${act.actFileUrl}?dl=`}
                      className="inline-flex items-center px-5 py-2 bg-surface-variant text-on-surface-variant text-sm font-bold rounded-sm hover:bg-outline-variant/30 transition-colors border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined mr-2 text-[18px]">download</span>
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
