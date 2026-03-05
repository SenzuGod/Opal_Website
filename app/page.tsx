"use client";

import { motion } from "framer-motion";
import { HUD } from "@/components/HUD";
import { Portal } from "@/components/Portal";
import { Particles } from "@/components/Particles";
import { EnergyStreaks } from "@/components/EnergyStreaks";
import { LevelSection } from "@/components/LevelSection";
import { Bot, Mic, Radar, Zap, Swords, Shield, Gamepad2, ChevronRight, ChevronUp } from "lucide-react";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-void">
      {/* z-10 ambient particles */}
      <Particles />
      {/* z-20 converging energy streaks */}
      <EnergyStreaks />
      {/* z-30 portal O-ring */}
      <Portal />
      {/* z-60 HUD frame — always on top */}
      <HUD />

      {/* HERO: cinematic entry — full-width cinematic framing */}
      <div className="relative z-50 mx-auto max-w-6xl px-4 pt-36 md:pt-48 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 border border-ember-50/10 bg-black/30 px-4 py-2 backdrop-blur"
               style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
          >
            <span className="h-2 w-2 bg-ember-hot shadow-glow animate-flicker" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
            <span className="text-xs tracking-[0.25em] uppercase text-ember-50/60">
              AI Gaming Companion — MVP
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold leading-[1.02] tracking-tight text-ember-50 text-glow" style={{ textShadow: '0 0 40px rgba(255,179,71,0.50), 0 0 120px rgba(184,115,43,0.20)' }}>
            Not a website.
            <br />
            <span className="opacity-80">A portal.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-ember-50/55 leading-relaxed">
            Opal listens, watches, and adapts—coach mode, squad mode, lore mode.
            Your UI becomes a mission control overlay that evolves with every session.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <MagneticButton href="#join" primary>
              Initiate Link
            </MagneticButton>
            <MagneticButton href="#systems">
              View Systems <ChevronRight className="inline h-4 w-4 ml-1 opacity-70" />
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      {/* SCROLL TO ENTER DEEPER divider */}
      <div className="relative z-50 mx-auto max-w-6xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ember-50/15 to-ember-50/25" />
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-[11px] tracking-[0.3em] uppercase text-ember-50/60 whitespace-nowrap flex items-center gap-2"
          >
            Scroll to enter deeper
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronRight className="h-3.5 w-3.5 text-ember-50/50" />
            </motion.span>
          </motion.span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-ember-50/15 to-ember-50/25" />
        </motion.div>
      </div>

      {/* Feature cards with integrated stats */}
      <div className="relative z-50 mx-auto max-w-6xl px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Radar, title: "Awareness", desc: "Reads context: map state, goals, tempo.", stat: "Low" },
            { icon: Mic, title: "Comms", desc: "Natural voice callouts + instant summaries.", stat: "5+", statExtra: true },
            { icon: Zap, title: "Clutch", desc: "Micro-coaching when it matters most.", stat: "HUD" },
          ].map((x) => (
            <motion.div
              key={x.title}
              className="hud-card group relative border border-ember-50/[0.12] bg-black/45 backdrop-blur-md p-5 shadow-glow hover:border-ember-50/25 transition-colors"
              style={{
                boxShadow: '0 0 20px rgba(255,179,71,0.06), inset 0 -1px 0 rgba(255,179,71,0.12)',
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -6 }}
            >
              {/* HUD corner accents */}
              <span className="hud-corner hud-corner-tl" />
              <span className="hud-corner hud-corner-tr" />
              <span className="hud-corner hud-corner-bl" />
              <span className="hud-corner hud-corner-br" />

              <div className="flex items-center gap-3">
                <x.icon className="h-5 w-5 text-ember-50/90" />
                <div className="text-sm font-medium tracking-wide text-ember-50">{x.title}</div>
              </div>
              <div className="mt-2 text-sm text-ember-50/55 leading-relaxed">{x.desc}</div>

              {/* stat value at bottom */}
              <div className="mt-4 pt-3 border-t border-ember-50/10 flex items-center justify-center gap-1">
                <span className="text-lg font-semibold text-ember-200 text-glow">{x.stat}</span>
                {x.statExtra && <ChevronRight className="h-4 w-4 text-ember-300/70" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom center scroll chevron — golden with glow */}
      <div className="relative z-50 mx-auto flex justify-center pb-8">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-glow"
        >
          <ChevronUp className="h-8 w-8 text-ember-50/80" style={{ filter: 'drop-shadow(0 0 8px rgba(255,179,71,0.4))' }} />
        </motion.div>
      </div>

      {/* LEVELS */}
      <LevelSection id="systems" eyebrow="LEVEL 01" title="Tech styling that feels like gameplay">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HoloPanel
            title="Adaptive HUD"
            icon={Gamepad2}
            bullets={[
              "Overlays respond to what you're doing (fight / roam / build / loot).",
              "Scroll-driven 'enter deeper' transitions instead of page jumps.",
              "Micro-animations on every control—like a game menu.",
            ]}
          />
          <HoloPanel
            title="State Engine"
            icon={Bot}
            bullets={[
              "Companion persona + memory rails.",
              "Match telemetry hooks (MVP: simulated).",
              "Mode switcher: Coach / Squad / Lore / Chill.",
            ]}
          />
        </div>
      </LevelSection>

      <LevelSection id="coach" eyebrow="LEVEL 02" title="Coach mode: guidance that never breaks flow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MiniTile title="Callouts" icon={Mic} text="Short, timed, and situational—no spam." />
          <MiniTile title="Decision Trees" icon={Shield} text="Fast heuristics + confidence meter." />
          <MiniTile title="Post-Round" icon={Radar} text="Auto highlights, mistakes, next steps." />
        </div>
      </LevelSection>

      <LevelSection id="squad" eyebrow="LEVEL 03" title="Squad mode: your party's tactical backbone">
        <div className="hud-card relative border border-ember-50/[0.12] bg-black/40 backdrop-blur-md p-6 shadow-glow"
             style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
        >
          <span className="hud-corner hud-corner-tl" />
          <span className="hud-corner hud-corner-tr" />
          <span className="hud-corner hud-corner-bl" />
          <span className="hud-corner hud-corner-br" />
          <div className="flex items-center gap-3">
            <Swords className="h-5 w-5 text-ember-50/90" />
            <div className="text-sm tracking-wide text-ember-50">Live Squad Overlay (MVP)</div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlitchLine label="SYNC" value="STABLE" />
            <GlitchLine label="COMMS" value="PRIORITY ROUTING" />
            <GlitchLine label="ROLE" value="IGL ASSIST" />
            <GlitchLine label="FOCUS" value="OBJECTIVE WINDOW" />
          </div>
        </div>
      </LevelSection>

      <LevelSection id="join" eyebrow="FINAL" title="Enter the beta (fake MVP form)">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          <div className="md:col-span-3 hud-card relative border border-ember-50/[0.12] bg-black/40 backdrop-blur-md p-6 shadow-glow"
               style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
          >
            <span className="hud-corner hud-corner-tl" />
            <span className="hud-corner hud-corner-tr" />
            <span className="hud-corner hud-corner-bl" />
            <span className="hud-corner hud-corner-br" />
            <div className="text-sm text-ember-50/80">
              Drop an email and preferred game. Wire this to your backend later.
            </div>

            <form
              className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input placeholder="Email" />
              <Input placeholder="Game (e.g., Valorant)" />
              <div className="md:col-span-2">
                <Input placeholder="What should Opal help you with?" />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-2">
                <MagneticButton href="#" primary>
                  Request Access
                </MagneticButton>
                <MagneticButton href="#">
                  Watch Intro
                </MagneticButton>
              </div>
            </form>
          </div>

          <motion.div
            className="md:col-span-2 hud-card relative border border-ember-50/[0.12] bg-black/40 backdrop-blur-md p-6 shadow-glow"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs tracking-[0.25em] uppercase text-ember-50/60">System Status</div>
            <div className="mt-4 space-y-3 text-sm">
              <StatusRow k="Portal Link" v="ONLINE" />
              <StatusRow k="Companion Core" v="WARMING" />
              <StatusRow k="Telemetry" v="SIMULATED" />
              <StatusRow k="Voice Layer" v="READY" />
            </div>
          </motion.div>
        </div>

        <footer className="mt-12 pb-20 text-center text-xs text-ember-50/40">
          &copy; {new Date().getFullYear()} Opal. Built to feel like a game.
        </footer>
      </LevelSection>
    </main>
  );
}

