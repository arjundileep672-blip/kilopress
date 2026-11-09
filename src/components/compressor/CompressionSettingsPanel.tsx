"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  BrowserFormatSupport,
  CompressionMode,
  CompressionOptions,
  ResizeMode,
  SupportedOutputFormat,
  TargetSizeUnit,
} from "@/types/image";
import { RESIZE_PRESETS } from "@/lib/image/resizer";
import { detectBrowserFormatSupport } from "@/lib/image/formats";

export interface TargetPresetOption {
  label: string;
  bytes: number;
}

export const TARGET_SIZE_PRESETS: TargetPresetOption[] = [
  { label: "20KB", bytes: 20 * 1024 },
  { label: "50KB", bytes: 50 * 1024 },
  { label: "100KB", bytes: 100 * 1024 },
  { label: "200KB", bytes: 200 * 1024 },
  { label: "500KB", bytes: 500 * 1024 },
  { label: "1MB", bytes: 1024 * 1024 },
];

interface CompressionSettingsPanelProps {
  options: CompressionOptions;
  onChange: (next: CompressionOptions) => void;
  onCompress: () => void;
  hasFiles: boolean;
  hasTransparentItems: boolean;
  disabled?: boolean;
  defaultExpandAdvanced?: boolean;
}

export function CompressionSettingsPanel({
  options,
  onChange,
  onCompress,
  hasFiles,
  hasTransparentItems,
  disabled = false,
  defaultExpandAdvanced = false,
}: CompressionSettingsPanelProps) {
  const [formatSupport, setFormatSupport] = useState<BrowserFormatSupport>({
    jpeg: true,
    png: true,
    webp: true,
    avif: true,
  });

  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(
    defaultExpandAdvanced || options.resize.mode !== "original"
  );

  const [customUnit, setCustomUnit] = useState<TargetSizeUnit>(
    options.targetBytes >= 1024 * 1024 &&
      options.targetBytes % (1024 * 1024) === 0
      ? "MB"
      : "KB"
  );
  const [customValue, setCustomValue] = useState<string>(() => {
    if (
      options.targetBytes >= 1024 * 1024 &&
      options.targetBytes % (1024 * 1024) === 0
    ) {
      return String(options.targetBytes / (1024 * 1024));
    }
    return String(Math.round(options.targetBytes / 1024));
  });

  useEffect(() => {
    detectBrowserFormatSupport().then(setFormatSupport);
  }, []);

  useEffect(() => {
    if (customUnit === "MB") {
      const mb = Number((options.targetBytes / (1024 * 1024)).toFixed(2));
      setCustomValue(String(mb));
    } else {
      const kb = Math.round(options.targetBytes / 1024);
      setCustomValue(String(kb));
    }
  }, [options.targetBytes, customUnit]);

  const setMode = (mode: CompressionMode) => {
    onChange({ ...options, mode });
  };

  const handlePresetClick = (bytes: number) => {
    setShowCustomInput(false);
    if (bytes >= 1024 * 1024) {
      setCustomUnit("MB");
      setCustomValue(String(bytes / (1024 * 1024)));
    } else {
      setCustomUnit("KB");
      setCustomValue(String(Math.round(bytes / 1024)));
    }
    onChange({ ...options, mode: "target", targetBytes: bytes });
  };

  const handleCustomTargetChange = (valStr: string, unit: TargetSizeUnit) => {
    setCustomValue(valStr);
    setCustomUnit(unit);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      const bytes =
        unit === "MB"
          ? Math.round(num * 1024 * 1024)
          : Math.round(num * 1024);
      onChange({
        ...options,
        mode: "target",
        targetBytes: Math.max(2 * 1024, Math.min(50 * 1024 * 1024, bytes)),
      });
    }
  };

  const setOutputFormat = (outputFormat: SupportedOutputFormat) => {
    onChange({ ...options, outputFormat });
  };

  const setResizeMode = (mode: ResizeMode) => {
    onChange({
      ...options,
      resize: {
        ...options.resize,
        mode,
        presetId:
          mode === "preset" && !options.resize.presetId
            ? RESIZE_PRESETS[0].id
            : options.resize.presetId,
      },
    });
  };

  const isPresetMatched = TARGET_SIZE_PRESETS.some(
    (p) => p.bytes === options.targetBytes
  );
  const showTransparencyWarning =
    hasTransparentItems && options.outputFormat === "image/jpeg";

  return (
    <div className="border border-rule bg-surface rounded p-4 sm:p-5 space-y-5">
      {/* Row 1: Mode & Output Format */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
        <div className="sm:col-span-7 space-y-1.5">
          <label className="block text-xs font-medium text-muted">
            Compression Mode
          </label>
          <div
            role="radiogroup"
            aria-label="Compression Mode"
            className="grid grid-cols-3 border border-rule rounded overflow-hidden divide-x divide-rule bg-canvas"
          >
            {(
              [
                { id: "target", label: "Target Size" },
                { id: "balanced", label: "Balanced" },
                { id: "manual", label: "Manual" },
              ] as { id: CompressionMode; label: string }[]
            ).map((item) => {
              const active = options.mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={disabled}
                  onClick={() => setMode(item.id)}
                  className={`py-2 px-2.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-ink text-surface"
                      : "bg-surface text-ink hover:bg-canvas"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sm:col-span-5 space-y-1.5">
          <label
            htmlFor="output-format-select"
            className="block text-xs font-medium text-muted"
          >
            Output Format
          </label>
          <select
            id="output-format-select"
            disabled={disabled}
            value={options.outputFormat}
            onChange={(e) =>
              setOutputFormat(e.target.value as SupportedOutputFormat)
            }
            className="w-full h-[34px] px-2.5 text-xs border border-rule rounded bg-surface text-ink focus:outline-none focus:border-ink"
          >
            <option value="original">Keep Original Format</option>
            <option value="image/jpeg">JPG / JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
            <option value="image/avif">
              AVIF {!formatSupport.avif ? "(Auto-WebP fallback)" : ""}
            </option>
          </select>
        </div>
      </div>

      {/* Row 2: Mode-Specific Controls */}
      {options.mode === "target" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted">
              Target Size
            </label>
            <span className="text-xs font-mono text-ink">
              ≤{" "}
              {options.targetBytes >= 1024 * 1024
                ? `${(options.targetBytes / (1024 * 1024)).toFixed(
                    options.targetBytes % (1024 * 1024) === 0 ? 0 : 2
                  )} MB`
                : `${Math.round(options.targetBytes / 1024)} KB`}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {TARGET_SIZE_PRESETS.map((preset) => {
              const active =
                !showCustomInput && options.targetBytes === preset.bytes;
              return (
                <button
                  key={preset.label}
                  type="button"
                  disabled={disabled}
                  onClick={() => handlePresetClick(preset.bytes)}
                  className={`py-1.5 px-2 border rounded text-xs font-mono transition-colors ${
                    active
                      ? "border-ink bg-ink text-surface font-medium"
                      : "border-rule bg-canvas/50 text-ink hover:bg-canvas"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
            <button
              type="button"
              disabled={disabled}
              onClick={() => setShowCustomInput(true)}
              className={`py-1.5 px-2 border rounded text-xs font-medium transition-colors ${
                showCustomInput || !isPresetMatched
                  ? "border-ink bg-ink text-surface"
                  : "border-rule bg-canvas/50 text-ink hover:bg-canvas"
              }`}
            >
              Custom
            </button>
          </div>

          {(showCustomInput || !isPresetMatched) && (
            <div className="flex items-center gap-2 pt-1">
              <label
                htmlFor="custom-target-size"
                className="text-xs text-muted"
              >
                Custom limit:
              </label>
              <div className="flex items-center border border-rule rounded overflow-hidden bg-surface">
                <input
                  id="custom-target-size"
                  type="number"
                  min={2}
                  max={customUnit === "MB" ? 50 : 50000}
                  step={customUnit === "MB" ? "0.1" : "5"}
                  disabled={disabled}
                  value={customValue}
                  onChange={(e) =>
                    handleCustomTargetChange(e.target.value, customUnit)
                  }
                  className="w-20 px-2.5 py-1 text-xs font-mono text-ink bg-surface focus:outline-none"
                />
                <select
                  aria-label="Target size unit"
                  disabled={disabled}
                  value={customUnit}
                  onChange={(e) =>
                    handleCustomTargetChange(
                      customValue,
                      e.target.value as TargetSizeUnit
                    )
                  }
                  className="px-2 py-1 text-xs font-mono border-l border-rule bg-canvas text-ink focus:outline-none"
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {options.mode === "manual" && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="manual-quality-slider" className="text-muted">
              Quality
            </label>
            <span className="font-mono text-ink font-medium">
              {options.manualQuality}%
            </span>
          </div>
          <input
            id="manual-quality-slider"
            type="range"
            min={5}
            max={100}
            step={1}
            disabled={disabled}
            value={options.manualQuality}
            onChange={(e) =>
              onChange({
                ...options,
                manualQuality: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-accent cursor-pointer"
          />
        </div>
      )}

      {/* Compact Expandable Advanced Settings */}
      <div className="border-t border-rule pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced}
          className="flex items-center justify-between w-full text-xs text-muted hover:text-ink transition-colors"
        >
          <span>Advanced settings (Resize & dimensions)</span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 pt-3 border-t border-rule/60 space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: "original", label: "Original size" },
                  { id: "custom", label: "Custom W×H" },
                  { id: "percentage", label: "Scale %" },
                  { id: "maxDimensions", label: "Max box" },
                  { id: "preset", label: "Presets" },
                ] as { id: ResizeMode; label: string }[]
              ).map((m) => {
                const active = options.resize.mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setResizeMode(m.id)}
                    className={`px-2.5 py-1 border rounded text-xs transition-colors ${
                      active
                        ? "border-ink bg-ink text-surface"
                        : "border-rule bg-canvas text-ink"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            {options.resize.mode === "custom" && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="resize-custom-width"
                    className="text-xs text-muted"
                  >
                    W:
                  </label>
                  <input
                    id="resize-custom-width"
                    type="number"
                    min={1}
                    max={12000}
                    placeholder="Auto"
                    value={options.resize.width || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onChange({
                        ...options,
                        resize: {
                          ...options.resize,
                          width: isNaN(val) ? undefined : val,
                        },
                      });
                    }}
                    className="w-20 px-2 py-1 border border-rule rounded text-xs font-mono bg-surface"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="resize-custom-height"
                    className="text-xs text-muted"
                  >
                    H:
                  </label>
                  <input
                    id="resize-custom-height"
                    type="number"
                    min={1}
                    max={12000}
                    placeholder="Auto"
                    value={options.resize.height || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onChange({
                        ...options,
                        resize: {
                          ...options.resize,
                          height: isNaN(val) ? undefined : val,
                        },
                      });
                    }}
                    className="w-20 px-2 py-1 border border-rule rounded text-xs font-mono bg-surface"
                  />
                </div>
                <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.resize.maintainAspectRatio}
                    onChange={(e) =>
                      onChange({
                        ...options,
                        resize: {
                          ...options.resize,
                          maintainAspectRatio: e.target.checked,
                        },
                      })
                    }
                    className="accent-ink"
                  />
                  <span>Lock aspect ratio</span>
                </label>
              </div>
            )}

            {options.resize.mode === "percentage" && (
              <div className="flex items-center gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...options,
                        resize: { ...options.resize, percentage: pct },
                      })
                    }
                    className={`px-2.5 py-1 border rounded text-xs font-mono ${
                      options.resize.percentage === pct
                        ? "border-ink bg-ink text-surface"
                        : "border-rule bg-canvas text-ink"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            )}

            {options.resize.mode === "maxDimensions" && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="resize-max-w"
                    className="text-xs text-muted"
                  >
                    Max W:
                  </label>
                  <input
                    id="resize-max-w"
                    type="number"
                    min={16}
                    max={12000}
                    placeholder="1920"
                    value={options.resize.maxWidth || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onChange({
                        ...options,
                        resize: {
                          ...options.resize,
                          maxWidth: isNaN(val) ? undefined : val,
                        },
                      });
                    }}
                    className="w-20 px-2 py-1 border border-rule rounded text-xs font-mono bg-surface"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="resize-max-h"
                    className="text-xs text-muted"
                  >
                    Max H:
                  </label>
                  <input
                    id="resize-max-h"
                    type="number"
                    min={16}
                    max={12000}
                    placeholder="1080"
                    value={options.resize.maxHeight || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onChange({
                        ...options,
                        resize: {
                          ...options.resize,
                          maxHeight: isNaN(val) ? undefined : val,
                        },
                      });
                    }}
                    className="w-20 px-2 py-1 border border-rule rounded text-xs font-mono bg-surface"
                  />
                </div>
              </div>
            )}

            {options.resize.mode === "preset" && (
              <select
                aria-label="Dimension preset"
                value={options.resize.presetId || RESIZE_PRESETS[0].id}
                onChange={(e) =>
                  onChange({
                    ...options,
                    resize: { ...options.resize, presetId: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 border border-rule rounded text-xs bg-surface text-ink"
              >
                {RESIZE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} — {p.description}
                  </option>
                ))}
              </select>
            )}

            {options.mode === "target" && (
              <label className="flex items-center gap-2 text-xs text-muted cursor-pointer pt-1">
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={options.allowDimensionStepDown}
                  onChange={(e) =>
                    onChange({
                      ...options,
                      allowDimensionStepDown: e.target.checked,
                    })
                  }
                  className="accent-ink"
                />
                <span>
                  Auto-scale dimensions if needed to reach strict KB target
                </span>
              </label>
            )}

            {showTransparencyWarning && (
              <div className="flex items-center justify-between pt-2 border-t border-rule/60 text-xs text-status-warning">
                <span>Transparent PNG→JPG background color:</span>
                <input
                  type="color"
                  aria-label="Matte fill color"
                  value={options.backgroundColor}
                  onChange={(e) =>
                    onChange({ ...options, backgroundColor: e.target.value })
                  }
                  className="w-7 h-5 border border-rule bg-surface cursor-pointer"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary Compress Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onCompress}
        className="w-full py-2.5 px-4 rounded bg-accent hover:bg-accent-hover text-surface text-xs font-semibold transition-colors disabled:opacity-50"
      >
        {disabled
          ? "Compressing..."
          : hasFiles
          ? "Compress Images"
          : "Select Image & Compress"}
      </button>
    </div>
  );
}
