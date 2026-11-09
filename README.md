# KiloPress — Universal Image Compressor
### Production Deployment, Analytics, AdSense & QA Documentation

**KiloPress** is a local-first, privacy-respecting online image compressor, target-size optimizer (`20KB`, `50KB`, `100KB`, `200KB`, `500KB`, `1MB`, `2MB`, `5MB`, and custom targets), resizer, format converter (`JPG`, `PNG`, `WebP`, `AVIF`), and batch ZIP processor built with Next.js App Router, TypeScript, and Tailwind CSS.

---

## 1. Local Development & Testing

```bash
# Install dependencies
npm install

# Run engine unit & SEO uniqueness verification suite
npm test

# Start development server
npm run dev

# Build production bundle
npm run build
npm start
```

---

## 2. Production Deployment Instructions (Vercel)

1. **Initialize Git & Push to GitHub / GitLab / Bitbucket:**
   ```bash
   git init
   git add .
   git commit -m "Initial production release of KiloPress Universal Image Compressor"
   ```
2. **Import into Vercel:**
   - Open the Vercel Dashboard and click **Add New → Project**.
   - Select the repository. Vercel automatically detects Next.js.
   - Framework Preset: `Next.js`
   - Build Command: `next build`
3. **Configure Environment Variables (Optional until Analytics/AdSense are live):**
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Your Google Analytics 4 Measurement ID (e.g., `G-XXXXXXXXXX`).
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: Your Google AdSense Publisher Client ID (e.g., `ca-pub-XXXXXXXXXXXXXXXX`).
4. **Custom Domain & HTTPS:**
   - Under **Settings → Domains**, attach your production domain.
   - Update `metadataBase` in `src/app/layout.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts` if using a domain other than `https://kilopress.app`.
5. **Google Search Console Setup:**
   - Verify domain ownership via DNS TXT record.
   - Submit `https://yourdomain.com/sitemap.xml` under **Sitemaps**.

---

## 3. Analytics Events Tracked (`src/lib/analytics.ts`)

All events strictly exclude personal filenames, image binary data, and EXIF metadata:
- `image_uploaded` (`count`)
- `compression_started` (`mode`, `target_kb`, `count`)
- `compression_completed` (`mode`, `count`)
- `compression_failed` (`reason`)
- `download_completed` (`output_mime`, `target_achieved`)
- `batch_processing_completed` (`count`)
- `zip_downloaded` (`count`)

---

## 4. Known Technical Limitations & Honest Handling

1. **AVIF Browser Encoding Support:** While almost all modern browsers decode AVIF, certain older Safari and Firefox versions do not yet support encoding `image/avif` via `HTMLCanvasElement.toBlob()`. `src/lib/image/formats.ts` probes encoding support at runtime and gracefully falls back to `image/webp` (with a clear user notification) rather than silently outputting an uncompressed PNG.
2. **Lossless PNG Target Size Floor:** Standard browser `canvas.toBlob('image/png')` ignores the quality parameter. We implemented a custom ordered 4×4 Bayer bit-depth palette quantizer (`src/lib/image/pngQuantizer.ts`) that reduces PNG sizes by 35%–70%. However, if a user requests a strict `20 KB` target on a high-resolution photographic PNG and disables dimension scaling, the engine displays the closest achievable byte size and recommends switching Output Format to WebP or JPG.
3. **Browser RAM Ceiling:** Individual input files are capped at `65 MB` (`src/lib/image/validator.ts`) and batch concurrency is throttled (`1–3` parallel workers based on `navigator.hardwareConcurrency`) to prevent mobile browser tab crashes.
