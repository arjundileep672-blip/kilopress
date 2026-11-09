import type { ResizeConfig, ResizePreset } from "../../types/image";

export const RESIZE_PRESETS: ResizePreset[] = [
  {
    id: "passport-600",
    label: "Passport / Portal (600 × 600)",
    width: 600,
    height: 600,
    description: "Standard square photo for online portals & exam applications",
  },
  {
    id: "signature-400x150",
    label: "Application Signature (400 × 150)",
    width: 400,
    height: 150,
    description: "Standard signature strip for job & student portals",
  },
  {
    id: "hd-720p",
    label: "HD Web (1280 × 720)",
    width: 1280,
    height: 720,
    description: "Clean blog & documentation embeds",
  },
  {
    id: "fhd-1080p",
    label: "Full HD (1920 × 1080)",
    width: 1920,
    height: 1080,
    description: "High-resolution hero images & slides",
  },
  {
    id: "og-social",
    label: "OpenGraph / Social (1200 × 630)",
    width: 1200,
    height: 630,
    description: "Social link preview cards & article headers",
  },
  {
    id: "ecommerce-1000",
    label: "Product Square (1000 × 1000)",
    width: 1000,
    height: 1000,
    description: "Marketplace & store catalog product image",
  },
];

export function calculateOutputDimensions(
  originalWidth: number,
  originalHeight: number,
  resize: ResizeConfig
): { width: number; height: number } {
  const safeOrigW = Math.max(1, Math.round(originalWidth));
  const safeOrigH = Math.max(1, Math.round(originalHeight));
  const aspect = safeOrigW / safeOrigH;

  switch (resize.mode) {
    case "original":
      return { width: safeOrigW, height: safeOrigH };

    case "percentage": {
      const pct = Math.max(5, Math.min(200, resize.percentage || 100)) / 100;
      return {
        width: Math.max(1, Math.round(safeOrigW * pct)),
        height: Math.max(1, Math.round(safeOrigH * pct)),
      };
    }

    case "maxDimensions": {
      const maxW = resize.maxWidth && resize.maxWidth > 0 ? resize.maxWidth : safeOrigW;
      const maxH = resize.maxHeight && resize.maxHeight > 0 ? resize.maxHeight : safeOrigH;
      const scale = Math.min(1, maxW / safeOrigW, maxH / safeOrigH);
      return {
        width: Math.max(1, Math.round(safeOrigW * scale)),
        height: Math.max(1, Math.round(safeOrigH * scale)),
      };
    }

    case "preset": {
      const preset = RESIZE_PRESETS.find((p) => p.id === resize.presetId);
      if (!preset) return { width: safeOrigW, height: safeOrigH };

      if (resize.maintainAspectRatio) {
        const scale = Math.min(
          preset.width / safeOrigW,
          preset.height / safeOrigH
        );
        return {
          width: Math.max(1, Math.round(safeOrigW * scale)),
          height: Math.max(1, Math.round(safeOrigH * scale)),
        };
      }
      return { width: preset.width, height: preset.height };
    }

    case "custom": {
      const reqW = resize.width && resize.width > 0 ? Math.round(resize.width) : undefined;
      const reqH = resize.height && resize.height > 0 ? Math.round(resize.height) : undefined;

      if (reqW && reqH) {
        if (resize.maintainAspectRatio) {
          const scale = Math.min(reqW / safeOrigW, reqH / safeOrigH);
          return {
            width: Math.max(1, Math.round(safeOrigW * scale)),
            height: Math.max(1, Math.round(safeOrigH * scale)),
          };
        }
        return { width: reqW, height: reqH };
      }

      if (reqW && !reqH) {
        return {
          width: reqW,
          height: resize.maintainAspectRatio
            ? Math.max(1, Math.round(reqW / aspect))
            : safeOrigH,
        };
      }

      if (!reqW && reqH) {
        return {
          width: resize.maintainAspectRatio
            ? Math.max(1, Math.round(reqH * aspect))
            : safeOrigW,
          height: reqH,
        };
      }

      return { width: safeOrigW, height: safeOrigH };
    }

    default:
      return { width: safeOrigW, height: safeOrigH };
  }
}
