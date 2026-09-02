import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface w-full mt-16 pt-6 pb-8 px-margin-mobile md:px-margin-desktop text-on-surface-variant transition-colors duration-200 border-t-[3px] border-on-surface">
      <div className="w-full flex flex-col gap-4 max-w-container-max mx-auto">
        <span className="text-headline-sm font-display font-semibold text-on-surface">
          ABHISHAL
        </span>
        <nav className="flex flex-wrap gap-x-6 gap-y-3">
          <Link
            className="text-body-sm font-num hover:text-primary transition-colors"
            href="/about"
          >
            About Us
          </Link>
          <Link
            className="text-body-sm font-num hover:text-primary transition-colors"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-body-sm font-num hover:text-primary transition-colors"
            href="/editorial"
          >
            Editorial
          </Link>
          <Link
            className="text-body-sm font-num hover:text-primary transition-colors"
            href="/contact"
          >
            Contact
          </Link>
        </nav>
        <span className="text-body-sm font-num">
          © {new Date().getFullYear()} ABHISHAL. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
