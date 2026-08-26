"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { playClick, playSuccessChime } from "@/lib/sound";

export default function CtaBanner() {
  const handleClick = () => {
    playClick();
    playSuccessChime();
  };

  return (
    <section className="py-14 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-8 bg-accent-yellow text-ink border-t-3 border-ink w-full max-w-full">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center w-full">
        
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-surface border-2 sm:border-3 border-ink shadow-neo-xs sm:shadow-neo-sm flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 rotate-[-3deg] hover:rotate-3 transition-transform font-black">
          ⚡
        </div>

        <h2 className="font-display font-black text-2xl xs:text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter mb-3 sm:mb-4 px-2 break-words">
          Ready to Ship Native Multi-Platform Apps?
        </h2>

        <p className="font-sans font-bold text-xs sm:text-lg lg:text-xl text-ink/85 max-w-xl mb-6 sm:mb-8 leading-relaxed px-2">
          Run your first conversion in 10 seconds. Zero config, zero dependencies, 100% native performance.
        </p>

        <a
          href="#demo"
          onClick={handleClick}
          className="btn-sharp w-full sm:w-auto bg-surface text-ink px-6 sm:px-10 py-3.5 sm:py-5 border-3 sm:border-4 border-ink shadow-neo-sm sm:shadow-neo-md hover:shadow-neo-lg font-display font-black text-base sm:text-xl tracking-tight transition-all flex items-center justify-center gap-2 sm:gap-3 uppercase"
        >
          <span>🚀 Get Started With web2app</span>
          <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" />
        </a>
      </div>
    </section>
  );
}
