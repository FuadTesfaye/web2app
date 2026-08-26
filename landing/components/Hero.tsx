"use client";

import React, { useState } from "react";
import { ArrowRight, Terminal, Sparkles } from "lucide-react";
import FloatingLanguages from "./FloatingLanguages";
import { playClick, playTone } from "../lib/sound";

export default function Hero() {
  const [floatMode, setFloatMode] = useState<"wobble" | "orbit" | "chaos">("wobble");

  const handleModeChange = (mode: "wobble" | "orbit" | "chaos") => {
    setFloatMode(mode);
    playClick();
    if (mode === "orbit") playTone(750, "sine", 0.08);
    if (mode === "chaos") playTone(900, "triangle", 0.08);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden border-b-3 border-ink">
      
      {/* BACKGROUND DECORATIVE RETRO BLOBS */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 w-[28rem] h-[28rem] bg-accent-yellow/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-28 -left-28 w-[28rem] h-[28rem] bg-accent-pink/30 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-pattern opacity-70"></div>
      </div>

      {/* FLOATING LANGUAGES CANVAS */}
      <FloatingLanguages mode={floatMode} />

      {/* HERO CENTER CARD */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 bg-surface border-3 border-ink px-4 py-1.5 rounded-full shadow-neo-sm mb-6 sm:mb-8 font-mono text-xs sm:text-sm font-black uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse"></span>
          <span>Next-Gen App Packaging Engine</span>
          <span className="bg-accent-yellow px-1.5 py-0.5 rounded border border-ink text-[10px]">
            v0.1.0
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight uppercase mb-6 sm:mb-8">
          Turn Any{" "}
          <span className="bg-accent-yellow px-3 py-0.5 border-3 border-ink shadow-neo-sm inline-block rotate-[-1.5deg]">
            Web App
          </span>{" "}
          <br className="hidden sm:inline" />
          Into{" "}
          <span className="bg-accent-pink text-ink px-3 py-0.5 border-3 border-ink shadow-neo-sm inline-block rotate-[2deg]">
            Native Apps
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans font-bold text-base sm:text-xl lg:text-2xl max-w-2xl text-ink/85 mb-8 sm:mb-10 leading-relaxed">
          Convert your <strong>Next.js, Vite, React, Python</strong> site or{" "}
          <strong>any live web URL</strong> into standalone applications for{" "}
          <span className="underline decoration-accent-green decoration-4 underline-offset-4">Android</span>,{" "}
          <span className="underline decoration-accent-cyan decoration-4 underline-offset-4">Windows</span>,{" "}
          <span className="underline decoration-accent-pink decoration-4 underline-offset-4">Debian</span>, and{" "}
          <span className="underline decoration-accent-purple decoration-4 underline-offset-4">Arch Linux</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10 sm:mb-12">
          <a
            href="#demo"
            onClick={playClick}
            className="w-full sm:w-auto bg-accent-yellow text-ink px-8 py-4 rounded-2xl border-3 border-ink shadow-neo-md hover:shadow-neo-lg hover:translate-x-[-3px] hover:translate-y-[-3px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-display font-black text-lg sm:text-xl tracking-tight transition-all flex items-center justify-center gap-3"
          >
            <span>⚡ Launch Converter</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </a>

          <a
            href="#cli-section"
            onClick={playClick}
            className="w-full sm:w-auto bg-surface text-ink px-7 py-4 rounded-2xl border-3 border-ink shadow-neo-md hover:shadow-neo-lg hover:bg-accent-cyan/30 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-mono font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2"
          >
            <Terminal className="w-5 h-5" />
            <span>npx web2app</span>
          </a>
        </div>

        {/* Floating Physics Controls */}
        <div className="inline-flex items-center gap-2 bg-surface/95 backdrop-blur border-2 border-ink px-3 py-1.5 rounded-xl shadow-neo-xs font-mono text-xs font-semibold">
          <span className="text-ink/60">Languages Physics:</span>
          <button
            onClick={() => handleModeChange("wobble")}
            className={`px-2.5 py-1 rounded-lg border border-ink text-xs font-bold transition-all ${
              floatMode === "wobble"
                ? "bg-accent-yellow shadow-neo-xs"
                : "bg-surface hover:bg-accent-yellow/50"
            }`}
          >
            Wobble ✨
          </button>
          <button
            onClick={() => handleModeChange("orbit")}
            className={`px-2.5 py-1 rounded-lg border border-ink text-xs font-bold transition-all ${
              floatMode === "orbit"
                ? "bg-accent-cyan shadow-neo-xs"
                : "bg-surface hover:bg-accent-cyan/50"
            }`}
          >
            Orbit 🪐
          </button>
          <button
            onClick={() => handleModeChange("chaos")}
            className={`px-2.5 py-1 rounded-lg border border-ink text-xs font-bold transition-all ${
              floatMode === "chaos"
                ? "bg-accent-pink shadow-neo-xs"
                : "bg-surface hover:bg-accent-pink/50"
            }`}
          >
            Drift 🎈
          </button>
        </div>

      </div>

    </section>
  );
}
