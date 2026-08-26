"use client";

import React, { useState } from "react";
import { ArrowRight, Terminal, Sparkles } from "lucide-react";
import FloatingLanguages from "./FloatingLanguages";
import { playClick, playTone } from "@/lib/sound";

export default function Hero() {
  const [floatMode, setFloatMode] = useState<"wobble" | "orbit" | "chaos">("wobble");

  const handleModeChange = (mode: "wobble" | "orbit" | "chaos") => {
    setFloatMode(mode);
    playClick();
    if (mode === "orbit") playTone(750, "sine", 0.08);
    if (mode === "chaos") playTone(900, "triangle", 0.08);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden border-b-3 border-ink bg-bg text-ink">
      
      {/* Background Dot Matrix */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-pattern opacity-80"></div>

      {/* Floating Languages Physics */}
      <FloatingLanguages mode={floatMode} />

      {/* Hero Center Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Eyebrow Stamp */}
        <div className="inline-flex items-center gap-2 bg-surface border-3 border-ink px-4 py-1.5 shadow-neo-sm mb-6 sm:mb-8 font-mono text-xs sm:text-sm font-black uppercase tracking-widest">
          <span className="w-2.5 h-2.5 bg-accent-green animate-pulse"></span>
          <span>[SYS::APP_COMPILER]</span>
          <span className="bg-accent-yellow text-ink px-1.5 py-0.2 border border-ink text-[10px] font-black">
            v0.1.0
          </span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tighter uppercase mb-6 sm:mb-8">
          Turn Any{" "}
          <span className="bg-accent-yellow text-ink px-3 py-0.5 border-3 border-ink shadow-neo-sm inline-block rotate-[-1.5deg]">
            Web App
          </span>{" "}
          <br className="hidden sm:inline" />
          Into{" "}
          <span className="bg-accent-pink text-ink px-3 py-0.5 border-3 border-ink shadow-neo-sm inline-block rotate-[2deg]">
            Native Apps
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans font-bold text-base sm:text-xl lg:text-2xl max-w-2xl text-ink-muted mb-8 sm:mb-10 leading-relaxed">
          Convert your <strong className="text-ink">Next.js, Vite, React, Python</strong> site or{" "}
          <strong className="text-ink">any live web URL</strong> into standalone applications for{" "}
          <span className="underline decoration-accent-green decoration-4 underline-offset-4 font-black text-ink">Android</span>,{" "}
          <span className="underline decoration-accent-cyan decoration-4 underline-offset-4 font-black text-ink">Windows</span>,{" "}
          <span className="underline decoration-accent-pink decoration-4 underline-offset-4 font-black text-ink">Debian</span>, and{" "}
          <span className="underline decoration-accent-purple decoration-4 underline-offset-4 font-black text-ink">Arch Linux</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10 sm:mb-12">
          <a
            href="#demo"
            onClick={playClick}
            className="btn-sharp w-full sm:w-auto bg-accent-yellow text-ink px-8 py-4 border-3 border-ink shadow-neo-md hover:shadow-neo-lg font-display font-black text-lg sm:text-xl tracking-tight transition-all flex items-center justify-center gap-3 uppercase"
          >
            <span>⚡ Launch Studio</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </a>

          <a
            href="#cli-section"
            onClick={playClick}
            className="btn-sharp w-full sm:w-auto bg-surface text-ink px-7 py-4 border-3 border-ink shadow-neo-md hover:shadow-neo-lg hover:bg-accent-cyan hover:text-ink font-mono font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Terminal className="w-4 h-4" />
            <span>&gt;_ npx web2app</span>
          </a>
        </div>

        {/* Physics Controls Bar */}
        <div className="inline-flex items-center gap-2 bg-surface border-2 border-ink px-3 py-1.5 shadow-neo-xs font-mono text-xs font-bold uppercase tracking-wider">
          <span className="text-ink-muted">[Physics]:</span>
          <button
            onClick={() => handleModeChange("wobble")}
            className={`px-2.5 py-1 border border-ink text-xs font-black transition-all ${
              floatMode === "wobble"
                ? "bg-accent-yellow text-ink shadow-neo-xs"
                : "bg-surface text-ink hover:bg-accent-yellow/40"
            }`}
          >
            Wobble ✨
          </button>
          <button
            onClick={() => handleModeChange("orbit")}
            className={`px-2.5 py-1 border border-ink text-xs font-black transition-all ${
              floatMode === "orbit"
                ? "bg-accent-cyan text-ink shadow-neo-xs"
                : "bg-surface text-ink hover:bg-accent-cyan/40"
            }`}
          >
            Orbit 🪐
          </button>
          <button
            onClick={() => handleModeChange("chaos")}
            className={`px-2.5 py-1 border border-ink text-xs font-black transition-all ${
              floatMode === "chaos"
                ? "bg-accent-pink text-ink shadow-neo-xs"
                : "bg-surface text-ink hover:bg-accent-pink/40"
            }`}
          >
            Drift 🎈
          </button>
        </div>

      </div>

    </section>
  );
}