/** --- UI bits --- */

function Input({ placeholder }: { placeholder: string }) {
  return (
    <input
      placeholder={placeholder}
      className="w-full border border-ember-50/10 bg-black/40 px-4 py-3 text-sm text-ember-50/90 placeholder:text-ember-50/35 outline-none focus:border-ember-50/25 focus:shadow-glow"
      style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}
    />
  );
}

function StatusRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border border-ember-50/10 bg-black/30 px-4 py-3"
         style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}
    >
      <span className="text-ember-50/60">{k}</span>
      <span className="text-ember-50/90">{v}</span>
    </div>
  );
}

function MiniTile({ title, text, icon: Icon }: { title: string; text: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
  return (
    <motion.div
      className="hud-card group relative border border-ember-50/[0.12] bg-black/40 p-6 backdrop-blur-md shadow-glow hover:border-ember-50/25 transition-colors"
      style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
      whileHover={{ y: -6 }}
    >
      <span className="hud-corner hud-corner-tl" />
      <span className="hud-corner hud-corner-tr" />
      <span className="hud-corner hud-corner-bl" />
      <span className="hud-corner hud-corner-br" />
      <Icon className="h-5 w-5 text-ember-50/90" />
      <div className="mt-3 text-sm text-ember-50">{title}</div>
      <div className="mt-1 text-sm text-ember-50/65">{text}</div>
    </motion.div>
  );
}

function HoloPanel({
  title,
  bullets,
  icon: Icon,
}: {
  title: string;
  bullets: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <motion.div
      className="hud-card relative border border-ember-50/[0.12] bg-black/40 p-7 backdrop-blur-md shadow-glow overflow-hidden"
      style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -6 }}
    >
      {/* holo sweep */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ x: ["-30%", "130%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(252,227,164,0.22) 45%, rgba(0,0,0,0) 90%)",
          transform: "skewX(-18deg)",
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-ember-50/90" />
          <div className="text-sm tracking-wide text-ember-50">{title}</div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-ember-50/65">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-ember-50/60" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function GlitchLine({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      className="border border-ember-50/10 bg-black/30 px-4 py-3 overflow-hidden relative"
      style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] tracking-[0.22em] uppercase text-ember-50/50">{label}</span>
        <span className="text-sm text-ember-50/90">{value}</span>
      </div>

      {/* glitch flick */}
      <motion.div
        className="absolute left-0 top-0 h-full w-24 opacity-20"
        animate={{ x: ["-30%", "140%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0), rgba(209,166,104,.45), rgba(0,0,0,0))",
        }}
      />
    </motion.div>
  );
}

function MagneticButton({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={[
        "inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide",
        "border backdrop-blur transition-colors",
        primary
          ? "border-ember-50/20 bg-ember-700/15 text-ember-50 shadow-glow hover:bg-ember-700/25"
          : "border-ember-50/10 bg-black/30 text-ember-50/85 hover:text-ember-50 hover:border-ember-50/20",
      ].join(" ")}
      style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
    >
      <span className="text-glow">{children}</span>
    </motion.a>
  );
}
