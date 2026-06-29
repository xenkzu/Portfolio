"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Node {
  x: number; // Resting X coordinate
  y: number; // Resting Y coordinate
  cx: number; // Current X coordinate
  cy: number; // Current Y coordinate
  vx: number; // Velocity X
  vy: number; // Velocity Y
  angle: number; // Rotation angle
  targetAngle: number; // Target rotation angle
  scale: number; // Scale factor
  id: string; // Coordinate label like "[04, 12]"
}

/**
 * InteractiveField — An Awwwards-level interactive background field.
 *
 * Renders a generative grid of delicate vector nodes.
 *
 * Creative Mode:
 *  - Nodes behave like an organic magnetic force field. They drift gently,
 *    and rotate to point directly at the cursor when it approaches.
 *  - Draws thin, fading connecting lines between nearby nodes to form a
 *    glowing, dynamic network.
 *  - The cursor creates a localized gravitational ripple, scaling nodes.
 *
 * Code Mode:
 *  - The field switches to a digital vector blueprint.
 *  - Draws a structured wireframe grid overlay.
 *  - Nodes close to the cursor reveal their real-time local vector coordinates
 *    (e.g., "[+0.25, -0.73]") in a tiny mono font, emphasizing the syntax theme.
 */
export function InteractiveField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  // Keep theme ref updated for the render loop to avoid re-binding events
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;

    const mouse = { x: -9999, y: -9999, active: false };

    // Physics parameters
    const spacing = 55; // Grid spacing in px
    const influenceRadius = 180; // Cursor influence radius
    const springStiffness = 0.08;
    const springDamping = 0.85;

    // Track mouse
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // Initialize grid
    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas.clientWidth * dpr;
      height = canvas.clientHeight * dpr;
      canvas.width = width;
      canvas.height = height;

      nodes = [];
      const cols = Math.ceil(width / (spacing * dpr)) + 2;
      const rows = Math.ceil(height / (spacing * dpr)) + 2;
      const offsetX = (width - (cols - 1) * spacing * dpr) / 2;
      const offsetY = (height - (rows - 1) * spacing * dpr) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * spacing * dpr;
          const y = offsetY + r * spacing * dpr;
          nodes.push({
            x,
            y,
            cx: x,
            cy: y,
            vx: 0,
            vy: 0,
            angle: 0,
            targetAngle: 0,
            scale: 1,
            id: `[${String(c).padStart(2, "0")},${String(r).padStart(2, "0")}]`,
          });
        }
      }
    };

    initGrid();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      initGrid();
    });
    resizeObserver.observe(canvas);

    let lastTime = performance.now();

    // Loop
    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.666, 4); // normalize to ~1 at 60fps
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const isCode = themeRef.current === "code";
      const time = now * 0.001;

      // Draw connections first (Creative Mode only)
      if (!isCode && mouse.active) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Draw grid lines between adjacent nodes when they warp
        const cols = Math.ceil(width / (spacing * dpr)) + 2;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const hasRight = (i + 1) % cols !== 0 && i + 1 < nodes.length;
          const hasDown = i + cols < nodes.length;

          if (hasRight) {
            ctx.moveTo(node.cx, node.cy);
            ctx.lineTo(nodes[i + 1].cx, nodes[i + 1].cy);
          }
          if (hasDown) {
            ctx.moveTo(node.cx, node.cy);
            ctx.lineTo(nodes[i + cols].cx, nodes[i + cols].cy);
          }
        }
        ctx.stroke();
      }

      // Draw blueprint grid lines (Code Mode only)
      if (isCode) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Horizontal and vertical grid lines
        const cols = Math.ceil(width / (spacing * dpr)) + 2;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const hasRight = (i + 1) % cols !== 0 && i + 1 < nodes.length;
          const hasDown = i + cols < nodes.length;

          if (hasRight) {
            ctx.moveTo(node.cx, node.cy);
            ctx.lineTo(nodes[i + 1].cx, nodes[i + 1].cy);
          }
          if (hasDown) {
            ctx.moveTo(node.cx, node.cy);
            ctx.lineTo(nodes[i + cols].cx, nodes[i + cols].cy);
          }
        }
        ctx.stroke();
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // 1. Idle noise drift (slow organic wave)
        const noiseX = Math.sin(time + node.x * 0.005 + node.y * 0.003) * 6 * dpr;
        const noiseY = Math.cos(time + node.x * 0.003 + node.y * 0.005) * 6 * dpr;

        let tx = node.x + noiseX;
        let ty = node.y + noiseY;
        let targetScale = 1;
        let targetAngle = time * 0.2 + (node.x + node.y) * 0.001; // default slow spin

        // 2. Mouse interaction
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius * dpr) {
            const force = (1 - dist / (influenceRadius * dpr)) ** 2;

            // Push/Swirl physics
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle - 0.2) * force * 35 * dpr;
            const pushY = Math.sin(angle - 0.2) * force * 35 * dpr;

            tx -= pushX;
            ty -= pushY;

            // Rotate toward cursor
            targetAngle = angle;
            targetScale = 1 + force * 0.4;
          }
        }

        // 3. Spring physics integration
        const ax = (tx - node.cx) * springStiffness;
        const ay = (ty - node.cy) * springStiffness;
        node.vx = (node.vx + ax) * springDamping;
        node.vy = (node.vy + ay) * springDamping;
        node.cx += node.vx * delta;
        node.cy += node.vy * delta;

        // Smooth angle rotation
        let angleDiff = targetAngle - node.angle;
        // Normalize angle difference to [-PI, PI]
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        node.angle += angleDiff * 0.1 * delta;

        // Smooth scale
        node.scale += (targetScale - node.scale) * 0.1 * delta;

        // 4. Render node
        ctx.save();
        ctx.translate(node.cx, node.cy);
        ctx.rotate(node.angle);

        if (isCode) {
          // CODE MODE: blueprint crosses, indicators, text readouts
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1;
          const size = 3 * node.scale * dpr;

          // Plus signs
          ctx.beginPath();
          ctx.moveTo(-size, 0);
          ctx.lineTo(size, 0);
          ctx.moveTo(0, -size);
          ctx.lineTo(0, size);
          ctx.stroke();

          // Render coordinate readouts for nodes near the mouse
          if (mouse.active) {
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Show text for a select few close nodes
            if (dist < 90 * dpr && i % 2 === 0) {
              ctx.restore();
              ctx.save();
              ctx.translate(node.cx, node.cy);

              // Calculate relative displacement vector normalized
              const rx = ((node.cx - node.x) / (20 * dpr)).toFixed(2);
              const ry = ((node.cy - node.y) / (20 * dpr)).toFixed(2);

              ctx.font = `${8 * dpr}px monospace`;
              ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
              ctx.textAlign = "left";
              ctx.textBaseline = "middle";
              ctx.fillText(
                `v[${rx > "0" ? "+" : ""}${rx},${ry > "0" ? "+" : ""}${ry}]`,
                8 * dpr,
                0
              );
            }
          }
        } else {
          // CREATIVE MODE: fluid magnetic vector needles
          // Glowing points that stretch in the direction of the mouse
          const alpha = mouse.active
            ? 0.1 + (node.scale - 1) * 1.5
            : 0.18;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.65)})`;

          ctx.beginPath();
          // Draw a neat vector pointer shape (tapered line or small triangle)
          const len = 7 * node.scale * dpr;
          ctx.moveTo(len, 0);
          ctx.lineTo(-len * 0.4, -2 * dpr);
          ctx.lineTo(-len * 0.4, 2 * dpr);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-60 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
