"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * WebGL grain shader field for the hero background.
 * A monochrome flowing-noise plane that reacts subtly to the pointer.
 * Uses a single fullscreen triangle via OGL's Mesh with a fullscreen program.
 */
export function GrainField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // Static fallback — solid near-black
      container.style.background = "#000000";
      return;
    }

    let renderer: Renderer;
    let program: Program;
    let mesh: Mesh;
    let raf = 0;
    let resizeObserver: ResizeObserver;
    let onMouseRef: ((e: MouseEvent) => void) | null = null;

    try {
      renderer = new Renderer({ alpha: true, antialias: true, dpr: 1.5 });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 1);
      container.appendChild(gl.canvas);
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";

      const vertex = /* glsl */ `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Flowing domain-warped noise in pure monochrome, pointer-reactive.
      const fragment = /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;

        // hash + value noise
        float hash(vec2 p) {
          p = fract(p * vec2(443.8975, 397.2973));
          p += dot(p, p.yx + 19.19);
          return fract((p.x + p.y) * p.x);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        // fbm
        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = rot * p * 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          uv.x *= uResolution.x / uResolution.y;

          float t = uTime * 0.04;

          // Domain warp for liquid motion
          vec2 q = vec2(
            fbm(uv * 1.5 + t),
            fbm(uv * 1.5 + vec2(5.2, 1.3) + t)
          );
          vec2 r = vec2(
            fbm(uv * 1.5 + q + vec2(1.7, 9.2) + t * 1.2),
            fbm(uv * 1.5 + q + vec2(8.3, 2.8) + t * 1.4)
          );
          float f = fbm(uv * 1.5 + r);

          // Pointer influence — subtle parallax warp toward cursor
          vec2 mouseDist = uv - uMouse;
          float mInf = exp(-dot(mouseDist, mouseDist) * 2.5) * 0.15;
          f += mInf;

          // Monochrome grade: keep it dark and filmic
          float val = smoothstep(0.15, 0.75, f);
          vec3 col = vec3(val * 0.16);
          col += pow(val, 4.0) * 0.25; // faint highlights

          // Vignette
          float vig = smoothstep(1.3, 0.2, length(vUv - 0.5));
          col *= 0.6 + vig * 0.7;

          gl_FragColor = vec4(col, 1.0);
        }
      `;

      program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: [0.5, 0.5] },
          uResolution: { value: [1, 1] },
        },
      });

      // Single fullscreen triangle
      const geometry = new Triangle(gl);
      mesh = new Mesh(gl, { geometry, program });

      const targetMouse = { x: 0.5, y: 0.5 };
      const smoothMouse = { x: 0.5, y: 0.5 };

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        program.uniforms.uResolution.value = [w, h];
      };
      resize();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      const onMouse = (e: MouseEvent) => {
        targetMouse.x = e.clientX / window.innerWidth;
        targetMouse.y = 1.0 - e.clientY / window.innerHeight;
      };
      onMouseRef = onMouse;
      window.addEventListener("mousemove", onMouse);

      const start = performance.now();
      const render = () => {
        const time = (performance.now() - start) / 1000;
        smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.05;
        smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.05;
        program.uniforms.uTime.value = time;
        program.uniforms.uMouse.value = [smoothMouse.x, smoothMouse.y];
        mesh.draw();
        raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    } catch (err) {
      // WebGL unavailable — leave the dark bg
      console.warn("GrainField WebGL init failed:", err);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      if (onMouseRef) window.removeEventListener("mousemove", onMouseRef);
      if (renderer?.gl?.canvas?.parentNode) {
        renderer.gl.canvas.parentNode.removeChild(renderer.gl.canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 bg-black"
    />
  );
}
