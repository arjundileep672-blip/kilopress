import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — KiloPress Local-First Image Compressor",
  description:
    "Read the KiloPress Privacy Policy. Learn how local browser-based image processing works and how analytics and advertising scripts operate.",
  alternates: {
    canonical: "/privacy-policy/",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2 border-b border-rule pb-5">
        <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
          Legal & Trust
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-muted">
          Last Updated: November 9, 2026
        </p>
      </header>

      <div className="border border-rule bg-surface rounded p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">
            1. Local-First Image Processing (No Server Uploads)
          </h2>
          <p>
            KiloPress is architected so that ordinary image compression,
            resizing, target-size optimization, and format conversion occur
            entirely locally inside your web browser using standard Web APIs
            (`File`, `Blob`, `HTMLCanvasElement`, `ImageData`, and `URL.createObjectURL`).
          </p>
          <p>
            <strong className="text-ink">
              We do not upload, transmit, view, or store your image files,
              filenames, or embedded EXIF metadata on our servers.
            </strong>{" "}
            When you close your browser tab or click &ldquo;Clear All,&rdquo; temporary
            object URLs and canvas buffers in your device&apos;s RAM are released by
            your browser.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">
            2. Analytics & Aggregate Usage Metrics
          </h2>
          <p>
            To understand which utilities are most helpful and to diagnose
            technical errors, we may use Google Analytics 4 (GA4) with IP
            anonymization enabled. Analytics events record aggregate,
            non-personal interaction signals—such as which compression mode was
            selected (e.g., Target 50KB vs. Balanced), output MIME type, and
            whether a target byte limit was achieved.
          </p>
          <p>
            Our analytics wrapper explicitly excludes image contents, file
            names, and personal metadata from ever being sent in event payloads.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">
            3. Advertising & Cookies (Google AdSense)
          </h2>
          <p>
            To keep KiloPress free for students, applicants, and professionals
            without requiring subscriptions or accounts, we may display
            advertisements provided by Google AdSense.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Third-party vendors, including Google, use cookies to serve ads
              based on a user&apos;s prior visits to this website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to
              serve ads to users based on their visit to this site and/or other
              sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                Google Ads Settings
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">
            4. Browser Environment & Security Scope
          </h2>
          <p>
            Because image processing runs inside your local web browser, the
            security of your files also depends on the security of your own
            device, operating system, and installed browser extensions. While we
            never transmit your images over the network, no website can
            guarantee protection against malicious third-party browser
            extensions installed on a user&apos;s computer.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">5. Contact</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please
            contact us at{" "}
            <a
              href="mailto:privacy@kilopress.app"
              className="text-accent underline font-mono"
            >
              privacy@kilopress.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
