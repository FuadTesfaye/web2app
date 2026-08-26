"use client";

import React, { useState } from "react";
import { Send, Check } from "lucide-react";
import { playClick, playTone } from "../lib/sound";

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
    <footer className="bg-[#121212] text-white border-t-3 border-ink py-16 px-4 sm:px-8 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Logo & Bio */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-yellow text-ink border-2 border-white rounded-xl flex items-center justify-center font-display font-black text-xl">
                ⚡
              </div>
              <div>
                <span className="font-display font-black text-xl text-white block">
                  web2app
                </span>
                <span className="text-gray-400 text-[11px]">
                  Web to Native Packaging Engine
                </span>
              </div>
            </div>
            <p className="text-gray-400 font-sans text-xs sm:text-sm font-semibold max-w-sm leading-relaxed">
              Convert Next.js, React, Vite, and live web URLs into standalone native Android, Windows, Debian, and Arch apps with zero runtime bloat.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-2 font-bold">
            <span className="text-accent-yellow font-black text-xs uppercase mb-1">
              Navigation
            </span>
            <a href="#demo" className="text-gray-300 hover:text-white transition-colors">
              Live Studio
            </a>
            <a href="#platforms" className="text-gray-300 hover:text-white transition-colors">
              Platform Targets
            </a>
            <a href="#components" className="text-gray-300 hover:text-white transition-colors">
              UI Kit Tokens
            </a>
            <a href="#benchmarks" className="text-gray-300 hover:text-white transition-colors">
              Benchmarks
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-accent-pink font-black text-xs uppercase">
              Stay In The Loop
            </span>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Get notified when new platform targets (macOS & Flatpak) drop.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="bg-[#222222] border-2 border-gray-600 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-accent-yellow w-full"
              />
              <button
                type="submit"
                className="bg-accent-yellow text-ink px-3 py-2 rounded-xl font-bold border-2 border-white shadow-neo-xs hover:bg-accent-yellow/90 active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div>
            <span>MIT License © 2026 web2app.</span>
            <span className="ml-2 text-gray-600">Inspired by NeoBrutalism UI System.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
