"use client";

import { useEffect, useRef } from "react";

type P = {
  x: number; y: number; vx: number; vy: number;
  a: number; r: number;
  color: string; glowColor: string; glowR: number;
  spark?: boolean; burst?: boolean;
  trail: { x: number; y: number }[];
  trailLen: number;
};

const COLORS = [
  { fill: "252,227,164", glow: "252,227,164" },
  { fill: "255,179,71",  glow: "255,179,71"  },
  { fill: "209,166,104", glow: "209,166,104" },
];

function pickColor(): { fill: string; glow: string } {
  const r = Math.random();
  if (r < 0.65) return COLORS[0];
  if (r < 0.88) return COLORS[1];
  return COLORS[2];
}

export function Particles() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // portal center
    const pcx = () => w / 2;
    const pcy = () => h * 0.42;

    const count = Math.min(350, Math.floor((w * h) / 6000));
    const ps: P[] = Array.from({ length: count }).map(() => {
      const c = pickColor();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: 0.12 + Math.random() * 0.45,
        r: 0.4 + Math.random() * 2.8,
        color: c.fill,
        glowColor: c.glow,
        glowR: 4 + Math.random() * 5,
        trail: [],
        trailLen: 0, // regular particles: no trail
      };
    });

    // spark particles — orbit near portal, have trails
    const sparkCount = Math.min(60, Math.floor(count * 0.17));
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 250;
      const c = Math.random() < 0.5 ? COLORS[0] : COLORS[1];
      ps.push({
        x: pcx() + Math.cos(angle) * dist,
        y: pcy() + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        a: 0.50 + Math.random() * 0.50,
        r: 0.6 + Math.random() * 1.6,
        spark: true,
        color: c.fill,
        glowColor: c.glow,
        glowR: 12 + Math.random() * 4,
        trail: [],
        trailLen: 3 + Math.floor(Math.random() * 3), // 3-5 trail segments
      });
    }

    // burst embers — rare, bright, with short trails
    const burstCount = Math.min(6, Math.floor(count * 0.02));
    for (let i = 0; i < burstCount; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        a: 0.75 + Math.random() * 0.25,
        r: 2.5 + Math.random() * 2,
        burst: true,
        color: "255,179,71",
        glowColor: "255,179,71",
        glowR: 18 + Math.random() * 8,
        trail: [],
        trailLen: 2,
      });
    }

    let mouseX = w / 2, mouseY = h / 2;
    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = pcx(), cy = pcy();

      for (const p of ps) {
        // vortex force toward portal center
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.max(60, Math.sqrt(dx * dx + dy * dy));
        const force = p.spark ? 0.0025 : 0.0008;

        // tangential component for orbital swirl
        const nx = dx / dist, ny = dy / dist;
        const tx = -ny, ty = nx; // perpendicular
        const tangentForce = p.spark ? 0.0018 : 0.0005;

        p.vx += nx * force + tx * tangentForce;
        p.vy += ny * force + ty * tangentForce;

        // gentle mouse attraction
        const mdx = mouseX - p.x;
        const mdy = mouseY - p.y;
        const md = Math.max(80, Math.sqrt(mdx * mdx + mdy * mdy));
        p.vx += (mdx / md) * 0.0008;
        p.vy += (mdy / md) * 0.0008;

        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;
        if (p.y < -50) p.y = h + 50;
        if (p.y > h + 50) p.y = -50;

        p.vx *= 0.992;
        p.vy *= 0.992;

        // update trail
        if (p.trailLen > 0) {
          p.trail.unshift({ x: p.x, y: p.y });
          if (p.trail.length > p.trailLen) p.trail.pop();
        }

        // draw trail
        if (p.trail.length > 1) {
          for (let t = 1; t < p.trail.length; t++) {
            const trailAlpha = p.a * (1 - t / p.trail.length) * 0.5;
            const trailR = p.r * (1 - t / p.trail.length * 0.5);
            ctx.beginPath();
            ctx.arc(p.trail[t].x, p.trail[t].y, trailR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${trailAlpha})`;
            ctx.fill();
          }
        }

        // velocity-based brightness boost
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const dynAlpha = Math.min(1, p.a + speed * 0.8);

        // draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${dynAlpha})`;
        ctx.shadowColor = `rgba(${p.glowColor},0.55)`;
        ctx.shadowBlur = p.glowR;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-10 opacity-[0.90]" />;
}
