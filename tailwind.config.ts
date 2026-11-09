import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F5F0",
        surface: "#FFFFFF",
        panel: "#EFECE6",
        ink: "#141413",
        muted: "#6E6D68",
        rule: "#D8D6CE",
        accent: {
          DEFAULT: "#C84B31",
          hover: "#A93B23",
          subtle: "#F9ECE8",
        },
        status: {
          success: "#1E5631",
          successBg: "#EBF3ED",
          warning: "#9A5B13",
          warningBg: "#FBF3E8",
          error: "#A62626",
          errorBg: "#FBEAEA",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "2px",
        sm: "1px",
        md: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
