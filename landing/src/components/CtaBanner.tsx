"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { playClick, playSuccessChime } from "@/lib/sound";

export default function CtaBanner() {
  const handleClick = () => {
    playClick();
    playSuccessChime();
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-accent-yellow text-ink border-t-3 border-ink">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        
        <div className="w-16 h-16 bg-surface border-3 border-ink shadow-neo-sm flex items-center justify-center text-3xl mb-6 rotate-[-3deg] hover:rotate-3 transition-transform font-black">
          ⚡
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter mb-4">
          Ready to Ship Native Multi-Platform Apps?
        </h2>

        <p className="font-sans font-bold text-base sm:text-xl text-ink/85 max-w-xl mb-8 leading-relaxed">
          Run your first conversion in 10 seconds. Zero config, zero dependencies, 100% native performance.
        </p>

        <a
          href="#demo"
          onClick={handleClick}
          className="btn-sharp bg-surface text-ink px-10 py-5 border-4 border-ink shadow-neo-md hover:shadow-neo-lg font-display font-black text-xl tracking-tight transition-all flex items-center gap-3 uppercase"
        >
          <span>🚀 Get Started With web2app</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </a>
      </div>
    </section>
  );
}
