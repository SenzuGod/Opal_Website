"use client";

import { motion } from "framer-motion";

export function LevelSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative z-50 mx-auto max-w-6xl px-4 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-10"
      >
        <div className="mb-3 inline-flex items-center gap-2 border border-ember-50/10 bg-black/30 px-3 py-1 text-[11px] tracking-[0.25em] uppercase text-ember-50/60 backdrop-blur"
             style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
        >
          <span className="h-1.5 w-1.5 bg-ember-hot/80 animate-flicker" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
          {eyebrow}
        </div>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-ember-50 text-glow">
          {title}
        </h2>
      </motion.div>

      {children}
    </section>
  );
}
