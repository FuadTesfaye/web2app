"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { playClick } from "@/lib/sound";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "How does web2app generate the app/ directory?",
    a: "When you run web2app build or convert any live URL, web2app generates a root app/ directory containing subfolders for /android, /windows, /debian, and /arch. Each subfolder contains complete standalone packages and native wrappers.",
  },
  {
    q: "Can I convert any live website or only local code?",
    a: "Both! You can pass any live URL (e.g. npx web2app https://example.com) or run web2app inside your local Next.js, Vite, React, Vue, Python, or static HTML project.",
  },
  {
    q: "Do I need Android Studio or dpkg installed to build?",
    a: "No! web2app includes a pure TypeScript Debian package generator (.deb) and Windows wrapper generator that works on any OS. For Android, it exports the complete native wrapper project ready for Gradle or Android Studio whenever needed.",
  },
  {
    q: "How does Android handle CORS and local web assets?",
    a: "web2app uses AndroidX WebViewAssetLoader, which maps local HTML/JS/CSS assets to a secure origin (https://appassets.androidplatform.net/assets/). This gives your web app full access to localStorage, IndexedDB, Web APIs, and CORS-free HTTP requests.",
  },
  {
    q: "What Windows versions and Linux distros are supported?",
    a: "On Windows, web2app runs on Windows 10 & 11 via MS Edge/WebView2. On Linux, it supports Debian, Ubuntu, Linux Mint, Pop!_OS via .deb packages, and Arch Linux, Manjaro, EndeavourOS via AUR PKGBUILD.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
    playClick();
  };

  return (
    <section id="faq" className="py-14 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-8 border-t-3 border-ink bg-surface text-ink w-full max-w-full">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-block bg-accent-yellow text-ink font-mono font-black text-[10px] sm:text-xs px-3 py-1 border-2 border-ink shadow-neo-xs uppercase tracking-widest mb-3">
            [// 07 FREQUENT_QUESTIONS]
          </div>
          <h2 className="font-display font-black text-2xl xs:text-3xl sm:text-5xl uppercase tracking-tighter px-2">
            Frequently Answered Inquiries
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-surface border-2 sm:border-3 border-ink shadow-neo-xs sm:shadow-neo-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-3.5 sm:p-5 text-left font-display font-black text-sm xs:text-base sm:text-lg uppercase flex items-center justify-between gap-3 hover:bg-accent-yellow/20 transition-colors"
                >
                  <span className="leading-snug break-words pr-2">{faq.q}</span>
                  <span className="w-7 h-7 sm:w-8 sm:h-8 bg-surface border-2 border-ink shadow-neo-xs flex items-center justify-center font-mono shrink-0 font-black">
                    {isOpen ? <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-3.5 sm:p-5 pt-0 font-sans font-semibold text-xs sm:text-sm text-ink-muted border-t-2 border-ink/15 leading-relaxed break-words">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
