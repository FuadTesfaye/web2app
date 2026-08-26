"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Menu, X, ChevronDown, Sparkles, Terminal } from "lucide-react";
import { playClick, playTone, setMuted, getMuted } from "../lib/sound";

interface ThemeOption {
  id: string;
  name: string;
  color: string;
}

const themes: ThemeOption[] = [
  { id: "theme-default", name: "Neo Retro", color: "#FFE600" },
  { id: "theme-cyber", name: "Cyber Neon", color: "#00F0FF" },
  { id: "theme-bubblegum", name: "Bubblegum", color: "#FF70A6" },
  { id: "theme-dark", name: "Dark Brutal", color: "#121212" },
  { id: "theme-emerald", name: "Emerald Matrix", color: "#80FF72" },
];

export default function Navbar() {
  const [muted, setIsMuted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>(themes[0]);
  const [themeOpen, setThemeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMuted(getMuted());
  }, []);

  const handleSoundToggle = () => {
    const next = !muted;
    setIsMuted(next);
    setMuted(next);
    if (!next) playTone(600, "triangle", 0.08);
  };

  const handleThemeSelect = (t: ThemeOption) => {
    setCurrentTheme(t);
    document.documentElement.className = t.id;
    setThemeOpen(false);
    playClick();
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b-3 border-ink px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#" 
          onClick={playClick}
          className="flex items-center gap-3 group focus-visible:outline-none"
        >
          <div className="w-10 h-10 bg-accent-yellow border-3 border-ink rounded-xl shadow-neo-sm flex items-center justify-center font-display font-black text-2xl group-hover:rotate-6 group-hover:scale-105 transition-all">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight leading-none flex items-center gap-1.5">
              web2app
              <span className="text-[10px] font-mono font-bold bg-accent-pink text-ink border-2 border-ink px-1.5 py-0.5 rounded shadow-neo-xs">
                v0.1
              </span>
            </span>
            <span className="text-[11px] font-mono font-semibold text-ink/70 hidden sm:inline-block">
              Web to Native App Engine
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 font-mono font-bold text-sm">
          <a
            href="#demo"
            onClick={playClick}
            className="px-3 py-1.5 rounded-lg hover:bg-accent-yellow/40 border-2 border-transparent hover:border-ink transition-all"
          >
            Live Studio
          </a>
          <a
            href="#platforms"
            onClick={playClick}
            className="px-3 py-1.5 rounded-lg hover:bg-accent-cyan/40 border-2 border-transparent hover:border-ink transition-all"
          >
            Platforms
          </a>
          <a
            href="#components"
            onClick={playClick}
            className="px-3 py-1.5 rounded-lg hover:bg-accent-pink/40 border-2 border-transparent hover:border-ink transition-all"
          >
            UI Kit
          </a>
          <a
            href="#benchmarks"
            onClick={playClick}
            className="px-3 py-1.5 rounded-lg hover:bg-accent-purple/40 border-2 border-transparent hover:border-ink transition-all"
          >
            Benchmarks
          </a>
          <a
            href="#faq"
            onClick={playClick}
            className="px-3 py-1.5 rounded-lg hover:bg-accent-green/40 border-2 border-transparent hover:border-ink transition-all"
          >
            FAQ
          </a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound FX Toggle */}
          <button
            onClick={handleSoundToggle}
            title={muted ? "Unmute sound FX" : "Mute sound FX"}
            className="p-2 rounded-xl bg-surface text-ink border-2 border-ink shadow-neo-xs hover:bg-accent-yellow active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setThemeOpen(!themeOpen);
                playClick();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-surface text-ink border-2 border-ink shadow-neo-xs font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-accent-cyan/30 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span
                className="w-3 h-3 rounded-full border border-ink"
                style={{ backgroundColor: currentTheme.color }}
              />
              <span className="hidden sm:inline">{currentTheme.name}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {themeOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border-3 border-ink rounded-xl shadow-neo-md z-50 p-1.5 flex flex-col gap-1 font-mono text-xs font-bold">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeSelect(t)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-accent-yellow border-2 border-transparent hover:border-ink text-left transition-all"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-ink"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <a
            href="#demo"
            onClick={playClick}
            className="px-3.5 sm:px-5 py-2 rounded-xl bg-accent-yellow text-ink border-3 border-ink shadow-neo-sm hover:shadow-neo-md hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display font-black text-xs sm:text-sm tracking-tight transition-all flex items-center gap-1.5"
          >
            <span>Try Demo</span>
            <Sparkles className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              playClick();
            }}
            className="md:hidden p-2 rounded-xl bg-surface border-2 border-ink shadow-neo-xs"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t-2 border-ink flex flex-col gap-2 font-mono font-bold text-sm bg-surface p-3 rounded-xl border-2 border-ink shadow-neo-md">
          <a
            href="#demo"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2 rounded-lg hover:bg-accent-yellow/50 border border-ink/20 flex items-center gap-2"
          >
            <span>🚀 Live Studio</span>
          </a>
          <a
            href="#platforms"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2 rounded-lg hover:bg-accent-cyan/50 border border-ink/20 flex items-center gap-2"
          >
            <span>💻 4 Target Platforms</span>
          </a>
          <a
            href="#components"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2 rounded-lg hover:bg-accent-pink/50 border border-ink/20 flex items-center gap-2"
          >
            <span>🎨 Neobrutal UI Kit</span>
          </a>
          <a
            href="#benchmarks"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2 rounded-lg hover:bg-accent-purple/50 border border-ink/20 flex items-center gap-2"
          >
            <span>📊 Benchmarks</span>
          </a>
          <a
            href="#faq"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2 rounded-lg hover:bg-accent-green/50 border border-ink/20 flex items-center gap-2"
          >
            <span>❓ FAQ</span>
          </a>
        </div>
      )}
    </header>
  );
}
