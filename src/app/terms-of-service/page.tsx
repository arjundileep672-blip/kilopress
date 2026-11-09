import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — KiloPress Image Compressor",
  description:
    "Terms of Service governing the use of KiloPress online image compression, resizing, and format conversion utilities.",
  alternates: {
    canonical: "/terms-of-service/",
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header className="space-y-2 border-b border-rule pb-5">
        <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
          Legal & Trust
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-muted">
          Last Updated: November 9, 2026
        </p>
      </header>

      <div className="border border-rule bg-surface rounded p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using KiloPress (&ldquo;the Service&rdquo;), you agree to be
            bound by these Terms of Service. If you do not agree with any part
            of these terms, please discontinue use of the website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">
            2. Description of Utility Service
          </h2>
          <p>
            KiloPress provides browser-based image compression, target-size
            optimization, image resizing, and format conversion utilities. All
            processing executes locally on your device using your web browser&apos;s
            built-in rendering and encoding engines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">
            3. User Responsibility & Backups
          </h2>
          <p>
            While our compression engine is engineered to preserve visual
            integrity and verify file sizes accurately, lossy image compression
            and pixel resizing permanently alter the exported copy of an image.
            You are responsible for keeping backups of your original source
            photographs and verifying that downloaded files meet the specific
            requirements of any third-party application portal before
            submission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">
            4. Disclaimer of Warranties
          </h2>
          <p>
            The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis
            without warranties of any kind, whether express or implied,
            including but not limited to implied warranties of merchantability,
            fitness for a particular purpose, or non-infringement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">
            5. Limitation of Liability
          </h2>
          <p>
            In no event shall KiloPress or its creators be liable for any
            indirect, incidental, special, consequential, or punitive damages,
            including loss of data, rejected portal submissions, or business
            interruption arising out of your use of or inability to use the
            Service.
          </p>
        </section>
      </div>
    </div>
  );
}
