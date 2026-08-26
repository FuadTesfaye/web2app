"use client";

import React from "react";

export default function MarqueeTicker() {
  const items = [
    "⚡ WEB2APP v0.1.0 IS LIVE",
    "★ ZERO RUNTIME OVERHEAD",
    "🚀 NATIVE ANDROID (.APK)",
    "🪟 WINDOWS DESKTOP (EDGE/WEBVIEW2)",
    "🐧 DEBIAN / UBUNTU (.DEB)",
    "🏹 ARCH LINUX (PKGBUILD)",
    "🔥 MULTI-PLATFORM EXPORT IN 1-COMMAND",
    "📱 KOTLIN WEBVIEW ASSET LOADER",
  ];

  return (
    <div className="bg-accent-yellow border-b-3 border-ink font-mono text-xs sm:text-sm font-bold tracking-wider py-1.5 overflow-hidden select-none">
      <div className="animate-marquee flex gap-8 items-center whitespace-nowrap">
        {items.concat(items).map((item, idx) => (
          <span key={idx} className="flex items-center gap-2">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
