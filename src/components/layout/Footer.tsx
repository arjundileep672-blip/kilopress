import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-surface mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between text-xs text-muted">
        <span>KiloPress</span>
        <nav aria-label="Footer Navigation" className="flex items-center gap-5">
          <Link href="/about/" className="hover:text-ink transition-colors">
            About
          </Link>
          <Link
            href="/privacy-policy/"
            className="hover:text-ink transition-colors"
          >
            Privacy Policy
          </Link>
          <Link href="/contact/" className="hover:text-ink transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
