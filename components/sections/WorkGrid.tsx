"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { work, type WorkItem } from "@/lib/content";
import { Section } from "./Section";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

const aspectClass: Record<WorkItem["aspect"], string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
};

export function WorkGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  useReveal(sectionRef, { stagger: 0.12, y: 60, duration: 1.1 });

  return (
    <Section id="work">
      <div ref={sectionRef}>
        {/* Heading */}
        <div className="mb-20 flex items-end justify-between">
          <div>
            <span className="mb-8 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/40">
              <span className="h-px w-12 bg-white/25" />
              <span className="code-only">// </span>02 — Selected Work
            </span>
            <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] tracking-[-0.04em]">
              Things I&apos;ve
              <br />
              <span className="text-white/40">made.</span>
            </h2>
          </div>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-white/30 md:block">
            {work.length} pieces
          </span>
        </div>

        {/* Editorial asymmetric grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-24 md:grid-cols-12">
          {work.map((item, i) => {
            const layout = layoutFor(i);
            return (
              <WorkCard
                key={item.id}
                item={item}
                layout={layout}
                index={i}
                isActive={active === item.id}
                onHover={(v) => setActive(v ? item.id : null)}
              />
            );
          })}
        </div>

        {/* Footer line */}
        <p className="mt-24 font-mono text-xs uppercase tracking-[0.2em] text-white/30">
          Full case studies on request —{" "}
          <a
            href="mailto:yashkaul777@gmail.com"
            className="text-white/60 underline-offset-4 hover:underline"
            data-cursor="hover"
          >
            get in touch
          </a>
        </p>
      </div>
    </Section>
  );
}

type Layout = {
  colSpan: string;
  selfAlign?: "start" | "center" | "end";
  order: string;
};

function layoutFor(i: number): Layout {
  // Hand-tuned asymmetric rhythm across a 12-col grid
  const layouts: Layout[] = [
    { colSpan: "md:col-span-7", selfAlign: "start", order: "" },
    { colSpan: "md:col-span-4 md:col-start-9", selfAlign: "center", order: "md:mt-32" },
    { colSpan: "md:col-span-5 md:col-start-2", selfAlign: "start", order: "md:mt-16" },
    { colSpan: "md:col-span-5 md:col-start-8", selfAlign: "end", order: "" },
    { colSpan: "md:col-span-6", selfAlign: "start", order: "md:mt-24" },
    { colSpan: "md:col-span-4 md:col-start-9", selfAlign: "center", order: "md:-mt-12" },
  ];
  return layouts[i % layouts.length];
}

function WorkCard({
  item,
  layout,
  index,
  onHover,
}: {
  item: WorkItem;
  layout: Layout;
  index: number;
  isActive: boolean;
  onHover: (v: boolean) => void;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      data-stagger-item
      className={cn("group", layout.colSpan, layout.order)}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <a href="#contact" data-cursor="media" data-cursor-label="View" className="block">
        <div className={cn("relative overflow-hidden bg-surface", aspectClass[item.aspect])}>
          <motion.img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-700 ease-smoother group-hover:scale-[1.03] group-hover:opacity-100"
          />
          {/* Hover veil for legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Index badge */}
          <span className="absolute left-4 top-4 font-mono text-xs text-white/50">
            {num}
          </span>
          {/* Year, top-right */}
          <span className="absolute right-4 top-4 font-mono text-xs text-white/50">
            {item.year}
          </span>
        </div>

        {/* Meta */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium leading-tight tracking-tight md:text-xl">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm text-white/45">{item.client}</p>
          </div>
        </div>

        {/* Discipline (always) */}
        <div className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-white/40">
          {item.discipline}
        </div>
        {/* Spec line — code layer only */}
        <div className="code-only mt-2 flex flex-wrap gap-2">
          {item.tools.map((t) => (
            <span
              key={t}
              className="rounded-sm border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/50"
            >
              {t}
            </span>
          ))}
        </div>
      </a>
    </article>
  );
}
