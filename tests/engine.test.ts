import assert from "node:assert/strict";
import {
  detectMimeFromBytes,
  validateImageFile,
  calculateReductionPercent,
  formatBytes,
  buildOutputFileName,
} from "../src/lib/image/validator.ts";
import { calculateOutputDimensions } from "../src/lib/image/resizer.ts";
import { quantizeImageDataForPng } from "../src/lib/image/pngQuantizer.ts";
import { ALL_TOOL_SLUGS, TOOL_PAGES } from "../src/data/tools.ts";
import { GUIDE_ARTICLES } from "../src/data/guides.ts";

async function runTests() {
  console.log("Running KiloPress Verification Suite...\n");

  // 1. Magic-byte detection tests
  console.log("1. Testing binary magic-byte header validation...");
  const jpegHeader = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
  ]);
  assert.equal(detectMimeFromBytes(jpegHeader), "image/jpeg");

  const pngHeader = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  ]);
  assert.equal(detectMimeFromBytes(pngHeader), "image/png");

  const webpHeader = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
  ]);
  assert.equal(detectMimeFromBytes(webpHeader), "image/webp");

  const avifHeader = new Uint8Array([
    0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66,
  ]);
  assert.equal(detectMimeFromBytes(avifHeader), "image/avif");

  const invalidHeader = new Uint8Array([
    0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35, 0x0a, 0x00, 0x00, 0x00,
  ]);
  assert.equal(detectMimeFromBytes(invalidHeader), null);

  // Test File validation for empty, disguised, and valid files
  const emptyFile = new File([], "empty.jpg", { type: "image/jpeg" });
  const emptyRes = await validateImageFile(emptyFile);
  assert.equal(emptyRes.valid, false);
  assert.equal(emptyRes.errorCode, "EMPTY_FILE");

  const fakeJpg = new File([invalidHeader], "disguised-pdf.jpg", {
    type: "image/jpeg",
  });
  const fakeRes = await validateImageFile(fakeJpg);
  assert.equal(fakeRes.valid, false);
  assert.equal(fakeRes.errorCode, "UNSUPPORTED_FORMAT");

  const realPngWithWrongExt = new File([pngHeader], "photo.jpg", {
    type: "image/jpeg",
  });
  const realPngRes = await validateImageFile(realPngWithWrongExt);
  assert.equal(realPngRes.valid, true);
  assert.equal(realPngRes.detectedMime, "image/png");
  console.log("   ✓ Binary magic-byte validation passed.");

  // 2. Percentage reduction formula & byte formatting
  console.log("2. Testing reduction math & output naming...");
  assert.equal(calculateReductionPercent(1000, 250), 75);
  assert.equal(calculateReductionPercent(500, 600), -20);
  assert.equal(formatBytes(20 * 1024), "20.0 KB");
  assert.equal(formatBytes(1024 * 1024), "1.00 MB");
  assert.equal(
    buildOutputFileName("passport.photo.png", "image/jpeg", "50kb"),
    "passport.photo-50kb.jpg"
  );
  console.log("   ✓ Reduction formula & file extension mapping passed.");

  // 3. Resizer geometry calculations
  console.log("3. Testing independent image resizer geometry...");
  const origDim = calculateOutputDimensions(4000, 3000, {
    mode: "original",
    maintainAspectRatio: true,
    percentage: 100,
  });
  assert.deepEqual(origDim, { width: 4000, height: 3000 });

  const pctDim = calculateOutputDimensions(4000, 3000, {
    mode: "percentage",
    maintainAspectRatio: true,
    percentage: 25,
  });
  assert.deepEqual(pctDim, { width: 1000, height: 750 });

  const aspectLockedWidthOnly = calculateOutputDimensions(4000, 2000, {
    mode: "custom",
    width: 800,
    maintainAspectRatio: true,
    percentage: 100,
  });
  assert.deepEqual(aspectLockedWidthOnly, { width: 800, height: 400 });

  const maxBoxDim = calculateOutputDimensions(4000, 2000, {
    mode: "maxDimensions",
    maxWidth: 1000,
    maxHeight: 1000,
    maintainAspectRatio: true,
    percentage: 100,
  });
  assert.deepEqual(maxBoxDim, { width: 1000, height: 500 });
  console.log("   ✓ Resizer geometry & aspect ratio locking passed.");

  // 4. PNG Bit-Depth Quantizer
  console.log("4. Testing PNG bit-depth palette quantizer...");
  const rawRgba = new Uint8ClampedArray([
    123, 211, 45, 255, // opaque pixel
    88, 99, 140, 0, // transparent pixel with noisy RGB
  ]);
  const mockImageData = {
    data: rawRgba,
    width: 2,
    height: 1,
    colorSpace: "srgb" as PredefinedColorSpace,
  };
  quantizeImageDataForPng(mockImageData, 0.5);
  // Transparent pixel (alpha === 0) must have RGB zeroed out for optimal DEFLATE compression
  assert.equal(mockImageData.data[4], 0);
  assert.equal(mockImageData.data[5], 0);
  assert.equal(mockImageData.data[6], 0);
  assert.equal(mockImageData.data[7], 0);
  console.log("   ✓ PNG quantizer & transparent pixel zeroing passed.");

  // 5. SEO Architecture & Uniqueness Verification
  console.log("5. Verifying all 16 tool pages & 7 guides have unique titles/descriptions...");
  assert.equal(ALL_TOOL_SLUGS.length, 16);
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const h1s = new Set<string>();

  for (const slug of ALL_TOOL_SLUGS) {
    const cfg = TOOL_PAGES[slug];
    assert.ok(cfg, `Missing config for ${slug}`);
    assert.ok(!titles.has(cfg.title), `Duplicate title: ${cfg.title}`);
    assert.ok(
      !descriptions.has(cfg.metaDescription),
      `Duplicate description on ${slug}`
    );
    assert.ok(!h1s.has(cfg.h1), `Duplicate H1: ${cfg.h1}`);
    titles.add(cfg.title);
    descriptions.add(cfg.metaDescription);
    h1s.add(cfg.h1);
  }

  assert.equal(GUIDE_ARTICLES.length, 7);
  for (const g of GUIDE_ARTICLES) {
    assert.ok(!titles.has(g.title), `Duplicate guide title: ${g.title}`);
    titles.add(g.title);
  }
  console.log(
    `   ✓ Verified ${ALL_TOOL_SLUGS.length} distinct tool pages + ${GUIDE_ARTICLES.length} technical guides.`
  );

  console.log("\nALL TESTS PASSED SUCCESSFULLY.");
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
