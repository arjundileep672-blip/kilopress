import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { GUIDE_ARTICLES } from "@/data/guides";

export const metadata: Metadata = {
  title: "Image Compression Guides",
  description:
    "Practical guides on image compression, hitting 20KB/50KB portal upload limits, and choosing between JPG, PNG, and WebP.",
  alternates: {
    canonical: "/guides/",
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
          GUIDES
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-ink">
          Image Compression Guides
        </h1>
      </div>

      <div className="border border-rule bg-surface rounded divide-y divide-rule">
        {GUIDE_ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/guides/${article.slug}/`}
            className="block p-4 hover:bg-canvas/50 transition-colors space-y-1"
          >
            <h2 className="text-sm font-semibold text-ink">{article.title}</h2>
            <p className="text-xs text-muted">{article.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
