"use client";

import { profile } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 px-6 py-12 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          {/* Big watermark */}
          <div className="overflow-hidden">
            <span className="block text-display-md font-medium leading-none text-white/15">
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

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs text-white/30">
            © {year} {profile.name}. All rights reserved.
          </p>
          <a
            href="#top"
            data-cursor="hover"
            className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
