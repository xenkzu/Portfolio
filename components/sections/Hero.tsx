"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { heroStatement, profile } from "@/lib/content";
import { InteractiveField } from "@/components/webgl/InteractiveField";
import { Magnetic } from "@/components/ui/Magnetic";

/**
 * Hero — Dynamic editorial landing screen.
 *
 * Visuals & Interactions:
 *  1. Background: Generative canvas-based InteractiveField (reacts to mouse cursor
 *     differently in Creative vs Code modes).
 *  2. Staggered clip-reveal entrance animations.
 *  3. Dynamic New Delhi live clock (high-end agency editorial detail).
 *  4. Perfectly aligned with the page's standard grid (px-6 md:px-12, max-w-[1600px] mx-auto).
 */

const revealEase: [number, number, number, number] = [0.33, 1, 0.68, 1];

export function Hero({ isLoading }: { isLoading?: boolean }) {
  const [timeStr, setTimeStr] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  // Live Clock (New Delhi time)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat([], options);
      setTimeStr(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll parallax — headline recedes up & blurs as the user scrolls past
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yRecede = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const opacityRecede = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blurRecede = useTransform(scrollYProgress, [0, 0.75], [0, 5]);
  const filterRecede = useTransform(blurRecede, (b) => `blur(${b}px)`);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between bg-black px-6 py-8 md:px-12 md:py-14"
    >
      {/* Generative Interactive Vector/Blueprint Field */}
      <InteractiveField />

      {/* Atmospheric bottom vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-0"
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between relative z-10">
        
        {/* Top Bar: Eyebrow + Live Time */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={isLoading ? { y: "100%" } : { y: "0%" }}
              transition={{ duration: 1, ease: revealEase, delay: 0.15 }}
              className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/40"
            >
              <span className="code-only">// </span>
              {heroStatement.kicker}
            </motion.span>
          </div>

          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={isLoading ? { y: "100%" } : { y: "0%" }}
              transition={{ duration: 1, ease: revealEase, delay: 0.15 }}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35"
            >
              NDLS // <span className="text-white/60">{timeStr || "--:--:--"}</span>
            </motion.span>
          </div>
        </div>

        {/* Center: Main Editorial Headline */}
        <div className="flex flex-1 flex-col justify-center py-12 md:py-20">
          <motion.div
            style={{ y: yRecede, opacity: opacityRecede, filter: filterRecede }}
          >
            <h1 className="max-w-6xl select-none">
              <span className="sr-only">Design that moves — and ships.</span>
              <div
                aria-hidden="true"
                className="font-medium leading-[0.9] tracking-[-0.04em] text-[clamp(3rem,10.5vw,10rem)]"
              >
                {heroStatement.lines.map((line, idx) => (
                  <div key={idx} className="overflow-hidden pb-[0.05em] md:pb-[0.08em]">
                    <motion.div
                      initial={{ y: "115%" }}
                      animate={isLoading ? { y: "115%" } : { y: "0%" }}
                      transition={{
                        duration: 1.2,
                        ease: revealEase,
                        delay: 0.4 + idx * 0.13,
                      }}
                    >
                      <span
                        className={
                          line.accent
                            ? "text-white/50 italic font-normal font-serif"
                            : "text-white"
                        }
                      >
                        {line.text}
                      </span>
                    </motion.div>
                  </div>
                ))}
              </div>
            </h1>
          </motion.div>
        </div>

        {/* Bottom Bar: Sub-info + Scroll Cue */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-t border-white/10 pt-8">
          
          {/* Profile Statement */}
          <div className="max-w-md">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isLoading ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.9, ease: revealEase }}
              className="text-sm leading-relaxed text-white/45"
            >
              {profile.heroSub}
            </motion.p>
          </div>

          {/* Location & Scroll Link */}
          <div className="flex items-center justify-between md:gap-12">
            <div className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 md:block">
              <span className="code-only">// </span>
              {profile.location}
            </div>

            <Magnetic strength={0.18}>
              <a
                href="#about"
                data-cursor="hover"
                aria-label="Scroll to content"
                className="flex items-center gap-4 group"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 transition-colors group-hover:text-white">
                  Scroll to enter
                </span>
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-colors group-hover:border-white/30">
                  <motion.span
                    animate={{ y: [ -4, 4, -4 ] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="block text-xs font-light text-white/40"
                  >
                    ↓
                  </motion.span>
                </span>
              </a>
            </Magnetic>
          </div>

        </div>

      </div>
    </section>
  );
}
