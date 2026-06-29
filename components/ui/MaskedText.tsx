"use client";

import { motion, type Variants } from "framer-motion";

/**
 * Masked word-by-word reveal.
 * Each word sits inside an overflow-hidden wrapper and slides up from behind
 * a mask, with a staggered delay. Premium, editorial entrance animation.
 */
const wordVariants: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export function MaskedText({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  ariaHidden = false,
}: {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  ariaHidden?: boolean;
}) {
  const words = children.split(" ");

  return (
    <motion.span
      className={className}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay + 0.15 },
        },
      }}
      initial="hidden"
      animate="show"
      aria-label={ariaHidden ? undefined : children}
      aria-hidden={ariaHidden || undefined}
    >
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-flex overflow-hidden align-bottom"
          style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
        >
          <motion.span variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </motion.span>
  );
}
