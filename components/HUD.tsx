"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronRight } from "lucide-react";

const items = [
  { label: "SYSTEMS", href: "#systems" },
  { label: "COACH", href: "#coach" },
  { label: "SQUAD", href: "#squad" },
  { label: "JOIN", href: "#join" },
];

export function HUD() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.4 });

  return (
    <>
      {/* top progress bar */}
      <div className="fixed inset-x-0 top-0 z-[60]">
        <motion.div className="h-[2px] origin-left bg-ember-50/80" style={{ scaleX: bar }} />
      </div>

      {/* HUD nav */}
      <div className="fixed inset-x-0 top-[2px] z-[60]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="#" className="group flex items-center gap-2.5 shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-ember-50 shadow-glow animate-flicker" />
              <span className="text-base font-semibold tracking-[0.32em] uppercase text-ember-50/90 group-hover:text-ember-50 text-glow">
                OPAL
              </span>
            </a>
            <div className="hidden lg:block w-20 h-px bg-gradient-to-r from-ember-50/40 to-transparent" />
          </div>

          <nav className="hidden md:flex items-center gap-1 text-xs tracking-[0.25em] uppercase">
            {items.map((it, i) => (
              <span key={it.href} className="flex items-center gap-1">
                <a
                  href={it.href}
                  className="px-2 py-2 text-ember-50/60 hover:text-ember-50 transition-colors"
                >
                  {it.label}
                </a>
                {i < items.length - 1 && (
                  <span className="text-ember-50/25 select-none">&mdash;</span>
                )}
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block w-20 h-px bg-gradient-to-l from-ember-50/40 to-transparent" />
            <a
              href="#join"
              className="group inline-flex items-center gap-2 border border-ember-50/20 bg-ember-50/[0.06] px-5 py-2.5 text-xs tracking-[0.18em] uppercase text-ember-50/90 hover:bg-ember-50/[0.12] hover:border-ember-50/30 transition-colors rounded-sm"
              style={{ boxShadow: '0 0 12px rgba(252,227,164,0.08)' }}
            >
              Enter Beta <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* dual-line top rail with energy sweep */}
        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="h-px bg-gradient-to-r from-ember-50/5 via-ember-50/20 to-ember-50/5" />
          <div className="mt-px h-px bg-gradient-to-r from-transparent via-ember-50/10 to-transparent" />
          {/* energy sweep that travels across the rail */}
          <motion.div
            className="absolute top-0 h-[2px] w-32"
            animate={{ left: ["-8rem", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,179,71,0.6), rgba(252,227,164,0.8), rgba(255,179,71,0.6), transparent)" }}
          />
        </div>
      </div>

      <HUDCorners />
    </>
  );
}

function HUDCorners() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {/* top-left: segmented angular frame */}
      <svg className="absolute top-14 left-3 w-20 h-20 text-ember-50/40" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 5px rgba(252,227,164,0.20))' }}>
        <path d="M0 64 L0 12 L12 0 L64 0" />
        <path d="M0 56 L0 18 L14 4 L48 4" className="text-ember-50/15" stroke="currentColor" strokeDasharray="4 6" />
        {/* corner node */}
        <circle cx="12" cy="0" r="2" fill="currentColor" className="text-ember-50/50" />
      </svg>

      {/* top-right: segmented angular frame */}
      <svg className="absolute top-14 right-3 w-20 h-20 text-ember-50/40" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 5px rgba(252,227,164,0.20))' }}>
        <path d="M64 64 L64 12 L52 0 L0 0" />
        <path d="M64 56 L64 18 L50 4 L16 4" className="text-ember-50/15" stroke="currentColor" strokeDasharray="4 6" />
        <circle cx="52" cy="0" r="2" fill="currentColor" className="text-ember-50/50" />
      </svg>

      {/* bottom-left: heavier frame with inner double stroke */}
      <svg className="absolute bottom-3 left-3 w-24 h-24 text-ember-300/45" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ filter: 'drop-shadow(0 0 6px rgba(209,166,104,0.18))' }}>
        <path d="M0 0 L0 64 L16 80 L80 80" />
        <path d="M6 10 L6 58 L20 72 L72 72" className="text-ember-200/20" stroke="currentColor" strokeWidth="0.8" />
        <path d="M12 20 L12 52 L24 64 L64 64" className="text-ember-200/10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 5" />
        {/* corner accent nodes */}
        <circle cx="16" cy="80" r="2.5" fill="currentColor" className="text-ember-hot/40" />
        <rect x="0" y="28" width="3" height="1" fill="currentColor" className="text-ember-50/30" />
        <rect x="0" y="36" width="2" height="1" fill="currentColor" className="text-ember-50/20" />
      </svg>

      {/* bottom-right: heavier frame with inner double stroke */}
      <svg className="absolute bottom-3 right-3 w-24 h-24 text-ember-300/45" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ filter: 'drop-shadow(0 0 6px rgba(209,166,104,0.18))' }}>
        <path d="M80 0 L80 64 L64 80 L0 80" />
        <path d="M74 10 L74 58 L60 72 L8 72" className="text-ember-200/20" stroke="currentColor" strokeWidth="0.8" />
        <path d="M68 20 L68 52 L56 64 L16 64" className="text-ember-200/10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 5" />
        <circle cx="64" cy="80" r="2.5" fill="currentColor" className="text-ember-hot/40" />
        <rect x="77" y="28" width="3" height="1" fill="currentColor" className="text-ember-50/30" />
        <rect x="78" y="36" width="2" height="1" fill="currentColor" className="text-ember-50/20" />
      </svg>

      {/* top energy lines — dual with animated pulse */}
      <div className="absolute top-[72px] left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(209,166,104,0.25) 15%, rgba(255,179,71,0.35) 30%, transparent 50%, rgba(255,179,71,0.30) 70%, rgba(209,166,104,0.20) 85%, transparent 100%)' }} />
      <div className="absolute top-[74px] left-0 right-0 h-[1px] opacity-40" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(252,227,164,0.12) 25%, transparent 45%, rgba(252,227,164,0.16) 65%, transparent 90%)' }} />

      {/* bottom edge frame line */}
      <div className="absolute bottom-5 left-24 right-24 flex items-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ember-50/20 to-transparent" />
      </div>

      {/* bottom corner energy ticks */}
      <div className="absolute bottom-3 left-28 w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(255,179,71,0.35), transparent)' }} />
      <div className="absolute bottom-3 right-28 w-16 h-[1px]" style={{ background: 'linear-gradient(270deg, rgba(255,179,71,0.35), transparent)' }} />
    </div>
  );
}
