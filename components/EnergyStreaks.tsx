"use client";

import { useEffect, useRef } from "react";

type Streak = {
  angle: number;       // direction toward center
  dist: number;        // current distance from portal center
  startDist: number;   // spawn distance
  len: number;         // streak length in pixels
  speed: number;
  opacity: number;
  width: number;
  color: string;
};

const STREAK_COLORS = [
  "209,166,104",
  "255,179,71",
  "252,227,164",
];

function createStreak(w: number, h: number): Streak {
  const angle = Math.random() * Math.PI * 2;
  const maxDim = Math.max(w, h);
  const startDist = 400 + Math.random() * (maxDim * 0.5);
  return {
    angle,
    dist: startDist,
    startDist,
    len: 80 + Math.random() * 220,
    speed: 0.15 + Math.random() * 0.45,
    opacity: 0.04 + Math.random() * 0.14,
    width: 0.6 + Math.random() * 1.8,
    color: STREAK_COLORS[Math.floor(Math.random() * STREAK_COLORS.length)],
  };
}

export function EnergyStreaks() {
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

    const streakCount = 18;
    const streaks: Streak[] = Array.from({ length: streakCount }, () => createStreak(w, h));

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h * 0.42;

      for (const s of streaks) {
        s.dist -= s.speed;

        // when streak reaches near center, recycle it
        if (s.dist < 60) {
          Object.assign(s, createStreak(w, h));
          continue;
        }

        // perspective: streaks fade and shrink as they get closer
        const progress = 1 - (s.dist / s.startDist);
        const perspAlpha = s.opacity * (0.3 + progress * 0.7);
        const perspWidth = s.width * (0.5 + progress * 0.5);

        // streak endpoints along the angle toward center
        const cos = Math.cos(s.angle);
        const sin = Math.sin(s.angle);
        const x1 = cx + cos * s.dist;
        const y1 = cy + sin * s.dist;
        const x2 = cx + cos * (s.dist + s.len);
        const y2 = cy + sin * (s.dist + s.len);

        // draw with gradient fade
        const grad = ctx.createLinearGradient(x2, y2, x1, y1);
        grad.addColorStop(0, `rgba(${s.color},0)`);
        grad.addColorStop(0.3, `rgba(${s.color},${perspAlpha * 0.6})`);
        grad.addColorStop(0.7, `rgba(${s.color},${perspAlpha})`);
        grad.addColorStop(1, `rgba(${s.color},${perspAlpha * 0.3})`);

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = grad;
        ctx.lineWidth = perspWidth;
        ctx.shadowColor = `rgba(${s.color},${perspAlpha * 0.4})`;
        ctx.shadowBlur = 8 + perspWidth * 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-20 opacity-100" />;
}
