"use client";

import React from "react";
import { Star, Quote, CheckCircle } from "lucide-react";

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
    avatarBg: "bg-accent-yellow",
    avatarText: "AR",
    text: "We packaged our Next.js dashboard into an Android APK and Debian package in literally 2 seconds. No Gradle headaches, no broken dependencies.",
    rating: 5,
    badge: "⚡ 2s Next.js Build",
    tagColor: "bg-accent-yellow",
  },
  {
    name: "Elena Rostova",
    role: "Solo SaaS Founder",
    company: "DocuCraft",
    avatarBg: "bg-accent-pink",
    avatarText: "ER",
    text: "The generated app/ folder with clean /windows, /debian, and /arch directories made distributing desktop builds to my users seamless.",
    rating: 5,
    badge: "📦 Multi-Platform",
    tagColor: "bg-accent-pink",
  },
  {
    name: "Marcus Chen",
    role: "Mobile Architect",
    company: "HyperScale",
    avatarBg: "bg-accent-cyan",
    avatarText: "MC",
    text: "WebViewAssetLoader support is game-changing. Full CORS-free modern web APIs, offline IndexedDB storage, and tiny 4KB bundle footprints.",
    rating: 5,
    badge: "📱 Android Kotlin",
    tagColor: "bg-accent-cyan",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t-3 border-ink bg-surface">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-accent-pink text-ink font-mono font-black text-xs px-3 py-1 rounded-md border-2 border-ink shadow-neo-xs uppercase tracking-wider mb-3">
            Developer Praise
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
            Loved By Engineers & Builders
          </h2>
          <p className="font-sans font-bold text-base sm:text-lg text-ink/75 max-w-xl mx-auto mt-3">
            See how developers are shipping multi-platform applications in record time.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-surface border-3 border-ink rounded-3xl p-6 sm:p-7 shadow-neo-md hover:shadow-neo-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-accent-yellow text-ink stroke-[2]"
                      />
                    ))}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg border border-ink font-mono text-[10px] font-bold ${t.tagColor}`}>
                    {t.badge}
                  </span>
                </div>

                {/* Review Text */}
                <p className="font-sans font-semibold text-sm text-ink/85 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t-2 border-ink/15 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${t.avatarBg} border-2 border-ink shadow-neo-xs flex items-center justify-center font-display font-black text-sm text-ink`}>
                  {t.avatarText}
                </div>
                <div>
                  <h4 className="font-display font-black text-sm uppercase flex items-center gap-1">
                    {t.name}
                    <CheckCircle className="w-3.5 h-3.5 text-accent-green-dark inline fill-accent-green" />
                  </h4>
                  <p className="font-mono text-xs text-ink/60">
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
