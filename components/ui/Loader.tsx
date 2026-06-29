"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onComplete?: () => void;
}

const words = [
  { text: "DESIGN", className: "font-sans font-medium uppercase tracking-[0.25em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white" },
  { text: "motion", className: "font-serif italic font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white" },
  { text: "// SYSTEMS", className: "font-mono uppercase tracking-[0.18em] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/70" },
  { text: "SHIPS.", className: "font-sans font-black uppercase tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white" },
  { text: "Yash Kaul", className: "font-serif italic font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white" }
];

export function Loader({ onComplete }: LoaderProps) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      setDone(true);
      document.documentElement.classList.remove("yk-loading");
      onComplete?.();
      return;
    }

    document.documentElement.classList.add("yk-loading");

    let timeoutId: NodeJS.Timeout;
    let wordIndex = 0;

    const cycle = () => {
      if (wordIndex < words.length) {
        setIndex(wordIndex);
        const isLast = wordIndex === words.length - 1;
        const delay = isLast ? 750 : 380; // Hold the last word (the name) slightly longer
        wordIndex++;
        timeoutId = setTimeout(cycle, delay);
      } else {
        setDone(true);
        document.documentElement.classList.remove("yk-loading");
        onComplete?.();
      }
    };

    cycle();

    return () => {
      clearTimeout(timeoutId);
      document.documentElement.classList.remove("yk-loading");
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative flex items-center justify-center overflow-hidden h-[120px] w-full px-6">
            <AnimatePresence mode="wait">
              {words[index] && (
                <motion.span
                  key={index}
                  className={words[index].className}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.38, ease: [0.215, 0.61, 0.355, 1] }}
                >
                  {words[index].text}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
