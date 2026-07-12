import { client } from "@/sanity/lib/client";
import { getBooksQuery } from "@/sanity/lib/queries";
import { Book } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function BooksPage() {
  const books: Book[] = await client.fetch(getBooksQuery).catch(() => []);

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 min-h-screen">
      <header className="mb-12 border-b border-outline-variant/30 pb-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-4">Books</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          A collection of books authored by ABHISHAL Prakashan. Click the links below to purchase.
        </p>
      </header>

      {books.length === 0 ? (
        <div className="text-center py-20 bg-surface-variant/20 rounded-sm">
          <p className="text-on-surface-variant">No books published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <article key={book._id} className="bg-surface border border-outline-variant/30 rounded-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="aspect-[3/4] relative bg-surface-variant overflow-hidden border-b border-outline-variant/30">
                {book.coverImage ? (
                  <img
                    src={urlForImage(book.coverImage)}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-display font-bold text-xl px-4 text-center">
                    {book.title}
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-display font-bold text-on-surface mb-2 line-clamp-2">
                  {book.title}
                </h2>
                <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-4">
                  {book.author || "ABHISHAL Prakashan"} 
                  {book.publishDate && <span className="ml-2">• {new Date(book.publishDate).getFullYear()}</span>}
                </div>
                
                <p className="text-body-md text-on-surface-variant line-clamp-4 mb-6 flex-grow">
                  {book.description}
                </p>
                
                <div className="flex flex-wrap gap-3 mt-auto">
                  {book.amazonLink && (
                    <a
                      href={book.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#FF9900] text-white text-sm font-bold rounded-sm hover:bg-[#E68A00] transition-colors"
                    >
                      Amazon
                    </a>
                  )}
                  {book.flipkartLink && (
                    <a
                      href={book.flipkartLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#047BD5] text-white text-sm font-bold rounded-sm hover:bg-[#0362AA] transition-colors"
                    >
                      Flipkart
                    </a>
                  )}
                  {book.otherLink && (
                    <a
                      href={book.otherLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors"
                    >
                      Buy Now
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
