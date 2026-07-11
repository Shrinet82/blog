"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
      <span
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
        style={{ fontSize: "18px" }}
      >
        search
      </span>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-4 py-1.5 bg-transparent border-b border-transparent hover:border-outline focus:border-on-surface text-body-sm font-body-sm focus:outline-none transition-colors w-40 lg:w-56"
        placeholder="Search..."
      />
    </form>
  );
}

export default function Header() {
  return (
    <header className="bg-surface top-0 sticky z-50 border-b border-outline-variant/30 text-primary transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20">
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex-shrink-0 cursor-pointer transition-all duration-150">
            <span className="text-display font-display font-bold tracking-tight text-on-surface text-3xl">
              ABHISHAL
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/category/current-affairs"
              className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200"
            >
              Current Affairs
            </Link>
            <Link
              href="/category/case-laws"
              className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200"
            >
              Case Laws
            </Link>
            <Link
              href="/category/general-studies"
              className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200"
            >
              General Studies
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Suspense
            fallback={
              <div className="relative hidden sm:block">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                  style={{ fontSize: "18px" }}
                >
                  search
                </span>
                <input
                  type="text"
                  className="pl-9 pr-4 py-1.5 bg-transparent w-40 lg:w-56"
                  placeholder="Search..."
                  disabled
                />
              </div>
            }
          >
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
