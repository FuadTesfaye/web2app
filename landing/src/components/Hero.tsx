"use client";

import React, { useState } from "react";
import { ArrowRight, Terminal } from "lucide-react";
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
    <section className="relative min-h-[85vh] sm:min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 overflow-hidden border-b-3 border-ink bg-bg text-ink w-full max-w-full">
      
      {/* Background Dot Matrix */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-pattern opacity-80 w-full"></div>

      {/* Floating Languages Physics */}
      <FloatingLanguages mode={floatMode} />

      {/* Hero Center Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center w-full">
        
        {/* Eyebrow Stamp */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-surface border-2 sm:border-3 border-ink px-3 sm:px-4 py-1 sm:py-1.5 shadow-neo-xs sm:shadow-neo-sm mb-5 sm:mb-8 font-mono text-[10px] xs:text-xs sm:text-sm font-black uppercase tracking-widest max-w-full">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent-green animate-pulse shrink-0"></span>
          <span className="truncate">[SYS::APP_COMPILER]</span>
          <span className="bg-accent-yellow text-ink px-1 sm:px-1.5 py-0.2 border border-ink text-[9px] sm:text-[10px] font-black shrink-0">
            v0.1.0
          </span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-display font-black text-3xl xs:text-4xl sm:text-6xl lg:text-7xl leading-[1.08] sm:leading-[1.02] tracking-tighter uppercase mb-5 sm:mb-8 break-words w-full">
          Turn Any{" "}
          <span className="bg-accent-yellow text-ink px-2 sm:px-3 py-0.5 border-2 sm:border-3 border-ink shadow-neo-xs sm:shadow-neo-sm inline-block rotate-[-1.5deg] whitespace-nowrap">
            Web App
          </span>{" "}
          <br className="hidden sm:inline" />
          Into{" "}
          <span className="bg-accent-pink text-ink px-2 sm:px-3 py-0.5 border-2 sm:border-3 border-ink shadow-neo-xs sm:shadow-neo-sm inline-block rotate-[2deg] whitespace-nowrap">
            Native Apps
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans font-bold text-sm sm:text-lg lg:text-xl max-w-2xl text-ink-muted mb-6 sm:mb-10 leading-relaxed px-2">
          Convert your <strong className="text-ink">Next.js, Vite, React, Python</strong> site or{" "}
          <strong className="text-ink">any live web URL</strong> into standalone applications for{" "}
          <span className="underline decoration-accent-green decoration-2 sm:decoration-4 underline-offset-2 sm:underline-offset-4 font-black text-ink">Android</span>,{" "}
          <span className="underline decoration-accent-cyan decoration-2 sm:decoration-4 underline-offset-2 sm:underline-offset-4 font-black text-ink">Windows</span>,{" "}
          <span className="underline decoration-accent-pink decoration-2 sm:decoration-4 underline-offset-2 sm:underline-offset-4 font-black text-ink">Debian</span>, and{" "}
          <span className="underline decoration-accent-purple decoration-2 sm:decoration-4 underline-offset-2 sm:underline-offset-4 font-black text-ink">Arch Linux</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-12 px-2">
          <a
            href="#demo"
            onClick={playClick}
            className="btn-sharp w-full sm:w-auto bg-accent-yellow text-ink px-6 sm:px-8 py-3.5 sm:py-4 border-2 sm:border-3 border-ink shadow-neo-sm sm:shadow-neo-md hover:shadow-neo-lg font-display font-black text-base sm:text-xl tracking-tight transition-all flex items-center justify-center gap-2 sm:gap-3 uppercase"
          >
            <span>⚡ Launch Studio</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
          </a>

          <a
            href="#cli-section"
            onClick={playClick}
            className="btn-sharp w-full sm:w-auto bg-surface text-ink px-5 sm:px-7 py-3.5 sm:py-4 border-2 sm:border-3 border-ink shadow-neo-sm sm:shadow-neo-md hover:shadow-neo-lg hover:bg-accent-cyan hover:text-ink font-mono font-bold text-xs sm:text-base transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Terminal className="w-4 h-4" />
            <span>&gt;_ npx web2app</span>
          </a>
        </div>

        {/* Physics Controls Bar */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-surface border-2 border-ink p-1.5 sm:px-3 sm:py-1.5 shadow-neo-xs font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider max-w-full">
          <span className="text-ink-muted hidden xs:inline">[Physics]:</span>
          <button
            onClick={() => handleModeChange("wobble")}
            className={`px-2 sm:px-2.5 py-1 border border-ink text-[11px] sm:text-xs font-black transition-all ${
              floatMode === "wobble"
                ? "bg-accent-yellow text-ink shadow-neo-xs"
                : "bg-surface text-ink hover:bg-accent-yellow/40"
            }`}
          >
            Wobble ✨
          </button>
          <button
            onClick={() => handleModeChange("orbit")}
            className={`px-2 sm:px-2.5 py-1 border border-ink text-[11px] sm:text-xs font-black transition-all ${
              floatMode === "orbit"
                ? "bg-accent-cyan text-ink shadow-neo-xs"
                : "bg-surface text-ink hover:bg-accent-cyan/40"
            }`}
          >
            Orbit 🪐
          </button>
          <button
            onClick={() => handleModeChange("chaos")}
            className={`px-2 sm:px-2.5 py-1 border border-ink text-[11px] sm:text-xs font-black transition-all ${
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
