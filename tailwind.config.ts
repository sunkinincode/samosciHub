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
        blueprint: {
          bg: "#060911",
          surface: "#0B1120",
          panel: "#111A2E",
          border: "#1E2D4A",
          gold: "#FACC15",
          cyan: "#38BDF8",
        },
      },
      fontFamily: {
        sans: ["var(--font-ibm-thai)", "var(--font-space)", "sans-serif"],
        display: ["var(--font-space)", "var(--font-ibm-thai)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "blueprint-float": {
          "0%, 100%": { transform: "translateY(0px) scale(1.02)" },
          "50%": { transform: "translateY(-10px) scale(1.04)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.9s ease-out forwards",
        "blueprint-float": "blueprint-float 16s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
