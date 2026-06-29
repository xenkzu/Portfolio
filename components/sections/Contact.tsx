"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { profile, socials } from "@/lib/content";
import { Section } from "./Section";
import { useReveal } from "@/lib/useReveal";
import { Magnetic } from "@/components/ui/Magnetic";

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useReveal(sectionRef);

  return (
    <Section id="contact" className="border-t border-white/10">
      <div ref={sectionRef}>
        <span className="mb-10 block font-mono text-xs uppercase tracking-[0.25em] text-white/40">
          <span className="code-only">// </span>
          06 — Contact
        </span>

        <div className="mb-20">
          <Magnetic strength={0.15} className="inline-block">
            <a
              href={`mailto:${profile.email}`}
              data-cursor="hover"
              className="group block"
            >
              <h2 className="text-display-lg font-medium leading-[0.9]">
                Let&apos;s make
                <br />
                <span className="italic text-white/50 transition-colors group-hover:text-white">
                  something
                </span>
              </h2>
            </a>
          </Magnetic>
        </div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Email */}
          <div data-reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              Email
            </p>
            <Magnetic strength={0.1} className="inline-block">
              <a
                href={`mailto:${profile.email}`}
                data-cursor="hover"
                className="text-xl underline-offset-8 transition-colors hover:text-white/70 md:text-2xl"
              >
                {profile.email}
              </a>
            </Magnetic>
          </div>

          {/* Socials */}
          <div data-reveal>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              Elsewhere
            </p>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <Magnetic strength={0.08} className="inline-block">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="group flex items-baseline gap-4 text-lg"
                    >
                      <span className="w-28 text-sm text-white/40">
                        {s.label}
                      </span>
                      <span className="border-b border-transparent transition-colors group-hover:border-white/40">
                        {s.handle}
                      </span>
                      <motion.span
                        className="text-white/30"
                        initial={{ opacity: 0, x: -4 }}
                        whileHover={{ opacity: 1, x: 0 }}
                      >
                        ↗
                      </motion.span>
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
