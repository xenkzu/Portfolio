"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, registerGsap } from "@/lib/gsap";

/**
 * Wraps the app with Lenis smooth scroll and syncs it to the GSAP ticker
 * so ScrollTrigger animations stay in lockstep with the smoothed scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerGsap();

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", () => {
      // Keep ScrollTrigger measurements in sync
    });

    // Drive Lenis from GSAP's ticker for a single rAF loop
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
