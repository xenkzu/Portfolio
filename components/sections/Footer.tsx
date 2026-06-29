"use client";

import { profile } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 px-6 py-10 md:px-12 md:py-12">
      <div className="mx-auto max-w-[1600px]">
        {/* Top: watermark + meta */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="overflow-hidden">
            <span className="block text-[clamp(3rem,12vw,11rem)] font-medium leading-[0.8] tracking-[-0.04em] text-white/10">
              {profile.name}
            </span>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              <span className="code-only">// </span>
              Built from scratch
            </span>
            <span className="font-mono text-xs text-white/30">
              Next.js · GSAP · WebGL · {year}
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 md:mt-12 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs text-white/30">
            © {year} {profile.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              New Delhi, IN
            </span>
            <a
              href="#top"
              data-cursor="hover"
              className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
            >
              Back to top
              <span className="transition-transform duration-300 group-hover:-translate-y-1">
                ↑
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
