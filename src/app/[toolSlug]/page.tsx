import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_TOOL_SLUGS, TOOL_PAGES } from "@/data/tools";
import { ToolLandingView } from "@/components/seo/ToolLandingView";

interface ToolPageProps {
  params: Promise<{ toolSlug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return ALL_TOOL_SLUGS.map((toolSlug) => ({
    toolSlug,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { toolSlug } = await params;
  const config = TOOL_PAGES[toolSlug];
  if (!config) return {};

  return {
    title: config.title,
    description: config.metaDescription,
    alternates: {
      canonical: `/${config.slug}/`,
    },
    openGraph: {
      title: config.title,
      description: config.metaDescription,
      url: `https://kilopress.app/${config.slug}/`,
      type: "website",
    },
  };
}

export default async function DynamicToolPage({ params }: ToolPageProps) {
  const { toolSlug } = await params;
  const config = TOOL_PAGES[toolSlug];

  if (!config) {
    notFound();
  }

  return <ToolLandingView config={config} />;
}
