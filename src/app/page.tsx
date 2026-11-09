import React from "react";
import { UniversalCompressorWorkspace } from "@/components/compressor/UniversalCompressorWorkspace";

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
          IMAGE COMPRESSOR
        </p>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
          Compress images to the size you need.
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Reduce JPG, PNG, WebP, and AVIF file sizes locally in your browser.
        </p>
      </div>

      <UniversalCompressorWorkspace
        defaultMode="target"
        defaultTargetBytes={100 * 1024}
        defaultOutputFormat="original"
        defaultResizeMode="original"
        defaultQuality={80}
      />
    </div>
  );
}
