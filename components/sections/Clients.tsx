"use client";

import { clients } from "@/lib/content";
import { Marquee } from "@/components/ui/Marquee";

/**
 * Clients: a quiet, infinite marquee strip.
 */
export function Clients() {
  return (
    <section className="border-y border-white/10 py-12">
      <div className="mx-auto mb-8 max-w-[1600px] px-6 md:px-12">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
          <span className="code-only">// </span>
          05 — Selected clients
        </span>
      </div>

      <Marquee duration={45}>
        {clients.map((c, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="text-2xl font-medium tracking-tight text-white/70 transition-colors hover:text-white md:text-4xl">
              {c}
            </span>
            <span className="text-2xl text-white/20 md:text-4xl">✺</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
