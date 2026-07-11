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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-surface top-0 sticky z-50 border-b border-outline-variant/30 text-primary transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20">
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex-shrink-0 cursor-pointer transition-all duration-150">
            <span className="text-display font-display font-bold tracking-tight text-on-surface text-3xl">
              ABHISHAL
            </span>
          </Link>
          
          {/* Desktop Navigation */}
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

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-surface border-b border-outline-variant/30 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-64 opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
      >
        <div className="flex flex-col space-y-4 px-margin-mobile">
          <Link
            href="/category/current-affairs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-body-lg text-on-surface-variant hover:text-on-surface transition-colors duration-200 font-medium"
          >
            Current Affairs
          </Link>
          <Link
            href="/category/case-laws"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-body-lg text-on-surface-variant hover:text-on-surface transition-colors duration-200 font-medium"
          >
            Case Laws
          </Link>
          <Link
            href="/category/general-studies"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-body-lg text-on-surface-variant hover:text-on-surface transition-colors duration-200 font-medium"
          >
            General Studies
          </Link>
          
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
