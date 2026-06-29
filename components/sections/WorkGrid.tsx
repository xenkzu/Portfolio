"use client";

import { useRef } from "react";
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
  useReveal(sectionRef, { stagger: 0.12, y: 60, duration: 1.1 });

  const leftItems = [
    { item: work[0], index: 0, className: "w-full" },
    { item: work[2], index: 2, className: "w-11/12 md:self-end" },
    { item: work[4], index: 4, className: "w-full" },
  ];

  const rightItems = [
    { item: work[1], index: 1, className: "w-full" },
    { item: work[3], index: 3, className: "w-full" },
    { item: work[5], index: 5, className: "w-full" },
  ];

  return (
    <Section id="work">
      <div ref={sectionRef}>
        {/* Heading */}
        <div className="mb-14 flex items-end justify-between md:mb-16">
          <div>
            <span className="mb-6 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/40 md:mb-8">
              <span className="h-px w-12 bg-white/25" />
              <span className="code-only">// </span>02 / Selected Work
            </span>
            <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] tracking-[-0.04em]">
              Things I&apos;ve
              <br />
              <span className="font-serif text-white/50 italic">made.</span>
            </h2>
          </div>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-white/30 md:block">
            {work.length} pieces
          </span>
        </div>

        {/* Desktop Layout: Asymmetric 2-column flow */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-x-16 items-start">
          {/* Left Column */}
          <div data-stagger className="col-span-7 flex flex-col gap-20">
            {leftItems.map(({ item, index, className }) => (
              <WorkCard
                key={item.id}
                item={item}
                index={index}
                className={className}
              />
            ))}
          </div>
          {/* Right Column (pushed down for asymmetry) */}
          <div data-stagger className="col-span-5 flex flex-col gap-20 pt-36">
            {rightItems.map(({ item, index, className }) => (
              <WorkCard
                key={item.id}
                item={item}
                index={index}
                className={className}
              />
            ))}
          </div>
        </div>

        {/* Mobile Layout: Single column stack */}
        <div data-stagger className="flex flex-col gap-14 md:hidden">
          {work.map((item, i) => (
            <WorkCard
              key={item.id}
              item={item}
              index={i}
              className="w-full"
            />
          ))}
        </div>

        {/* Footer line */}
        <p className="mt-20 font-mono text-xs uppercase tracking-[0.2em] text-white/30 md:mt-24">
          Full case studies on request /{" "}
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

function WorkCard({
  item,
  index,
  className,
}: {
  item: WorkItem;
  index: number;
  className?: string;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      data-stagger-item
      className={cn("group", className)}
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Index badge */}
          <span className="absolute left-4 top-4 font-mono text-xs text-white/50">
            {num}
          </span>
          {/* Year, top-right */}
          <span className="absolute right-4 top-4 font-mono text-xs text-white/50">
            {item.year}
          </span>

          {/* "View project" tag — slides up on hover */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex translate-y-3 items-center justify-between px-5 py-5 opacity-0 transition-all duration-500 ease-smoother group-hover:translate-y-0 group-hover:opacity-100">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">
              View project
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-sm">
              ↗
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium leading-tight tracking-tight transition-colors duration-300 group-hover:text-white md:text-xl">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm text-white/45">{item.client}</p>
          </div>
          <span className="mt-1 translate-x-0 text-white/0 transition-all duration-300 ease-smoother group-hover:translate-x-1 group-hover:text-white/50">
            →
          </span>
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
