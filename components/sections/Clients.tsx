"use client";

import { clients } from "@/lib/content";
import { Marquee } from "@/components/ui/Marquee";

/**
 * Clients — a quiet, infinite marquee strip of selected clients.
 */
export function Clients() {
  return (
    <section className="border-y border-white/10 py-12 md:py-16">
      <div className="mx-auto mb-8 max-w-[1600px] px-6 md:px-12">
        <span className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/40">
          <span className="h-px w-12 bg-white/25" />
          <span className="code-only">// </span>05 / Selected clients
        </span>
      </div>

      <Marquee duration={45}>
        {clients.map((c, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="text-[clamp(1.5rem,4vw,3rem)] font-medium tracking-tight text-white/40 transition-colors duration-300 hover:text-white md:text-4xl">
              {c}
            </span>
            <span className="text-2xl text-white/15 md:text-3xl">✺</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
