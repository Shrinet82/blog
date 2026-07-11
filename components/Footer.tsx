import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface w-full mt-24 py-12 px-margin-mobile md:px-margin-desktop text-on-surface-variant transition-colors duration-200 border-t border-outline-variant/30">
      <div className="w-full flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto gap-y-6">
        <div className="flex-shrink-0 text-center md:text-left">
          <span className="text-headline-sm font-headline-sm font-bold text-on-surface block mb-2">
            ABHISHAL
          </span>
          <span className="text-body-sm">
            © {new Date().getFullYear()} ABHISHAL. All rights reserved.
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link
            className="text-body-sm hover:text-on-surface transition-colors"
            href="/about"
          >
            About Us
          </Link>
          <Link
            className="text-body-sm hover:text-on-surface transition-colors"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-body-sm hover:text-on-surface transition-colors"
            href="/editorial"
          >
            Editorial
          </Link>
          <Link
            className="text-body-sm hover:text-on-surface transition-colors"
            href="/contact"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
