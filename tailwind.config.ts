// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    // Mobile-first: Basis = mobile; skaliert über sm/md/lg/xl
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        bart: {
          black: "#000000",
          white: "#FFFFFF",
          neon: "#00FF00",
          pink: "#FF2CA3",
          red: "#FF0000",
          purple: "#8A2BE2",
          blue: "#1E90FF",
          gray: "#808080",
        },
      },
      fontFamily: {
        marker: ["var(--font-marker)", "system-ui", "sans-serif"],
        comic: ["var(--font-comic)", "system-ui", "sans-serif"],
        gloria: ["var(--font-gloria)", "system-ui", "sans-serif"],
        vt323: ["var(--font-vt323)", "ui-monospace", "SFMono-Regular", "monospace"],
        misfits: ["var(--font-misfits)", "system-ui", "sans-serif"],
        glitch: ["var(--font-glitch)", "system-ui", "sans-serif"],
      },
      // Nützliche Defaults für Mobile-Layout
      container: {
        center: true,
        padding: "1rem", // mobile padding
        screens: { sm: "600px", md: "728px", lg: "984px", xl: "1240px", "2xl": "1440px" },
      },
    },
  },
  plugins: [],
} satisfies Config
