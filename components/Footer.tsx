import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant w-full mt-12 py-12 px-margin-mobile md:px-margin-desktop text-secondary transition-colors duration-200">
      <div className="w-full flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto gap-y-6">
        <div className="flex-shrink-0 text-center md:text-left">
          <span className="text-headline-sm font-headline-sm font-bold text-on-surface block mb-2">
            LEX ACADEMIA
          </span>
          <span className="text-body-sm font-body-sm">
            © {new Date().getFullYear()} Lex Academia. Scholarly discipline for legal excellence.
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          <Link
            className="text-label-md font-label-md text-on-surface-variant hover:text-primary hover:underline transition-all"
            href="/about"
          >
            About Us
          </Link>
          <Link
            className="text-label-md font-label-md text-on-surface-variant hover:text-primary hover:underline transition-all"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-label-md font-label-md text-on-surface-variant hover:text-primary hover:underline transition-all"
            href="/editorial"
          >
            Editorial Guidelines
          </Link>
          <Link
            className="text-label-md font-label-md text-on-surface-variant hover:text-primary hover:underline transition-all"
            href="/contact"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
