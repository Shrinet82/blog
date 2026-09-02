import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#FBF9F4",
        "on-background": "#1A1A18",
        "surface": "#FBF9F4",
        "surface-bright": "#FBF9F4",
        "surface-dim": "#F0EBDD",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F5F1E8",
        "surface-container": "#F0EBDD",
        "surface-container-high": "#EAE3D0",
        "surface-container-highest": "#E2D9C4",
        "surface-variant": "#F0EBDD",
        "on-surface": "#1A1A18",
        "on-surface-variant": "#5C594E",
        "outline": "#5C594E",
        "outline-variant": "#DAD5C6",
        "primary": "#A32424",
        "on-primary": "#FFFFFF",
        "primary-container": "#F3DCDC",
        "on-primary-container": "#6B1414",
        "secondary": "#A32424",
        "on-secondary": "#FFFFFF",
        "secondary-container": "#F3DCDC",
        "on-secondary-container": "#6B1414",
        "tertiary": "#1A1A18",
        "on-tertiary": "#FFFFFF",
        "tertiary-container": "#EAE3D0",
        "on-tertiary-container": "#1A1A18",
        "error": "#A32424",
        "on-error": "#FFFFFF",
        "error-container": "#F3DCDC",
        "on-error-container": "#6B1414",
        "inverse-surface": "#1A1A18",
        "inverse-on-surface": "#FBF9F4",
        "inverse-primary": "#E5B3B3",
        "surface-tint": "#A32424"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "content-width": "720px",
        "margin-desktop": "40px",
        "gutter": "24px",
        "container-max": "1280px",
        "unit": "8px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "num": ["var(--font-inter)", "sans-serif"],
        "label-md": ["var(--font-inter)", "sans-serif"],
        "body-sm": ["var(--font-inter)", "sans-serif"],
        "headline-lg-mobile": ["var(--font-source-serif)", "var(--font-noto-devanagari)", "serif"],
        "body-md": ["var(--font-source-serif)", "var(--font-noto-devanagari)", "serif"],
        "headline-sm": ["var(--font-source-serif)", "var(--font-noto-devanagari)", "serif"],
        "body-lg": ["var(--font-source-serif)", "var(--font-noto-devanagari)", "serif"],
        "headline-lg": ["var(--font-source-serif)", "var(--font-noto-devanagari)", "serif"],
        "display": ["var(--font-source-serif)", "var(--font-noto-devanagari)", "serif"],
        "label-lg": ["var(--font-inter)", "sans-serif"],
        "headline-md": ["var(--font-source-serif)", "var(--font-noto-devanagari)", "serif"]
      },
      fontSize: {
        "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "body-sm": ["14px", { "lineHeight": "22px", "fontWeight": "400" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "38px", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "26px", "fontWeight": "400" }],
        "headline-sm": ["20px", { "lineHeight": "28px", "fontWeight": "700" }],
        "body-lg": ["18px", { "lineHeight": "30px", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "44px", "fontWeight": "700" }],
        "display": ["48px", { "lineHeight": "60px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "700" }]
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
export default config;
