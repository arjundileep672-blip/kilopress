import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — KiloPress Image Compressor",
  description:
    "Learn how KiloPress compresses, resizes, and converts JPG, PNG, WebP, and AVIF images locally inside your web browser.",
  alternates: {
    canonical: "/about/",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
          ABOUT
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-ink">
          Local-First Image Compression
        </h1>
      </div>

      <div className="border border-rule bg-surface rounded p-5 space-y-4 text-xs sm:text-sm text-muted leading-relaxed">
        <p>
          KiloPress is an online image utility built to reduce image file sizes
          to exact kilobyte and megabyte targets without uploading private
          documents or photographs to external servers.
        </p>
        <p>
          Every file you select is decoded and encoded inside your own
          browser&apos;s memory space using the HTML5 Canvas API. When you
          select a target size (such as 20KB, 50KB, or 100KB), the engine runs a
          bounded binary search over encoder quality and dimensions, measuring
          the actual output byte size on each pass.
        </p>
      </div>
    </div>
  );
}
