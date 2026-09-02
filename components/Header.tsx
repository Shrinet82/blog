"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function SearchBar({ isMobile = false }: { isMobile?: boolean }) {
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
    <form onSubmit={handleSearchSubmit} className={`relative ${isMobile ? "w-full" : "hidden sm:block"}`}>
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
        className={`pl-9 pr-4 py-1.5 bg-transparent border-b border-outline-variant hover:border-outline focus:border-on-surface text-body-sm font-body-sm focus:outline-none transition-colors ${isMobile ? "w-full" : "w-40 lg:w-56"}`}
        placeholder="Search..."
      />
    </form>
  );
}

const NAV_LINKS = [
  { href: "/category/current-affairs", label: "Current Affairs" },
  { href: "/category/case-laws", label: "Case Laws" },
  { href: "/acts-laws", label: "Acts/Laws" },
  { href: "/category/general-studies", label: "General Studies" },
  { href: "/books", label: "Books" },
  { href: "/journals", label: "Journals" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="bg-surface top-0 sticky z-50 transition-colors duration-200">
      <div className="h-[3px] bg-primary" />
      <div className="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-6">
        {/* Masthead row */}
        <div className="flex justify-between items-end flex-wrap gap-x-6 gap-y-2 pb-5 border-b border-on-surface">
          <Link href="/" className="flex-shrink-0 cursor-pointer transition-all duration-150">
            <span className="block text-display font-display font-semibold tracking-tight text-on-surface text-3xl md:text-[2.6rem] leading-none">
              ABHISHAL
            </span>
            <span className="block font-body-md italic text-body-sm text-on-surface-variant mt-1.5">
              विधि शोध एवं समसामयिक विश्लेषण
            </span>
          </Link>
          <div className="text-right font-num text-xs text-on-surface-variant leading-relaxed">
            <div className="font-medium text-on-surface">Vol. I, Issue 34</div>
            <div>{issueDate}</div>
          </div>
        </div>

        {/* Nav row */}
        <div className="flex justify-between items-center py-3.5 border-b border-outline-variant">
          <nav className="hidden md:flex flex-wrap gap-x-6 gap-y-1" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm font-num text-on-surface-variant hover:text-primary border-b border-transparent hover:border-primary transition-colors duration-200 pb-0.5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4 ml-auto">
            {/* Desktop Search Bar */}
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

            {/* Mobile Menu Toggle Button */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-on-surface transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-on-surface transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
              <span className={`block w-6 h-0.5 bg-on-surface transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
      >
        <div className="flex flex-col space-y-4 px-margin-mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-body-lg font-num text-on-surface-variant hover:text-primary transition-colors duration-200 font-medium"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 w-full">
            <Suspense fallback={<div className="h-8 bg-surface-variant animate-pulse w-full rounded"></div>}>
               <SearchBar isMobile={true} />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
