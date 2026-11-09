import React from "react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="text-xs font-mono uppercase tracking-widest text-muted">
        HTTP 404 — Page Not Found
      </div>
      <h1 className="text-2xl font-bold text-ink">
        This utility page could not be found
      </h1>
      <p className="text-sm text-muted">
        The URL you requested does not exist. Choose one of our core image
        compression utilities below:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <Link
          href="/"
          className="px-4 py-2 rounded bg-ink text-surface text-xs font-medium"
        >
          Universal Compressor
        </Link>
        <Link
          href="/compress-image-to-50kb/"
          className="px-3.5 py-2 rounded border border-rule bg-surface text-ink text-xs font-mono"
        >
          Compress to 50KB
        </Link>
        <Link
          href="/compress-image-to-100kb/"
          className="px-3.5 py-2 rounded border border-rule bg-surface text-ink text-xs font-mono"
        >
          Compress to 100KB
        </Link>
      </div>
    </div>
  );
}
