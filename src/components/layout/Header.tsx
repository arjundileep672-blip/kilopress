"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/image-compressor/", label: "Compress" },
  { href: "/image-resizer/", label: "Resize" },
  { href: "/image-converter/", label: "Convert" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-rule bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-sm tracking-tight text-ink hover:opacity-80 transition-opacity"
        >
          KiloPress
        </Link>

        <nav aria-label="Primary Navigation" className="flex items-center gap-5">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              pathname === item.href.replace(/\/$/, "") ||
              (item.href === "/image-compressor/" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs transition-colors ${
                  active
                    ? "text-ink font-semibold"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
