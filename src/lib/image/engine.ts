import {
  CompressionOptions,
  CompressionResult,
  ResolvedOutputMime,
  SupportedInputMime,
} from "@/types/image";
import {
  detectBrowserFormatSupport,
  detectImageTransparency,
  resolveOutputFormat,
} from "./formats";
import { quantizeImageDataForPng } from "./pngQuantizer";
import { calculateOutputDimensions } from "./resizer";
import {
  buildOutputFileName,
  calculateReductionPercent,
  formatBytes,
  mimeToLabel,
  validateImageFile,
} from "./validator";

export interface ProgressCallback {
  (progress: number, stepLabel?: string): void;
}

/**
 * Decodes a File or Blob into an HTMLImageElement cleanly and revokes temporary URL.
 */
export async function decodeImageElement(file: File | Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error("Failed to decode image data. The file may be damaged."));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Encodes a rendered source image onto a canvas at given dimensions, format, and quality.
 */
async function encodeAtParameters(
  source: HTMLImageElement,
  width: number,
  height: number,
  outputMime: ResolvedOutputMime,
  quality: number,
  backgroundColor: string
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const ctx = canvas.getContext("2d", { willReadFrequently: outputMime === "image/png" });
  if (!ctx) {
    throw new Error("Browser 2D Canvas context is unavailable.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Fill background when converting to JPEG (which does not support alpha transparency)
  if (outputMime === "image/jpeg") {
    ctx.fillStyle = backgroundColor || "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  // If PNG is selected and quality < 0.96, run bit-depth quantization so DEFLATE shrinks file size
  if (outputMime === "image/png" && quality < 0.96) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    quantizeImageDataForPng(imgData, quality);
    ctx.putImageData(imgData, 0, 0);
  }

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Browser failed to encode ${outputMime}.`));
          return;
        }
        resolve(blob);
      },
      outputMime,
      Math.max(0.02, Math.min(1, quality))
    );
  });
}

/**
 * Executes Target-Size Optimization (Mode A) using bounded binary search over quality
 * followed by optional progressive dimension step-downs if the target byte budget
 * is smaller than the minimum acceptable quality floor at the initial dimensions.
 */
async function compressToTargetBytes(
  source: HTMLImageElement,
  initialWidth: number,
  initialHeight: number,
  outputMime: ResolvedOutputMime,
  targetBytes: number,
  allowDimensionStepDown: boolean,
  backgroundColor: string,
  onProgress?: ProgressCallback
): Promise<{
  blob: Blob;
  width: number;
  height: number;
  quality: number;
  iterations: number;
  targetAchieved: boolean;
  statusNote?: string;
  suggestedAlternative?: string;
}> {
  let iterations = 0;
  let currentW = initialWidth;
  let currentH = initialHeight;

  // Step 1: Test high quality (0.92) first — if already <= targetBytes, we don't need heavy compression!
  onProgress?.(20, "Checking baseline size at high quality...");
  iterations++;
  const highQualityBlob = await encodeAtParameters(
    source,
    currentW,
    currentH,
    outputMime,
    0.92,
    backgroundColor
  );

  if (highQualityBlob.size <= targetBytes) {
    return {
      blob: highQualityBlob,
      width: currentW,
      height: currentH,
      quality: 92,
      iterations,
      targetAchieved: true,
      statusNote: `Target of ${formatBytes(targetBytes)} easily met at 92% quality without dimension loss.`,
    };
  }

  // Minimum acceptable quality before stepping down dimensions
  const minQualityFloor = outputMime === "image/png" ? 0.10 : 0.14;
  const maxDimensionPasses = allowDimensionStepDown ? 5 : 1;

  let bestValidBlob: Blob | null = null;
  let bestValidQuality = 0.5;
  let bestValidW = currentW;
  let bestValidH = currentH;

  let smallestOverallBlob: Blob = highQualityBlob;
  let smallestOverallQuality = 0.92;
  let smallestOverallW = currentW;
  let smallestOverallH = currentH;

  for (let pass = 0; pass < maxDimensionPasses; pass++) {
    const passProgressBase = 25 + pass * 14;
    onProgress?.(
      Math.min(90, passProgressBase),
      pass === 0
        ? `Optimizing quality via binary search (${currentW}×${currentH})...`
        : `Scaling resolution to ${currentW}×${currentH} to reach ${formatBytes(targetBytes)}...`
    );

    // Check minimum quality floor at current dimensions first
    iterations++;
    const minFloorBlob = await encodeAtParameters(
      source,
      currentW,
      currentH,
      outputMime,
      minQualityFloor,
      backgroundColor
    );

    if (minFloorBlob.size < smallestOverallBlob.size) {
      smallestOverallBlob = minFloorBlob;
      smallestOverallQuality = minQualityFloor;
      smallestOverallW = currentW;
      smallestOverallH = currentH;
    }

    if (minFloorBlob.size <= targetBytes) {
      // Target is achievable at currentW x currentH!
      // Run bounded binary search (7 steps) between [minQualityFloor, 0.90] to get as close to targetBytes as possible (within 92%..100% of targetBytes)
      bestValidBlob = minFloorBlob;
      bestValidQuality = minQualityFloor;
      bestValidW = currentW;
      bestValidH = currentH;

      let low = minQualityFloor;
      let high = 0.90;

      for (let step = 0; step < 7; step++) {
        const mid = (low + high) / 2;
        iterations++;
        onProgress?.(
          Math.min(95, passProgressBase + (step + 1) * 8),
          `Binary search step ${step + 1}/7 (q=${Math.round(mid * 100)}%)...`
        );

        const candidate = await encodeAtParameters(
          source,
          currentW,
          currentH,
          outputMime,
          mid,
          backgroundColor
        );

        if (candidate.size <= targetBytes) {
          bestValidBlob = candidate;
          bestValidQuality = mid;
          bestValidW = currentW;
          bestValidH = currentH;
          low = mid; // try higher quality

          // Early exit if we are between 93% and 100% of targetBytes
          if (candidate.size >= targetBytes * 0.93) {
            break;
          }
        } else {
          high = mid; // need lower quality
        }
      }

      const scaledNote =
        pass > 0
          ? `Target size of ${formatBytes(targetBytes)} achieved by optimizing quality (${Math.round(
              bestValidQuality * 100
            )}%) and scaling dimensions to ${bestValidW}×${bestValidH}.`
          : `Target size of ${formatBytes(targetBytes)} achieved at ${Math.round(
              bestValidQuality * 100
            )}% quality.`;

      return {
        blob: bestValidBlob,
        width: bestValidW,
        height: bestValidH,
        quality: Math.round(bestValidQuality * 100),
        iterations,
        targetAchieved: true,
        statusNote: scaledNote,
      };
    }

    // If we are here, even minQualityFloor at currentW x currentH exceeded targetBytes.
    if (!allowDimensionStepDown || pass === maxDimensionPasses - 1) {
      break;
    }

    // Calculate smart scale factor based on square root of byte ratio, bounded between 0.50 and 0.80 per pass
    const ratio = Math.sqrt(targetBytes / Math.max(1, minFloorBlob.size));
    const scaleFactor = Math.max(0.52, Math.min(0.78, ratio * 0.95));

    const nextW = Math.max(64, Math.round(currentW * scaleFactor));
    const nextH = Math.max(64, Math.round(currentH * scaleFactor));

    if (nextW === currentW && nextH === currentH) {
      break;
    }
    currentW = nextW;
    currentH = nextH;
  }

  // If we exit the loop without meeting targetBytes, return the closest achievable result HONESTLY
  const missedBy = smallestOverallBlob.size - targetBytes;
  const alternativeSuggestion =
    outputMime === "image/png"
      ? "PNG uses lossless DEFLATE compression. Switch output format to WebP or JPEG to reach strict KB targets like 20 KB or 50 KB effortlessly."
      : !allowDimensionStepDown
      ? "Enable 'Auto-scale dimensions if needed' in settings or reduce image dimensions manually to reach this strict target."
      : "Try switching output format to WebP or reducing custom width/height further.";

  return {
    blob: smallestOverallBlob,
    width: smallestOverallW,
    height: smallestOverallH,
    quality: Math.round(smallestOverallQuality * 100),
    iterations,
    targetAchieved: false,
    statusNote: `Closest achievable result without severe image corruption is ${formatBytes(
      smallestOverallBlob.size
    )} (${formatBytes(missedBy)} above your ${formatBytes(targetBytes)} target).`,
    suggestedAlternative: alternativeSuggestion,
  };
}

/**
 * Primary entry point for compressing, resizing, and converting a single image File.
 */
export async function processImageFile(
  file: File,
  options: CompressionOptions,
  onProgress?: ProgressCallback
): Promise<CompressionResult> {
  const startTime = performance.now();
  onProgress?.(5, "Validating image signature...");

  const validation = await validateImageFile(file);
  if (!validation.valid || !validation.detectedMime) {
    throw new Error(validation.errorMessage || "Invalid image file.");
  }

  const inputMime: SupportedInputMime = validation.detectedMime;
  const support = await detectBrowserFormatSupport();
  const { mime: outputMime, fallbackNote } = resolveOutputFormat(
    options.outputFormat,
    inputMime,
    support
  );

  onProgress?.(12, "Decoding image into memory...");
  const imgElement = await decodeImageElement(file);
  const originalWidth = imgElement.naturalWidth || imgElement.width;
  const originalHeight = imgElement.naturalHeight || imgElement.height;

  // Check for transparency when input is PNG, WebP, or AVIF
  const hasTransparency =
    inputMime !== "image/jpeg" ? detectImageTransparency(imgElement) : false;
  const transparencyLostWarning =
    hasTransparency && outputMime === "image/jpeg";

  const { width: targetWidth, height: targetHeight } = calculateOutputDimensions(
    originalWidth,
    originalHeight,
    options.resize
  );

  const dimensionsChanged =
    targetWidth !== originalWidth || targetHeight !== originalHeight;
  const formatChanged = outputMime !== inputMime;

  let finalBlob: Blob;
  let finalWidth = targetWidth;
  let finalHeight = targetHeight;
  let appliedQuality = 82;
  let iterations = 1;
  let targetAchieved = false;
  let statusNote = fallbackNote;
  let suggestedAlternative: string | undefined;
  let sizeIncreased = false;

  if (options.mode === "target") {
    const targetRes = await compressToTargetBytes(
      imgElement,
      targetWidth,
      targetHeight,
      outputMime,
      options.targetBytes,
      options.allowDimensionStepDown,
      options.backgroundColor,
      onProgress
    );

    finalBlob = targetRes.blob;
    finalWidth = targetRes.width;
    finalHeight = targetRes.height;
    appliedQuality = targetRes.quality;
    iterations = targetRes.iterations;
    targetAchieved =
      finalBlob.size <= options.targetBytes && targetRes.targetAchieved;
    statusNote = [fallbackNote, targetRes.statusNote].filter(Boolean).join(" ");
    suggestedAlternative = targetRes.suggestedAlternative;
    sizeIncreased = finalBlob.size > file.size;
  } else if (options.mode === "balanced") {
    onProgress?.(45, "Applying perceptual balanced compression...");
    const balancedQualityMap: Record<ResolvedOutputMime, number> = {
      "image/jpeg": 0.80,
      "image/webp": 0.80,
      "image/avif": 0.74,
      "image/png": 0.72,
    };

    const q = balancedQualityMap[outputMime] ?? 0.8;
    appliedQuality = Math.round(q * 100);
    finalBlob = await encodeAtParameters(
      imgElement,
      targetWidth,
      targetHeight,
      outputMime,
      q,
      options.backgroundColor
    );

    // If balanced compression on an already-optimized file produces a larger file (and format/dimensions didn't change),
    // try a secondary pass at q=0.65, and if still larger, preserve original file bytes so we never inflate user files!
    if (finalBlob.size >= file.size && !dimensionsChanged && !formatChanged) {
      iterations++;
      onProgress?.(75, "Fine-tuning compression density...");
      const secondPass = await encodeAtParameters(
        imgElement,
        targetWidth,
        targetHeight,
        outputMime,
        0.62,
        options.backgroundColor
      );

      if (secondPass.size < file.size) {
        finalBlob = secondPass;
        appliedQuality = 62;
      } else {
        // Keep original file if it's already maximally compressed at these dimensions and format
        finalBlob = file.slice(0, file.size, inputMime);
        statusNote = [
          fallbackNote,
          "Source image is already heavily compressed; retained original byte stream to prevent file size inflation.",
        ]
          .filter(Boolean)
          .join(" ");
      }
    }

    sizeIncreased = finalBlob.size > file.size;
  } else {
    // Mode C: Manual Quality (1 - 100)
    onProgress?.(50, `Encoding at ${options.manualQuality}% manual quality...`);
    const q = Math.max(0.01, Math.min(1, options.manualQuality / 100));
    appliedQuality = Math.round(q * 100);
    finalBlob = await encodeAtParameters(
      imgElement,
      targetWidth,
      targetHeight,
      outputMime,
      q,
      options.backgroundColor
    );
    sizeIncreased = finalBlob.size > file.size;
    if (sizeIncreased) {
      statusNote = [
        fallbackNote,
        `Encoding at ${appliedQuality}% quality in ${mimeToLabel(
          outputMime
        )} resulted in a larger file than the already-compressed source. Lower the manual quality slider or use Balanced mode.`,
      ]
        .filter(Boolean)
        .join(" ");
    }
  }

  onProgress?.(100, "Complete");
  const durationMs = Math.max(1, Math.round(performance.now() - startTime));
  const compressedSize = finalBlob.size;
  const reductionPercent = calculateReductionPercent(file.size, compressedSize);
  const objectUrl = URL.createObjectURL(finalBlob);

  const suffix =
    options.mode === "target" && targetAchieved
      ? `${Math.round(options.targetBytes / 1024)}kb`
      : "compressed";

  return {
    blob: finalBlob,
    objectUrl,
    outputFileName: buildOutputFileName(file.name, outputMime, suffix),
    originalSize: file.size,
    compressedSize,
    reductionPercent,
    originalWidth,
    originalHeight,
    outputWidth: finalWidth,
    outputHeight: finalHeight,
    inputMime,
    outputMime,
    hasTransparency,
    transparencyLostWarning,
    durationMs,
    iterations,
    appliedQuality,
    targetAchieved,
    targetBytes: options.mode === "target" ? options.targetBytes : undefined,
    statusNote,
    suggestedAlternative,
    sizeIncreased,
  };
}
