import type { SupportedInputMime, ValidationResult } from "../../types/image";

/** Maximum single image file size: 65 MB */
export const MAX_FILE_SIZE_BYTES = 65 * 1024 * 1024;

/**
 * Inspects the first 16 bytes of a buffer to identify true image format
 * regardless of file extension.
 */
export function detectMimeFromBytes(bytes: Uint8Array): SupportedInputMime | null {
  if (bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 && // R
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x46 && // F
    bytes[8] === 0x57 && // W
    bytes[9] === 0x45 && // E
    bytes[10] === 0x42 && // B
    bytes[11] === 0x50 // P
  ) {
    return "image/webp";
  }

  // AVIF / ISO Base Media File Format: bytes 4..7 == "ftyp"
  if (
    bytes[4] === 0x66 && // f
    bytes[5] === 0x74 && // t
    bytes[6] === 0x79 && // y
    bytes[7] === 0x70 // p
  ) {
    const brand = String.fromCharCode(
      bytes[8],
      bytes[9],
      bytes[10],
      bytes[11]
    ).toLowerCase();
    if (brand === "avif" || brand === "avis" || brand === "mif1") {
      return "image/avif";
    }
  }

  return null;
}

/**
 * Validates an uploaded File object by reading its binary magic header
 * and checking size limits.
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  if (!file || file.size === 0) {
    return {
      valid: false,
      errorCode: "EMPTY_FILE",
      errorMessage: "The selected file is empty (0 bytes). Please choose a valid image file.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      errorCode: "FILE_TOO_LARGE",
      errorMessage: `File exceeds the 65 MB browser memory limit (${formatBytes(
        file.size
      )}). Please use an image under 65 MB.`,
    };
  }

  try {
    const headerSlice = file.slice(0, 16);
    const arrayBuffer = await headerSlice.arrayBuffer();
    const headerBytes = new Uint8Array(arrayBuffer);
    const detectedMime = detectMimeFromBytes(headerBytes);

    if (!detectedMime) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "unknown";
      return {
        valid: false,
        extension: ext,
        errorCode: "UNSUPPORTED_FORMAT",
        errorMessage: `Unsupported format (.${ext}). Please upload a valid JPG, JPEG, PNG, WebP, or AVIF image.`,
      };
    }

    return {
      valid: true,
      detectedMime,
      extension: mimeToExtension(detectedMime),
    };
  } catch {
    return {
      valid: false,
      errorCode: "CORRUPT_HEADER",
      errorMessage: "Could not read file header. The file may be corrupted or inaccessible.",
    };
  }
}

export function mimeToExtension(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}

export function mimeToLabel(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "JPEG";
    case "image/png":
      return "PNG";
    case "image/webp":
      return "WebP";
    case "image/avif":
      return "AVIF";
    case "original":
      return "Match Original";
    default:
      return mime.toUpperCase();
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const sign = bytes < 0 ? "-" : "";
  const absBytes = Math.abs(bytes);

  if (absBytes < 1024) {
    return `${sign}${absBytes} B`;
  }
  const kb = absBytes / 1024;
  if (kb < 1024) {
    return `${sign}${kb.toFixed(kb < 10 ? 2 : decimals)} KB`;
  }
  const mb = kb / 1024;
  return `${sign}${mb.toFixed(2)} MB`;
}

export function calculateReductionPercent(
  originalSize: number,
  compressedSize: number
): number {
  if (originalSize <= 0) return 0;
  return ((originalSize - compressedSize) / originalSize) * 100;
}

export function buildOutputFileName(
  originalName: string,
  outputMime: string,
  suffix = "compressed"
): string {
  const cleanBase = originalName.replace(/\.[^/.]+$/, "") || "image";
  const ext = mimeToExtension(outputMime);
  return `${cleanBase}-${suffix}.${ext}`;
}
