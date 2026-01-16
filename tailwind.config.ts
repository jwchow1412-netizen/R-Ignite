import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
        muted: "var(--muted)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: [
          "var(--font-space-grotesk)",
          "var(--font-geist-sans)",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
      boxShadow: {
        glow: "0 10px 60px rgba(212, 100, 118, 0.25)",
        card: "0 20px 60px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(124, 28, 57, 0.45), transparent 35%), radial-gradient(circle at 80% 0%, rgba(236, 113, 150, 0.25), transparent 40%), linear-gradient(135deg, #0c0610, #130a14 55%, #0b060c)",
        "panel-gradient":
          "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
      },
      animation: {
        scroll: "scroll 40s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
