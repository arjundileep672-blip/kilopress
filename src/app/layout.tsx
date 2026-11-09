import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://kilopress.app"),
  title: {
    default: "KiloPress — Universal Image Compressor (20KB, 50KB, 100KB, JPG, PNG, WebP)",
    template: "%s | KiloPress",
  },
  description:
    "Compress images to exact KB/MB targets (20KB, 50KB, 100KB, 200KB, 1MB) or optimize JPG, PNG, WebP, and AVIF quality locally in your browser with zero server uploads.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "KiloPress — Universal Image Compressor",
    title: "KiloPress — Universal Image Compressor & Target-Size Optimizer",
    description:
      "Reduce photo and document file sizes to exact KB targets (20KB, 50KB, 100KB, 500KB) or convert between JPG, PNG, WebP, and AVIF 100% locally in your browser.",
    url: "https://kilopress.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "KiloPress — Universal Image Compressor",
    description:
      "Exact target-size image compression (20KB, 50KB, 100KB) and batch optimization processed locally in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        {gaMeasurementId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-canvas text-ink antialiased font-sans">
        <a
          href="#main-workspace"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-surface focus:rounded focus:text-xs focus:font-mono"
        >
          Skip to Image Compressor Workspace
        </a>
        <Header />
        <main id="main-workspace" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
