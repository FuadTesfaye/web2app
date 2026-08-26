"use client";

import React, { useState } from "react";
import { Sparkles, Folder, RefreshCw } from "lucide-react";
import { playClick, playTone, playSuccessChime } from "@/lib/sound";

interface Preset {
  name: string;
  url: string;
  app: string;
  pkg: string;
  badge: string;
  color: string;
}

const presets: Preset[] = [
  { name: "Hacker News", url: "https://news.ycombinator.com", app: "Hacker News", pkg: "com.ycombinator.news", badge: "📰 HN", color: "bg-accent-yellow text-ink" },
  { name: "GitHub", url: "https://github.com", app: "GitHub Desktop", pkg: "com.github.mobile", badge: "🐙 GitHub", color: "bg-accent-cyan text-ink" },
  { name: "Next.js Portal", url: "https://nextjs.org", app: "Next.js Hub", pkg: "org.nextjs.hub", badge: "▲ Next.js", color: "bg-accent-pink text-ink" },
  { name: "NeoBrutalism", url: "https://neobrutalism.com", app: "NeoBrutalism App", pkg: "com.neobrutalism.app", badge: "🎨 Retro UI", color: "bg-accent-green text-ink" },
];

export default function ConverterStudio() {
  const [url, setUrl] = useState("https://news.ycombinator.com");
  const [appName, setAppName] = useState("Hacker News");
  const [pkgName, setPkgName] = useState("com.ycombinator.news");
  
  const [chkAndroid, setChkAndroid] = useState(true);
  const [chkWindows, setChkWindows] = useState(true);
  const [chkDebian, setChkDebian] = useState(true);
  const [chkArch, setChkArch] = useState(true);

  const [isConverting, setIsConverting] = useState(false);
  const [logs, setLogs] = useState<Array<{ text: string; color: string }>>([
    { text: "$ web2app https://news.ycombinator.com", color: "text-gray-400" },
    { text: "⚡ web2app v0.1.0 — Ready to convert web apps to native packages", color: "text-accent-yellow font-bold" },
    { text: "Press \"Convert to Native Apps\" to launch build pipeline...", color: "text-gray-500" },
  ]);
  const [status, setStatus] = useState<"READY" | "BUILDING" | "COMPLETED">("READY");

  const handlePreset = (p: Preset) => {
    setUrl(p.url);
    setAppName(p.app);
    setPkgName(p.pkg);
    playClick();
  };

  const handleConvert = async () => {
    if (isConverting) return;
    setIsConverting(true);
    setStatus("BUILDING");
    playClick();
    playTone(440, "square", 0.08);

    setLogs([
      { text: `$ web2app ${url}`, color: "text-gray-400" },
      { text: `⚡ web2app v0.1.0 — Multi-Platform Native App Packager`, color: "text-accent-yellow font-bold" },
      { text: `ℹ Target URL:   🌐 ${url}`, color: "text-gray-300" },
      { text: `ℹ Application:  ${appName} (${pkgName} v1.0.0)`, color: "text-gray-300" },
      { text: `ℹ Output Root:  ./app/`, color: "text-gray-300" },
      { text: "──────────────────────────────────────────────────────", color: "text-gray-700" },
    ]);

    const steps = [
      { text: `[1/5] 🌐 Analyzing manifest & web page assets...`, color: "text-accent-cyan", freq: 500, delay: 350 },
      { text: `[2/5] 📱 Generating Android Kotlin native wrapper in app/android...`, color: "text-accent-green", freq: 600, delay: 400 },
      { text: `      ✔ Injected AndroidManifest.xml, MainActivity.kt, Gradle wrapper`, color: "text-gray-400", freq: 650, delay: 250 },
      { text: `[3/5] 🪟 Scaffolding Windows Desktop app in app/windows...`, color: "text-accent-cyan-dark", freq: 700, delay: 350 },
      { text: `      ✔ Generated launch.bat, launch.ps1, start.vbs, desktop shortcuts`, color: "text-gray-400", freq: 750, delay: 250 },
      { text: `[4/5] 🐧 Compiling Debian binary package (Pure TypeScript DebPackager)...`, color: "text-accent-pink", freq: 800, delay: 400 },
      { text: `      ✔ Built app/debian/${pkgName}_1.0.0_all.deb + .desktop entry`, color: "text-gray-400", freq: 850, delay: 250 },
      { text: `[5/5] 🏹 Assembling Arch Linux package in app/arch...`, color: "text-accent-purple", freq: 900, delay: 350 },
      { text: `      ✔ Generated PKGBUILD, .SRCINFO, install.sh`, color: "text-gray-400", freq: 950, delay: 250 },
      { text: `🎉 BUILD SUCCESSFUL! All packages created in ./app/ (1.4s)`, color: "text-accent-yellow font-bold text-xs sm:text-sm", freq: 1046, delay: 300 },
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, step.delay));
      playTone(step.freq, "triangle", 0.05);
      setLogs((prev) => [...prev, { text: step.text, color: step.color }]);
    }

    playSuccessChime();
    setIsConverting(false);
    setStatus("COMPLETED");
  };

  return (
    <section id="demo" className="py-14 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-16">
        <div className="inline-block bg-accent-pink text-ink font-mono font-black text-[10px] sm:text-xs px-3 py-1 border-2 border-ink shadow-neo-xs uppercase tracking-widest mb-3">
          [// 01 INTERACTIVE_STUDIO]
        </div>
        <h2 className="font-display font-black text-2xl xs:text-3xl sm:text-5xl uppercase tracking-tighter">
          Test The Converter In Real-Time
        </h2>
        <p className="font-sans font-bold text-sm sm:text-lg text-ink-muted max-w-xl mx-auto mt-2 sm:mt-3 px-2">
          Type any live web page URL or pick a sample preset to simulate instant multi-platform compilation!
        </p>
      </div>

      {/* Main Studio Card */}
      <div className="bg-surface border-3 sm:border-4 border-ink shadow-neo-md sm:shadow-neo-lg overflow-hidden w-full">
        
        {/* Title Bar */}
        <div className="bg-accent-yellow text-ink border-b-2 sm:border-b-3 border-ink px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-accent-pink border border-ink sm:border-2 inline-block shrink-0"></span>
            <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-accent-yellow border border-ink sm:border-2 inline-block shrink-0"></span>
            <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-accent-green border border-ink sm:border-2 inline-block shrink-0"></span>
            <span className="font-mono font-black text-[11px] sm:text-sm uppercase tracking-wider ml-1 sm:ml-2 truncate">
              web2app // Multi-Platform Studio
            </span>
          </div>
          <div className="font-mono text-[10px] sm:text-xs font-black px-2 py-0.5 bg-surface text-ink border border-ink shadow-neo-xs hidden sm:block shrink-0">
            OUTPUT_ROOT: app/
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT: Configuration (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6 w-full">
            
            {/* URL Input */}
            <div>
              <label htmlFor="targetUrl" className="block font-mono font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center justify-between">
                <span>🌐 Target Web URL</span>
                <span className="text-[10px] sm:text-[11px] text-ink-muted lowercase">https://...</span>
              </label>
              <input
                id="targetUrl"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-website.com"
                className="w-full bg-surface text-ink border-2 sm:border-3 border-ink px-3 sm:px-4 py-2.5 sm:py-3 font-mono font-bold text-xs sm:text-base focus:outline-none focus:bg-accent-yellow/15 shadow-neo-xs sm:shadow-neo-sm transition-all"
              />
            </div>

            {/* Presets */}
            <div>
              <span className="block font-mono font-bold text-[11px] sm:text-xs uppercase tracking-wider text-ink-muted mb-1.5 sm:mb-2">
                ⚡ Quick Presets:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handlePreset(p)}
                    className={`btn-sharp px-2.5 sm:px-3 py-1 border-2 border-ink text-[11px] sm:text-xs font-mono font-black shadow-neo-xs uppercase tracking-wider ${p.color}`}
                  >
                    {p.badge}
                  </button>
                ))}
              </div>
            </div>

            {/* App Name & Package ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono font-bold text-[11px] sm:text-xs uppercase tracking-wider text-ink-muted mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-surface text-ink border-2 border-ink px-3 py-2 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:bg-accent-yellow/15 shadow-neo-xs"
                />
              </div>
              <div>
                <label className="block font-mono font-bold text-[11px] sm:text-xs uppercase tracking-wider text-ink-muted mb-1">
                  Package ID
                </label>
                <input
                  type="text"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  className="w-full bg-surface text-ink border-2 border-ink px-3 py-2 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:bg-accent-yellow/15 shadow-neo-xs"
                />
              </div>
            </div>

            {/* Target Output Checkboxes */}
            <div>
              <span className="block font-mono font-black text-[11px] sm:text-xs uppercase tracking-widest mb-2">
                📦 Output Targets (Inside <code className="bg-accent-yellow text-ink px-1 border border-ink font-mono">app/</code>)
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] sm:text-xs font-black uppercase">
                <label className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-surface border-2 border-ink cursor-pointer hover:bg-accent-green/20 transition-colors shadow-neo-xs">
                  <input
                    type="checkbox"
                    checked={chkAndroid}
                    onChange={(e) => setChkAndroid(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer shrink-0"
                  />
                  <span className="truncate">📱 /android</span>
                </label>

                <label className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-surface border-2 border-ink cursor-pointer hover:bg-accent-cyan/20 transition-colors shadow-neo-xs">
                  <input
                    type="checkbox"
                    checked={chkWindows}
                    onChange={(e) => setChkWindows(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer shrink-0"
                  />
                  <span className="truncate">🪟 /windows</span>
                </label>

                <label className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-surface border-2 border-ink cursor-pointer hover:bg-accent-pink/20 transition-colors shadow-neo-xs">
                  <input
                    type="checkbox"
                    checked={chkDebian}
                    onChange={(e) => setChkDebian(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer shrink-0"
                  />
                  <span className="truncate">🐧 /debian</span>
                </label>

                <label className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-surface border-2 border-ink cursor-pointer hover:bg-accent-purple/20 transition-colors shadow-neo-xs">
                  <input
                    type="checkbox"
                    checked={chkArch}
                    onChange={(e) => setChkArch(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer shrink-0"
                  />
                  <span className="truncate">🏹 /arch</span>
                </label>
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={isConverting}
              className="btn-sharp w-full bg-accent-yellow text-ink py-3.5 sm:py-4 border-2 sm:border-3 border-ink shadow-neo-sm sm:shadow-neo-md hover:shadow-neo-lg font-display font-black text-base sm:text-xl tracking-tight transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-60"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Compiling Apps...</span>
                </>
              ) : (
                <>
                  <span>⚡ Convert to Native Apps</span>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>

          </div>

          {/* RIGHT: Terminal & Explorer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            
            {/* Terminal Card */}
            <div className="bg-[#0B0C0E] text-[#57F287] border-2 sm:border-3 border-ink shadow-neo-sm sm:shadow-neo-md overflow-hidden font-mono text-xs sm:text-sm w-full">
              <div className="bg-[#191B1F] text-white px-3 sm:px-4 py-2 sm:py-2.5 border-b-2 border-ink flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#FF5C8A] inline-block shrink-0"></span>
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#FEE75C] inline-block shrink-0"></span>
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#57F287] inline-block shrink-0"></span>
                  <span className="text-[11px] sm:text-xs text-gray-300 font-bold ml-1 sm:ml-2 truncate">Terminal: web2app-engine</span>
                </div>
                <span
                  className={`px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase shrink-0 ${
                    status === "BUILDING"
                      ? "bg-accent-yellow text-ink animate-pulse"
                      : status === "COMPLETED"
                      ? "bg-accent-green text-ink"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* Terminal Logs */}
              <div className="p-3 sm:p-4 h-56 sm:h-64 overflow-y-auto space-y-1 sm:space-y-1.5 leading-relaxed selection:bg-[#57F287] selection:text-black font-mono text-[11px] sm:text-xs break-word-safe">
                {logs.map((log, index) => (
                  <div key={index} className={`${log.color} break-word-safe`}>
                    {log.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Directory Tree */}
            <div className="bg-surface border-2 sm:border-3 border-ink p-3.5 sm:p-5 shadow-neo-xs sm:shadow-neo-sm w-full">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between border-b-2 border-ink pb-2.5 mb-3 gap-2">
                <span className="font-mono font-black text-xs sm:text-sm uppercase flex items-center gap-1.5 truncate">
                  <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-yellow fill-accent-yellow shrink-0" />
                  <span>Generated Root:</span> <code className="bg-accent-yellow text-ink px-1.5 py-0.2 border border-ink font-mono font-black">app/</code>
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-black bg-accent-green text-ink px-2 py-0.5 border border-ink uppercase self-start xs:self-auto shrink-0">
                  4 Targets Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 font-mono text-xs">
                {/* Android */}
                <div className="p-2.5 sm:p-3 bg-surface border-2 border-ink flex items-start justify-between shadow-neo-xs gap-2">
                  <div className="min-w-0">
                    <span className="font-black flex items-center gap-1 uppercase text-xs truncate">📱 app/android</span>
                    <span className="text-[10px] sm:text-[11px] text-ink-muted block mt-0.5 font-semibold truncate">app-debug.apk + Gradle</span>
                  </div>
                  <button 
                    onClick={playClick}
                    className="btn-sharp px-2 sm:px-2.5 py-1 bg-accent-green text-ink border border-ink text-[10px] font-black shadow-neo-xs uppercase shrink-0"
                  >
                    View
                  </button>
                </div>

                {/* Windows */}
                <div className="p-2.5 sm:p-3 bg-surface border-2 border-ink flex items-start justify-between shadow-neo-xs gap-2">
                  <div className="min-w-0">
                    <span className="font-black flex items-center gap-1 uppercase text-xs truncate">🪟 app/windows</span>
                    <span className="text-[10px] sm:text-[11px] text-ink-muted block mt-0.5 font-semibold truncate">launch.bat + install.ps1</span>
                  </div>
                  <button 
                    onClick={playClick}
                    className="btn-sharp px-2 sm:px-2.5 py-1 bg-accent-cyan text-ink border border-ink text-[10px] font-black shadow-neo-xs uppercase shrink-0"
                  >
                    View
                  </button>
                </div>

                {/* Debian */}
                <div className="p-2.5 sm:p-3 bg-surface border-2 border-ink flex items-start justify-between shadow-neo-xs gap-2">
                  <div className="min-w-0">
                    <span className="font-black flex items-center gap-1 uppercase text-xs truncate">🐧 app/debian</span>
                    <span className="text-[10px] sm:text-[11px] text-ink-muted block mt-0.5 font-semibold truncate">{pkgName}_1.0.0.deb</span>
                  </div>
                  <button 
                    onClick={playClick}
                    className="btn-sharp px-2 sm:px-2.5 py-1 bg-accent-pink text-ink border border-ink text-[10px] font-black shadow-neo-xs uppercase shrink-0"
                  >
                    View
                  </button>
                </div>

                {/* Arch */}
                <div className="p-2.5 sm:p-3 bg-surface border-2 border-ink flex items-start justify-between shadow-neo-xs gap-2">
                  <div className="min-w-0">
                    <span className="font-black flex items-center gap-1 uppercase text-xs truncate">🏹 app/arch</span>
                    <span className="text-[10px] sm:text-[11px] text-ink-muted block mt-0.5 font-semibold truncate">PKGBUILD + install.sh</span>
                  </div>
                  <button 
                    onClick={playClick}
                    className="btn-sharp px-2 sm:px-2.5 py-1 bg-accent-purple text-ink border border-ink text-[10px] font-black shadow-neo-xs uppercase shrink-0"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
