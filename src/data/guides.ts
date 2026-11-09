export interface GuideArticle {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  readingTime: string;
  summary: string;
  relatedToolSlug: string;
  relatedToolLabel: string;
  sections: {
    heading: string;
    paragraphs: string[];
    codeOrFormula?: string;
    table?: {
      headers: [string, string, string];
      rows: [string, string, string][];
    };
  }[];
}

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: "how-image-compression-works",
    title: "How Image Compression Works: Lossy vs. Lossless Algorithms Explained",
    metaDescription:
      "A practical engineering breakdown of how JPEG DCT quantization, PNG DEFLATE dictionary coding, WebP predictive blocks, and AVIF work.",
    category: "Compression Fundamentals",
    readingTime: "6 min read",
    summary:
      "Understand the mathematical difference between spatial redundancy (PNG) and psychovisual frequency quantization (JPEG, WebP, AVIF).",
    relatedToolSlug: "image-compressor",
    relatedToolLabel: "Universal Image Compressor",
    sections: [
      {
        heading: "1. Why Uncompressed Bitmaps Are Enormous",
        paragraphs: [
          "An uncompressed digital image is a two-dimensional grid of pixels. In standard 32-bit RGBA color, every single pixel requires 4 bytes (8 bits each for Red, Green, Blue, and Alpha). A 12-megapixel smartphone photograph (4000 × 3000 pixels) therefore occupies 48,000,000 bytes—or 45.78 MB—in raw memory.",
          "Image compression algorithms reduce this footprint by removing two distinct types of redundancy: statistical redundancy (lossless compression) and psychovisual redundancy (lossy compression).",
        ],
        codeOrFormula:
          "Raw Memory Bytes = Width × Height × 4 (RGBA)\nExample: 4000 × 3000 × 4 = 48,000,000 bytes (~45.8 MB)",
      },
      {
        heading: "2. Lossy Psychovisual Compression (JPEG, WebP, AVIF)",
        paragraphs: [
          "The human visual system contains far more rod photoreceptors (sensitive to luminance brightness) than cone photoreceptors (sensitive to chromatic color detail). Lossy encoders exploit this biology in three stages:",
          "First, RGB pixels are converted into YCbCr (Luminance + Blue/Red Chroma), allowing chroma channels to be subsampled. Second, pixel blocks (8×8 in JPEG, variable predictive blocks in WebP/AVIF) are transformed into spatial frequency coefficients. Third, high-frequency coefficients—representing microscopic grain that the eye cannot resolve at normal viewing distance—are divided by a Quantization Table and rounded to zero.",
        ],
        table: {
          headers: ["Stage", "Mechanism", "Typical Byte Reduction"],
          rows: [
            ["Color Space & Chroma", "RGB → YCbCr 4:2:0 subsampling", "50% immediate reduction"],
            ["Frequency Transform", "DCT (JPEG) or Predictive Intra-frame (WebP)", "Reorganizes energy into low frequencies"],
            ["Quantization + Entropy", "Divides high frequencies + Huffman/Arithmetic coding", "60% – 85% additional reduction"],
          ],
        },
      },
      {
        heading: "3. Lossless & Palette Compression (PNG)",
        paragraphs: [
          "PNG (Portable Network Graphics) applies scanline filtering followed by DEFLATE (LZ77 sliding-window dictionary + Huffman coding). Because LZ77 looks for repeated byte sequences, screenshots with flat UI colors compress into tiny files, whereas noisy camera photos compress poorly unless bit-depth palette quantization is applied first.",
        ],
      },
    ],
  },
  {
    slug: "reduce-image-size-for-online-forms",
    title: "How to Reduce Image Size for Online Application Forms (20KB, 50KB & 100KB)",
    metaDescription:
      "Step-by-step guide to compressing passport photos, scanned signatures, and certificates to strict 20KB, 50KB, and 100KB portal limits without blurriness.",
    category: "Portals & Applications",
    readingTime: "5 min read",
    summary:
      "Why online portals reject smartphone photos—and how to hit exact 20 KB, 50 KB, and 100 KB ceilings while keeping signatures and ID numbers crisp.",
    relatedToolSlug: "compress-image-to-50kb",
    relatedToolLabel: "Compress Image to 50 KB",
    sections: [
      {
        heading: "1. Why Smartphone Scans Fail Portal Validators",
        paragraphs: [
          "When you photograph a passport photo or ink signature with a modern iPhone or Android phone, the camera saves a 3,000 to 4,000 pixel wide image weighing 2.5 MB to 6 MB. Online exam, visa, and job portals typically enforce strict validation rules such as 'JPG format only, between 20 KB and 50 KB'.",
          "Simply lowering JPEG quality on a 4000×3000 pixel image cannot reach 20 KB or 50 KB because the file headers and minimum block headers for 12 million pixels exceed 50 KB on their own.",
        ],
      },
      {
        heading: "2. Match Pixel Dimensions to Document Type First",
        paragraphs: [
          "Before—or during—target-size compression, matching your pixel dimensions to the physical display area guarantees sharp text and facial features:",
        ],
        table: {
          headers: ["Document Type", "Target File Size", "Ideal Pixel Dimensions"],
          rows: [
            ["Ink Signature Strip", "10 KB – 20 KB", "400 × 150 px (JPEG)"],
            ["Passport Headshot", "20 KB – 50 KB", "413 × 531 px or 600 × 600 px (JPEG)"],
            ["Full-Page Certificate / Marksheet", "100 KB – 200 KB", "1200 × 1700 px (JPEG / WebP)"],
          ],
        },
      },
      {
        heading: "3. Lighting and Cropping Best Practices",
        paragraphs: [
          "Always crop tightly around the edges of your signature or document before compressing. Dark shadows or textured wooden tables around a piece of paper consume valuable kilobytes that should be allocated to your handwriting or portrait.",
        ],
      },
    ],
  },
  {
    slug: "jpg-vs-png-vs-webp",
    title: "JPG vs. PNG vs. WebP vs. AVIF: Complete Format Comparison",
    metaDescription:
      "Compare JPEG, PNG, WebP, and AVIF across compression efficiency, transparency support, browser compatibility, and ideal use cases.",
    category: "Format Engineering",
    readingTime: "6 min read",
    summary:
      "An objective comparison of the four primary web image formats with empirical compression ratios and compatibility notes.",
    relatedToolSlug: "image-converter",
    relatedToolLabel: "Image Format Converter",
    sections: [
      {
        heading: "1. Side-by-Side Technical Matrix",
        paragraphs: [
          "Selecting the wrong container format is the #1 cause of bloated web pages and rejected portal uploads. Use this reference matrix to pick the right format:",
        ],
        table: {
          headers: ["Format", "Transparency (Alpha)", "Best Use Case"],
          rows: [
            ["JPEG (.jpg)", "No (Opaque 24-bit RGB)", "Universal portals, email attachments, print photos"],
            ["PNG (.png)", "Yes (Full 8-bit Alpha)", "UI icons, sharp screenshots, diagrams requiring lossless edges"],
            ["WebP (.webp)", "Yes (Lossy & Lossless Alpha)", "All modern website images, e-commerce catalogs, transparent graphics"],
            ["AVIF (.avif)", "Yes (Alpha + 10/12-bit HDR)", "High-compression photographic hero assets on modern browsers"],
          ],
        },
      },
      {
        heading: "2. Why WebP Replaces Both JPEG and PNG on the Web",
        paragraphs: [
          "Historically, web developers had to use PNG whenever an image needed a transparent background—even if the image was a complex product cutout, resulting in 1.5 MB+ files. Because WebP supports lossy predictive coding for the RGB channels alongside an alpha channel, a 1.5 MB transparent PNG product cutout routinely shrinks to 95 KB in WebP.",
        ],
      },
    ],
  },
  {
    slug: "compress-images-without-losing-quality",
    title: "How to Compress Images Without Noticeable Quality Loss",
    metaDescription:
      "Learn the perceptual quality thresholds (78%–85%), chroma subsampling rules, and resolution matching techniques for visually lossless compression.",
    category: "Visual Quality",
    readingTime: "5 min read",
    summary:
      "Where the human eye stops noticing encoder artifacts—and why 80% quality is 60% smaller than 100% quality.",
    relatedToolSlug: "image-compressor",
    relatedToolLabel: "Universal Image Compressor",
    sections: [
      {
        heading: "1. The Nonlinear 80% Quality Knee",
        paragraphs: [
          "In JPEG and WebP encoders, file size does not scale linearly with the quality slider. Moving from 80% quality to 100% quality typically doubles or triples the file size in kilobytes while improving objective structural similarity (SSIM) by less than 0.8%.",
          "For continuous-tone photographs, the perceptual sweet spot lies between 76% and 84% quality. Within this window, quantization noise remains below the human contrast sensitivity threshold at normal viewing distances.",
        ],
        table: {
          headers: ["Encoder Quality", "Relative File Size", "Visual Fidelity Assessment"],
          rows: [
            ["95% – 100%", "100% (Baseline)", "Unnecessary mathematical overhead; stores invisible sensor grain"],
            ["78% – 84%", "32% – 45% of baseline", "Visually lossless on Retina/4K displays"],
            ["55% – 70%", "18% – 28% of baseline", "Slight softening on high-contrast text edges; great for strict KB caps"],
          ],
        },
      },
      {
        heading: "2. Always Inspect at 100%–200% Zoom Before Publishing",
        paragraphs: [
          "Synthetic text overlays, sharp geometric logos, and high-contrast edges show ringing artifacts earlier than natural landscapes. Use KiloPress's split-screen comparison slider and zoom toggle to verify edge fidelity before downloading.",
        ],
      },
    ],
  },
  {
    slug: "optimize-images-for-websites",
    title: "How to Optimize Images for Websites & Core Web Vitals (LCP & CLS)",
    metaDescription:
      "Practical engineering checklist for optimizing website images: LCP byte budgets, responsive dimensions, WebP/AVIF delivery, and layout shift prevention.",
    category: "Web Performance",
    readingTime: "6 min read",
    summary:
      "Actionable performance budgets for Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).",
    relatedToolSlug: "jpg-to-webp",
    relatedToolLabel: "JPG to WebP Converter",
    sections: [
      {
        heading: "1. Enforce Strict Byte Budgets by Component Role",
        paragraphs: [
          "Images account for over 50% of the transfer weight of the median webpage. When an unoptimized 2.4 MB hero banner blocks Largest Contentful Paint (LCP), mobile users on 4G connections experience multi-second blank screens.",
        ],
        table: {
          headers: ["Page Element", "Max Dimensions", "Target Byte Budget"],
          rows: [
            ["Full-Width Hero Banner (LCP)", "1920 × 1080 px", "≤ 180 KB (WebP / AVIF)"],
            ["In-Article Content Image", "1280 × 720 px", "≤ 90 KB (WebP / JPG)"],
            ["Product Grid Thumbnail", "600 × 600 px", "≤ 40 KB (WebP)"],
            ["Author Avatar / Icon", "160 × 160 px", "≤ 12 KB (WebP / PNG)"],
          ],
        },
      },
      {
        heading: "2. Prevent Cumulative Layout Shift (CLS) with Explicit Dimensions",
        paragraphs: [
          "Whenever you resize an image in KiloPress, note the exact output pixel width and height displayed on the result card and pass those integers directly to your HTML `<img width=\"...\" height=\"...\">` attributes so the browser reserves the correct aspect ratio box before the image loads.",
        ],
      },
    ],
  },
  {
    slug: "why-image-file-sizes-increase",
    title: "Why Compression Sometimes Increases File Size (And How We Prevent It)",
    metaDescription:
      "Understand why re-encoding an already compressed JPG or converting JPG to PNG can increase byte size, and how KiloPress prevents file inflation.",
    category: "Technical Deep Dive",
    readingTime: "4 min read",
    summary:
      "Why re-saving a 60% quality JPEG at 90% quality makes it larger without improving clarity—and how smart byte-stream retention works.",
    relatedToolSlug: "image-compressor",
    relatedToolLabel: "Universal Image Compressor",
    sections: [
      {
        heading: "1. Quantization Table Mismatch When Re-Encoding JPEGs",
        paragraphs: [
          "Suppose you download an image from WhatsApp or Instagram that was already encoded at 60% JPEG quality (120 KB). If you open that image in an editor and export it at 92% quality, the new encoder uses much finer quantization divisors to encode the blocky artifacts left behind by the first compression—resulting in a 260 KB file that looks no sharper than the 120 KB input.",
        ],
      },
      {
        heading: "2. Converting Photographic JPEG to Lossless PNG",
        paragraphs: [
          "Another frequent cause of file inflation is converting a `.jpg` photograph into `.png`. Because PNG must preserve every single pixel value losslessly (including JPEG compression noise), a 200 KB JPEG photograph often balloons into a 1.8 MB PNG.",
          "In KiloPress's Balanced mode, if an image's format and dimensions are unchanged and the re-encoded buffer exceeds the original byte length, our engine automatically runs a fine-tuning pass and retains the original smaller byte stream if no further savings are possible.",
        ],
      },
    ],
  },
  {
    slug: "choose-the-right-image-format",
    title: "Decision Guide: How to Choose the Right Image Format for Every Task",
    metaDescription:
      "Quick decision tree for choosing between JPEG, PNG, WebP, and AVIF for government forms, e-commerce stores, email attachments, and UI design.",
    category: "Workflow Guide",
    readingTime: "4 min read",
    summary:
      "A clear decision framework based on target platform compatibility, transparency needs, and byte limits.",
    relatedToolSlug: "image-converter",
    relatedToolLabel: "Image Format Converter",
    sections: [
      {
        heading: "1. Follow the Four-Question Rule",
        paragraphs: [
          "Instead of guessing which format to select, answer four simple questions about where the file will be used:",
        ],
        table: {
          headers: ["Scenario / Requirement", "Recommended Format", "Recommended Mode"],
          rows: [
            ["Government, Exam, or Banking Portal", "JPEG (.jpg)", "Target File Size (20 KB / 50 KB / 100 KB)"],
            ["Website Hero or Product Catalog", "WebP (.webp)", "Balanced Smart or Target ≤ 150 KB"],
            ["Logo or Screenshot with Sharp Text & Transparency", "PNG (.png) or WebP", "Balanced Smart"],
            ["Email Attachment for Clients", "JPEG (.jpg)", "Target File Size (200 KB – 500 KB)"],
          ],
        },
      },
    ],
  },
];
