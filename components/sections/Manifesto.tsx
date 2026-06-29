"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { manifesto } from "@/lib/content";
import { Section } from "./Section";

/**
 * Manifesto — a pinned, scroll-scrubbed statement.
 *
 * Each word starts dim and brightens to full as the user scrolls, so the
 * manifesto reads like it's being illuminated line by line. The section is
 * pinned while the scrub runs, then releases.
 *
 * Reduced motion: all words render at full opacity, no pin/scrub.
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");
      gsap.set(words, { opacity: 0.12 });

      gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="about" className="!px-0 !py-0">
      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="relative flex min-h-[100svh] flex-col justify-center px-6 md:px-12"
      >
        {/* Index label */}
        <span className="mb-14 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/40 md:mb-20">
          <span className="h-px w-12 bg-white/25" />
          <span className="code-only">// </span>01 — Manifesto
        </span>

        {/* Statement */}
        <div className="max-w-6xl">
          {manifesto.map((line, li) => (
            <p
              key={li}
              data-line
              className="flex flex-wrap gap-x-[0.22em] text-[clamp(2rem,6vw,5.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-white"
            >
              {line.split(" ").map((word, wi) => (
                <span key={wi} data-word className="inline-block">
                  {word}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
