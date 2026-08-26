"use client";

import React, { useState } from "react";
import { Play, CheckCircle, Terminal as TerminalIcon, Download, Sparkles, Folder, RefreshCw } from "lucide-react";
import { playClick, playTone, playSuccessChime } from "../lib/sound";

interface Preset {
  name: string;
  url: string;
  app: string;
  pkg: string;
  badge: string;
  color: string;
}

const presets: Preset[] = [
  { name: "Hacker News", url: "https://news.ycombinator.com", app: "Hacker News", pkg: "com.ycombinator.news", badge: "📰 HN", color: "bg-accent-yellow" },
  { name: "GitHub", url: "https://github.com", app: "GitHub Desktop", pkg: "com.github.mobile", badge: "🐙 GitHub", color: "bg-accent-cyan" },
  { name: "Next.js Portal", url: "https://nextjs.org", app: "Next.js Hub", pkg: "org.nextjs.hub", badge: "▲ Next.js", color: "bg-accent-pink" },
  { name: "NeoBrutalism", url: "https://neobrutalism.com", app: "NeoBrutalism App", pkg: "com.neobrutalism.app", badge: "🎨 Retro UI", color: "bg-accent-green" },
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
      { text: `[1/5] 🌐 Analyzing manifest & web page assets...`, color: "text-accent-cyan", freq: 500, delay: 400 },
      { text: `[2/5] 📱 Generating Android Kotlin native wrapper in app/android...`, color: "text-accent-green", freq: 600, delay: 450 },
      { text: `      ✔ Injected AndroidManifest.xml, MainActivity.kt, Gradle wrapper`, color: "text-gray-400", freq: 650, delay: 300 },
      { text: `[3/5] 🪟 Scaffolding Windows Desktop app in app/windows...`, color: "text-accent-cyan-dark", freq: 700, delay: 400 },
      { text: `      ✔ Generated launch.bat, launch.ps1, start.vbs, desktop shortcuts`, color: "text-gray-400", freq: 750, delay: 300 },
      { text: `[4/5] 🐧 Compiling Debian binary package (Pure TypeScript DebPackager)...`, color: "text-accent-pink", freq: 800, delay: 450 },
      { text: `      ✔ Built app/debian/${pkgName}_1.0.0_all.deb + .desktop entry`, color: "text-gray-400", freq: 850, delay: 300 },
      { text: `[5/5] 🏹 Assembling Arch Linux package in app/arch...`, color: "text-accent-purple", freq: 900, delay: 400 },
      { text: `      ✔ Generated PKGBUILD, .SRCINFO, install.sh`, color: "text-gray-400", freq: 950, delay: 300 },
      { text: `🎉 BUILD SUCCESSFUL! All packages created in ./app/ (1.4s)`, color: "text-accent-yellow font-bold text-sm", freq: 1046, delay: 350 },
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
    <section id="demo" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-block bg-accent-pink text-ink font-mono font-black text-xs px-3 py-1 rounded-md border-2 border-ink shadow-neo-xs uppercase tracking-wider mb-3">
          Interactive Web2App Studio
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
          Test The Converter Right Now
        </h2>
        <p className="font-sans font-bold text-base sm:text-lg text-ink/75 max-w-xl mx-auto mt-3">
          Type any live web page URL or pick a sample preset to simulate instant multi-platform compilation!
        </p>
      </div>

      {/* Main Studio Card */}
      <div className="bg-surface border-4 border-ink rounded-3xl shadow-neo-lg overflow-hidden">
        
        {/* Title Bar */}
        <div className="bg-accent-yellow border-b-3 border-ink px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-accent-pink border-2 border-ink inline-block"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-accent-yellow border-2 border-ink inline-block"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-accent-green border-2 border-ink inline-block"></span>
            <span className="font-mono font-extrabold text-xs sm:text-sm text-ink ml-2">
              web2app — Multi-Platform Studio
            </span>
          </div>
          <div className="font-mono text-xs font-bold px-2.5 py-0.5 bg-surface rounded-md border-2 border-ink shadow-neo-xs hidden sm:block">
            OUTPUT: app/
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Configuration (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* URL Input */}
            <div>
              <label htmlFor="targetUrl" className="block font-mono font-extrabold text-sm uppercase tracking-wide mb-2 flex items-center justify-between">
                <span>🌐 Target Web URL or Local App</span>
                <span className="text-xs text-ink/60 lowercase">https://...</span>
              </label>
              <input
                id="targetUrl"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-website.com"
                className="w-full bg-surface border-3 border-ink rounded-2xl px-4 py-3 font-mono font-bold text-sm sm:text-base focus:outline-none focus:bg-accent-yellow/20 shadow-neo-sm transition-all"
              />
            </div>

            {/* Presets */}
            <div>
              <span className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                ⚡ Quick Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handlePreset(p)}
                    className={`px-3 py-1 rounded-xl border-2 border-ink text-xs font-mono font-bold shadow-neo-xs hover:shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all ${p.color}`}
                  >
                    {p.badge}
                  </button>
                ))}
              </div>
            </div>

            {/* App Name & Package ID */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-surface border-2 border-ink rounded-xl px-3 py-2 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:bg-accent-yellow/20 shadow-neo-xs"
                />
              </div>
              <div>
                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-1">
                  Package ID
                </label>
                <input
                  type="text"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  className="w-full bg-surface border-2 border-ink rounded-xl px-3 py-2 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:bg-accent-yellow/20 shadow-neo-xs"
                />
              </div>
            </div>

            {/* Output Targets */}
            <div>
              <span className="block font-mono font-extrabold text-sm uppercase tracking-wide mb-2.5">
                📦 Output Targets (Inside <code className="bg-accent-yellow/50 px-1 border border-ink rounded">app/</code>)
              </span>
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs font-bold">
                <label className="flex items-center gap-2 p-2.5 bg-accent-green/20 border-2 border-ink rounded-xl cursor-pointer hover:bg-accent-green/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={chkAndroid}
                    onChange={(e) => setChkAndroid(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <span>📱 /android</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-accent-cyan/20 border-2 border-ink rounded-xl cursor-pointer hover:bg-accent-cyan/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={chkWindows}
                    onChange={(e) => setChkWindows(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <span>🪟 /windows</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-accent-pink/20 border-2 border-ink rounded-xl cursor-pointer hover:bg-accent-pink/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={chkDebian}
                    onChange={(e) => setChkDebian(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <span>🐧 /debian (.deb)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-accent-purple/20 border-2 border-ink rounded-xl cursor-pointer hover:bg-accent-purple/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={chkArch}
                    onChange={(e) => setChkArch(e.target.checked)}
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <span>🏹 /arch (PKGBUILD)</span>
                </label>
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={isConverting}
              className="w-full bg-accent-yellow text-ink py-4 rounded-2xl border-3 border-ink shadow-neo-md hover:shadow-neo-lg hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display font-black text-lg sm:text-xl tracking-tight transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Compiling Apps...</span>
                </>
              ) : (
                <>
                  <span>⚡ Convert to Native Apps</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>

          </div>

          {/* RIGHT: Terminal & Explorer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Terminal Card */}
            <div className="bg-[#121212] text-[#80FF72] border-3 border-ink rounded-2xl shadow-neo-md overflow-hidden font-mono text-xs sm:text-sm">
              <div className="bg-[#222222] text-white px-4 py-2.5 border-b-2 border-ink flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B8B] inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#80FF72] inline-block"></span>
                  <span className="text-xs text-gray-300 font-bold ml-2">Terminal: web2app-cli</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    status === "BUILDING"
                      ? "bg-accent-yellow text-ink animate-pulse"
                      : status === "COMPLETED"
                      ? "bg-accent-green text-ink"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* Terminal Logs */}
              <div className="p-4 h-64 overflow-y-auto space-y-1.5 leading-relaxed selection:bg-[#80FF72] selection:text-black">
                {logs.map((log, index) => (
                  <div key={index} className={log.color}>
                    {log.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Directory Tree */}
            <div className="bg-surface border-3 border-ink rounded-2xl p-4 sm:p-5 shadow-neo-sm">
              <div className="flex items-center justify-between border-b-2 border-ink pb-2.5 mb-3">
                <span className="font-mono font-black text-xs sm:text-sm uppercase flex items-center gap-1.5">
                  <Folder className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
                  Generated Directory: <code className="bg-accent-yellow px-1.5 py-0.5 rounded border border-ink">app/</code>
                </span>
                <span className="text-xs font-mono font-bold bg-accent-green px-2 py-0.5 rounded border border-ink">
                  4 Platforms Built
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {/* Android */}
                <div className="p-3 bg-accent-green/15 border-2 border-ink rounded-xl flex items-start justify-between">
                  <div>
                    <span className="font-bold flex items-center gap-1">📱 app/android</span>
                    <span className="text-[11px] text-ink/70 block mt-0.5">app-debug.apk + Gradle</span>
                  </div>
                  <button 
                    onClick={playClick}
                    className="px-2 py-1 bg-surface hover:bg-accent-green border border-ink rounded-lg text-[10px] font-bold shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    ⬇ View
                  </button>
                </div>

                {/* Windows */}
                <div className="p-3 bg-accent-cyan/15 border-2 border-ink rounded-xl flex items-start justify-between">
                  <div>
                    <span className="font-bold flex items-center gap-1">🪟 app/windows</span>
                    <span className="text-[11px] text-ink/70 block mt-0.5">launch.bat + install.ps1</span>
                  </div>
                  <button 
                    onClick={playClick}
                    className="px-2 py-1 bg-surface hover:bg-accent-cyan border border-ink rounded-lg text-[10px] font-bold shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    ⬇ View
                  </button>
                </div>

                {/* Debian */}
                <div className="p-3 bg-accent-pink/15 border-2 border-ink rounded-xl flex items-start justify-between">
                  <div>
                    <span className="font-bold flex items-center gap-1">🐧 app/debian</span>
                    <span className="text-[11px] text-ink/70 block mt-0.5">{pkgName}_1.0.0.deb</span>
                  </div>
                  <button 
                    onClick={playClick}
                    className="px-2 py-1 bg-surface hover:bg-accent-pink border border-ink rounded-lg text-[10px] font-bold shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    ⬇ View
                  </button>
                </div>

                {/* Arch */}
                <div className="p-3 bg-accent-purple/15 border-2 border-ink rounded-xl flex items-start justify-between">
                  <div>
                    <span className="font-bold flex items-center gap-1">🏹 app/arch</span>
                    <span className="text-[11px] text-ink/70 block mt-0.5">PKGBUILD + install.sh</span>
                  </div>
                  <button 
                    onClick={playClick}
                    className="px-2 py-1 bg-surface hover:bg-accent-purple border border-ink rounded-lg text-[10px] font-bold shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    ⬇ View
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
