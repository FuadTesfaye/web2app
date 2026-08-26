"use client";

import React from "react";
import { Check, X, Zap } from "lucide-react";

export default function BenchmarkTable() {
  const rows = [
    {
      metric: "Package Bundle Size",
      web2app: "~4 KB – 1 MB",
      electron: "~120 MB – 250 MB",
      capacitor: "~15 MB – 40 MB",
      highlight: true,
    },
    {
      metric: "RAM Memory Usage",
      web2app: "~30 MB (Shared WebKit)",
      electron: "~250 MB – 600 MB",
      capacitor: "~80 MB – 120 MB",
      highlight: true,
    },
    {
      metric: "Target Platforms",
      web2app: "Android, Windows, Debian, Arch",
      electron: "Desktop Only",
      capacitor: "Mobile (Requires Plugins)",
      highlight: false,
    },
    {
      metric: "Live Web URL Support",
      web2app: "✔ Yes (1-command)",
      electron: "❌ Needs custom boilerplate",
      capacitor: "❌ Requires local build",
      highlight: true,
    },
    {
      metric: "Output Directory Structure",
      web2app: "Clean app/ (android, windows, debian, arch)",
      electron: "Scattered /dist /out",
      capacitor: "Heavy Android Studio Tree",
      highlight: false,
    },
    {
      metric: "Build Time",
      web2app: "⚡ ~1.4 Seconds",
      electron: "🐢 ~45 – 90 Seconds",
      capacitor: "🐢 ~30 – 60 Seconds",
      highlight: true,
    },
  ];

  return (
    <section id="benchmarks" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-block bg-accent-purple text-ink font-mono font-black text-xs px-3 py-1 rounded-md border-2 border-ink shadow-neo-xs uppercase tracking-wider mb-3">
          Performance Benchmarks
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
          How web2app Compares
        </h2>
        <p className="font-sans font-bold text-base sm:text-lg text-ink/75 max-w-xl mx-auto mt-3">
          Why bundle a 150MB Chromium binary when your operating system already has high-performance rendering engines?
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-surface border-4 border-ink rounded-3xl shadow-neo-lg overflow-x-auto">
        <table className="w-full text-left font-mono text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-accent-yellow border-b-3 border-ink font-black text-xs sm:text-sm uppercase tracking-wider">
              <th className="p-4 sm:p-5 border-r-3 border-ink">Metric / Feature</th>
              <th className="p-4 sm:p-5 bg-accent-green border-r-3 border-ink flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-ink fill-ink" /> ⚡ web2app
              </th>
              <th className="p-4 sm:p-5 border-r-3 border-ink">Electron</th>
              <th className="p-4 sm:p-5">Capacitor / Cordova</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink font-semibold">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-accent-yellow/10 transition-colors">
                <td className="p-4 sm:p-5 border-r-3 border-ink font-bold">
                  {row.metric}
                </td>
                <td className="p-4 sm:p-5 border-r-3 border-ink font-black text-accent-green-dark bg-accent-green/10">
                  {row.web2app}
                </td>
                <td className="p-4 sm:p-5 border-r-3 border-ink text-red-600">
                  {row.electron}
                </td>
                <td className="p-4 sm:p-5 text-yellow-700">
                  {row.capacitor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
}
