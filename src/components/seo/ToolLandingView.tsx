import React from "react";
import Link from "next/link";
import { TOOL_PAGES, ToolPageConfig } from "@/data/tools";
import { UniversalCompressorWorkspace } from "@/components/compressor/UniversalCompressorWorkspace";

interface ToolLandingViewProps {
  config: ToolPageConfig;
}

export function ToolLandingView({ config }: ToolLandingViewProps) {
  const relatedTools = config.relatedSlugs
    .map((s) => TOOL_PAGES[s])
    .filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <div className="space-y-1">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
          {config.shortLabel}
        </p>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
          {config.h1}
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          {config.subtitle}
        </p>
      </div>

      <UniversalCompressorWorkspace
        defaultMode={config.defaultMode}
        defaultTargetBytes={config.defaultTargetBytes}
        defaultOutputFormat={config.defaultOutputFormat}
        defaultResizeMode={config.defaultResizeMode}
        defaultQuality={config.defaultQuality}
        dropzoneHeadline={config.dropzoneHeadline}
        dropzoneSubhead={config.dropzoneSubhead}
      />

      {/* Concise Reference Note */}
      <div className="border-t border-rule pt-6 space-y-3 text-xs text-muted leading-relaxed">
        <h2 className="text-xs font-semibold text-ink">
          {config.useCaseHeading}
        </h2>
        <p>{config.useCaseIntro}</p>
        {config.technicalParagraphs[0] && <p>{config.technicalParagraphs[0]}</p>}

        {relatedTools.length > 0 && (
          <div className="pt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-ink font-medium">Related:</span>
            {relatedTools.map((rel) => (
              <Link
                key={rel.slug}
                href={`/${rel.slug}/`}
                className="underline underline-offset-2 hover:text-ink"
              >
                {rel.shortLabel}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
