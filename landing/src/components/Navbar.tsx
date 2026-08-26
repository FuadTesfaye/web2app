"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Menu, X, Sun, Moon, Sparkles, Terminal } from "lucide-react";
import { playClick, playTone, setMuted, getMuted } from "@/lib/sound";

export default function Navbar() {
  const [muted, setIsMuted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMuted(getMuted());
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      playTone(400, "sine", 0.08);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      playTone(700, "triangle", 0.08);
    }
  };

  const handleSoundToggle = () => {
    const next = !muted;
    setIsMuted(next);
    setMuted(next);
    if (!next) playTone(600, "triangle", 0.08);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b-3 border-ink px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#" 
          onClick={playClick}
          className="flex items-center gap-3 group focus-visible:outline-none"
        >
          <div className="w-10 h-10 bg-accent-yellow text-ink border-3 border-ink shadow-neo-sm flex items-center justify-center font-display font-black text-2xl group-hover:rotate-6 transition-transform">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl sm:text-2xl tracking-tighter leading-none flex items-center gap-1.5 uppercase">
              web2app
              <span className="text-[10px] font-mono font-bold bg-accent-pink text-ink border-2 border-ink px-1.5 py-0.2 shadow-neo-xs">
                v0.1
              </span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
              // Native App Compiler
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 font-mono font-bold text-xs uppercase tracking-wider">
          <a
            href="#demo"
            onClick={playClick}
            className="px-3 py-2 hover:bg-accent-yellow hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [01] Live Studio
          </a>
          <a
            href="#platforms"
            onClick={playClick}
            className="px-3 py-2 hover:bg-accent-cyan hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [02] Platforms
          </a>
          <a
            href="#components"
            onClick={playClick}
            className="px-3 py-2 hover:bg-accent-pink hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [03] UI Kit
          </a>
          <a
            href="#benchmarks"
            onClick={playClick}
            className="px-3 py-2 hover:bg-accent-purple hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [04] Benchmarks
          </a>
          <a
            href="#faq"
            onClick={playClick}
            className="px-3 py-2 hover:bg-accent-green hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [05] FAQ
          </a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            title={muted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 bg-surface text-ink border-2 border-ink shadow-neo-xs hover:bg-accent-yellow hover:text-ink active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 bg-surface text-ink border-2 border-ink shadow-neo-xs hover:bg-accent-cyan hover:text-ink active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center font-mono text-xs font-bold gap-1.5"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
                <span className="hidden sm:inline">LIGHT</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-ink" />
                <span className="hidden sm:inline">DARK</span>
              </>
            )}
          </button>

          {/* CTA Button */}
          <a
            href="#demo"
            onClick={playClick}
            className="px-4 py-2 bg-accent-yellow text-ink border-3 border-ink shadow-neo-sm hover:shadow-neo-md hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display font-black text-xs sm:text-sm uppercase tracking-tight transition-all flex items-center gap-1.5"
          >
            <span>Run Studio</span>
            <Sparkles className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              playClick();
            }}
            className="md:hidden p-2 bg-surface text-ink border-2 border-ink shadow-neo-xs"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t-2 border-ink flex flex-col gap-2 font-mono font-bold text-xs uppercase bg-surface text-ink p-3 border-2 border-ink shadow-neo-md">
          <a
            href="#demo"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-yellow hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[01] Live Studio</span>
          </a>
          <a
            href="#platforms"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-cyan hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[02] 4 Target Platforms</span>
          </a>
          <a
            href="#components"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-pink hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[03] Neobrutal UI Kit</span>
          </a>
          <a
            href="#benchmarks"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-purple hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[04] Benchmarks</span>
          </a>
          <a
            href="#faq"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-green hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[05] FAQ</span>
          </a>
        </div>
      )}
    </header>
  );
}
