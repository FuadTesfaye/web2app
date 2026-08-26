"use client";

import React from "react";
import { Smartphone, Monitor, Disc, Terminal, Check } from "lucide-react";
import { playPop } from "@/lib/sound";

interface PlatformInfo {
  id: string;
  title: string;
  dir: string;
  category: string;
  badge: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
  points: string[];
  size: string;
}

const platforms: PlatformInfo[] = [
  {
    id: "android",
    title: "Android Native App",
    dir: "app/android",
    category: "// Mobile Native",
    badge: "KOTLIN + APK",
    desc: "Kotlin native wrapper with AndroidX WebViewAssetLoader. Generates standalone APKs with hardware acceleration and offline web storage.",
    icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-black" />,
    iconBg: "bg-[#3DDC84]",
    points: ["Material 3 & Splash", "Standalone app-debug.apk", "WebViewAssetLoader support"],
    size: "~4.3 KB",
  },
  {
    id: "windows",
    title: "Windows Desktop",
    dir: "app/windows",
    category: "// Desktop Windows",
    badge: "EDGE / WEBVIEW2",
    desc: "Standalone Windows app wrapper leveraging MS Edge / Chromium App mode with custom manifests, launch scripts, and desktop installer shortcuts.",
    icon: <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    iconBg: "bg-[#00A4EF]",
    points: ["launch.bat & launch.ps1", "start.vbs silent launcher", "install.bat Start Menu shortcut"],
    size: "~5.1 KB",
  },
  {
    id: "debian",
    title: "Debian / Ubuntu",
    dir: "app/debian",
    category: "// Linux Debian",
    badge: "PURE TS .DEB",
    desc: "Pure TypeScript Debian packaging engine builds ready-to-install binary .deb packages, desktop entries, and icon registries on any OS.",
    icon: <Disc className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    iconBg: "bg-[#D70A53]",
    points: ["Standalone .deb Package", ".desktop App Launcher", "Scalable SVG App Icon"],
    size: "~1.6 KB",
  },
  {
    id: "arch",
    title: "Arch Linux / AUR",
    dir: "app/arch",
    category: "// Arch Linux",
    badge: "PKGBUILD",
    desc: "Complete AUR-compliant PKGBUILD and .SRCINFO metadata with automated install.sh scripts for instant pacman/makepkg deployment.",
    icon: <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    iconBg: "bg-[#1793D1]",
    points: ["Standard PKGBUILD script", ".SRCINFO Metadata", "makepkg -si automated install"],
    size: "~2.7 KB",
  },
];

export default function PlatformCards() {
  return (
    <section id="platforms" className="py-14 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto text-ink w-full max-w-full">
      
      {/* Heading */}
      <div className="text-center mb-10 sm:mb-16">
        <div className="inline-block bg-accent-cyan text-ink font-mono font-black text-[10px] sm:text-xs px-3 py-1 border-2 border-ink shadow-neo-xs uppercase tracking-widest mb-3">
          [// 03 PLATFORM_TARGETS]
        </div>
        <h2 className="font-display font-black text-2xl xs:text-3xl sm:text-5xl uppercase tracking-tighter px-2">
          Generated Inside <code className="bg-accent-yellow text-ink px-1.5 sm:px-2 py-0.5 border-2 border-ink font-mono whitespace-nowrap">app/</code>
        </h2>
        <p className="font-sans font-bold text-xs sm:text-lg text-ink-muted max-w-xl mx-auto mt-2 sm:mt-3 px-2">
          Each platform gets a dedicated, clean, standalone setup with zero third-party runtime bloat.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {platforms.map((p) => (
          <div
            key={p.id}
            onMouseEnter={() => playPop()}
            className="bg-surface border-3 border-ink p-5 sm:p-6 lg:p-7 shadow-neo-sm sm:shadow-neo-md hover:shadow-neo-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
          >
            <div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${p.iconBg} border-2 sm:border-3 border-ink shadow-neo-xs sm:shadow-neo-sm flex items-center justify-center mb-4 sm:mb-5`}>
                {p.icon}
              </div>

              <div className="font-mono text-[11px] sm:text-xs font-black text-ink-muted uppercase tracking-wider mb-1">
                {p.category}
              </div>

              <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight mb-1 truncate">
                {p.dir}
              </h3>

              <div className="text-[11px] sm:text-xs font-mono font-bold text-ink-muted mb-3 sm:mb-4 uppercase">
                {p.title}
              </div>

              <p className="font-sans text-xs sm:text-sm font-semibold text-ink-muted mb-4 sm:mb-6 leading-relaxed">
                {p.desc}
              </p>

              <ul className="space-y-2 font-mono text-[11px] sm:text-xs font-bold text-ink mb-5 sm:mb-6">
                {p.points.map((pt, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 sm:gap-2">
                    <Check className="w-3.5 h-3.5 text-accent-green-dark stroke-[3] shrink-0" />
                    <span className="leading-tight">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 sm:pt-4 border-t-2 border-ink/20 flex items-center justify-between font-mono text-[11px] sm:text-xs font-black uppercase gap-2">
              <span className="truncate">Size: {p.size}</span>
              <span className="bg-ink text-surface px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black tracking-wider shrink-0">
                {p.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
