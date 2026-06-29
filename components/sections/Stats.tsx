"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { stats } from "@/lib/content";
import { Section } from "./Section";

/**
 * Stats beat: oversized numbers that count up when scrolled into view.
 * Values are mixed (numeric + text suffixes), so we animate the numeric part
 * and reveal the suffix.
 */
export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-stat]");

      if (reduced) {
        items.forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
        return;
      }

      items.forEach((el) => {
        const numEl = el.querySelector<HTMLElement>("[data-num]");
        const targetAttr = numEl?.getAttribute("data-num") || "0";
        const numeric = parseFloat(targetAttr);
        const suffix = numEl?.getAttribute("data-suffix") || "";

        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );

        if (!isNaN(numeric) && numEl) {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: numeric,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
            onUpdate: () => {
              const isInt = Number.isInteger(numeric);
              const val = isInt
                ? Math.round(obj.v)
                : obj.v.toFixed(1).replace(/\.0$/, "");
              numEl.textContent = `${val}${suffix}`;
            },
          });
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Parse "20M+" -> { num: 20, suffix: "M+" }
  const parseStat = (value: string) => {
    const m = value.match(/^([\d.]+)(.*)$/);
    return m ? { num: m[1], suffix: m[2] } : { num: value, suffix: "" };
  };

  return (
    <Section id="stats" className="border-t border-white/10 bg-surface">
      <div ref={sectionRef as React.RefObject<HTMLDivElement>}>
        <span className="mb-16 block font-mono text-xs uppercase tracking-[0.25em] text-white/40">
          <span className="code-only">// </span>
          03 — By the numbers
        </span>

        <div className="grid grid-cols-2 gap-x-8 gap-y-16 md:grid-cols-4">
          {stats.map((stat, i) => {
            const { num, suffix } = parseStat(stat.value);
            return (
              <div
                key={i}
                data-stat
                className="border-t border-white/15 pt-6 opacity-0"
              >
                <div className="text-display-sm font-medium leading-none tabular-nums">
                  <span data-num={num} data-suffix={suffix}>
                    {stat.value}
                  </span>
                </div>
                <p className="mt-4 max-w-[180px] text-sm leading-snug text-white/50">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
