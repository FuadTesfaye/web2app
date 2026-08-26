"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatarBg: string;
  avatarText: string;
  text: string;
  rating: number;
  badge: string;
  tagColor: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Alex Rivera",
    role: "Lead Full-Stack Eng",
    company: "DevSprint",
    avatarBg: "bg-accent-yellow text-ink",
    avatarText: "AR",
    text: "We packaged our Next.js dashboard into an Android APK and Debian package in literally 2 seconds. No Gradle headaches, no broken dependencies.",
    rating: 5,
    badge: "⚡ 2s Next.js Build",
    tagColor: "bg-accent-yellow text-ink",
  },
  {
    name: "Elena Rostova",
    role: "Solo SaaS Founder",
    company: "DocuCraft",
    avatarBg: "bg-accent-pink text-ink",
    avatarText: "ER",
    text: "The generated app/ folder with clean /windows, /debian, and /arch directories made distributing desktop builds to my users seamless.",
    rating: 5,
    badge: "📦 Multi-Platform",
    tagColor: "bg-accent-pink text-ink",
  },
  {
    name: "Marcus Chen",
    role: "Mobile Architect",
    company: "HyperScale",
    avatarBg: "bg-accent-cyan text-ink",
    avatarText: "MC",
    text: "WebViewAssetLoader support is game-changing. Full CORS-free modern web APIs, offline IndexedDB storage, and tiny 4KB bundle footprints.",
    rating: 5,
    badge: "📱 Android Kotlin",
    tagColor: "bg-accent-cyan text-ink",
  },
];

export default function Testimonials() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-8 border-t-3 border-ink bg-surface text-ink w-full max-w-full">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-block bg-accent-pink text-ink font-mono font-black text-[10px] sm:text-xs px-3 py-1 border-2 border-ink shadow-neo-xs uppercase tracking-widest mb-3">
            [// 06 VERIFIED_REVIEWS]
          </div>
          <h2 className="font-display font-black text-2xl xs:text-3xl sm:text-5xl uppercase tracking-tighter px-2">
            Loved By Engineers & Builders
          </h2>
          <p className="font-sans font-bold text-xs sm:text-lg text-ink-muted max-w-xl mx-auto mt-2 sm:mt-3 px-2">
            See how developers are shipping multi-platform applications in record time.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-surface border-3 border-ink p-5 sm:p-6 lg:p-7 shadow-neo-sm sm:shadow-neo-md hover:shadow-neo-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Badge */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-accent-yellow text-ink stroke-[2]"
                      />
                    ))}
                  </div>
                  <span className={`px-2 sm:px-2.5 py-0.5 border border-ink font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider truncate ${t.tagColor}`}>
                    {t.badge}
                  </span>
                </div>

                {/* Review Text */}
                <p className="font-sans font-semibold text-xs sm:text-sm text-ink-muted leading-relaxed mb-4 sm:mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-3 sm:pt-4 border-t-2 border-ink/20 flex items-center gap-2.5 sm:gap-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${t.avatarBg} border-2 border-ink shadow-neo-xs flex items-center justify-center font-display font-black text-xs sm:text-sm shrink-0`}>
                  {t.avatarText}
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-black text-xs sm:text-sm uppercase flex items-center gap-1 truncate">
                    <span className="truncate">{t.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-accent-green-dark inline fill-accent-green shrink-0" />
                  </h4>
                  <p className="font-mono text-[10px] sm:text-xs text-ink-muted truncate">
                    {t.role} • {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
