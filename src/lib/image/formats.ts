import {
  BrowserFormatSupport,
  ResolvedOutputMime,
  SupportedInputMime,
  SupportedOutputFormat,
} from "@/types/image";

let cachedSupport: BrowserFormatSupport | null = null;

/**
 * Runtime detection of browser canvas encoding support for JPEG, PNG, WebP, and AVIF.
 * Browsers silently fall back to `image/png` when `toDataURL` or `toBlob` is called
 * with an unsupported MIME type, so we verify the returned MIME header.
 */
export async function detectBrowserFormatSupport(): Promise<BrowserFormatSupport> {
  if (cachedSupport) return cachedSupport;

  if (typeof document === "undefined") {
    return {
      jpeg: true,
      png: true,
      webp: true,
      avif: false,
    };
  }

  const testMime = async (mime: string): Promise<boolean> => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 2;
      canvas.height = 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      ctx.fillStyle = "#0052ff";
      ctx.fillRect(0, 0, 2, 2);

      return await new Promise<boolean>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(false);
              return;
            }
            resolve(blob.type === mime);
          },
          mime,
          0.8
        );
      });
    } catch {
      return false;
    }
  };

  const [jpeg, png, webp, avif] = await Promise.all([
    testMime("image/jpeg"),
    testMime("image/png"),
    testMime("image/webp"),
    testMime("image/avif"),
  ]);

  cachedSupport = { jpeg, png, webp, avif };
  return cachedSupport;
}

/**
 * Resolves the requested output format against actual browser encoding capabilities.
 * Returns the resolved MIME and an explanation note if fallback was required.
 */
export function resolveOutputFormat(
  requested: SupportedOutputFormat,
  inputMime: SupportedInputMime,
  support: BrowserFormatSupport
): { mime: ResolvedOutputMime; fallbackNote?: string } {
  const desired: ResolvedOutputMime =
    requested === "original" ? inputMime : requested;

  if (desired === "image/avif" && !support.avif) {
    if (support.webp) {
      return {
        mime: "image/webp",
        fallbackNote:
          "Your current browser does not natively encode AVIF via Canvas. Automatically encoded as high-efficiency WebP instead.",
      };
    }
    return {
      mime: "image/jpeg",
      fallbackNote:
        "Your current browser does not natively encode AVIF. Automatically encoded as JPEG instead.",
    };
  }

  if (desired === "image/webp" && !support.webp) {
    return {
      mime: "image/jpeg",
      fallbackNote:
        "Your current browser does not support WebP encoding. Encoded as JPEG instead.",
    };
  }

  return { mime: desired };
}

/**
 * Samples pixel alpha channel on a small offscreen canvas to determine
 * whether a PNG, WebP, or AVIF image contains non-opaque pixels (alpha < 255).
 */
export function detectImageTransparency(
  source: HTMLImageElement | ImageBitmap
): boolean {
  if (typeof document === "undefined") return false;
  try {
    const sampleW = Math.min(source.width, 128);
    const sampleH = Math.min(source.height, 128);
    const canvas = document.createElement("canvas");
    canvas.width = sampleW;
    canvas.height = sampleH;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return false;
    ctx.drawImage(source, 0, 0, sampleW, sampleH);
    const { data } = ctx.getImageData(0, 0, sampleW, sampleH);
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 250) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
