"use client";

import { useRef } from "react";
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
        <span className="mb-6 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/40 md:mb-8">
          <span className="h-px w-12 bg-white/25" />
          <span className="code-only">// </span>06 / Contact
        </span>

        {/* Oversized serif headline */}
        <div className="mb-14 md:mb-16">
          <Magnetic strength={0.12} className="inline-block">
            <a
              href={`mailto:${profile.email}`}
              data-cursor="hover"
              className="group block"
            >
              <h2 className="text-[clamp(3rem,11vw,11rem)] font-medium leading-[0.88] tracking-[-0.04em]">
                Let&apos;s make
                <br />
                <span className="font-serif italic font-normal text-white/45 transition-colors duration-500 group-hover:text-white">
                  something
                </span>
                <span className="text-white/30">.</span>
              </h2>
            </a>
          </Magnetic>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Email */}
          <div data-reveal>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              Email
            </p>
            <Magnetic strength={0.1} className="inline-block">
              <a
                href={`mailto:${profile.email}`}
                data-cursor="hover"
                className="group text-lg underline-offset-8 transition-colors hover:text-white md:text-2xl"
              >
                {profile.email}
                <span className="ml-2 inline-block translate-x-0 text-white/0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/60">
                  →
                </span>
              </a>
            </Magnetic>
          </div>

          {/* Socials */}
          <div data-reveal>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              Elsewhere
            </p>
            <ul className="space-y-4">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="group flex items-center gap-6 text-lg"
                  >
                    <span className="w-28 shrink-0 text-sm text-white/35 transition-colors duration-300 group-hover:text-white/60">
                      {s.label}
                    </span>
                    <span className="border-b border-transparent transition-colors duration-300 group-hover:border-white/40">
                      {s.handle}
                    </span>
                    <span className="ml-auto translate-x-0 text-white/0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/60">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
