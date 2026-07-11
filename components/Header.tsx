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
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        style={{ fontSize: "18px" }}
      >
        search
      </span>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-DEFAULT text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-0 transition-colors w-48 lg:w-64"
        placeholder="Search precedents..."
      />
    </form>
  );
}

export default function Header() {
  return (
    <header className="bg-surface dark:bg-surface-dim top-0 sticky z-50 border-b border-outline-variant text-primary transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16">
        <Link href="/" className="flex-shrink-0 cursor-pointer transition-all duration-150">
          <span className="text-headline-md font-headline-md font-bold tracking-tight text-on-surface">
            LEX ACADEMIA
          </span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/category/current-affairs"
            className="text-label-lg font-label-lg text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Current Affairs
          </Link>
          <Link
            href="/category/case-laws"
            className="text-label-lg font-label-lg text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Case Laws
          </Link>
          <Link
            href="/category/general-studies"
            className="text-label-lg font-label-lg text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            General Studies
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Suspense
            fallback={
              <div className="relative hidden sm:block">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  style={{ fontSize: "18px" }}
                >
                  search
                </span>
                <input
                  type="text"
                  className="pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-DEFAULT text-body-sm font-body-sm w-48 lg:w-64"
                  placeholder="Search precedents..."
                  disabled
                />
              </div>
            }
          >
            <SearchBar />
          </Suspense>
          
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
