"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Menu, X, ChevronDown, Check, Sparkles, Palette, BookOpen } from "lucide-react";
import { playClick, playTone, setMuted, getMuted } from "@/lib/sound";

export interface ThemeOption {
  id: string;
  name: string;
  color: string;
  badge: string;
  dark: boolean;
  icon: string;
}

export const THEMES: ThemeOption[] = [
  { id: "theme-default", name: "Neo Retro", color: "#FFE600", badge: "Default", dark: false, icon: "⚡" },
  { id: "theme-cyber", name: "Cyber Neon", color: "#00F0FF", badge: "Cyber", dark: true, icon: "🚀" },
  { id: "theme-bubblegum", name: "Bubblegum", color: "#FF69B4", badge: "Pastel", dark: false, icon: "💖" },
  { id: "theme-dark", name: "Dark Brutal", color: "#121212", badge: "Obsidian", dark: true, icon: "🌙" },
  { id: "theme-emerald", name: "Emerald Matrix", color: "#80FF72", badge: "Matrix", dark: true, icon: "💻" },
  { id: "theme-sunset", name: "Sunset Amber", color: "#FF5E36", badge: "80s Synth", dark: true, icon: "🌅" },
];

export default function Navbar() {
  const [muted, setIsMuted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>(THEMES[0]);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMuted(getMuted());
    const saved = localStorage.getItem("theme");
    let matchedTheme = THEMES[0];

    if (saved) {
      if (saved === "dark") {
        matchedTheme = THEMES.find((t) => t.id === "theme-dark") || THEMES[3];
      } else if (saved === "light") {
        matchedTheme = THEMES[0];
      } else {
        matchedTheme = THEMES.find((t) => t.id === saved) || THEMES[0];
      }
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        matchedTheme = THEMES.find((t) => t.id === "theme-dark") || THEMES[3];
      }
    }

    setCurrentTheme(matchedTheme);
    applyThemeClasses(matchedTheme);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyThemeClasses = (theme: ThemeOption) => {
    THEMES.forEach((t) => document.documentElement.classList.remove(t.id));
    document.documentElement.classList.remove("light", "dark");

    document.documentElement.classList.add(theme.id);
    document.documentElement.classList.add(theme.dark ? "dark" : "light");
  };

  const handleSelectTheme = (theme: ThemeOption) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme.id);
    applyThemeClasses(theme);
    setThemeMenuOpen(false);
    playClick();
    playTone(theme.dark ? 440 : 660, "triangle", 0.08);
  };

  const handleSoundToggle = () => {
    const next = !muted;
    setIsMuted(next);
    setMuted(next);
    if (!next) playTone(600, "triangle", 0.08);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b-3 border-ink px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-colors w-full max-w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <a 
          href="/" 
          onClick={playClick}
          className="flex items-center gap-2 sm:gap-3 group focus-visible:outline-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent-yellow text-ink border-2 sm:border-3 border-ink shadow-neo-xs sm:shadow-neo-sm flex items-center justify-center font-display font-black text-lg sm:text-2xl group-hover:rotate-6 transition-transform shrink-0">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-lg sm:text-2xl tracking-tighter leading-none flex items-center gap-1 sm:gap-1.5 uppercase text-ink">
              web2app
              <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-accent-pink text-ink border border-ink px-1 sm:px-1.5 py-0.2 shadow-neo-xs">
                v0.1
              </span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted hidden xs:inline">
              // Native App Compiler
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 font-mono font-bold text-xs uppercase tracking-wider text-ink">
          <a
            href="/#demo"
            onClick={playClick}
            className="px-2.5 py-1.5 hover:bg-accent-yellow hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [01] Studio
          </a>
          <a
            href="/#platforms"
            onClick={playClick}
            className="px-2.5 py-1.5 hover:bg-accent-cyan hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [02] Platforms
          </a>
          <a
            href="/#components"
            onClick={playClick}
            className="px-2.5 py-1.5 hover:bg-accent-pink hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [03] UI Kit
          </a>
          <a
            href="/#benchmarks"
            onClick={playClick}
            className="px-2.5 py-1.5 hover:bg-accent-purple hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [04] Benchmarks
          </a>
          <a
            href="/#faq"
            onClick={playClick}
            className="px-2.5 py-1.5 hover:bg-accent-green hover:text-ink border-2 border-transparent hover:border-ink transition-all"
          >
            [05] FAQ
          </a>
          <a
            href="/docs"
            onClick={playClick}
            className="px-3 py-1.5 bg-accent-yellow text-ink border-2 border-ink shadow-neo-xs hover:bg-accent-yellow/90 transition-all flex items-center gap-1.5 font-black ml-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>[06] Docs</span>
          </a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Sound FX Toggle */}
          <button
            onClick={handleSoundToggle}
            title={muted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:p-2 bg-surface text-ink border-2 border-ink shadow-neo-xs hover:bg-accent-yellow hover:text-ink active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center shrink-0"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Theme Dropdown Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setThemeMenuOpen(!themeMenuOpen);
                playClick();
              }}
              title="Switch Color Theme"
              className="btn-sharp px-2 sm:px-3 py-1.5 sm:py-2 bg-surface text-ink border-2 border-ink shadow-neo-xs hover:bg-surface-subtle active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs font-bold shrink-0"
            >
              <span
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 border border-ink shadow-[1px_1px_0px_0px_var(--shadow-color)] shrink-0"
                style={{ backgroundColor: currentTheme.color }}
              />
              <span className="hidden sm:inline font-black uppercase tracking-tight">
                {currentTheme.name}
              </span>
              <ChevronDown
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${
                  themeMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {themeMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 sm:w-56 max-w-[calc(100vw-1.5rem)] bg-surface text-ink border-3 border-ink shadow-neo-md z-50 p-2 flex flex-col gap-1 font-mono text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1 text-[10px] font-black uppercase text-ink-muted border-b border-ink/20 mb-1 flex items-center justify-between">
                  <span>// Select Theme</span>
                  <Palette className="w-3 h-3 text-accent-yellow" />
                </div>
                {THEMES.map((theme) => {
                  const isSelected = currentTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme)}
                      className={`flex items-center justify-between px-2.5 py-2 border-2 transition-all text-left ${
                        isSelected
                          ? "bg-accent-yellow text-ink border-ink shadow-neo-xs font-black"
                          : "bg-surface hover:bg-surface-subtle border-transparent hover:border-ink/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3.5 h-3.5 border border-ink shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]"
                          style={{ backgroundColor: theme.color }}
                        />
                        <span className="text-xs truncate">{theme.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[9px] px-1 py-0.2 border border-ink/40 bg-surface text-ink opacity-80 uppercase">
                          {theme.badge}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA Studio Button */}
          <a
            href="/#demo"
            onClick={playClick}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-accent-yellow text-ink border-2 sm:border-3 border-ink shadow-neo-xs sm:shadow-neo-sm hover:shadow-neo-md active:translate-x-[1px] active:translate-y-[1px] font-display font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-tight transition-all items-center gap-1 sm:gap-1.5 shrink-0 hidden xs:flex"
          >
            <span>Studio</span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              playClick();
            }}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-1.5 sm:p-2 bg-surface text-ink border-2 border-ink shadow-neo-xs shrink-0"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2.5 pt-2.5 border-t-2 border-ink flex flex-col gap-2 font-mono font-bold text-xs uppercase bg-surface text-ink p-3 border-2 border-ink shadow-neo-md max-w-full">
          <a
            href="/docs"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 bg-accent-yellow text-ink border-2 border-ink shadow-neo-xs flex items-center justify-between font-black"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>[06] Documentation Portal</span>
            </span>
            <span className="text-[10px] bg-surface text-ink px-1.5 py-0.2 border border-ink">READ</span>
          </a>

          <a
            href="/#demo"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-yellow hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[01] Live Studio</span>
          </a>
          <a
            href="/#platforms"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-cyan hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[02] 4 Target Platforms</span>
          </a>
          <a
            href="/#components"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-pink hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[03] Neobrutal UI Kit</span>
          </a>
          <a
            href="/#benchmarks"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-purple hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[04] Benchmarks</span>
          </a>
          <a
            href="/#faq"
            onClick={() => {
              setMobileMenuOpen(false);
              playClick();
            }}
            className="px-3 py-2.5 hover:bg-accent-green hover:text-ink border border-ink/30 flex items-center gap-2"
          >
            <span>[05] FAQ</span>
          </a>

          {/* Mobile Theme Selector Grid */}
          <div className="mt-2 pt-2 border-t-2 border-ink/20">
            <span className="text-[10px] font-black text-ink-muted uppercase block mb-2">
              // Choose Palette Theme:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {THEMES.map((theme) => {
                const isSelected = currentTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      handleSelectTheme(theme);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-2 py-2 border-2 text-[11px] font-bold transition-colors ${
                      isSelected
                        ? "bg-accent-yellow text-ink border-ink shadow-neo-xs font-black"
                        : "bg-surface border-ink/30 hover:border-ink text-ink"
                    }`}
                  >
                    <span
                      className="w-3 h-3 border border-ink shrink-0"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className="truncate">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
