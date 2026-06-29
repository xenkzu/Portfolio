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
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <span className="mb-6 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/40 md:mb-8">
              <span className="h-px w-12 bg-white/25" />
              <span className="code-only">// </span>04 / Capabilities
            </span>
            <h2 className="text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white">
              What I{" "}
              <span className="font-serif text-white/45 italic font-normal">do.</span>
            </h2>
          </div>

          <div className="max-w-xs md:text-right font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 md:self-end">
            <span className="code-only">// </span>studio focus
            <p className="mt-2 font-sans text-sm tracking-normal text-white/45 normal-case leading-relaxed">
              Bridging the gap between high fidelity motion direction and clean interactive development.
            </p>
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
                className="group relative border-b border-white/15"
                data-cursor="hover"
              >
                {/* Hover fill rail */}
                <span className="pointer-events-none absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-white transition-transform duration-500 ease-smoother group-hover:scale-y-100" />

                <div className="flex items-center justify-between py-5 md:py-6">
                  <div className="flex items-baseline gap-6 md:gap-10">
                    <span className="font-mono text-xs text-white/30 transition-colors duration-300 group-hover:text-white/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <motion.h3
                      animate={{
                        x: isOpen ? 16 : 0,
                        opacity: isOpen ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-medium tracking-tight"
                    >
                      {cap.title}
                    </motion.h3>
                  </div>

                  <div className="hidden items-center gap-2 md:flex">
                    {cap.tools.map((t) => (
                      <span
                        key={t}
                        className={cn(
                          "whitespace-nowrap rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-500 ease-smoother",
                          isOpen
                            ? "border-white/30 text-white/80 bg-white/5"
                            : "border-white/10 text-white/25"
                        )}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expandable detail */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-xl pb-6 pl-[2.75rem] text-base leading-relaxed text-white/55 md:pl-[4rem]">
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
