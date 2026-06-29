"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Magnetic } from "@/components/ui/Magnetic";

/**
 * The signature creative ⇄ code switch.
 * Toggles a subtle site-wide "code layer": mono labels, spec lines, grid overlay.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isCode = theme === "code";

  return (
    <Magnetic strength={0.25}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isCode}
        aria-label={`Switch to ${isCode ? "creative" : "code"} mode`}
        data-cursor="hover"
        className="group flex items-center gap-3 rounded-full border border-white/15 px-4 py-2 transition-colors duration-300 hover:border-white/40"
      >
        <span className="relative flex h-4 w-8 items-center">
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="absolute h-3 w-3 rounded-full bg-white"
            style={{ left: isCode ? "1.125rem" : "0.125rem" }}
          />
        </span>

        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/70 transition-colors group-hover:text-white">
          {isCode ? (
            <>
              <span className="text-white/40">●</span> code
            </>
          ) : (
            <>
              <span>●</span> creative
            </>
          )}
        </span>
      </button>
    </Magnetic>
  );
}
