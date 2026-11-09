import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDE_ARTICLES } from "@/data/guides";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return GUIDE_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = GUIDE_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.metaDescription,
    alternates: {
      canonical: `/guides/${article.slug}/`,
    },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = GUIDE_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1.5">
        <Link
          href="/guides/"
          className="text-xs text-muted hover:text-ink inline-block"
        >
          ← Guides
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-ink leading-snug">
          {article.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          {article.summary}
        </p>
      </div>

      <div className="border border-rule bg-surface rounded p-5 space-y-6 text-xs sm:text-sm text-muted leading-relaxed">
        {article.sections.map((sec) => (
          <section key={sec.heading} className="space-y-2">
            <h2 className="text-sm font-semibold text-ink">{sec.heading}</h2>
            {sec.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
