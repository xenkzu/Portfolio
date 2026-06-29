"use client";

import { useEffect } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

type RevealOptions = {
  /** Selector for stagger groups; children animate as a sequence. */
  staggerSelector?: string;
  /** Stagger delay between items. */
  stagger?: number;
  /** Start position relative to viewport. e.g. "top 85%" */
  start?: string;
  /** y-translate distance in px */
  y?: number;
  /** Duration in seconds */
  duration?: number;
};

/**
 * Sets up GSAP ScrollTrigger reveal animations for any element carrying
 * [data-reveal] (single) or [data-stagger] (group of children).
 * Pass a root element ref selector scope to limit the query.
 */
export function useReveal(
  scope: React.RefObject<HTMLElement> | string | null,
  options: RevealOptions = {}
) {
  useEffect(() => {
    registerGsap();
    const {
      stagger = 0.08,
      start = "top 85%",
      y = 30,
      duration = 1,
    } = options;

    const root =
      typeof scope === "string"
        ? (document.querySelector(scope) as HTMLElement | null)
        : scope?.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(root.querySelectorAll("[data-reveal], [data-stagger] > *"), {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Single reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const isFade = el.getAttribute("data-reveal") === "fade";
        gsap.fromTo(
          el,
          { opacity: 0, y: isFade ? 0 : y },
          {
            opacity: 1,
            y: 0,
            duration,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start },
          }
        );
      });

      // Stagger groups
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>(":scope > *");
        gsap.fromTo(
          items,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            ease: "power3.out",
            stagger,
            scrollTrigger: { trigger: group, start },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [scope, options.stagger, options.start, options.y, options.duration]);
}
