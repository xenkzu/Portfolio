"use client";

import { type ReactNode } from "react";

/**
 * Reusable section heading with an index label.
 * The label flips to mono with a "//" prefix in code mode via the code-only helper.
 */
export function SectionHeading({
  index,
  title,
  className,
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-8 flex items-center gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
          {index}
        </span>
        <span className="h-px flex-1 max-w-[80px] bg-white/15" />
      </div>
      <h2 className="text-display-md font-medium">
        <span className="code-only font-mono text-white/40">// </span>
        {title}
      </h2>
    </div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative px-6 py-24 md:px-12 md:py-32 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-[1600px]">{children}</div>
    </section>
  );
}
