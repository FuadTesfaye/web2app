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
    icon: <Smartphone className="w-6 h-6 text-black" />,
    iconBg: "bg-[#3DDC84]",
    points: ["Material 3 Theme & Native Splash", "Standalone app-debug.apk", "Full offline WebViewAssetLoader"],
    size: "~4.3 KB",
  },
  {
    id: "windows",
    title: "Windows Desktop",
    dir: "app/windows",
    category: "// Desktop Windows",
    badge: "EDGE / WEBVIEW2",
    desc: "Standalone Windows app wrapper leveraging MS Edge / Chromium App mode with custom manifests, launch scripts, and desktop installer shortcuts.",
    icon: <Monitor className="w-6 h-6 text-white" />,
    iconBg: "bg-[#00A4EF]",
    points: ["launch.bat & launch.ps1 runners", "start.vbs silent launcher", "install.bat Start Menu shortcut"],
    size: "~5.1 KB",
  },
  {
    id: "debian",
    title: "Debian / Ubuntu",
    dir: "app/debian",
    category: "// Linux Debian",
    badge: "PURE TS .DEB",
    desc: "Pure TypeScript Debian packaging engine builds ready-to-install binary .deb packages, desktop entries, and icon registries on any OS.",
    icon: <Disc className="w-6 h-6 text-white" />,
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
    icon: <Terminal className="w-6 h-6 text-white" />,
    iconBg: "bg-[#1793D1]",
    points: ["Standard PKGBUILD script", ".SRCINFO Metadata", "makepkg -si automated install"],
    size: "~2.7 KB",
  },
];

export default function PlatformCards() {
  return (
    <section id="platforms" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-ink">
      
      {/* Heading */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-block bg-accent-cyan text-ink font-mono font-black text-xs px-3 py-1 border-2 border-ink shadow-neo-xs uppercase tracking-widest mb-3">
          [// 03 PLATFORM_TARGETS]
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter">
          What Gets Generated Inside <code className="bg-accent-yellow text-ink px-2 py-0.5 border-2 border-ink font-mono">app/</code>
        </h2>
        <p className="font-sans font-bold text-base sm:text-lg text-ink-muted max-w-xl mx-auto mt-3">
          Each platform gets a dedicated, clean, standalone setup with no third-party runtime bloat.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {platforms.map((p) => (
          <div
            key={p.id}
            onMouseEnter={() => playPop()}
            className="bg-surface border-3 border-ink p-6 sm:p-7 shadow-neo-md hover:shadow-neo-lg hover:translate-x-[-3px] hover:translate-y-[-3px] transition-all flex flex-col justify-between"
          >
            <div>
              <div className={`w-12 h-12 ${p.iconBg} border-3 border-ink shadow-neo-sm flex items-center justify-center mb-5`}>
                {p.icon}
              </div>

              <div className="font-mono text-xs font-black text-ink-muted uppercase tracking-wider mb-1">
                {p.category}
              </div>

              <h3 className="font-display font-black text-2xl uppercase tracking-tight mb-1">
                {p.dir}
              </h3>

              <div className="text-xs font-mono font-bold text-ink-muted mb-4 uppercase">
                {p.title}
              </div>

              <p className="font-sans text-sm font-semibold text-ink-muted mb-6 leading-relaxed">
                {p.desc}
              </p>

              <ul className="space-y-2.5 font-mono text-xs font-bold text-ink mb-6">
                {p.points.map((pt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-accent-green-dark stroke-[3] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t-2 border-ink/20 flex items-center justify-between font-mono text-xs font-black uppercase">
              <span>Size: {p.size}</span>
              <span className="bg-ink text-surface px-2 py-0.5 text-[10px] font-black tracking-wider">
                {p.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
