"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen, pointer-events-none animated film grain overlay.
 * Rendered via canvas at low res then CSS-scaled for performance.
 * This is the texture that makes monochrome feel filmic rather than flat.
 */
export function Grain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Low-res noise buffer, scaled up via CSS for cheap blur + perf
    const w = 128;
    const h = 128;
    canvas.width = w;
    canvas.height = h;

    let raf = 0;
    let frame = 0;

    const render = () => {
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 18; // low alpha — subtle
      }
      ctx.putImageData(imageData, 0, 0);
      frame++;
      raf = requestAnimationFrame(render);
    };

    if (!prefersReduced) {
      raf = requestAnimationFrame(render);
    } else {
      // Static single frame
      render();
      cancelAnimationFrame(raf);
    }

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full opacity-[0.06] mix-blend-screen"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
