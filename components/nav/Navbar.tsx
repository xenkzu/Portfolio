"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile, nav } from "@/lib/content";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

export function Navbar({ isLoading }: { isLoading?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Hide on scroll-down, reveal on scroll-up (past the hero)
      setHidden(y > lastY && y > 200);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isLoading ? -100 : (hidden ? -100 : 0),
        opacity: isLoading ? 0 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? "bg-black/60 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
        {/* Logo */}
        <Magnetic strength={0.3}>
          <a
            href="#top"
            data-cursor="hover"
            className="flex items-center gap-2 text-sm font-medium tracking-tight"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-white" />
            <span>{profile.name}</span>
            <span className="font-mono text-xs text-white/40 code-only">
              {"{ }"}
            </span>
          </a>
        </Magnetic>

        {/* Center nav */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {nav.map((item) => (
            <Magnetic key={item.href} strength={0.2}>
              <a
                href={item.href}
                data-cursor="hover"
                className="group relative font-mono text-xs uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white"
              >
                <span className="code-only">// </span>
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            </Magnetic>
          ))}
        </div>

        {/* Toggle */}
        <ThemeToggle />
      </nav>
    </motion.header>
  );
}
