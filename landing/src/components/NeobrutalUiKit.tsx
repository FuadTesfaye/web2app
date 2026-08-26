"use client";

import React, { useState } from "react";
import { Star, Zap, Shield, Flame } from "lucide-react";
import { playClick, playTone } from "@/lib/sound";
import { THEMES, ThemeOption } from "./Navbar";

export default function NeobrutalUiKit() {
  const [offlineChecked, setOfflineChecked] = useState(true);
  const [gpuChecked, setGpuChecked] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(false);
  const [rating, setRating] = useState(5);
  const [likeCount, setLikeCount] = useState(128);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    playClick();
    playTone(600, "triangle", 0.08);
  };

  const handleThemeSwitchFromKit = (theme: ThemeOption) => {
    THEMES.forEach((t) => document.documentElement.classList.remove(t.id));
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme.id);
    document.documentElement.classList.add(theme.dark ? "dark" : "light");
    localStorage.setItem("theme", theme.id);
    playClick();
    playTone(theme.dark ? 440 : 660, "triangle", 0.08);
  };

  return (
    <section id="components" className="py-14 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-8 border-t-3 border-ink bg-surface text-ink transition-colors w-full max-w-full">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-block bg-accent-yellow text-ink font-mono font-black text-[10px] sm:text-xs px-3 py-1 border-2 border-ink shadow-neo-xs uppercase tracking-widest mb-3">
            [// 04 DESIGN_TOKENS]
          </div>
          <h2 className="font-display font-black text-2xl xs:text-3xl sm:text-5xl uppercase tracking-tighter px-2">
            Architectural NeoBrutalism Kit
          </h2>
          <p className="font-sans font-bold text-xs sm:text-lg text-ink-muted max-w-xl mx-auto mt-2 sm:mt-3 px-2">
            Pure geometry with zero border-radius, high-contrast borders, multi-theme presets, and tactile drop shadows.
          </p>
        </div>

        {/* Components Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          
          {/* COMPONENT 1: BUTTONS */}
          <div className="bg-surface border-3 border-ink p-5 sm:p-6 shadow-neo-sm sm:shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-3 sm:mb-4">
                <span>Tactile Buttons</span>
                <span className="bg-accent-yellow text-ink px-2 py-0.5 border border-ink text-[10px]">[Atoms]</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={playClick}
                  className="btn-sharp px-3 sm:px-4 py-1.5 sm:py-2 bg-accent-yellow text-ink border-2 border-ink font-mono font-black text-[11px] sm:text-xs shadow-neo-xs uppercase tracking-wider"
                >
                  ⚡ Yellow
                </button>
                <button
                  onClick={playClick}
                  className="btn-sharp px-3 sm:px-4 py-1.5 sm:py-2 bg-accent-pink text-ink border-2 border-ink font-mono font-black text-[11px] sm:text-xs shadow-neo-xs uppercase tracking-wider"
                >
                  💖 Pink
                </button>
                <button
                  onClick={playClick}
                  className="btn-sharp px-3 sm:px-4 py-1.5 sm:py-2 bg-accent-cyan text-ink border-2 border-ink font-mono font-black text-[11px] sm:text-xs shadow-neo-xs uppercase tracking-wider"
                >
                  🚀 Cyan
                </button>
                <button
                  onClick={playClick}
                  className="btn-sharp px-3 sm:px-4 py-1.5 sm:py-2 bg-ink text-surface border-2 border-ink font-mono font-black text-[11px] sm:text-xs shadow-neo-xs uppercase tracking-wider"
                >
                  ★ Stark Ink
                </button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[10px] sm:text-[11px] font-mono font-bold text-ink-muted">
              Classes: <code>shadow-neo-xs active:translate-x-0.5</code>
            </div>
          </div>

          {/* COMPONENT 2: STICKERS & BADGES */}
          <div className="bg-surface border-3 border-ink p-5 sm:p-6 shadow-neo-sm sm:shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-3 sm:mb-4">
                <span>Stickers & Tags</span>
                <span className="bg-accent-pink text-ink px-2 py-0.5 border border-ink text-[10px]">[Badges]</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-accent-green text-ink px-2.5 sm:px-3 py-1 border-2 border-ink font-mono font-black text-[10px] sm:text-xs shadow-neo-xs rotate-[-2deg] inline-flex items-center gap-1 uppercase">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 100% OFFLINE
                </span>
                <span className="bg-accent-purple text-ink px-2.5 sm:px-3 py-1 border-2 border-ink font-mono font-black text-[10px] sm:text-xs shadow-neo-xs rotate-[2deg] inline-flex items-center gap-1 uppercase">
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> ZERO CONFIG
                </span>
                <span className="bg-accent-yellow text-ink px-2 sm:px-2.5 py-1 border-2 border-ink font-mono font-black text-[10px] sm:text-xs shadow-neo-xs inline-flex items-center gap-1 uppercase">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-pink-dark" /> POPULAR
                </span>
                <span className="bg-ink text-surface px-2.5 sm:px-3 py-1 border-2 border-ink font-mono font-black text-[10px] sm:text-xs shadow-neo-xs uppercase">
                  STANDALONE
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[10px] sm:text-[11px] font-mono font-bold text-ink-muted">
              Zero border-radius rotated stickers
            </div>
          </div>

          {/* COMPONENT 3: TACTILE SWITCHES & TOGGLES */}
          <div className="bg-surface border-3 border-ink p-5 sm:p-6 shadow-neo-sm sm:shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-3 sm:mb-4">
                <span>Tactile Switches</span>
                <span className="bg-accent-cyan text-ink px-2 py-0.5 border border-ink text-[10px]">[Controls]</span>
              </div>
              <div className="flex flex-col gap-2">
                {/* Checkbox 1 */}
                <label className="flex items-center justify-between p-2.5 bg-surface border-2 border-ink cursor-pointer hover:bg-accent-yellow/20 transition-colors shadow-neo-xs">
                  <span className="font-mono text-[11px] sm:text-xs font-black uppercase truncate mr-2">Offline Cache</span>
                  <input
                    type="checkbox"
                    checked={offlineChecked}
                    onChange={(e) => {
                      setOfflineChecked(e.target.checked);
                      playClick();
                    }}
                    className="w-4 h-4 accent-ink cursor-pointer shrink-0"
                  />
                </label>

                {/* Checkbox 2 */}
                <label className="flex items-center justify-between p-2.5 bg-surface border-2 border-ink cursor-pointer hover:bg-accent-pink/20 transition-colors shadow-neo-xs">
                  <span className="font-mono text-[11px] sm:text-xs font-black uppercase truncate mr-2">GPU Rendering</span>
                  <input
                    type="checkbox"
                    checked={gpuChecked}
                    onChange={(e) => {
                      setGpuChecked(e.target.checked);
                      playClick();
                    }}
                    className="w-4 h-4 accent-ink cursor-pointer shrink-0"
                  />
                </label>

                {/* Tactile Slider Switch */}
                <div 
                  onClick={() => {
                    setHapticEnabled(!hapticEnabled);
                    playClick();
                  }}
                  className="flex items-center justify-between p-2.5 bg-surface border-2 border-ink cursor-pointer hover:bg-accent-green/20 transition-colors shadow-neo-xs select-none"
                >
                  <span className="font-mono text-[11px] sm:text-xs font-black uppercase truncate mr-2">Haptic Engine</span>
                  <div className={`w-11 sm:w-12 h-5 sm:h-6 border-2 border-ink flex items-center p-0.5 transition-colors shrink-0 ${
                    hapticEnabled ? "bg-accent-green justify-end" : "bg-surface-subtle justify-start"
                  }`}>
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-ink border border-ink shadow-neo-xs"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[10px] sm:text-[11px] font-mono font-bold text-ink-muted">
              Tactile slide switches & sharp checkboxes
            </div>
          </div>

          {/* COMPONENT 4: LIVE PALETTE SELECTOR */}
          <div className="bg-surface border-3 border-ink p-5 sm:p-6 shadow-neo-sm sm:shadow-neo-md lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-2.5 sm:mb-3">
                <span>Theme Presets & Palette Switches</span>
                <span className="bg-accent-green text-ink px-2 py-0.5 border border-ink text-[10px]">[Theme Engine]</span>
              </div>
              <p className="font-sans text-xs sm:text-sm font-semibold text-ink-muted mb-3 leading-relaxed">
                Click any palette below to instantly switch the entire page theme dynamically:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSwitchFromKit(theme)}
                    className="btn-sharp p-2 sm:p-2.5 bg-surface border-2 border-ink shadow-neo-xs hover:bg-accent-yellow/20 flex items-center gap-2 text-left font-mono text-[11px] sm:text-xs font-bold transition-all min-w-0"
                  >
                    <span
                      className="w-3.5 h-3.5 border border-ink shrink-0 shadow-[1px_1px_0px_0px_var(--shadow-color)]"
                      style={{ backgroundColor: theme.color }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-ink truncate">{theme.name}</span>
                      <span className="text-[9px] sm:text-[10px] text-ink-muted uppercase">{theme.badge}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[10px] sm:text-[11px] font-mono font-bold text-ink-muted">
              Live multi-theme CSS variable injection
            </div>
          </div>

          {/* COMPONENT 5: RATING & STAT CARD */}
          <div className="bg-surface border-3 border-ink p-5 sm:p-6 shadow-neo-sm sm:shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-2.5 sm:mb-3">
                <span>Interactive Rating</span>
                <span className="bg-accent-purple text-ink px-2 py-0.5 border border-ink text-[10px]">[Widget]</span>
              </div>
              
              <div className="p-3.5 sm:p-4 bg-surface border-2 border-ink text-center flex flex-col items-center shadow-neo-xs">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setRating(star);
                        playClick();
                        playTone(500 + star * 100, "sine", 0.08);
                      }}
                      className="p-0.5 sm:p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          star <= rating
                            ? "fill-accent-yellow text-ink stroke-[2]"
                            : "text-ink-muted/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="font-display font-black text-xl sm:text-2xl uppercase">
                  {rating}.0 / 5.0 Rating
                </span>
                
                <button
                  onClick={handleLike}
                  className="btn-sharp mt-2.5 sm:mt-3 px-3 py-1.5 bg-surface text-ink border-2 border-ink font-mono text-xs font-black shadow-neo-xs flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <span>{isLiked ? "❤️ Liked!" : "🤍 Like"}</span>
                  <span className="bg-accent-pink text-ink px-1.5 py-0.2 border border-ink text-[10px]">
                    {likeCount}
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[10px] sm:text-[11px] font-mono font-bold text-ink-muted">
              Interactive stateful widgets
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
