"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { playClick } from "../lib/sound";

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
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t-3 border-ink bg-surface">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-accent-yellow text-ink font-mono font-black text-xs px-3 py-1 rounded-md border-2 border-ink shadow-neo-xs uppercase tracking-wider mb-3">
            Questions & Answers
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-surface border-3 border-ink rounded-2xl shadow-neo-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left font-display font-extrabold text-base sm:text-lg uppercase flex items-center justify-between gap-4 hover:bg-accent-yellow/20 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="w-8 h-8 rounded-xl bg-surface border-2 border-ink shadow-neo-xs flex items-center justify-center font-mono shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 font-sans font-semibold text-sm text-ink/80 border-t-2 border-ink/10 leading-relaxed">
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
