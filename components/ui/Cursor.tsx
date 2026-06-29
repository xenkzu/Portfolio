"use client";

import { useEffect, useRef, useState } from "react";
import { lerp } from "@/lib/utils";

/**
 * Adaptive custom cursor.
 * - Renders as a small dot + a trailing ring that eases toward the pointer.
 * - Grows and shows a label when hovering [data-cursor] elements.
 * - Disables itself on touch / coarse pointers.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>("");
  const [variant, setVariant] = useState<"default" | "hover" | "media">(
    "default"
  );

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...mouse };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;

      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (target) {
        const c = target.getAttribute("data-cursor") || "hover";
        const lbl = target.getAttribute("data-cursor-label") || "";
        setVariant(c === "media" ? "media" : "hover");
        setLabel(lbl);
      } else {
        setVariant("default");
        setLabel("");
      }
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const render = () => {
      ringPos.x = lerp(ringPos.x, mouse.x, 0.18);
      ringPos.y = lerp(ringPos.y, mouse.y, 0.18);
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-white/40 transition-[width,height,background-color] duration-300 ease-smooth"
        style={{
          width: variant === "media" ? 96 : variant === "hover" ? 56 : 32,
          height: variant === "media" ? 96 : variant === "hover" ? 56 : 32,
          backgroundColor:
            variant === "media" ? "rgba(255,255,255,0.95)" : "transparent",
        }}
      >
        {label && (
          <span
            className={`font-mono text-[10px] uppercase tracking-widest transition-opacity duration-200 ${
              variant === "media" ? "text-black" : "text-white"
            }`}
          >
            {label}
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-white"
      />
    </div>
  );
}
