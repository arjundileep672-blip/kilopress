/**
 * Privacy-first Analytics Event Dispatcher (Google Analytics 4 compatible).
 *
 * Security & Privacy Guarantee:
 * - Never transmits image contents, filenames, URLs, or EXIF metadata.
 * - Only dispatches aggregate structural metrics (MIME type, mode, reduction percentage, byte bucket).
 */

export type AnalyticsEventName =
  | "image_uploaded"
  | "compression_started"
  | "compression_completed"
  | "compression_failed"
  | "download_completed"
  | "batch_processing_completed"
  | "zip_downloaded"
  | "target_size_compression_succeeded";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      eventName: string,
      params?: Record<string, string | number | boolean | undefined>
    ) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  eventName: AnalyticsEventName,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  } catch {
    // Analytics must never interrupt core utility functionality
  }
}
