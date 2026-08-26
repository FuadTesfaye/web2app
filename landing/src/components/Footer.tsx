"use client";

import React, { useState } from "react";
import { Send, Check, BookOpen } from "lucide-react";
import { playClick, playTone } from "@/lib/sound";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    playClick();
    playTone(700, "sine", 0.1);
  };

  return (
    <footer className="bg-[#0C0D10] text-white border-t-3 border-ink py-12 sm:py-16 px-3 sm:px-6 lg:px-8 font-mono text-xs w-full max-w-full">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-12 w-full">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Logo & Bio */}
          <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent-yellow text-ink border-2 border-white flex items-center justify-center font-display font-black text-lg sm:text-xl shrink-0">
                ⚡
              </div>
              <div className="min-w-0">
                <span className="font-display font-black text-lg sm:text-xl text-white block uppercase tracking-tight truncate">
                  web2app
                </span>
                <span className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wider block truncate">
                  // Web to Native App Packaging Engine
                </span>
              </div>
            </div>
            <p className="text-gray-400 font-sans text-xs sm:text-sm font-semibold max-w-sm leading-relaxed">
              Convert Next.js, React, Vite, and live web URLs into standalone native Android, Windows, Debian, and Arch apps with zero runtime bloat.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-2 font-bold uppercase">
            <span className="text-accent-yellow font-black text-xs uppercase mb-1 tracking-wider">
              [Navigation]
            </span>
            <a href="/docs" className="text-accent-yellow hover:text-white transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>[00] Documentation</span>
            </a>
            <a href="/#demo" className="text-gray-400 hover:text-white transition-colors">
              [01] Live Studio
            </a>
            <a href="/#platforms" className="text-gray-400 hover:text-white transition-colors">
              [02] Platform Targets
            </a>
            <a href="/#components" className="text-gray-400 hover:text-white transition-colors">
              [03] UI Kit Tokens
            </a>
            <a href="/#benchmarks" className="text-gray-400 hover:text-white transition-colors">
              [04] Benchmarks
            </a>
            <a href="/#faq" className="text-gray-400 hover:text-white transition-colors">
              [05] FAQ
            </a>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 flex flex-col gap-2.5 sm:gap-3 w-full">
            <span className="text-accent-pink font-black text-xs uppercase tracking-wider">
              [Updates // Release Radar]
            </span>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Get notified when new platform targets (macOS & Flatpak) drop.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="bg-[#1A1C21] border-2 border-gray-700 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-accent-yellow min-w-0 flex-1"
              />
              <button
                type="submit"
                className="btn-sharp bg-accent-yellow text-ink px-3.5 sm:px-4 py-2 font-black border-2 border-white shadow-neo-xs hover:bg-accent-yellow/90 uppercase tracking-wider shrink-0 flex items-center justify-center"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-[11px] text-center sm:text-left">
          <div>
            <span>MIT License © 2026 web2app.</span>
            <span className="ml-2 hidden xs:inline text-gray-500">Architectural Brutalism System.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1.5 font-bold uppercase text-[10px] sm:text-[11px]">
              <span className="w-2 h-2 bg-accent-green animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
