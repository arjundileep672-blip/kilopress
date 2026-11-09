import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — KiloPress Image Compressor",
  description:
    "Contact KiloPress for bug reports, browser compatibility questions, or general inquiries.",
  alternates: {
    canonical: "/contact/",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
          CONTACT
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-ink">
          Contact & Support
        </h1>
      </div>

      <div className="border border-rule bg-surface rounded p-5 space-y-3 text-xs sm:text-sm text-muted leading-relaxed">
        <p>
          For technical support, bug reports, or privacy inquiries, email us
          directly:
        </p>
        <p className="font-mono text-ink font-medium">
          <a
            href="mailto:support@kilopress.app"
            className="underline underline-offset-2"
          >
            support@kilopress.app
          </a>
        </p>
      </div>
    </div>
  );
}
