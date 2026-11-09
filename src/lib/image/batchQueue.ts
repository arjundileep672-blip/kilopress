import JSZip from "jszip";
import { BatchImageItem, CompressionOptions } from "@/types/image";
import { processImageFile } from "./engine";

/**
 * Determines safe concurrent worker limit based on hardware concurrency
 * to prevent mobile and tablet browser tab out-of-memory crashes.
 */
export function getSafeConcurrencyLimit(): number {
  if (typeof navigator === "undefined") return 2;
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return 1;
  if (cores <= 4) return 2;
  return 3;
}

/**
 * Triggers a clean browser file download from a Blob or Object URL.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Packages all completed batch items into a single ZIP file with deduplicated filenames
 * and triggers download.
 */
export async function generateAndDownloadZip(
  items: BatchImageItem[],
  zipFileName = "compressed-images.zip"
): Promise<number> {
  const completed = items.filter(
    (item) => item.status === "completed" && item.result?.blob
  );
  if (completed.length === 0) {
    throw new Error("No compressed images are ready for ZIP download.");
  }

  const zip = new JSZip();
  const usedNames = new Map<string, number>();

  for (const item of completed) {
    if (!item.result) continue;
    let fileName = item.result.outputFileName;

    const count = usedNames.get(fileName) || 0;
    if (count > 0) {
      const dotIndex = fileName.lastIndexOf(".");
      if (dotIndex !== -1) {
        fileName = `${fileName.slice(0, dotIndex)}-${count}${fileName.slice(
          dotIndex
        )}`;
      } else {
        fileName = `${fileName}-${count}`;
      }
    }
    usedNames.set(item.result.outputFileName, count + 1);

    zip.file(fileName, item.result.blob);
  }

  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "STORE", // Images are already compressed; STORE is instantaneous and uses less RAM
  });

  triggerBlobDownload(zipBlob, zipFileName);
  return completed.length;
}

/**
 * Processes an array of queued BatchImageItems with bounded concurrency,
 * invoking `onItemUpdate` as each item progresses or completes.
 */
export async function runBatchQueue(
  items: BatchImageItem[],
  options: CompressionOptions,
  onItemUpdate: (id: string, patch: Partial<BatchImageItem>) => void,
  shouldAbort?: () => boolean
): Promise<void> {
  const concurrency = getSafeConcurrencyLimit();
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      if (shouldAbort?.()) break;
      const index = cursor++;
      const item = items[index];
      if (!item || item.status === "completed") continue;

      onItemUpdate(item.id, {
        status: "processing",
        progress: 10,
        error: undefined,
      });

      try {
        // Revoke previous result URL if re-compressing
        if (item.result?.objectUrl) {
          URL.revokeObjectURL(item.result.objectUrl);
        }

        const result = await processImageFile(
          item.file,
          options,
          (progress) => {
            onItemUpdate(item.id, { progress });
          }
        );

        onItemUpdate(item.id, {
          status: "completed",
          progress: 100,
          result,
          originalWidth: result.originalWidth,
          originalHeight: result.originalHeight,
          detectedMime: result.inputMime,
          hasTransparency: result.hasTransparency,
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unexpected error during compression.";
        onItemUpdate(item.id, {
          status: "error",
          progress: 0,
          error: message,
        });
      }

      // Yield briefly to keep UI animations and scrolling 60fps smooth
      await new Promise((r) => setTimeout(r, 16));
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  );
  await Promise.all(workers);
}
