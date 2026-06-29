"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/lib/content";

/**
 * Intro loader — counter 000→100 with a name reveal, then a curtain wipe up.
 *
 * Robustness:
 *  - Locks scroll while active and ALWAYS releases it on unmount / completion.
 *  - Hard safety timeout so it can never permanently freeze the page.
 *  - Plays once per session (sessionStorage).
 */
export function Loader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Only play the full intro once per browser session
    const alreadyPlayed = sessionStorage.getItem("yk-loader-played") === "1";

    if (reduced || alreadyPlayed) {
      setCount(100);
      setDone(true);
      document.documentElement.classList.remove("yk-loading");
      return;
    }

    sessionStorage.setItem("yk-loader-played", "1");
    document.documentElement.classList.add("yk-loading");

    const duration = 2000; // ms
    const start = performance.now();
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setDone(true);
      document.documentElement.classList.remove("yk-loading");
      cancelAnimationFrame(raf);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Brief beat at 100, then reveal
        setTimeout(finish, 350);
      }
    };

    raf = requestAnimationFrame(tick);

    // Hard safety: never let the loader block the page beyond 3.5s
    const safety = setTimeout(finish, 3500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      document.documentElement.classList.remove("yk-loading");
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black px-6 py-10 md:px-12 md:py-14"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2 overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
              >
                Portfolio
              </motion.span>
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                className="text-sm font-medium tracking-tight text-white/80"
              >
                {profile.name}
              </motion.span>
            </div>

            {/* Counter */}
            <div className="flex items-end gap-2 overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                className="font-mono text-5xl font-light tabular-nums leading-none md:text-7xl"
              >
                {String(count).padStart(3, "0")}
              </motion.span>
              <span className="mb-1 font-mono text-sm text-white/40">%</span>
            </div>
          </div>

          {/* Bottom row — tagline + progress */}
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
                className="max-w-sm text-sm leading-relaxed text-white/45"
              >
                {profile.role}
              </motion.p>
            </div>

            {/* Progress line */}
            <div className="h-px w-full overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-white"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
