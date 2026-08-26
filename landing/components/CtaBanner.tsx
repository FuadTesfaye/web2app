"use client";

import React from "react";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { playClick, playSuccessChime } from "../lib/sound";

export default function CtaBanner() {
  const handleClick = () => {
    playClick();
    playSuccessChime();
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-accent-yellow border-t-3 border-ink">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        
        <div className="w-16 h-16 bg-surface border-3 border-ink rounded-3xl shadow-neo-sm flex items-center justify-center text-3xl mb-6 rotate-[-4deg] hover:rotate-6 transition-transform">
          ⚡
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight mb-4">
          Ready to Ship Native Multi-Platform Apps?
        </h2>

        <p className="font-sans font-bold text-base sm:text-xl text-ink/85 max-w-xl mb-8 leading-relaxed">
          Run your first conversion in 10 seconds. Zero config, zero dependencies, 100% native performance.
        </p>

        <a
          href="#demo"
          onClick={handleClick}
          className="bg-surface text-ink px-10 py-5 rounded-2xl border-4 border-ink shadow-neo-md hover:shadow-neo-lg hover:translate-x-[-3px] hover:translate-y-[-3px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-display font-black text-xl tracking-tight transition-all flex items-center gap-3"
        >
          <span>🚀 Get Started With web2app</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </a>
      </div>
    </section>
  );
}
