"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { capabilities } from "@/lib/content";
import { Section } from "./Section";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

/**
 * Capabilities: an interactive accordion-like list.
 * Hovering a row expands its detail + tool chips; layout shifts smoothly.
 */
export function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  useReveal(sectionRef);

  return (
    <Section id="capabilities" className="border-t border-white/10">
      <div ref={sectionRef}>
        <div className="mb-16 flex items-end justify-between">
          <div>
            <span className="mb-6 block font-mono text-xs uppercase tracking-[0.25em] text-white/40">
              <span className="code-only">// </span>
              04 — Capabilities
            </span>
            <h2 className="text-display-md font-medium">What I do</h2>
          </div>
        </div>

        <ul className="border-t border-white/15">
          {capabilities.map((cap, i) => {
            const isOpen = hovered === i;
            return (
              <li
                key={cap.title}
                data-stagger-item
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group border-b border-white/15"
                data-cursor="hover"
              >
                <div className="flex items-center justify-between py-6 md:py-8">
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-xs text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <motion.h3
                      animate={{
                        x: isOpen ? 12 : 0,
                        opacity: isOpen ? 1 : 0.55,
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="text-3xl font-medium tracking-tight md:text-5xl"
                    >
                      {cap.title}
                    </motion.h3>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      width: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    className="hidden items-center gap-2 overflow-hidden md:flex"
                  >
                    {cap.tools.map((t) => (
                      <span
                        key={t}
                        className="whitespace-nowrap rounded-sm border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/50"
                      >
                        {t}
                      </span>
                    ))}
                  </motion.div>
                </div>

                {/* Expandable detail */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-xl pb-6 pl-12 text-base text-white/55">
                    {cap.detail}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
