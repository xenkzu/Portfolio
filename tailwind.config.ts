import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        surface: "#0A0A0A",
        ink: "#0F0F0F",
        hairline: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      fontSize: {
        // Fluid display sizes via clamp()
        "display-sm": ["clamp(2.5rem, 8vw, 5rem)", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "display-md": ["clamp(3rem, 12vw, 8rem)", { lineHeight: "0.95", letterSpacing: "-0.05em" }],
        "display-lg": ["clamp(3.5rem, 16vw, 12rem)", { lineHeight: "0.9", letterSpacing: "-0.06em" }],
        "display-xl": ["clamp(4rem, 22vw, 18rem)", { lineHeight: "0.85", letterSpacing: "-0.07em" }],
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        smoother: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
