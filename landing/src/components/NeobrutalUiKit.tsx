"use client";

import React, { useState } from "react";
import { Star, Check, Sparkles, AlertCircle, Zap, Shield, Flame } from "lucide-react";
import { playClick, playTone } from "@/lib/sound";

export default function NeobrutalUiKit() {
  const [offlineChecked, setOfflineChecked] = useState(true);
  const [gpuChecked, setGpuChecked] = useState(true);
  const [rating, setRating] = useState(5);
  const [likeCount, setLikeCount] = useState(128);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    playClick();
    playTone(600, "triangle", 0.08);
  };

  return (
    <section id="components" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t-3 border-ink bg-surface text-ink">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-accent-yellow text-ink font-mono font-black text-xs px-3 py-1 border-2 border-ink shadow-neo-xs uppercase tracking-widest mb-3">
            [// 04 DESIGN_TOKENS]
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter">
            Architectural NeoBrutalism Kit
          </h2>
          <p className="font-sans font-bold text-base sm:text-lg text-ink-muted max-w-xl mx-auto mt-3">
            Pure geometry with zero border-radius, high-contrast borders, and tactile drop shadows.
          </p>
        </div>

        {/* Components Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* COMPONENT 1: BUTTONS */}
          <div className="bg-surface border-3 border-ink p-6 shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-4">
                <span>Tactile Buttons</span>
                <span className="bg-accent-yellow text-ink px-2 py-0.5 border border-ink">[Atoms]</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={playClick}
                  className="btn-sharp px-4 py-2 bg-accent-yellow text-ink border-2 border-ink font-mono font-black text-xs shadow-neo-xs hover:shadow-neo-sm uppercase tracking-wider"
                >
                  ⚡ Primary Yellow
                </button>
                <button
                  onClick={playClick}
                  className="btn-sharp px-4 py-2 bg-accent-pink text-ink border-2 border-ink font-mono font-black text-xs shadow-neo-xs hover:shadow-neo-sm uppercase tracking-wider"
                >
                  💖 Vivid Pink
                </button>
                <button
                  onClick={playClick}
                  className="btn-sharp px-4 py-2 bg-accent-cyan text-ink border-2 border-ink font-mono font-black text-xs shadow-neo-xs hover:shadow-neo-sm uppercase tracking-wider"
                >
                  🚀 Cyan Button
                </button>
                <button
                  onClick={playClick}
                  className="btn-sharp px-4 py-2 bg-ink text-surface border-2 border-ink font-mono font-black text-xs shadow-neo-xs hover:shadow-neo-sm uppercase tracking-wider"
                >
                  ★ Stark Ink
                </button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-bold text-ink-muted">
              Classes: <code>shadow-neo-xs active:translate-x-0.5</code>
            </div>
          </div>

          {/* COMPONENT 2: STICKERS & BADGES */}
          <div className="bg-surface border-3 border-ink p-6 shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-4">
                <span>Stickers & Tags</span>
                <span className="bg-accent-pink text-ink px-2 py-0.5 border border-ink">[Badges]</span>
              </div>
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="bg-accent-green text-ink px-3 py-1 border-2 border-ink font-mono font-black text-xs shadow-neo-xs rotate-[-2deg] inline-flex items-center gap-1 uppercase">
                  <Shield className="w-3.5 h-3.5" /> 100% OFFLINE
                </span>
                <span className="bg-accent-purple text-ink px-3 py-1 border-2 border-ink font-mono font-black text-xs shadow-neo-xs rotate-[2deg] inline-flex items-center gap-1 uppercase">
                  <Zap className="w-3.5 h-3.5" /> ZERO CONFIG
                </span>
                <span className="bg-accent-yellow text-ink px-2.5 py-1 border-2 border-ink font-mono font-black text-xs shadow-neo-xs inline-flex items-center gap-1 uppercase">
                  <Flame className="w-3.5 h-3.5 text-accent-pink-dark" /> POPULAR
                </span>
                <span className="bg-ink text-surface px-3 py-1 border-2 border-ink font-mono font-black text-xs shadow-neo-xs uppercase">
                  STANDALONE
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-bold text-ink-muted">
              Zero border-radius rotated stickers
            </div>
          </div>

          {/* COMPONENT 3: TACTILE SWITCHES */}
          <div className="bg-surface border-3 border-ink p-6 shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-4">
                <span>Tactile Toggles</span>
                <span className="bg-accent-cyan text-ink px-2 py-0.5 border border-ink">[Controls]</span>
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between p-3 bg-surface border-2 border-ink cursor-pointer hover:bg-accent-yellow/20 transition-colors shadow-neo-xs">
                  <span className="font-mono text-xs font-black uppercase">Offline Cache Mode</span>
                  <input
                    type="checkbox"
                    checked={offlineChecked}
                    onChange={(e) => {
                      setOfflineChecked(e.target.checked);
                      playClick();
                    }}
                    className="w-5 h-5 accent-ink cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-surface border-2 border-ink cursor-pointer hover:bg-accent-pink/20 transition-colors shadow-neo-xs">
                  <span className="font-mono text-xs font-black uppercase">GPU Acceleration</span>
                  <input
                    type="checkbox"
                    checked={gpuChecked}
                    onChange={(e) => {
                      setGpuChecked(e.target.checked);
                      playClick();
                    }}
                    className="w-5 h-5 accent-ink cursor-pointer"
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-bold text-ink-muted">
              Square tactile checkbox states
            </div>
          </div>

          {/* COMPONENT 4: ALERT BANNER */}
          <div className="bg-surface border-3 border-ink p-6 shadow-neo-md lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-3">
                <span>Alert Banner Card</span>
                <span className="bg-accent-green text-ink px-2 py-0.5 border border-ink">[Feedback]</span>
              </div>
              <div className="p-4 sm:p-5 bg-accent-yellow text-ink border-3 border-ink shadow-neo-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-surface border-2 border-ink flex items-center justify-center text-xl shrink-0 font-black">
                  💡
                </div>
                <div>
                  <h4 className="font-display font-black text-base uppercase">
                    Zero Runtime Boilerplate Overhead
                  </h4>
                  <p className="font-sans text-xs sm:text-sm font-semibold text-ink/85 mt-1 leading-relaxed">
                    Unlike Cordova or Electron, web2app requires zero extra SDK configuration files. Just pass your web URL or folder, and you get native packages instantly.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-bold text-ink-muted">
              High contrast alert container
            </div>
          </div>

          {/* COMPONENT 5: RATING & STAT CARD */}
          <div className="bg-surface border-3 border-ink p-6 shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider mb-3">
                <span>Interactive Rating</span>
                <span className="bg-accent-purple text-ink px-2 py-0.5 border border-ink">[Widget]</span>
              </div>
              
              <div className="p-4 bg-surface border-2 border-ink text-center flex flex-col items-center shadow-neo-xs">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setRating(star);
                        playClick();
                        playTone(500 + star * 100, "sine", 0.08);
                      }}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? "fill-accent-yellow text-ink stroke-[2]"
                            : "text-ink-muted/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="font-display font-black text-2xl uppercase">
                  {rating}.0 / 5.0 Rating
                </span>
                
                <button
                  onClick={handleLike}
                  className="btn-sharp mt-3 px-3 py-1.5 bg-surface text-ink border-2 border-ink font-mono text-xs font-black shadow-neo-xs flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <span>{isLiked ? "❤️ Liked!" : "🤍 Like"}</span>
                  <span className="bg-accent-pink text-ink px-1.5 py-0.2 border border-ink text-[10px]">
                    {likeCount}
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-bold text-ink-muted">
              Interactive stateful widgets
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
