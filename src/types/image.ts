/**
 * Strict domain types for the local-first image compression, resizing,
 * conversion, and target-size optimization engine.
 */

export type SupportedInputMime =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/avif";

export type SupportedOutputFormat =
  | "original"
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/avif";

export type ResolvedOutputMime =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/avif";

export type CompressionMode = "target" | "balanced" | "manual";

export type TargetSizeUnit = "KB" | "MB";

export type ResizeMode =
  | "original"
  | "custom"
  | "percentage"
  | "maxDimensions"
  | "preset";

export interface ResizePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  description: string;
}

export interface ResizeConfig {
  mode: ResizeMode;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  percentage: number; // e.g., 50, 75, 100
  maxWidth?: number;
  maxHeight?: number;
  presetId?: string;
}

export interface CompressionOptions {
  mode: CompressionMode;
  /** Target size in bytes when mode === 'target' */
  targetBytes: number;
  /** Manual quality 1-100 when mode === 'manual' */
  manualQuality: number;
  /** Desired output format or 'original' */
  outputFormat: SupportedOutputFormat;
  /** Whether to allow automatic resolution step-down when a strict byte target cannot be reached by quality alone */
  allowDimensionStepDown: boolean;
  /** Background fill color when converting transparent PNG/WebP/AVIF to opaque JPEG */
  backgroundColor: string;
  /** Resize configuration */
  resize: ResizeConfig;
}

export interface ValidationResult {
  valid: boolean;
  detectedMime?: SupportedInputMime;
  extension?: string;
  errorCode?:
    | "EMPTY_FILE"
    | "FILE_TOO_LARGE"
    | "UNSUPPORTED_FORMAT"
    | "CORRUPT_HEADER";
  errorMessage?: string;
}

export interface BrowserFormatSupport {
  jpeg: boolean;
  png: boolean;
  webp: boolean;
  avif: boolean;
}

export interface CompressionResult {
  blob: Blob;
  objectUrl: string;
  outputFileName: string;
  originalSize: number;
  compressedSize: number;
  /** ((originalSize - compressedSize) / originalSize) * 100 */
  reductionPercent: number;
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
  inputMime: SupportedInputMime;
  outputMime: ResolvedOutputMime;
  hasTransparency: boolean;
  transparencyLostWarning: boolean;
  durationMs: number;
  iterations: number;
  appliedQuality: number;
  /** Strictly true ONLY when mode === 'target' and compressedSize <= targetBytes */
  targetAchieved: boolean;
  /** Set when mode === 'target' */
  targetBytes?: number;
  /** Explanation if target size could not be met or format fallback occurred */
  statusNote?: string;
  /** Alternative recommendation if target was missed */
  suggestedAlternative?: string;
  /** True if output was kept equal to original or warned about size increase */
  sizeIncreased: boolean;
}

export type BatchItemStatus =
  | "queued"
  | "validating"
  | "processing"
  | "completed"
  | "error";

export interface BatchImageItem {
  id: string;
  file: File;
  originalUrl: string;
  originalWidth?: number;
  originalHeight?: number;
  detectedMime?: SupportedInputMime;
  hasTransparency?: boolean;
  status: BatchItemStatus;
  progress: number;
  result?: CompressionResult;
  error?: string;
}
