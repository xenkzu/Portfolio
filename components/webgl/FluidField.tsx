"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * FluidField — a smooth, slow flowing monochrome "liquid light" background.
 *
 * Unlike GrainField (high-frequency film grain), this is a calm, large-scale
 * field: domain-warped multi-octave noise that drifts like ink in water or
 * soft light pooling and moving. It reacts gently to the pointer.
 *
 * Inspired by editorial heroes where the background feels alive but never
 * competes with the typography. Pure monochrome — no hue.
 */
export function FluidField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
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
      renderer = new Renderer({ alpha: false, antialias: true, dpr: Math.min(window.devicePixelRatio, 1.5) });
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

      const fragment = /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;

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
          uv *= 1.4;

          float t = uTime * 0.035;

          // Domain warp — the smooth "liquid" motion
          vec2 q = vec2(
            fbm(uv + t),
            fbm(uv + vec2(5.2, 1.3) + t * 0.9)
          );
          vec2 r = vec2(
            fbm(uv + 1.6 * q + vec2(1.7, 9.2) + t * 1.1),
            fbm(uv + 1.6 * q + vec2(8.3, 2.8) + t * 1.3)
          );
          float f = fbm(uv + 1.4 * r);

          // Pointer influence — soft pull around the cursor
          float aspect = uResolution.x / uResolution.y;
          vec2 mUv = vec2(uMouse.x * aspect, uMouse.y) * 1.4;
          float md = distance(uv, mUv);
          float mInf = exp(-md * md * 2.0) * 0.12;
          f += mInf;

          // Monochrome grade — keep it dark & filmic, soft highlights
          float val = smoothstep(0.2, 0.85, f);
          vec3 col = vec3(val * 0.14);
          col += pow(val, 5.0) * 0.35;            // faint bright pools
          col += smoothstep(0.75, 1.0, val) * 0.1; // brightest cores

          // Vignette to focus the centre
          float vig = smoothstep(1.4, 0.25, length(vUv - 0.5));
          col *= 0.55 + vig * 0.6;

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

      const geometry = new Triangle(gl);
      mesh = new Mesh(gl, { geometry, program });

      const target = { x: 0.5, y: 0.5 };
      const smooth = { x: 0.5, y: 0.5 };

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
        target.x = e.clientX / window.innerWidth;
        target.y = 1.0 - e.clientY / window.innerHeight;
      };
      onMouseRef = onMouse;
      window.addEventListener("mousemove", onMouse);

      const start = performance.now();
      const render = () => {
        const time = (performance.now() - start) / 1000;
        smooth.x += (target.x - smooth.x) * 0.04;
        smooth.y += (target.y - smooth.y) * 0.04;
        program.uniforms.uTime.value = time;
        program.uniforms.uMouse.value = [smooth.x, smooth.y];
        mesh.draw();
        raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    } catch (err) {
      console.warn("FluidField WebGL init failed:", err);
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
