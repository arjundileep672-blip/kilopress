"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Download, X } from "lucide-react";
import {
  BatchImageItem,
  CompressionMode,
  CompressionOptions,
  ResizeMode,
  SupportedOutputFormat,
} from "@/types/image";
import {
  formatBytes,
  validateImageFile,
} from "@/lib/image/validator";
import {
  generateAndDownloadZip,
  runBatchQueue,
  triggerBlobDownload,
} from "@/lib/image/batchQueue";
import { trackEvent } from "@/lib/analytics";
import { CompressionSettingsPanel } from "./CompressionSettingsPanel";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export interface CompressorPresetProps {
  defaultMode?: CompressionMode;
  defaultTargetBytes?: number;
  defaultOutputFormat?: SupportedOutputFormat;
  defaultResizeMode?: ResizeMode;
  defaultQuality?: number;
  dropzoneHeadline?: string;
  dropzoneSubhead?: string;
}

export function UniversalCompressorWorkspace({
  defaultMode = "target",
  defaultTargetBytes = 100 * 1024,
  defaultOutputFormat = "original",
  defaultResizeMode = "original",
  defaultQuality = 80,
  dropzoneHeadline = "Drop images here or click to upload",
  dropzoneSubhead = "JPG, PNG, WebP or AVIF",
}: CompressorPresetProps) {
  const [options, setOptions] = useState<CompressionOptions>({
    mode: defaultMode,
    targetBytes: defaultTargetBytes,
    manualQuality: defaultQuality,
    outputFormat: defaultOutputFormat,
    allowDimensionStepDown: true,
    backgroundColor: "#FFFFFF",
    resize: {
      mode: defaultResizeMode,
      maintainAspectRatio: true,
      percentage: 100,
    },
  });

  const [items, setItems] = useState<BatchImageItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<BatchImageItem[]>([]);
  itemsRef.current = items;

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
        if (item.result?.objectUrl) URL.revokeObjectURL(item.result.objectUrl);
      }
    };
  }, []);

  const updateItem = useCallback(
    (id: string, patch: Partial<BatchImageItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
    },
    []
  );

  const executeCompressionRun = useCallback(
    async (queueItems: BatchImageItem[], activeOptions: CompressionOptions) => {
      if (queueItems.length === 0) return;
      setIsProcessing(true);
      setGlobalError(null);

      trackEvent("compression_started", {
        mode: activeOptions.mode,
        target_kb:
          activeOptions.mode === "target"
            ? Math.round(activeOptions.targetBytes / 1024)
            : undefined,
        count: queueItems.length,
      });

      const resetQueue = queueItems.map((it) => ({
        ...it,
        status: "queued" as const,
        progress: 0,
        error: undefined,
      }));
      setItems(resetQueue);

      await runBatchQueue(resetQueue, activeOptions, updateItem);
      setIsProcessing(false);

      const current = itemsRef.current;
      const completedCount = current.filter(
        (i) => i.status === "completed"
      ).length;
      if (completedCount > 0) {
        trackEvent("compression_completed", {
          mode: activeOptions.mode,
          count: completedCount,
        });
      }
      if (completedCount > 1) {
        trackEvent("batch_processing_completed", { count: completedCount });
      }
    },
    [updateItem]
  );

  const handleFilesSelected = async (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;
    setGlobalError(null);

    const newBatchItems: BatchImageItem[] = [];
    const errors: string[] = [];

    for (const file of incoming) {
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.errorMessage}`);
        trackEvent("compression_failed", { reason: validation.errorCode });
        continue;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const originalUrl = URL.createObjectURL(file);
      newBatchItems.push({
        id,
        file,
        originalUrl,
        detectedMime: validation.detectedMime,
        status: "queued",
        progress: 0,
      });
    }

    if (errors.length > 0) {
      setGlobalError(errors.join(" | "));
    }

    if (newBatchItems.length === 0) return;

    trackEvent("image_uploaded", { count: newBatchItems.length });

    const combined = [...items, ...newBatchItems];
    setItems(combined);
    if (!selectedItemId && newBatchItems[0]) {
      setSelectedItemId(newBatchItems[0].id);
    }

    await executeCompressionRun(combined, options);
  };

  const handleCompressAction = async () => {
    if (items.length === 0) {
      fileInputRef.current?.click();
      return;
    }
    if (!isProcessing) {
      await executeCompressionRun(items, options);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        if (target.originalUrl) URL.revokeObjectURL(target.originalUrl);
        if (target.result?.objectUrl)
          URL.revokeObjectURL(target.result.objectUrl);
      }
      const remaining = prev.filter((i) => i.id !== id);
      if (selectedItemId === id) {
        setSelectedItemId(remaining[0]?.id || null);
      }
      return remaining;
    });
  };

  const handleClearAll = () => {
    for (const item of items) {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.result?.objectUrl) URL.revokeObjectURL(item.result.objectUrl);
    }
    setItems([]);
    setSelectedItemId(null);
    setGlobalError(null);
  };

  const handleDownloadSingle = (item: BatchImageItem) => {
    if (!item.result) return;
    triggerBlobDownload(item.result.blob, item.result.outputFileName);
    trackEvent("download_completed", {
      output_mime: item.result.outputMime,
      target_achieved: item.result.targetAchieved,
    });
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      const count = await generateAndDownloadZip(items);
      trackEvent("zip_downloaded", { count });
    } catch (err) {
      setGlobalError(
        err instanceof Error ? err.message : "Failed to create ZIP archive."
      );
    } finally {
      setIsZipping(false);
    }
  };

  const selectedItem =
    items.find((i) => i.id === selectedItemId) || items[0] || null;
  const hasTransparentItems = items.some((i) => i.hasTransparency);
  const completedItems = items.filter(
    (i) => i.status === "completed" && i.result
  );

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
        onChange={(e) => {
          if (e.target.files) {
            handleFilesSelected(e.target.files);
            e.target.value = "";
          }
        }}
        className="sr-only"
      />

      {/* 1. Image Upload Area */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload images"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            handleFilesSelected(e.dataTransfer.files);
          }
        }}
        className={`border border-dashed rounded p-7 sm:p-9 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-accent bg-accent-subtle"
            : "border-rule bg-surface hover:border-ink"
        }`}
      >
        <Upload className="w-5 h-5 text-muted mx-auto mb-2.5" />
        <p className="text-sm font-medium text-ink">{dropzoneHeadline}</p>
        <p className="text-xs text-muted mt-1">{dropzoneSubhead}</p>
      </div>

      {globalError && (
        <div
          role="alert"
          className="p-3 rounded border border-status-error bg-status-errorBg text-status-error text-xs flex items-center justify-between"
        >
          <span>{globalError}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setGlobalError(null)}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Compression Interface */}
      <CompressionSettingsPanel
        options={options}
        onChange={setOptions}
        onCompress={handleCompressAction}
        hasFiles={items.length > 0}
        hasTransparentItems={hasTransparentItems}
        disabled={isProcessing}
        defaultExpandAdvanced={defaultResizeMode !== "original"}
      />

      {/* 3. Results Section (Shown when files are uploaded) */}
      {items.length > 0 && (
        <div className="border border-rule bg-surface rounded p-4 sm:p-5 space-y-4">
          {items.length > 1 && (
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <span className="text-xs font-medium text-ink">
                {completedItems.length} of {items.length} compressed
              </span>
              <div className="flex items-center gap-2">
                {completedItems.length > 1 && (
                  <button
                    type="button"
                    disabled={isZipping}
                    onClick={handleDownloadAllZip}
                    className="px-3 py-1.5 rounded bg-ink text-surface text-xs font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {isZipping ? "Creating ZIP..." : "Download All (ZIP)"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-muted hover:text-ink"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Individual File Result Rows */}
          <div className="divide-y divide-rule">
            {items.map((item) => {
              const res = item.result;
              const isSelected = selectedItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                    items.length > 1 && isSelected ? "bg-canvas/50 -mx-2 px-2 rounded" : ""
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-ink truncate">
                        {res ? res.outputFileName : item.file.name}
                      </span>
                      {items.length === 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item.id);
                          }}
                          className="text-xs text-muted hover:text-ink"
                          aria-label="Remove image"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {item.status === "processing" || item.status === "queued" ? (
                      <p className="text-xs font-mono text-muted">
                        Compressing ({item.progress}%)...
                      </p>
                    ) : item.status === "error" ? (
                      <p className="text-xs text-status-error">{item.error}</p>
                    ) : res ? (
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                        <span className="text-muted">
                          Original: {formatBytes(res.originalSize)}
                        </span>
                        <span className="text-ink font-semibold">
                          Compressed: {formatBytes(res.compressedSize)}
                        </span>
                        <span
                          className={
                            res.reductionPercent >= 0
                              ? "text-status-success font-medium"
                              : "text-status-warning font-medium"
                          }
                        >
                          {res.reductionPercent >= 0
                            ? `-${res.reductionPercent.toFixed(1)}%`
                            : `+${Math.abs(res.reductionPercent).toFixed(1)}%`}
                        </span>
                      </div>
                    ) : null}

                    {res && !res.targetAchieved && options.mode === "target" && res.statusNote && (
                      <p className="text-[11px] text-status-warning">
                        {res.statusNote}
                      </p>
                    )}
                  </div>

                  {res && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadSingle(item);
                      }}
                      className="px-3.5 py-2 rounded bg-ink hover:opacity-90 text-surface text-xs font-medium inline-flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Before/After Preview */}
          {selectedItem && selectedItem.result && (
            <div className="pt-2">
              <BeforeAfterSlider
                originalUrl={selectedItem.originalUrl}
                originalName={selectedItem.file.name}
                result={selectedItem.result}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
