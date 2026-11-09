# SPEC.md — Universal Image Compressor (KiloPress)

**Status:** FINALIZED
**Date:** 2026-11-09

## 1. Product Vision & Positioning
Universal Image Compressor (**KiloPress**) is an editorial, local-first utility web application engineered to compress images to exact target byte sizes (20KB, 50KB, 100KB, 200KB, 500KB, 1MB, 2MB, 5MB, or custom KB/MB), optimize quality, convert formats (JPG, PNG, WebP, AVIF), resize dimensions, and process batches 100% locally in the browser using HTML5 Canvas, OffscreenCanvas, Web Workers, and UPNG-style color quantization for PNGs.

## 2. Design System & Visual Identity
- **Background:** `#F7F7F4` (Warm paper off-white)
- **Primary Text:** `#171717` (Ink black)
- **Secondary Text:** `#737373` (Muted slate)
- **Borders:** `#E2E2DE` (Crisp editorial rule)
- **Surface:** `#FFFFFF` (Pure white utility panels)
- **Accent:** `#0052FF` (Restrained electric blue)
- **Success:** `#15803D` (Accessible forest green)
- **Warning:** `#B45309` (Accessible amber)
- **Error:** `#B91C1C` (Accessible crimson)
- **Typography:** Geist Sans / Inter for UI & editorial content; Geist Mono / IBM Plex Mono for file sizes, byte deltas, dimensions, and timing metrics.

## 3. Core Architecture & Modules
- `src/lib/image/validator.ts`: Magic-byte file signature inspection (JPEG `FF D8 FF`, PNG `89 50 4E 47`, RIFF WEBP, ISO BMFF `ftypavif`/`mif1`) + extension fallback and human-readable errors.
- `src/lib/image/formats.ts`: Runtime browser encoding capability detector (`image/jpeg`, `image/png`, `image/webp`, `image/avif`) + alpha channel detection by sampling canvas pixel alpha values.
- `src/lib/image/resizer.ts`: Dimension calculation supporting Original, Custom W×H (with aspect lock), Percentage scale, Max Width/Height bounding box, and Presets (Passport/Portal 600×600, HD 1280×720, Full HD 1920×1080, Web Banner 1200×630, Thumbnail 400×400).
- `src/lib/image/pngQuantizer.ts`: Pure TypeScript median-cut / octree palette quantizer & dithering pass so PNG target-size and lossy PNG compression work genuinely in the browser without external server uploads, plus conversion suggestions when target sizes are too tight for indexed PNG.
- `src/lib/image/engine.ts`: Core compression & target-size optimization engine:
  - **Mode A (Target File Size):** Bounded binary search over quality (10 iterations max) + multi-step progressive resolution downscaling if minimum acceptable quality (`0.18`) still exceeds target byte budget, or palette quantization for PNG outputs. Strictly verifies `blob.size <= targetBytes` before reporting `targetAchieved: true`.
  - **Mode B (Balanced):** Perceptually tuned quality & chroma settings per format (`0.82` JPEG, `0.80` WebP, `0.75` AVIF, 256-color quantized PNG) with safeguard against file size inflation.
  - **Mode C (Manual Quality):** Direct 1–100% quality control with live output size readout.
- `src/lib/image/batchQueue.ts`: Concurrency-limited batch processor (adapts to `navigator.hardwareConcurrency`, max 3 concurrent tasks) with per-item progress, cancellation/removal, object URL cleanup, and `JSZip` archive generation.
- `src/data/tools.ts` & `src/data/guides.ts`: Single source of truth for all 17 specialized tool routes (with distinct default presets, tailored workflow controls, technical specifications, and portal/use-case tables) and 7 in-depth technical guides.
