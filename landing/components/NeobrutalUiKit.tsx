"use client";

import React, { useState } from "react";
import { Star, Check, Sparkles, AlertCircle, Zap, Shield, Flame } from "lucide-react";
import { playClick, playTone } from "../lib/sound";

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
    <section id="components" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t-3 border-ink bg-surface">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-accent-yellow text-ink font-mono font-black text-xs px-3 py-1 rounded-md border-2 border-ink shadow-neo-xs uppercase tracking-wider mb-3">
            Design Tokens & Components
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
            Interactive NeoBrutalism UI Kit
          </h2>
          <p className="font-sans font-bold text-base sm:text-lg text-ink/75 max-w-xl mx-auto mt-3">
            Every component is crafted with thick solid borders, tactile drop shadows, and lively micro-interactions.
          </p>
        </div>

        {/* Components Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* COMPONENT 1: BUTTONS */}
          <div className="bg-surface border-3 border-ink rounded-3xl p-6 shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase mb-4">
                <span>Tactile Buttons</span>
                <span className="bg-accent-yellow px-2 py-0.5 rounded border border-ink">Atoms</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={playClick}
                  className="px-4 py-2 bg-accent-yellow text-ink border-2 border-ink rounded-xl font-mono font-bold text-xs shadow-neo-xs hover:shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  ⚡ Primary Yellow
                </button>
                <button
                  onClick={playClick}
                  className="px-4 py-2 bg-accent-pink text-ink border-2 border-ink rounded-xl font-mono font-bold text-xs shadow-neo-xs hover:shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  💖 Vivid Pink
                </button>
                <button
                  onClick={playClick}
                  className="px-4 py-2 bg-accent-cyan text-ink border-2 border-ink rounded-xl font-mono font-bold text-xs shadow-neo-xs hover:shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  🚀 Cyan Button
                </button>
                <button
                  onClick={playClick}
                  className="px-4 py-2 bg-ink text-white border-2 border-ink rounded-xl font-mono font-bold text-xs shadow-neo-xs hover:shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  ★ Stark Ink
                </button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-semibold text-ink/70">
              Classes: <code>shadow-neo-xs active:translate-x-0.5</code>
            </div>
          </div>

          {/* COMPONENT 2: STICKERS & BADGES */}
          <div className="bg-surface border-3 border-ink rounded-3xl p-6 shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase mb-4">
                <span>Stickers & Badges</span>
                <span className="bg-accent-pink text-ink px-2 py-0.5 rounded border border-ink">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="bg-accent-green text-ink px-3 py-1 rounded-full border-2 border-ink font-mono font-black text-xs shadow-neo-xs rotate-[-3deg] inline-flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> 100% OFFLINE
                </span>
                <span className="bg-accent-purple text-ink px-3 py-1 rounded-xl border-2 border-ink font-mono font-bold text-xs shadow-neo-xs rotate-[2deg] inline-flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> ZERO CONFIG
                </span>
                <span className="bg-accent-yellow text-ink px-2.5 py-1 rounded-lg border-2 border-ink font-mono font-black text-xs shadow-neo-xs inline-flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-accent-pink-dark" /> POPULAR
                </span>
                <span className="bg-ink text-white px-3 py-1 rounded-full border-2 border-ink font-mono font-bold text-xs shadow-neo-xs">
                  STANDALONE
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-semibold text-ink/70">
              Rotated badges with hard shadow offsets
            </div>
          </div>

          {/* COMPONENT 3: TACTILE SWITCHES */}
          <div className="bg-surface border-3 border-ink rounded-3xl p-6 shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase mb-4">
                <span>Tactile Toggles</span>
                <span className="bg-accent-cyan text-ink px-2 py-0.5 rounded border border-ink">Controls</span>
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between p-3 bg-accent-yellow/15 border-2 border-ink rounded-2xl cursor-pointer hover:bg-accent-yellow/25 transition-colors">
                  <span className="font-mono text-xs font-bold">Offline Cache Mode</span>
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
                <label className="flex items-center justify-between p-3 bg-accent-pink/15 border-2 border-ink rounded-2xl cursor-pointer hover:bg-accent-pink/25 transition-colors">
                  <span className="font-mono text-xs font-bold">GPU Acceleration</span>
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
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-semibold text-ink/70">
              Custom checked state variables
            </div>
          </div>

          {/* COMPONENT 4: ALERT BANNER */}
          <div className="bg-surface border-3 border-ink rounded-3xl p-6 shadow-neo-md lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase mb-3">
                <span>Alert Banner Card</span>
                <span className="bg-accent-green text-ink px-2 py-0.5 rounded border border-ink">Feedback</span>
              </div>
              <div className="p-4 sm:p-5 bg-accent-yellow border-3 border-ink rounded-2xl shadow-neo-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface border-2 border-ink flex items-center justify-center text-xl shrink-0">
                  💡
                </div>
                <div>
                  <h4 className="font-display font-black text-base uppercase">
                    Zero Complex Boilerplate
                  </h4>
                  <p className="font-sans text-xs sm:text-sm font-semibold text-ink/85 mt-1 leading-relaxed">
                    Unlike Cordova or Electron, web2app requires zero extra SDK configuration files. Just pass your web URL or folder, and you get native packages instantly.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-semibold text-ink/70">
              High contrast alert container with icons
            </div>
          </div>

          {/* COMPONENT 5: RATING & STAT CARD */}
          <div className="bg-surface border-3 border-ink rounded-3xl p-6 shadow-neo-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono font-black text-xs uppercase mb-3">
                <span>Interactive Rating</span>
                <span className="bg-accent-purple text-ink px-2 py-0.5 rounded border border-ink">Widget</span>
              </div>
              
              <div className="p-4 bg-accent-green/20 border-2 border-ink rounded-2xl text-center flex flex-col items-center">
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
                            : "text-ink/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="font-display font-black text-2xl">
                  {rating}.0 / 5.0 Rating
                </span>
                
                <button
                  onClick={handleLike}
                  className="mt-3 px-3 py-1.5 bg-surface border-2 border-ink rounded-xl font-mono text-xs font-bold shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                >
                  <span>{isLiked ? "❤️ Liked!" : "🤍 Like"}</span>
                  <span className="bg-accent-pink px-1.5 py-0.2 rounded text-[10px]">
                    {likeCount}
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-ink/15 text-[11px] font-mono font-semibold text-ink/70">
              Interactive stateful widgets
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
