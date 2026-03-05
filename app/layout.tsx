import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opal — AI Gaming Companion",
  description: "An AI companion that plays with you, coaches you, and turns every session into a quest.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise scanlines text-ember-50">
        {/* global atmospheric light — burning amber, high contrast */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" style={{
          background: `
            radial-gradient(ellipse 1600px 1000px at 50% 38%, rgba(255,179,71,0.20) 0%, transparent 60%),
            radial-gradient(ellipse 1200px 800px at 50% 42%, rgba(252,227,164,0.10) 0%, transparent 50%),
            radial-gradient(ellipse 1400px 700px at 50% 50%, rgba(184,115,43,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 1000px 600px at 50% 45%, rgba(209,166,104,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 2000px 400px at 50% 70%, rgba(184,115,43,0.08) 0%, transparent 65%)
          `
        }} />
        {/* atmospheric fog band at horizon level */}
        <div className="pointer-events-none fixed inset-x-0 top-[55%] z-0 h-[300px]" aria-hidden="true" style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(184,115,43,0.06) 30%, rgba(209,166,104,0.04) 60%, transparent 100%)",
          filter: "blur(40px)",
        }} />
        {children}
        <div className="vignette" style={{ opacity: 0.95 }} />
      </body>
    </html>
  );
}
