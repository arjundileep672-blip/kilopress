import type {
  CompressionMode,
  ResizeMode,
  SupportedOutputFormat,
} from "../types/image";

export interface ToolSpecificationRow {
  parameter: string;
  value: string;
  notes: string;
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolPageConfig {
  slug: string;
  category: "core" | "target-size" | "format" | "conversion";
  shortLabel: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  badgeText: string;
  defaultMode: CompressionMode;
  defaultTargetBytes: number;
  defaultOutputFormat: SupportedOutputFormat;
  defaultResizeMode: ResizeMode;
  defaultQuality: number;
  dropzoneHeadline: string;
  dropzoneSubhead: string;
  useCaseHeading: string;
  useCaseIntro: string;
  specTableTitle: string;
  specTable: ToolSpecificationRow[];
  technicalBreakdownTitle: string;
  technicalParagraphs: string[];
  practicalSteps: { title: string; detail: string }[];
  faqs: ToolFaqItem[];
  relatedSlugs: string[];
}

export const TOOL_PAGES: Record<string, ToolPageConfig> = {
  "image-compressor": {
    slug: "image-compressor",
    category: "core",
    shortLabel: "Universal Compressor",
    title: "Online Image Compressor — Reduce JPG, PNG, WebP & AVIF Size Locally",
    metaDescription:
      "Compress JPG, PNG, WebP, and AVIF images online in your browser. Choose exact KB/MB target sizes, balanced optimization, or manual quality with zero server uploads.",
    h1: "Universal Image Compressor",
    subtitle:
      "Reduce photo and graphic file sizes to an exact KB/MB budget or perceptual quality balance—processed locally on your device.",
    badgeText: "All-in-One Local Image Optimizer (JPG, PNG, WebP, AVIF)",
    defaultMode: "balanced",
    defaultTargetBytes: 100 * 1024,
    defaultOutputFormat: "original",
    defaultResizeMode: "original",
    defaultQuality: 80,
    dropzoneHeadline: "Drop JPG, PNG, WebP, or AVIF images to compress",
    dropzoneSubhead:
      "Balanced perceptual compression enabled by default • Switch to Target Size for strict KB limits",
    useCaseHeading: "When to Use Balanced vs. Target-Size Compression",
    useCaseIntro:
      "Different publishing and upload workflows require different compression strategies. While web performance benefits from perceptual quality tuning, government and academic portals enforce strict byte ceilings.",
    specTableTitle: "Format Compression Characteristics & Typical Savings",
    specTable: [
      {
        parameter: "JPEG / JPG Photographs",
        value: "45% – 78% reduction",
        notes: "Uses DCT chroma subsampling and quantization tuning at 80% quality.",
      },
      {
        parameter: "PNG UI Graphics & Logos",
        value: "35% – 70% reduction",
        notes: "Applies 6-bit ordered Bayer palette quantization prior to DEFLATE encoding.",
      },
      {
        parameter: "WebP Web Assets",
        value: "30% – 65% reduction",
        notes: "Predictive block coding with full 8-bit alpha channel preservation.",
      },
      {
        parameter: "AVIF Next-Gen Assets",
        value: "50% – 82% reduction",
        notes: "AV1 intra-frame coding where supported by the host browser.",
      },
    ],
    technicalBreakdownTitle: "How Local Browser-Based Compression Works",
    technicalParagraphs: [
      "Unlike traditional online compressors that upload your private photographs and documents to remote cloud servers, KiloPress executes the entire decoding, quantization, and encoding pipeline inside your browser's local memory space using HTML5 Canvas and typed arrays.",
      "When you select an image, our validator first inspects the binary magic bytes (such as FF D8 FF for JPEG or 89 50 4E 47 for PNG) to verify file integrity. The image is then decoded into an uncompressed RGBA pixel buffer, optionally scaled with high-quality bicubic interpolation, and re-encoded into your target format.",
    ],
    practicalSteps: [
      {
        title: "Choose your compression mode",
        detail:
          "Use Balanced Smart mode for general website and email optimization, or select Target File Size if a form requires an exact ceiling like 50 KB or 200 KB.",
      },
      {
        title: "Drop one or multiple images",
        detail:
          "Drag files directly onto the workspace. Batch processing automatically queues images according to your CPU core count.",
      },
      {
        title: "Inspect before & after fidelity",
        detail:
          "Drag the interactive split-screen slider and zoom up to 300% to verify text sharpness and edge fidelity before downloading.",
      },
    ],
    faqs: [
      {
        question: "Are my images uploaded to any server?",
        answer:
          "No. All image decoding, resizing, and compression occur locally inside your web browser using the HTML5 Canvas API. Your files never leave your computer or phone.",
      },
      {
        question: "Why did my compressed image stay the same size in Balanced mode?",
        answer:
          "If an image was already heavily compressed by a messaging app or social network, re-encoding it at 80% quality can sometimes produce a slightly larger byte stream. KiloPress detects this automatically and retains your smaller original byte stream so your file never inflates.",
      },
    ],
    relatedSlugs: [
      "compress-image-to-100kb",
      "compress-image-to-50kb",
      "image-resizer",
      "bulk-image-compressor",
    ],
  },

  "image-resizer": {
    slug: "image-resizer",
    category: "core",
    shortLabel: "Image Resizer",
    title: "Online Image Resizer — Resize Photos to Custom Pixels or Percentage",
    metaDescription:
      "Resize JPG, PNG, WebP, and AVIF images to exact pixel dimensions, aspect-locked widths, percentage scales, or portal presets locally in your browser.",
    h1: "Online Image Resizer",
    subtitle:
      "Change image width and height by exact pixel dimensions, percentage scale, or standard portal presets while preserving sharpness.",
    badgeText: "High-Precision Bicubic Canvas Resizer + Aspect Ratio Lock",
    defaultMode: "balanced",
    defaultTargetBytes: 200 * 1024,
    defaultOutputFormat: "original",
    defaultResizeMode: "custom",
    defaultQuality: 85,
    dropzoneHeadline: "Drop images to resize to custom pixel dimensions",
    dropzoneSubhead:
      "Enter custom Width × Height above, scale by percentage, or pick a standard preset",
    useCaseHeading: "Standard Pixel Dimensions for Web, Social & Portals",
    useCaseIntro:
      "Reducing excessive pixel dimensions is the single most effective way to shrink multi-megabyte smartphone photos (often 4000×3000 pixels) down to crisp, fast-loading web and document sizes.",
    specTableTitle: "Common Image Dimension Standards",
    specTable: [
      {
        parameter: "Passport / Exam Portal Photo",
        value: "600 × 600 px (or 3.5 × 4.5 cm @ 300 DPI)",
        notes: "Square or portrait crop commonly required alongside a 20 KB–100 KB limit.",
      },
      {
        parameter: "Digital Signature Strip",
        value: "400 × 150 px",
        notes: "Wide aspect ratio for scanned ink signatures on job portals.",
      },
      {
        parameter: "Blog & Article Content",
        value: "1280 × 720 px (16:9 HD)",
        notes: "Ideal balance for desktop Retina displays without excessive byte weight.",
      },
      {
        parameter: "OpenGraph / Social Share Card",
        value: "1200 × 630 px",
        notes: "Universal preview card dimensions for X, LinkedIn, Slack, and Facebook.",
      },
    ],
    technicalBreakdownTitle: "Why Pixel Dimensions Matter More Than Quality Sliders Alone",
    technicalParagraphs: [
      "A 12-megapixel camera image contains 12,000,000 individual pixels. Even at aggressive JPEG compression, storing frequency coefficients for 12 million pixels consumes hundreds of kilobytes. Scaling that image to 1280×960 pixels reduces the total pixel count by nearly 90% before compression even begins.",
      "Our resizer decouples pixel geometry from encoder quality. You can lock the aspect ratio to prevent stretching, fit images inside a maximum bounding box (e.g., max 1920×1080), or combine exact pixel resizing with a strict KB target.",
    ],
    practicalSteps: [
      {
        title: "Select Custom W×H, Scale %, or Presets",
        detail:
          "In Section 3 of the control panel, enter your desired width or height. Keep 'Aspect Locked' enabled to calculate the matching dimension automatically.",
      },
      {
        title: "Optionally combine with a KB ceiling",
        detail:
          "If an application portal requires both 600×600 pixels AND under 50 KB, enable Target File Size mode in Section 1.",
      },
      {
        title: "Verify output dimensions in the preview badge",
        detail:
          "Every processed card displays the exact output pixel width and height next to the final file size.",
      },
    ],
    faqs: [
      {
        question: "Will resizing an image distort or stretch the subject?",
        answer:
          "Not when 'Aspect Locked' is enabled (the default). When aspect ratio lock is active, entering a target width automatically scales the height proportionally so your photo never stretches.",
      },
      {
        question: "Can I resize multiple photos to the same max width at once?",
        answer:
          "Yes. Choose 'Fit Max Box' (for example, Max Width 1200 px) and drop an entire folder of images. Every image wider than 1200 px will scale down proportionally, and you can download them all as a single ZIP.",
      },
    ],
    relatedSlugs: [
      "image-compressor",
      "compress-image-to-50kb",
      "bulk-image-compressor",
      "image-converter",
    ],
  },

  "image-converter": {
    slug: "image-converter",
    category: "core",
    shortLabel: "Format Converter",
    title: "Image Format Converter — Convert Between JPG, PNG, WebP & AVIF",
    metaDescription:
      "Convert images between JPG, PNG, WebP, and AVIF locally in your browser. Preserve alpha transparency or customize matte background fill colors.",
    h1: "Image Format Converter",
    subtitle:
      "Transcode images cleanly between JPEG, PNG, WebP, and AVIF with explicit transparency handling and optional target-size limits.",
    badgeText: "Local Format Transcoder with Alpha Channel Detection",
    defaultMode: "balanced",
    defaultTargetBytes: 200 * 1024,
    defaultOutputFormat: "image/webp",
    defaultResizeMode: "original",
    defaultQuality: 85,
    dropzoneHeadline: "Drop images to convert to WebP, JPG, PNG, or AVIF",
    dropzoneSubhead:
      "Select your desired Output Format in Section 2 above before or after dropping files",
    useCaseHeading: "Choosing the Right Image Container Format",
    useCaseIntro:
      "Each modern image format uses a fundamentally different compression algorithm suited to specific visual content:",
    specTableTitle: "Image Format Capability Matrix",
    specTable: [
      {
        parameter: "JPEG (.jpg)",
        value: "Lossy • No Transparency",
        notes: "Universal compatibility across all legacy portals, printers, and email clients.",
      },
      {
        parameter: "PNG (.png)",
        value: "Lossless / Indexed • Alpha Transparency",
        notes: "Sharp edges for UI screenshots, diagrams, and logos with transparent backgrounds.",
      },
      {
        parameter: "WebP (.webp)",
        value: "Lossy & Lossless • Alpha Transparency",
        notes: "25%–35% smaller than JPEG/PNG with full transparency support across all modern browsers.",
      },
      {
        parameter: "AVIF (.avif)",
        value: "Next-Gen Lossy • Alpha & HDR",
        notes: "Highest compression efficiency for modern web publishing.",
      },
    ],
    technicalBreakdownTitle: "Safe Transparency Handling When Converting to JPEG",
    technicalParagraphs: [
      "A common pitfall in basic image converters is silently turning transparent PNG or WebP backgrounds pitch black when converting to JPEG (because transparent RGBA pixels often have RGB values of 0,0,0 with Alpha=0).",
      "KiloPress inspects the alpha channel of every uploaded image. If transparency is detected and you select JPEG output, the interface alerts you immediately and lets you pick a clean matte fill color (defaulting to pure white #FFFFFF) before compositing.",
    ],
    practicalSteps: [
      {
        title: "Pick your target format in Section 2",
        detail:
          "Choose JPG for legacy portals, WebP for fast websites, PNG for lossless graphics, or AVIF for maximum compression.",
      },
      {
        title: "Review transparency warnings if converting to JPG",
        detail:
          "If your source PNG or WebP has a transparent background, choose a custom matte fill color or switch to WebP to keep transparency.",
      },
      {
        title: "Download individual files or a batch ZIP",
        detail:
          "All converted files automatically receive the correct file extension (.jpg, .png, .webp, or .avif) matching their true binary header.",
      },
    ],
    faqs: [
      {
        question: "What happens if my browser does not support AVIF encoding?",
        answer:
          "KiloPress tests your browser's native Canvas encoding capabilities at runtime. If AVIF encoding is unsupported on your current OS/browser version, it clearly notifies you and encodes as high-efficiency WebP instead.",
      },
      {
        question: "Does converting PNG to JPG reduce file size?",
        answer:
          "Yes, significantly for photographs. A 2 MB photographic PNG typically converts into a 150 KB–250 KB JPEG with no visible difference.",
      },
    ],
    relatedSlugs: [
      "jpg-to-webp",
      "png-to-jpg",
      "compress-webp",
      "image-compressor",
    ],
  },

  "bulk-image-compressor": {
    slug: "bulk-image-compressor",
    category: "core",
    shortLabel: "Bulk Compressor",
    title: "Bulk Image Compressor — Batch Compress Multiple Photos & Download ZIP",
    metaDescription:
      "Compress dozens of JPG, PNG, and WebP images simultaneously in your browser. Hardware-aware queue prevents tab freezes and exports a one-click ZIP archive.",
    h1: "Bulk Image Compressor",
    subtitle:
      "Batch-process collections of product photos, blog assets, or document scans locally with automatic concurrency throttling and one-click ZIP export.",
    badgeText: "Hardware-Aware Multi-Image Queue + Instant ZIP Packaging",
    defaultMode: "balanced",
    defaultTargetBytes: 150 * 1024,
    defaultOutputFormat: "original",
    defaultResizeMode: "original",
    defaultQuality: 80,
    dropzoneHeadline: "Drop multiple images here for batch compression",
    dropzoneSubhead:
      "Process 2 to 50+ images in parallel • Individual progress tracking & one-click ZIP download",
    useCaseHeading: "Engineered for High-Volume Local Batch Workflows",
    useCaseIntro:
      "Processing 30 high-resolution photographs simultaneously in a web browser can easily exhaust tab memory if all canvases allocate at once. Our batch engine schedules tasks based on your device's logical CPU cores.",
    specTableTitle: "Batch Engine Architecture Specifications",
    specTable: [
      {
        parameter: "Concurrency Limiter",
        value: "1 – 3 parallel workers",
        notes: "Dynamically adapts to navigator.hardwareConcurrency to prevent mobile OOM crashes.",
      },
      {
        parameter: "Fault Isolation",
        value: "Per-file error recovery",
        notes: "A single corrupt or unsupported file never halts the rest of your batch.",
      },
      {
        parameter: "ZIP Archive Mode",
        value: "JSZip STORE stream",
        notes: "Packages already-compressed images into a single .zip without redundant CPU re-deflation.",
      },
      {
        parameter: "Memory Hygiene",
        value: "Automatic ObjectURL revocation",
        notes: "Releases temporary canvas buffers immediately after each item completes.",
      },
    ],
    technicalBreakdownTitle: "How to Optimize Entire Product Catalogs or Asset Folders",
    technicalParagraphs: [
      "E-commerce store owners, photographers, and web developers frequently need to standardize an entire folder of mixed-resolution images. With Bulk Image Compressor, you can combine a maximum bounding box (such as 1200×1200 px), a unified format conversion (such as WebP), and a target file size ceiling across all uploaded files in a single pass.",
      "Once the queue completes, you can click 'Inspect' on any individual card to verify its before/after visual quality on the split comparison slider, download single files, or export the entire collection as `compressed-images.zip`.",
    ],
    practicalSteps: [
      {
        title: "Configure shared batch rules",
        detail:
          "Set your desired compression mode (Balanced or Target KB), output format, and optional max dimensions.",
      },
      {
        title: "Drag and drop your image collection",
        detail:
          "Select multiple files from your file manager. Each card displays real-time progress and byte savings.",
      },
      {
        title: "Export all as a single ZIP",
        detail:
          "Click 'Download All as ZIP Archive' to receive every optimized image with clean, deduplicated filenames.",
      },
    ],
    faqs: [
      {
        question: "How many images can I compress at once?",
        answer:
          "On desktop browsers, you can comfortably process 30 to 60 images per batch. On mobile devices with stricter RAM limits, we recommend batches of 10 to 20 high-resolution photos at a time.",
      },
      {
        question: "What happens if two uploaded files have the same filename?",
        answer:
          "Our ZIP packager automatically deduplicates identical filenames (e.g., photo-compressed.jpg, photo-compressed-1.jpg) so no file is ever overwritten.",
      },
    ],
    relatedSlugs: [
      "image-compressor",
      "jpg-to-webp",
      "image-resizer",
      "compress-image-to-200kb",
    ],
  },

  "compress-image-to-20kb": {
    slug: "compress-image-to-20kb",
    category: "target-size",
    shortLabel: "Compress to 20KB",
    title: "Compress Image to 20KB Online — Exact Signature & Portal Photo Reducer",
    metaDescription:
      "Compress JPG, PNG, and WebP images to 20KB or less online. Built for strict government, exam, and banking signature/photo upload portals with zero server uploads.",
    h1: "Compress Image to 20 KB",
    subtitle:
      "Pre-configured to ≤ 20 KB (20,480 bytes) using iterative binary search and smart resolution scaling for strict signature and ID photo portals.",
    badgeText: "Target Preset Locked: ≤ 20 KB (20,480 Bytes)",
    defaultMode: "target",
    defaultTargetBytes: 20 * 1024,
    defaultOutputFormat: "image/jpeg",
    defaultResizeMode: "original",
    defaultQuality: 75,
    dropzoneHeadline: "Drop signature or ID photo to compress under 20 KB",
    dropzoneSubhead:
      "Iterative binary search guarantees output ≤ 20,480 bytes • 100% private local processing",
    useCaseHeading: "Portals Requiring Under 20 KB Image Uploads",
    useCaseIntro:
      "A 20 KB file size ceiling is one of the strictest limits encountered on legacy online application systems, most commonly required for scanned ink signatures, thumb impressions, and small passport photographs.",
    specTableTitle: "Typical 20 KB Portal Upload Requirements",
    specTable: [
      {
        parameter: "Scanned Signature Strip",
        value: "10 KB – 20 KB (JPEG)",
        notes: "Recommended dimensions: 140 × 60 px to 400 × 150 px on white paper.",
      },
      {
        parameter: "Thumb Impression Scan",
        value: "10 KB – 20 KB (JPEG)",
        notes: "Recommended dimensions: 240 × 240 px at medium contrast.",
      },
      {
        parameter: "Compact ID Photograph",
        value: "15 KB – 20 KB (JPEG)",
        notes: "Recommended dimensions: 200 × 230 px to 300 × 400 px.",
      },
    ],
    technicalBreakdownTitle: "How Our Engine Reaches 20 KB Without Destroying Legibility",
    technicalParagraphs: [
      "Compressing a raw 3 MB smartphone photo of a signature directly to 20 KB purely by dropping JPEG quality to 1% produces severe blocky artifacts. Instead, KiloPress combines bounded binary search over JPEG/WebP quantization with proportional resolution step-downs.",
      "If your uploaded image cannot fit under 20,480 bytes at acceptable visual quality at its original multi-megapixel resolution, the engine automatically scales the pixel dimensions down in controlled passes until the file lands cleanly between 17 KB and 19.9 KB.",
    ],
    practicalSteps: [
      {
        title: "Crop tight around the signature or face first",
        detail:
          "Unused background paper wastes byte budget. Upload a cleanly cropped photo for the sharpest 20 KB result.",
      },
      {
        title: "Keep Output Format set to JPG or WebP",
        detail:
          "Most government and exam portals require .jpg files. Our 20 KB preset defaults to JPG for maximum compatibility.",
      },
      {
        title: "Verify the green 'Target ≤ 20 KB Met' badge",
        detail:
          "Check the exact byte measurement on the result card before downloading.",
      },
    ],
    faqs: [
      {
        question: "Will my compressed file be strictly under 20 KB (20,480 bytes)?",
        answer:
          "Yes. Our engine measures the actual generated Blob byte length and only marks the target achieved when the file is ≤ 20,480 bytes.",
      },
      {
        question: "Why did the pixel dimensions of my photo decrease?",
        answer:
          "A 4000×3000 pixel image cannot physically encode under 20 KB without corrupting into solid blocks. Auto-scaling dimensions down to portal-appropriate sizes (e.g., 400×500 px) preserves crisp facial features and readable signatures under 20 KB.",
      },
    ],
    relatedSlugs: [
      "compress-image-to-50kb",
      "compress-image-to-100kb",
      "image-resizer",
      "compress-jpg",
    ],
  },

  "compress-image-to-50kb": {
    slug: "compress-image-to-50kb",
    category: "target-size",
    shortLabel: "Compress to 50KB",
    title: "Compress Image to 50KB Online — Passport Photo & Application Optimizer",
    metaDescription:
      "Reduce image size to 50KB or under online in your browser. Ideal for passport photos, university admissions, and job application portals.",
    h1: "Compress Image to 50 KB",
    subtitle:
      "Pre-configured to ≤ 50 KB (51,200 bytes) for online job applications, university admission forms, and passport photo submissions.",
    badgeText: "Target Preset Locked: ≤ 50 KB (51,200 Bytes)",
    defaultMode: "target",
    defaultTargetBytes: 50 * 1024,
    defaultOutputFormat: "image/jpeg",
    defaultResizeMode: "original",
    defaultQuality: 80,
    dropzoneHeadline: "Drop passport or profile photo to compress under 50 KB",
    dropzoneSubhead:
      "Target locked to ≤ 51,200 bytes • Preserves facial detail & clear contrast",
    useCaseHeading: "Why 50 KB Is the Standard Portal Photo Limit",
    useCaseIntro:
      "Across civil service exams, university portals, visa systems, and corporate HR applications, 20 KB to 50 KB is the universal standard for applicant headshots.",
    specTableTitle: "Recommended Settings for 50 KB Portal Photos",
    specTable: [
      {
        parameter: "Standard Headshot",
        value: "20 KB – 50 KB",
        notes: "3.5 cm × 4.5 cm (approx. 413 × 531 px at 300 DPI) in JPEG format.",
      },
      {
        parameter: "Square Portal Avatar",
        value: "30 KB – 50 KB",
        notes: "600 × 600 px in JPEG or WebP format.",
      },
      {
        parameter: "ID Card Scan (Front)",
        value: "35 KB – 50 KB",
        notes: "800 × 500 px ensuring small printed ID numbers remain legible.",
      },
    ],
    technicalBreakdownTitle: "Achieving Crisp 50 KB Portraits via Binary Search",
    technicalParagraphs: [
      "At 50 KB, a portrait photograph has enough byte budget to look completely indistinguishable from the original—provided its pixel dimensions are matched to display size (typically 500×500 to 900×900 pixels).",
      "KiloPress tests 92% quality first, and if your photo exceeds 51,200 bytes, performs a 7-step binary search over the encoder quantization scale to land as close to 48–50 KB as possible without wasting available quality headroom.",
    ],
    practicalSteps: [
      {
        title: "Drop your portrait or document scan",
        detail:
          "The 50 KB preset is already active. Processing starts immediately upon selection.",
      },
      {
        title: "Optionally set 600×600 px in Dimensions",
        detail:
          "If your portal also requires square dimensions, select the 'Passport / Portal (600×600)' preset in Section 3.",
      },
      {
        title: "Download your verified ≤ 50 KB file",
        detail:
          "Your downloaded file is ready for immediate upload with zero risk of 'File too large' errors.",
      },
    ],
    faqs: [
      {
        question: "Does compressing to 50 KB make text on an ID card blurry?",
        answer:
          "To keep small text on an ID card sharp under 50 KB, crop out any table background around the card before uploading so 100% of the 50 KB budget is dedicated to the card itself.",
      },
      {
        question: "Is my passport photo safe to compress here?",
        answer:
          "Yes. Because KiloPress runs entirely inside your browser's local sandbox, your passport photo or ID document is never transmitted over the internet.",
      },
    ],
    relatedSlugs: [
      "compress-image-to-20kb",
      "compress-image-to-100kb",
      "image-resizer",
      "compress-jpg",
    ],
  },

  "compress-image-to-100kb": {
    slug: "compress-image-to-100kb",
    category: "target-size",
    shortLabel: "Compress to 100KB",
    title: "Compress Image to 100KB Online — High-Clarity Photo & Document Reducer",
    metaDescription:
      "Compress JPG, PNG, and WebP images to 100KB or under online. Preserve high resolution for certificates, forms, and web thumbnails locally in your browser.",
    h1: "Compress Image to 100 KB",
    subtitle:
      "Pre-configured to ≤ 100 KB (102,400 bytes)—ideal for scanned certificates, official documents, e-commerce thumbnails, and web uploads.",
    badgeText: "Target Preset Locked: ≤ 100 KB (102,400 Bytes)",
    defaultMode: "target",
    defaultTargetBytes: 100 * 1024,
    defaultOutputFormat: "original",
    defaultResizeMode: "original",
    defaultQuality: 82,
    dropzoneHeadline: "Drop photos or document scans to compress under 100 KB",
    dropzoneSubhead:
      "Target locked to ≤ 102,400 bytes • High-detail preservation for text & portraits",
    useCaseHeading: "Ideal Workflows for a 100 KB File Size Target",
    useCaseIntro:
      "100 KB is the sweet spot where full-page document scans, academic mark sheets, and high-resolution website product cards remain sharp while loading instantaneously on mobile connections.",
    specTableTitle: "100 KB Use Cases & Expected Output Resolution",
    specTable: [
      {
        parameter: "Scanned Marksheet / Certificate",
        value: "75 KB – 100 KB",
        notes: "Maintains 1000×1400 px resolution so fine print and stamps stay clear.",
      },
      {
        parameter: "E-Commerce Product Card",
        value: "60 KB – 100 KB",
        notes: "1000×1000 px in WebP or JPEG format for fast category page LCP.",
      },
      {
        parameter: "Corporate Directory Headshot",
        value: "50 KB – 100 KB",
        notes: "800×800 px high-DPI retina portrait with zero visible compression noise.",
      },
    ],
    technicalBreakdownTitle: "Maximizing Visual Fidelity Within 102,400 Bytes",
    technicalParagraphs: [
      "Many basic tools compress a 500 KB image to 35 KB when you ask for 100 KB, throwing away 65 KB of visual detail you were allowed to keep. Our binary search algorithm narrows the quality interval across 7 iterations to utilize 93%–99% of your 100 KB allowance whenever needed.",
      "If your uploaded image is already under 100 KB (or fits under 100 KB at 92% quality), KiloPress immediately returns the high-quality output without over-compressing.",
    ],
    practicalSteps: [
      {
        title: "Upload your certificate or photograph",
        detail:
          "Drop single or multiple files into the 100 KB workspace.",
      },
      {
        title: "Inspect fine print with the 300% zoom tool",
        detail:
          "Use the zoom controls above the split preview to verify that document text and numbers are crisp.",
      },
      {
        title: "Download or switch to WebP for even higher sharpness",
        detail:
          "If uploading to a modern website rather than a legacy portal, choose WebP in Section 2 to pack ~30% more detail into 100 KB.",
      },
    ],
    faqs: [
      {
        question: "Can I compress a PNG screenshot to 100 KB?",
        answer:
          "Yes. Our engine applies bit-depth palette quantization to PNG files, or you can switch the Output Format to WebP or JPG in Section 2 to reach 100 KB at full resolution.",
      },
    ],
    relatedSlugs: [
      "compress-image-to-50kb",
      "compress-image-to-200kb",
      "compress-jpg",
      "image-compressor",
    ],
  },

  "compress-image-to-200kb": {
    slug: "compress-image-to-200kb",
    category: "target-size",
    shortLabel: "Compress to 200KB",
    title: "Compress Image to 200KB Online — Web Hero & Document Image Optimizer",
    metaDescription:
      "Compress images to 200KB or less online in your browser. Perfect for full-page document uploads, blog hero images, and Core Web Vitals optimization.",
    h1: "Compress Image to 200 KB",
    subtitle:
      "Pre-configured to ≤ 200 KB (204,800 bytes) for full-page document scans, visa attachments, and fast-loading website hero images.",
    badgeText: "Target Preset Locked: ≤ 200 KB (204,800 Bytes)",
    defaultMode: "target",
    defaultTargetBytes: 200 * 1024,
    defaultOutputFormat: "original",
    defaultResizeMode: "original",
    defaultQuality: 84,
    dropzoneHeadline: "Drop images to compress under 200 KB",
    dropzoneSubhead:
      "Target locked to ≤ 204,800 bytes • Ideal for full-page scans & blog hero images",
    useCaseHeading: "Why 200 KB Is the Gold Standard for Web & Document Uploads",
    useCaseIntro:
      "Google's Core Web Vitals guidelines recommend keeping above-the-fold Largest Contentful Paint (LCP) hero images under 200 KB, and many visa and government portals cap full-page document scans at 200 KB.",
    specTableTitle: "200 KB Performance & Resolution Benchmarks",
    specTable: [
      {
        parameter: "Full-Page A4 / Letter Scan",
        value: "140 KB – 200 KB",
        notes: "Supports 1400×1980 px resolution with crisp 10pt typography.",
      },
      {
        parameter: "Website Hero Banner (1920×1080)",
        value: "120 KB – 200 KB",
        notes: "Delivers sub-1.5s LCP on 4G connections when encoded in WebP or JPEG.",
      },
      {
        parameter: "High-Res Product Zoom Image",
        value: "150 KB – 200 KB",
        notes: "1600×1600 px square catalog image with clean texture fidelity.",
      },
    ],
    technicalBreakdownTitle: "Balancing High Resolution and the 200 KB Ceiling",
    technicalParagraphs: [
      "With a 204,800-byte allowance, most 1080p (1920×1080) photographs can be compressed without any dimension reduction at all, using quality values between 68% and 86%.",
      "If you upload an uncompressed 16-megapixel DSLR or smartphone photo, KiloPress automatically evaluates whether quality adjustment alone can hit 200 KB or if a gentle resolution step-down produces superior visual sharpness.",
    ],
    practicalSteps: [
      {
        title: "Drop your high-resolution photo or scan",
        detail:
          "The 200 KB target is pre-selected and ready.",
      },
      {
        title: "Compare original vs. 200 KB output",
        detail:
          "Use the split comparison slider to confirm textures and typography remain virtually identical.",
      },
      {
        title: "Download singly or in bulk",
        detail:
          "Process an entire article's worth of images to ≤ 200 KB in one batch.",
      },
    ],
    faqs: [
      {
        question: "What if my uploaded image is already 140 KB?",
        answer:
          "If your image already meets the 200 KB target at high quality, KiloPress preserves its quality and does not artificially degrade it.",
      },
    ],
    relatedSlugs: [
      "compress-image-to-100kb",
      "compress-image-to-500kb",
      "jpg-to-webp",
      "bulk-image-compressor",
    ],
  },

  "compress-image-to-500kb": {
    slug: "compress-image-to-500kb",
    category: "target-size",
    shortLabel: "Compress to 500KB",
    title: "Compress Image to 500KB Online — High-Resolution Photo Size Reducer",
    metaDescription:
      "Reduce large multi-megabyte photos to 500KB or under online in your browser. Retain full HD and 2K detail for portfolios, portals, and email attachments.",
    h1: "Compress Image to 500 KB",
    subtitle:
      "Pre-configured to ≤ 500 KB (512,000 bytes)—shrink 5 MB–25 MB camera and smartphone photos down to half a megabyte while preserving studio-grade detail.",
    badgeText: "Target Preset Locked: ≤ 500 KB (512,000 Bytes)",
    defaultMode: "target",
    defaultTargetBytes: 500 * 1024,
    defaultOutputFormat: "original",
    defaultResizeMode: "original",
    defaultQuality: 86,
    dropzoneHeadline: "Drop large camera or phone photos to compress under 500 KB",
    dropzoneSubhead:
      "Target locked to ≤ 512,000 bytes • Preserves high-resolution photographic detail",
    useCaseHeading: "When to Target a 500 KB Image Budget",
    useCaseIntro:
      "Modern smartphones capture 4 MB to 12 MB photos by default. Compressing them to 500 KB achieves an 85%–95% file size reduction while keeping full multi-megapixel resolution for large desktop monitors and high-resolution document portals.",
    specTableTitle: "500 KB Compression Scenarios",
    specTable: [
      {
        parameter: "Insurance / Real Estate Claim Photos",
        value: "300 KB – 500 KB",
        notes: "Retains fine inspection details while fitting 20+ photos in a single email.",
      },
      {
        parameter: "Design & Photography Portfolio",
        value: "350 KB – 500 KB",
        notes: "2560×1440 (2K QHD) display clarity with zero visible banding.",
      },
      {
        parameter: "High-DPI Document / Blueprint Scan",
        value: "400 KB – 500 KB",
        notes: "Preserves fine line art and handwritten annotations.",
      },
    ],
    technicalBreakdownTitle: "Studio-Quality Compression at Half a Megabyte",
    technicalParagraphs: [
      "At 500 KB, JPEG and WebP encoders operate in their high-fidelity range (typically 78%–92% quality). Chroma subsampling and mild high-frequency quantization remove invisible sensor noise from camera photos without touching visible edges.",
      "Because all processing happens locally in your browser, you don't have to wait to upload a 15 MB photo over slow Wi-Fi—compression finishes in milliseconds on your device's CPU.",
    ],
    practicalSteps: [
      {
        title: "Select your multi-megabyte photos",
        detail:
          "Drop one or dozens of large camera photos into the workspace.",
      },
      {
        title: "Review the percentage reduction",
        detail:
          "Typical 6 MB smartphone photos shrink by 91% down to ~490 KB.",
      },
      {
        title: "Download individually or as a ZIP archive",
        detail:
          "Share via email or upload to your CMS immediately.",
      },
    ],
    faqs: [
      {
        question: "Will compressing a 6 MB photo to 500 KB reduce its print quality?",
        answer:
          "For screen viewing, web publishing, and standard 4×6 or A4 document printing, a 500 KB JPEG or WebP at original dimensions is visually indistinguishable from the 6 MB source.",
      },
    ],
    relatedSlugs: [
      "compress-image-to-200kb",
      "compress-image-to-1mb",
      "bulk-image-compressor",
      "image-compressor",
    ],
  },

  "compress-image-to-1mb": {
    slug: "compress-image-to-1mb",
    category: "target-size",
    shortLabel: "Compress to 1MB",
    title: "Compress Image to 1MB Online — Shrink Large Camera Photos Without Quality Loss",
    metaDescription:
      "Compress 10MB–50MB high-resolution photographs to 1MB or less locally in your browser. Ideal for DSLR uploads, print portals, and email attachments.",
    h1: "Compress Image to 1 MB",
    subtitle:
      "Pre-configured to ≤ 1 MB (1,048,576 bytes)—reduce massive DSLR exports and 4K graphics to under 1 megabyte with near-lossless visual fidelity.",
    badgeText: "Target Preset Locked: ≤ 1 MB (1,048,576 Bytes)",
    defaultMode: "target",
    defaultTargetBytes: 1024 * 1024,
    defaultOutputFormat: "original",
    defaultResizeMode: "original",
    defaultQuality: 88,
    dropzoneHeadline: "Drop high-resolution photos to compress under 1 MB",
    dropzoneSubhead:
      "Target locked to ≤ 1,048,576 bytes • Near-lossless quality for 4K & DSLR images",
    useCaseHeading: "Built for High-Resolution 1 MB Portal & Publishing Caps",
    useCaseIntro:
      "Many SaaS platforms, marketplace listings, contest submissions, and community forums enforce a strict 1 MB per-image upload limit. Our 1 MB preset shrinks 15 MB+ images right up to the 1,048,576-byte boundary.",
    specTableTitle: "1 MB Target Performance Profile",
    specTable: [
      {
        parameter: "4K UHD Photography (3840×2160)",
        value: "750 KB – 1.00 MB",
        notes: "Retains full 8.3-megapixel 4K resolution at 82%–90% JPEG/WebP quality.",
      },
      {
        parameter: "Marketplace Hero Listings",
        value: "800 KB – 1.00 MB",
        notes: "Meets strict 1 MB upload limits on real estate and automotive portals.",
      },
      {
        parameter: "Multi-Page / High-DPI Scans",
        value: "600 KB – 1.00 MB",
        notes: "Archival clarity for medical, legal, and architectural documents.",
      },
    ],
    technicalBreakdownTitle: "Why Local Processing Excels on Multi-Megabyte Files",
    technicalParagraphs: [
      "Uploading a batch of ten 20 MB photographs to a remote server takes minutes on typical residential upload connections and risks timeout errors. Because KiloPress decodes and compresses files locally in your browser, even 30 MB images are processed in under a second with zero network transfer.",
    ],
    practicalSteps: [
      {
        title: "Drop your 5 MB – 65 MB images",
        detail:
          "The 1 MB target (1,048,576 bytes) is pre-configured.",
      },
      {
        title: "Verify zero dimension loss",
        detail:
          "At 1 MB, almost all photographs retain 100% of their original pixel width and height.",
      },
      {
        title: "Download your optimized files",
        detail:
          "Export single images or a batch ZIP ready for upload.",
      },
    ],
    faqs: [
      {
        question: "Is 1 MB calculated as 1,000 KB or 1,024 KB?",
        answer:
          "We enforce the strict binary megabyte standard (1,024 KB = 1,048,576 bytes) and target slightly below that ceiling so both decimal (1,000,000 bytes) and binary (1,048,576 bytes) server validators accept your file.",
      },
    ],
    relatedSlugs: [
      "compress-image-to-500kb",
      "compress-image-to-2mb",
      "bulk-image-compressor",
      "compress-jpg",
    ],
  },

  "compress-image-to-2mb": {
    slug: "compress-image-to-2mb",
    category: "target-size",
    shortLabel: "Compress to 2MB",
    title: "Compress Image to 2MB Online — Archival & DSLR Photo Size Optimizer",
    metaDescription:
      "Reduce ultra-high-resolution 20MB–65MB images to 2MB or under locally in your browser. Built for 2MB portal caps, print proofs, and photography submissions.",
    h1: "Compress Image to 2 MB",
    subtitle:
      "Pre-configured to ≤ 2 MB (2,097,152 bytes) for ultra-high-resolution camera exports, print proofs, and portals with a 2 MB attachment cap.",
    badgeText: "Target Preset Locked: ≤ 2 MB (2,097,152 Bytes)",
    defaultMode: "target",
    defaultTargetBytes: 2 * 1024 * 1024,
    defaultOutputFormat: "original",
    defaultResizeMode: "original",
    defaultQuality: 90,
    dropzoneHeadline: "Drop ultra-high-resolution images to compress under 2 MB",
    dropzoneSubhead:
      "Target locked to ≤ 2,097,152 bytes • Archival-grade quality up to 65 MB input",
    useCaseHeading: "When You Need a 2 MB Ceiling",
    useCaseIntro:
      "Discord free-tier attachments, government immigration portals, and print-on-demand proofing systems frequently specify a 2 MB maximum file size.",
    specTableTitle: "2 MB Target Capabilities",
    specTable: [
      {
        parameter: "24 MP+ Full-Frame Camera Exports",
        value: "1.4 MB – 2.0 MB",
        notes: "Compresses 25 MB uncompressed exports while preserving full 6000×4000 px dimensions.",
      },
      {
        parameter: "Immigration & Visa Portals",
        value: "Under 2.0 MB",
        notes: "Meets high-resolution document scan caps without downsampling text.",
      },
      {
        parameter: "High-Detail Infographics & Maps",
        value: "1.2 MB – 2.0 MB",
        notes: "Preserves small labels across large canvas dimensions.",
      },
    ],
    technicalBreakdownTitle: "High-Bitrate Quantization Control",
    technicalParagraphs: [
      "When compressing a 30 MB image to 2 MB, our binary search engine starts at 92% quality and steps down in fine increments only as far as necessary to cross below 2,097,152 bytes, guaranteeing maximum perceptual fidelity.",
    ],
    practicalSteps: [
      {
        title: "Drop your large image files (up to 65 MB each)",
        detail:
          "Processed locally in browser memory without upload delays.",
      },
      {
        title: "Inspect at 300% zoom",
        detail:
          "Confirm studio-grade edge and color reproduction.",
      },
      {
        title: "Download your ≤ 2 MB output",
        detail:
          "Save individually or package multiple hi-res photos into a ZIP.",
      },
    ],
    faqs: [
      {
        question: "What is the maximum input file size supported?",
        answer:
          "You can upload individual images up to 65 MB each. All decoding and encoding happen locally on your device.",
      },
    ],
    relatedSlugs: [
      "compress-image-to-1mb",
      "compress-image-to-500kb",
      "bulk-image-compressor",
      "image-compressor",
    ],
  },

  "compress-jpg": {
    slug: "compress-jpg",
    category: "format",
    shortLabel: "JPG Compressor",
    title: "JPG Compressor Online — Reduce JPEG File Size Without Losing Quality",
    metaDescription:
      "Compress JPG and JPEG photos online in your browser. Optimize DCT quantization or hit exact KB targets (20KB, 50KB, 100KB) with zero server uploads.",
    h1: "JPG / JPEG Image Compressor",
    subtitle:
      "Optimize JPEG photographs using perceptual Discrete Cosine Transform (DCT) quantization or compress to an exact KB target locally in your browser.",
    badgeText: "Dedicated JPEG Quantization & Target-Size Optimizer",
    defaultMode: "balanced",
    defaultTargetBytes: 100 * 1024,
    defaultOutputFormat: "image/jpeg",
    defaultResizeMode: "original",
    defaultQuality: 80,
    dropzoneHeadline: "Drop JPG or JPEG photos here to compress",
    dropzoneSubhead:
      "Outputs standard compliant .jpg files • Supports Balanced, Manual & Target KB modes",
    useCaseHeading: "How JPEG Compression Shrinks Photos by 50%–80%",
    useCaseIntro:
      "JPEG (Joint Photographic Experts Group) is the universal standard for continuous-tone photographs. Understanding how its encoder works helps you get the smallest file with zero visible degradation:",
    specTableTitle: "JPEG Quality Ranges & Visual Impact",
    specTable: [
      {
        parameter: "85% – 92% (Archival / Portfolio)",
        value: "30% – 50% size reduction",
        notes: "Visually indistinguishable from uncompressed source even at 200% zoom.",
      },
      {
        parameter: "75% – 82% (Balanced Default)",
        value: "55% – 75% size reduction",
        notes: "Optimal perceptual sweet spot for websites, blogs, and email attachments.",
      },
      {
        parameter: "50% – 70% (Compact Portal Mode)",
        value: "75% – 88% size reduction",
        notes: "Slight softening in high-frequency foliage/hair; ideal for 50 KB–100 KB portals.",
      },
    ],
    technicalBreakdownTitle: "Inside the JPEG Encoding Pipeline",
    technicalParagraphs: [
      "JPEG compression transforms 8×8 pixel blocks from the RGB color space into YCbCr (separating luminance brightness from chrominance color) and applies a Discrete Cosine Transform (DCT). Because the human eye is far more sensitive to brightness detail than subtle color shifts, high-frequency color data can be quantized aggressively without affecting perceived sharpness.",
      "Our JPG compressor defaults to 80% perceptual quality in Balanced mode, or you can switch to Target File Size mode to hit an exact byte budget for online forms.",
    ],
    practicalSteps: [
      {
        title: "Drop your .jpg or .jpeg files",
        detail:
          "You can also drop PNG or WebP files—this tool automatically outputs standard .jpg files.",
      },
      {
        title: "Choose Balanced or Target KB mode",
        detail:
          "Use Balanced for general photo shrinking, or pick a preset like 50 KB or 100 KB.",
      },
      {
        title: "Inspect and download",
        detail:
          "Compare original and compressed versions side by side before saving.",
      },
    ],
    faqs: [
      {
        question: "Are .jpg and .jpeg the exact same format?",
        answer:
          "Yes. Both extensions refer to the exact same ISO/IEC 10918-1 JPEG binary format. Our tool accepts both and outputs clean `.jpg` files for universal portal compatibility.",
      },
    ],
    relatedSlugs: [
      "jpg-to-webp",
      "compress-image-to-50kb",
      "compress-image-to-100kb",
      "image-compressor",
    ],
  },

  "compress-png": {
    slug: "compress-png",
    category: "format",
    shortLabel: "PNG Compressor",
    title: "PNG Compressor Online — Reduce PNG Size with Alpha Transparency",
    metaDescription:
      "Compress PNG images locally in your browser using bit-depth palette quantization and ordered Bayer dithering while preserving full alpha transparency.",
    h1: "PNG Image Compressor",
    subtitle:
      "Shrink PNG screenshots, UI assets, and transparent logos by 35%–70% using local bit-depth quantization while preserving alpha transparency.",
    badgeText: "Bit-Depth Palette Quantizer + Full Alpha Transparency Preservation",
    defaultMode: "balanced",
    defaultTargetBytes: 150 * 1024,
    defaultOutputFormat: "image/png",
    defaultResizeMode: "original",
    defaultQuality: 72,
    dropzoneHeadline: "Drop PNG images here to compress with transparency",
    dropzoneSubhead:
      "Preserves alpha transparency • Uses bit-depth quantization to boost DEFLATE ratios",
    useCaseHeading: "How Our Browser-Based PNG Quantizer Works",
    useCaseIntro:
      "Standard browser Canvas APIs ignore the quality parameter when exporting `image/png`, often producing files larger than the original. KiloPress solves this with a custom client-side quantization pass:",
    specTableTitle: "PNG Optimization Modes",
    specTable: [
      {
        parameter: "Balanced PNG (q=72%)",
        value: "35% – 65% reduction",
        notes: "Quantizes RGB channels with 4×4 ordered Bayer dithering to maximize LZ77 runs.",
      },
      {
        parameter: "Transparent Pixel Zeroing",
        value: "5% – 15% extra savings",
        notes: "Clears hidden RGB noise inside Alpha=0 pixels so DEFLATE compresses empty areas to near zero.",
      },
      {
        parameter: "WebP Alternative Option",
        value: "60% – 85% reduction",
        notes: "When a strict KB target like 20 KB is needed with transparency, switch Output to WebP.",
      },
    ],
    technicalBreakdownTitle: "Why PNG Files Are Large—And How Bit-Depth Quantization Shrinks Them",
    technicalParagraphs: [
      "PNG uses lossless DEFLATE compression (LZ77 + Huffman coding). When a 24-bit or 32-bit PNG contains subtle camera noise or smooth gradients, adjacent pixels rarely share identical byte values, preventing LZ77 dictionary matches.",
      "By quantizing low-order bit noise across RGBA channels with a subtle 4×4 ordered Bayer dither matrix before passing the buffer to the PNG encoder, long sequences of repeating byte patterns emerge—shrinking the resulting PNG file dramatically while keeping sharp UI typography and full alpha transparency.",
    ],
    practicalSteps: [
      {
        title: "Drop your transparent PNG logos or screenshots",
        detail:
          "The checkerboard preview confirms your transparent background is intact.",
      },
      {
        title: "Adjust Manual Quality or Target Size if needed",
        detail:
          "Lower quality settings increase palette quantization for smaller PNG files.",
      },
      {
        title: "Need an even smaller file? Try PNG to WebP or JPG",
        detail:
          "If your PNG is actually a photograph without transparency, switching Output Format to JPG or WebP will reduce its size by up to 85%.",
      },
    ],
    faqs: [
      {
        question: "Will my PNG keep its transparent background?",
        answer:
          "Yes. When Output Format is set to PNG (or Original/WebP), the full alpha channel is preserved and displayed over our inspection checkerboard.",
      },
    ],
    relatedSlugs: [
      "png-to-jpg",
      "image-converter",
      "compress-webp",
      "image-compressor",
    ],
  },

  "compress-webp": {
    slug: "compress-webp",
    category: "format",
    shortLabel: "WebP Compressor",
    title: "WebP Compressor Online — Optimize WebP Images for Core Web Vitals",
    metaDescription:
      "Compress WebP images online in your browser. Reduce WebP file sizes further by tuning predictive coding quality or targeting an exact KB budget.",
    h1: "WebP Image Compressor",
    subtitle:
      "Optimize WebP assets for maximum PageSpeed and Core Web Vitals performance with full alpha transparency and exact KB targeting.",
    badgeText: "High-Efficiency WebP Predictive Encoder (Lossy + Alpha)",
    defaultMode: "balanced",
    defaultTargetBytes: 100 * 1024,
    defaultOutputFormat: "image/webp",
    defaultResizeMode: "original",
    defaultQuality: 80,
    dropzoneHeadline: "Drop WebP images here to compress",
    dropzoneSubhead:
      "Preserves WebP alpha transparency • Ideal for Shopify, WordPress & Next.js assets",
    useCaseHeading: "Why WebP Is the Modern Standard for Web Performance",
    useCaseIntro:
      "Developed by Google and supported by 97%+ of active web browsers, WebP combines VP8 predictive intra-frame coding with an 8-bit alpha channel—replacing both JPEG and PNG in modern web stacks.",
    specTableTitle: "WebP vs. Legacy Formats",
    specTable: [
      {
        parameter: "WebP vs. JPEG",
        value: "25% – 34% smaller",
        notes: "At equivalent SSIM perceptual quality index.",
      },
      {
        parameter: "WebP vs. Transparent PNG",
        value: "60% – 80% smaller",
        notes: "Supports lossy RGB + lossless/lossy alpha channel in a single container.",
      },
      {
        parameter: "Browser Compatibility",
        value: "Chrome, Safari, Firefox, Edge",
        notes: "Supported across all modern desktop, iOS (14+), and Android browsers.",
      },
    ],
    technicalBreakdownTitle: "Predictive Block Coding in WebP",
    technicalParagraphs: [
      "Unlike JPEG, which encodes every 8×8 block independently, WebP predicts pixel values in a block from already-decoded neighboring blocks above and to the left, encoding only the residual difference. This eliminates block ringing around sharp edges and produces remarkably compact files.",
    ],
    practicalSteps: [
      {
        title: "Drop WebP (or JPG/PNG) files",
        detail:
          "Output Format is locked to WebP so any uploaded image exports as a highly optimized `.webp` file.",
      },
      {
        title: "Target 100 KB or 200 KB for hero banners",
        detail:
          "Switch to Target File Size mode to enforce strict performance budgets across your site.",
      },
      {
        title: "Download单个 or batch ZIP",
        detail:
          "Deploy directly to your CDN or CMS media library.",
      },
    ],
    faqs: [
      {
        question: "Does compressing WebP remove transparency?",
        answer:
          "No. WebP natively supports full 8-bit alpha transparency even at lossy compression settings.",
      },
    ],
    relatedSlugs: [
      "jpg-to-webp",
      "image-converter",
      "compress-image-to-100kb",
      "bulk-image-compressor",
    ],
  },

  "jpg-to-webp": {
    slug: "jpg-to-webp",
    category: "conversion",
    shortLabel: "JPG to WebP",
    title: "JPG to WebP Converter Online — Convert & Compress JPEG to WebP Locally",
    metaDescription:
      "Convert JPG and JPEG images to WebP online in your browser. Cut image payload by 30%–65% for faster website loading and better Core Web Vitals.",
    h1: "JPG to WebP Converter",
    subtitle:
      "Transcode JPEG photographs into modern WebP format locally in your browser—cutting file sizes by an additional 30% to 65% while preserving visual sharpness.",
    badgeText: "Direct Local Transcoder: JPEG → WebP",
    defaultMode: "balanced",
    defaultTargetBytes: 100 * 1024,
    defaultOutputFormat: "image/webp",
    defaultResizeMode: "original",
    defaultQuality: 80,
    dropzoneHeadline: "Drop JPG / JPEG files here to convert to WebP",
    dropzoneSubhead:
      "Automatic `.webp` output • Batch conversion & ZIP download supported",
    useCaseHeading: "Eliminate 'Serve Images in Next-Gen Formats' Lighthouse Warnings",
    useCaseIntro:
      "Google PageSpeed Insights and Lighthouse flag legacy `.jpg` files when their byte weight delays Largest Contentful Paint (LCP). Converting your existing JPEG library to WebP resolves this audit immediately.",
    specTableTitle: "Typical JPG to WebP Conversion Benchmarks",
    specTable: [
      {
        parameter: "E-Commerce Product JPG (420 KB)",
        value: "→ 135 KB WebP (-68%)",
        notes: "Encoded at 80% balanced WebP quality at identical 1200×1200 px resolution.",
      },
      {
        parameter: "Blog Hero Banner JPG (850 KB)",
        value: "→ 240 KB WebP (-72%)",
        notes: "Eliminates gradient banding in sky/background areas.",
      },
      {
        parameter: "Thumbnail Grid (20 × 85 KB JPG)",
        value: "→ 20 × 28 KB WebP (-67%)",
        notes: "Saves over 1.1 MB of total page transfer on category pages.",
      },
    ],
    technicalBreakdownTitle: "Why Converting JPG to WebP Works So Effectively",
    technicalParagraphs: [
      "WebP's adaptive block quantization and in-loop deblocking filter smooth out 8×8 macroblock boundaries that otherwise require high bitrates in JPEG. When you drop your JPG files here, KiloPress decodes the JPEG colour planes onto an HTML5 Canvas and re-encodes them through your browser's native WebP encoder.",
    ],
    practicalSteps: [
      {
        title: "Drop one or dozens of .jpg files",
        detail:
          "Output Format is pre-selected to WebP.",
      },
      {
        title: "Compare sharpness on the split slider",
        detail:
          "Verify that fine details match your source JPEG.",
      },
      {
        title: "Download `.webp` files or batch ZIP",
        detail:
          "Use in `<picture>` tags or `<img>` elements across all modern browsers.",
      },
    ],
    faqs: [
      {
        question: "Can all modern web browsers display WebP images?",
        answer:
          "Yes. Chrome, Firefox, Edge, Opera, and Safari (since macOS Big Sur and iOS 14) all natively support WebP images.",
      },
    ],
    relatedSlugs: [
      "compress-webp",
      "image-converter",
      "bulk-image-compressor",
      "compress-jpg",
    ],
  },

  "png-to-jpg": {
    slug: "png-to-jpg",
    category: "conversion",
    shortLabel: "PNG to JPG",
    title: "PNG to JPG Converter Online — Convert PNG to JPEG with Custom Background",
    metaDescription:
      "Convert PNG images to JPG locally in your browser. Shrink multi-megabyte photographic PNGs by up to 85% with customizable matte background color for transparent areas.",
    h1: "PNG to JPG Converter",
    subtitle:
      "Convert heavy PNG screenshots and photographs into compact, universally compatible `.jpg` files with automatic transparency matte compositing.",
    badgeText: "Direct Local Transcoder: PNG → JPEG (With Transparency Matte)",
    defaultMode: "balanced",
    defaultTargetBytes: 100 * 1024,
    defaultOutputFormat: "image/jpeg",
    defaultResizeMode: "original",
    defaultQuality: 82,
    dropzoneHeadline: "Drop PNG files here to convert to JPG",
    dropzoneSubhead:
      "Shrunk by 70%–90% for photographic PNGs • Custom matte fill for transparent PNGs",
    useCaseHeading: "When Converting PNG to JPG Saves 80%+ of File Size",
    useCaseIntro:
      "Design tools, macOS/Windows screenshot utilities, and AI image generators frequently save photographic images as uncompressed `.png` files ranging from 2 MB to 15 MB. Converting those files to `.jpg` reduces their size by 80%–90% instantaneously.",
    specTableTitle: "PNG to JPG Conversion Scenarios",
    specTable: [
      {
        parameter: "Desktop / Mobile Screenshot with Photo",
        value: "3.2 MB PNG → 280 KB JPG (-91%)",
        notes: "Ideal when alpha transparency is not required.",
      },
      {
        parameter: "Portal Upload Rejection ('Only .JPG allowed')",
        value: "PNG → Standard ISO JPEG",
        notes: "Many exam, banking, and government portals reject `.png` extensions.",
      },
      {
        parameter: "Transparent PNG Logo on White Page",
        value: "Composited over #FFFFFF matte",
        notes: "Prevents the black-background bug common in basic converters.",
      },
    ],
    technicalBreakdownTitle: "How We Handle Transparent PNG Pixels Cleanly",
    technicalParagraphs: [
      "Because the JPEG specification only supports 3-channel YCbCr (Red, Green, Blue converted to Luminance/Chrominance) and has no Alpha channel, transparent pixels must be blended against a solid background color before encoding.",
      "Whenever you upload a PNG containing transparent pixels, KiloPress detects the alpha channel automatically, composites the image onto a clean white (`#FFFFFF`) canvas by default, and displays a color picker in Section 2 so you can match any custom page background.",
    ],
    practicalSteps: [
      {
        title: "Drop your .png files",
        detail:
          "Output Format is pre-configured to JPG.",
      },
      {
        title: "Choose a matte fill color if your PNG is transparent",
        detail:
          "White (#FFFFFF) is applied by default, or pick any hex color in Section 2.",
      },
      {
        title: "Optionally set a strict KB target (e.g., 50 KB)",
        detail:
          "Switch to Target File Size mode if converting a PNG portrait for an online form.",
      },
    ],
    faqs: [
      {
        question: "Why did my 4 MB PNG become only 300 KB as a JPG?",
        answer:
          "PNG stores every pixel losslessly, which is inefficient for continuous-tone photographs. JPEG uses perceptual frequency compression designed specifically for photographic content, shrinking file size by up to 90% with no visible loss.",
      },
    ],
    relatedSlugs: [
      "compress-png",
      "compress-jpg",
      "image-converter",
      "compress-image-to-50kb",
    ],
  },
};

export const ALL_TOOL_SLUGS = Object.keys(TOOL_PAGES);
