"use client";

import { useEffect, useRef } from "react";
import { Renderer, Camera, Program, Mesh, Sphere } from "ogl";

/**
 * MorphSphere — Interactive 3D morphing sphere.
 *
 * A sphere rendered with OGL, displaced by multi-octave noise in the vertex
 * shader. The cursor position is passed as a uniform, causing vertices aligned
 * with the cursor direction to bulge outward — creating a reactive, organic
 * blob that feels alive.
 *
 * Visual style: dark body, cool-toned fresnel rim glow, displacement-based
 * brightness. Matches the site's monochrome palette.
 */
export function MorphSphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let renderer: Renderer;
    let raf = 0;
    let resizeObserver: ResizeObserver;
    let onMouseRef: ((e: MouseEvent) => void) | null = null;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 2),
      });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.DEPTH_TEST);
      container.appendChild(gl.canvas);
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";

      // ---- Camera ----
      const camera = new Camera(gl, { fov: 35, near: 0.1, far: 100 });
      camera.position.set(0, 0, 5);

      // ---- Sphere geometry ----
      const geometry = new Sphere(gl, {
        radius: 1,
        widthSegments: 64,
        heightSegments: 64,
      });

      // ---- Shaders ----
      const vertex = /* glsl */ `
        attribute vec3 position;
        attribute vec3 normal;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat3 normalMatrix;
        uniform float uTime;
        uniform vec2 uMouse;

        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying float vDisp;

        /* ---- 3D value noise via hash ---- */
        float hash31(vec3 p) {
          p = fract(p * vec3(443.897, 397.297, 491.193));
          p += dot(p, p.yzx + 19.19);
          return fract((p.x + p.y) * p.z);
        }

        float noise3(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float a = hash31(i);
          float b = hash31(i + vec3(1, 0, 0));
          float c = hash31(i + vec3(0, 1, 0));
          float d = hash31(i + vec3(1, 1, 0));
          float e = hash31(i + vec3(0, 0, 1));
          float ff = hash31(i + vec3(1, 0, 1));
          float g = hash31(i + vec3(0, 1, 1));
          float h = hash31(i + vec3(1, 1, 1));

          return mix(
            mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
            mix(mix(e, ff, f.x), mix(g, h, f.x), f.y),
            f.z
          );
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise3(p);
            p = p * 2.1 + vec3(1.7, 2.3, 1.1);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 pos = position;
          float t = uTime * 0.25;

          // Multi-octave noise displacement
          float n = (fbm(pos * 1.5 + t) - 0.5) * 0.35;
          n += (fbm(pos * 3.0 + t * 1.3 + 10.0) - 0.5) * 0.12;

          // Cursor-reactive bulge: vertices facing the cursor push outward
          vec2 m = uMouse * 2.0 - 1.0;
          vec3 mDir = normalize(vec3(m.x, m.y, 0.5));
          float alignment = max(dot(normalize(pos), mDir), 0.0);
          n += pow(alignment, 3.0) * 0.25;

          pos += normal * n;

          vDisp = n;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          vViewPos = -mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `;

      const fragment = /* glsl */ `
        precision highp float;

        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying float vDisp;

        void main() {
          vec3 viewDir = normalize(vViewPos);

          // Fresnel rim glow — bright edges, dark center
          float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.8);

          // Two-point lighting for depth
          vec3 l1 = normalize(vec3(0.5, 0.8, 1.0));
          vec3 l2 = normalize(vec3(-0.6, -0.3, 0.7));
          float d1 = dot(vNormal, l1) * 0.5 + 0.5;
          float d2 = dot(vNormal, l2) * 0.3 + 0.3;

          // Layer colors
          vec3 base = vec3(0.03, 0.03, 0.04) * (d1 + d2 * 0.4);
          vec3 rim  = vec3(0.28, 0.30, 0.38) * fresnel;
          vec3 peak = vec3(0.55, 0.58, 0.68) * pow(fresnel, 5.0);
          vec3 glow = vec3(0.10, 0.11, 0.14) * smoothstep(0.0, 0.3, vDisp);

          gl_FragColor = vec4(base + rim + peak + glow, 1.0);
        }
      `;

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: [0.5, 0.5] },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });

      // ---- Mouse tracking (lerped) ----
      const target = { x: 0.5, y: 0.5 };
      const smooth = { x: 0.5, y: 0.5 };

      const onMouse = (e: MouseEvent) => {
        target.x = e.clientX / window.innerWidth;
        target.y = 1 - e.clientY / window.innerHeight;
      };
      onMouseRef = onMouse;
      window.addEventListener("mousemove", onMouse);

      // ---- Resize ----
      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        camera.perspective({ aspect: w / h });
      };
      resize();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      // ---- Render loop ----
      const t0 = performance.now();
      const render = () => {
        const time = (performance.now() - t0) / 1000;

        smooth.x += (target.x - smooth.x) * 0.04;
        smooth.y += (target.y - smooth.y) * 0.04;

        program.uniforms.uTime.value = time;
        (program.uniforms.uMouse as { value: number[] }).value = [
          smooth.x,
          smooth.y,
        ];

        // Slow rotation + gentle float
        mesh.rotation.y = time * 0.12;
        mesh.rotation.x = Math.sin(time * 0.15) * 0.15;
        mesh.position.y = 0.1 + Math.sin(time * 0.3) * 0.04;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderer.render({ scene: mesh, camera });

        raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    } catch (err) {
      console.warn("MorphSphere WebGL init failed:", err);
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
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
}
