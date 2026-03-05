"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

/* ─── O-ring geometry helpers ──────────────────────────── */
// Build a slightly irregular annulus that reads as a stylised "O"
// — thicker at 6 o'clock, thinner at 12 o'clock (like molten gold pooling).
function oRingPath(cx: number, cy: number, outerR: number, innerR: number, wobble: number): string {
  const pts = 120;
  let d = "M";
  // outer loop
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const rVar = outerR + Math.sin(a * 3 + wobble) * 4 + Math.cos(a * 5 - wobble * 1.3) * 3;
    const x = cx + Math.cos(a) * rVar;
    const y = cy + Math.sin(a) * rVar;
    d += `${i === 0 ? "" : " L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += " Z M";
  // inner loop (winding reversed so it becomes a hole)
  for (let i = pts; i >= 0; i--) {
    const a = (i / pts) * Math.PI * 2;
    // thicker at bottom (a≈π/2), thinner at top
    const thicknessVar = 1 + Math.sin(a) * 0.13;
    const rVar = innerR * thicknessVar + Math.sin(a * 4 - wobble * 0.8) * 2.5 + Math.cos(a * 6 + wobble) * 2;
    const x = cx + Math.cos(a) * rVar;
    const y = cy + Math.sin(a) * rVar;
    d += `${i === pts ? "" : " L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += " Z";
  return d;
}

export function Portal() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.4 });
  const rotateX = useTransform(sy, [0, 1], [6, -6]);
  const rotateY = useTransform(sx, [0, 1], [-8, 8]);

  const { scrollY } = useScroll();
  const portalScale = useTransform(scrollY, [0, 600], [1, 0.82]);
  const portalOpacity = useTransform(scrollY, [0, 600], [1, 0.55]);
  const smoothScale = useSpring(portalScale, { stiffness: 80, damping: 20 });
  const smoothOpacity = useSpring(portalOpacity, { stiffness: 80, damping: 20 });

  // Canvas for inner concentric depth rings + particles orbiting in the void
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  /* inner depth canvas — concentric rings + orbiting embers */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const size = 600;
    c.width = size;
    c.height = size;
    const mid = size / 2;

    // small orbiting embers inside the void
    const embers = Array.from({ length: 40 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 20 + Math.random() * 100,
      speed: 0.002 + Math.random() * 0.006,
      r: 0.5 + Math.random() * 1.5,
      a: 0.3 + Math.random() * 0.5,
    }));

    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.008;
      ctx.clearRect(0, 0, size, size);

      // concentric depth rings — pulsing inward
      for (let i = 5; i >= 0; i--) {
        const baseR = 38 + i * 16;
        const pulse = Math.sin(t * 1.2 + i * 0.7) * 4;
        const r = baseR + pulse;
        const alpha = 0.06 + (5 - i) * 0.03 + Math.sin(t + i) * 0.015;
        ctx.beginPath();
        ctx.arc(mid, mid, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,179,71,${alpha})`;
        ctx.lineWidth = 0.8 + (5 - i) * 0.15;
        ctx.stroke();
      }

      // orbiting embers
      for (const e of embers) {
        e.angle += e.speed;
        const x = mid + Math.cos(e.angle) * e.dist;
        const y = mid + Math.sin(e.angle) * e.dist;
        ctx.beginPath();
        ctx.arc(x, y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(252,227,164,${e.a})`;
        ctx.shadowColor = "rgba(255,179,71,0.5)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const S = 600; // SVG viewport size
  const cx = S / 2, cy = S / 2;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      style={{ scale: smoothScale, opacity: smoothOpacity }}
    >
      {/* ambient gradient bloom behind portal */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 90% 70% at 50% 40%, rgba(255,179,71,0.22) 0%, rgba(209,166,104,0.10) 35%, transparent 65%),
          radial-gradient(ellipse 70% 50% at 50% 42%, rgba(252,227,164,0.12) 0%, transparent 55%),
          radial-gradient(ellipse 110% 75% at 50% 55%, rgba(184,115,43,0.16) 0%, transparent 55%),
          radial-gradient(ellipse at bottom, rgba(209,166,104,0.10) 0%, transparent 50%)
        `
      }} />

      {/* portal ring group — parallax mouse tilt */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
      >
        {/* ──── SVG liquid O-ring ──── */}
        <svg
          viewBox={`0 0 ${S} ${S}`}
          className="relative h-[560px] w-[560px]"
          style={{ filter: "drop-shadow(0 0 40px rgba(255,179,71,0.35)) drop-shadow(0 0 100px rgba(209,166,104,0.20))" }}
        >
          <defs>
            {/* animated turbulence for liquid wobble */}
            <filter id="oLiquid" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.015"
                numOctaves="3"
                seed="5"
                result="turb"
              >
                <animate attributeName="seed" values="1;8;3;10;5;1" dur="8s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="turb" scale="14" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="oLiquidOuter" x="-25%" y="-25%" width="150%" height="150%">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.012"
                numOctaves="2"
                seed="3"
                result="turb2"
              >
                <animate attributeName="seed" values="3;9;1;7;3" dur="10s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="turb2" scale="18" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="oGlow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="oGlowWide">
              <feGaussianBlur stdDeviation="22" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* radial gradient fill for molten O shape */}
            <radialGradient id="oFillGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB347" stopOpacity="0.05" />
              <stop offset="60%" stopColor="#FFB347" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#FCE3A4" stopOpacity="0.95" />
              <stop offset="92%" stopColor="#FFB347" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#B8732B" stopOpacity="0.2" />
            </radialGradient>

            {/* stroke gradient for the bright edge */}
            <linearGradient id="oStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCE3A4" />
              <stop offset="30%" stopColor="#FFB347" />
              <stop offset="60%" stopColor="#F7D28A" />
              <stop offset="100%" stopColor="#D1A668" />
            </linearGradient>
          </defs>

          {/* Layer 0: wide atmospheric haze ring */}
          <g filter="url(#oGlowWide)" opacity="0.40">
            <circle cx={cx} cy={cy} r="265" fill="none" stroke="rgba(255,179,71,0.25)" strokeWidth="80"
              style={{ maskImage: "radial-gradient(circle, black 50%, transparent 80%)" }}
            />
          </g>

          {/* Layer 1: outer diffused molten ring (heavily turbulenced) */}
          <g filter="url(#oLiquidOuter)" opacity="0.55">
            <path
              d={oRingPath(cx, cy, 240, 175, 0.5)}
              fill="url(#oFillGrad)"
              stroke="none"
            >
              <animateTransform attributeName="transform" type="rotate" values={`0 ${cx} ${cy};360 ${cx} ${cy}`} dur="30s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Layer 2: primary liquid O shape — filled annulus with turbulence */}
          <g filter="url(#oLiquid)" opacity="0.90">
            <path
              d={oRingPath(cx, cy, 230, 168, 0)}
              fill="url(#oFillGrad)"
              stroke="url(#oStrokeGrad)"
              strokeWidth="2"
            >
              <animateTransform attributeName="transform" type="rotate" values={`0 ${cx} ${cy};-360 ${cx} ${cy}`} dur="25s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Layer 3: bright inner stroke ring — animated dash for liquid crawl */}
          <g filter="url(#oGlow)" opacity="0.85">
            <circle
              cx={cx} cy={cy} r="182"
              fill="none"
              stroke="#FCE3A4"
              strokeWidth="2.5"
              strokeDasharray="18 24 8 30"
              opacity="0.7"
            >
              <animateTransform attributeName="transform" type="rotate" values={`0 ${cx} ${cy};360 ${cx} ${cy}`} dur="12s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Layer 4: hot ember sparkle ring — dashed, counter-rotating */}
          <g filter="url(#oGlow)" opacity="0.65">
            <circle
              cx={cx} cy={cy} r="220"
              fill="none"
              stroke="#FFB347"
              strokeWidth="1.8"
              strokeDasharray="4 40 2 50 6 35"
              opacity="0.8"
            >
              <animateTransform attributeName="transform" type="rotate" values={`360 ${cx} ${cy};0 ${cx} ${cy}`} dur="18s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Layer 5: outermost faint haze ring */}
          <g filter="url(#oGlowWide)" opacity="0.30">
            <circle
              cx={cx} cy={cy} r="256"
              fill="none"
              stroke="#D1A668"
              strokeWidth="1.2"
              strokeDasharray="12 60 4 45"
              opacity="0.5"
            >
              <animateTransform attributeName="transform" type="rotate" values={`0 ${cx} ${cy};360 ${cx} ${cy}`} dur="35s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>

        {/* ──── inner canvas: concentric depth rings + orbiting embers ──── */}
        <canvas
          ref={canvasRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 340, height: 340, mixBlendMode: "screen" }}
        />

        {/* dark event-horizon center */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ scale: [1, 1.03, 1], opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(9,3,1,0.95) 0%, rgba(9,3,1,0.88) 35%, rgba(82,44,15,0.12) 58%, rgba(184,115,43,0.06) 72%, transparent 90%)",
            boxShadow:
              "inset 0 0 90px 30px rgba(9,3,1,0.7), 0 0 60px 10px rgba(255,179,71,0.10), 0 0 140px 50px rgba(209,166,104,0.06)",
          }}
        />
      </motion.div>

      {/* horizon glow beneath portal */}
      <div className="absolute left-1/2 top-[70%] h-[320px] w-[1400px] -translate-x-1/2 rounded-[999px] blur-[80px] opacity-55"
           style={{ background: "radial-gradient(circle, rgba(252,227,164,0.22), rgba(209,166,104,0.08) 45%, transparent 75%)" }}
      />
      <div className="absolute left-1/2 top-[68%] h-[180px] w-[900px] -translate-x-1/2 rounded-[999px] blur-[50px] opacity-35"
           style={{ background: "radial-gradient(circle, rgba(255,179,71,0.16), rgba(184,115,43,0.05) 50%, transparent 75%)" }}
      />

      {/* warm edge ambiance */}
      <div className="absolute inset-0"
           style={{ background: "radial-gradient(ellipse 130% 90% at 50% 45%, transparent 25%, rgba(184,115,43,0.08) 55%, transparent 80%)" }}
      />
    </motion.div>
  );
}
