"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { playClick, playTone } from "../lib/sound";

export default function CliCommandBox() {
  const [activePm, setActivePm] = useState<"npx" | "npm" | "pnpm" | "bun">("npx");
  const [copied, setCopied] = useState(false);

  const commands = {
    npx: "npx web2app https://your-website.com",
    npm: "npm install -g web2app && web2app build",
    pnpm: "pnpm dlx web2app https://your-website.com",
    bun: "bunx web2app https://your-website.com",
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commands[activePm]);
      setCopied(true);
      playClick();
      playTone(880, "sine", 0.08);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section id="cli-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y-3 border-ink bg-accent-yellow/20">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        
        <div className="inline-block bg-accent-green text-ink font-mono font-black text-xs px-3 py-1 rounded-md border-2 border-ink shadow-neo-xs uppercase tracking-wider mb-3">
          Zero Setup Required
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mb-4">
          Convert In One Shell Command
        </h2>
        <p className="font-sans font-bold text-sm sm:text-base text-ink/75 max-w-lg mb-8">
          Run web2app directly via npx or add it to your project scripts.
        </p>

        {/* Command Box */}
        <div className="w-full max-w-2xl bg-surface border-4 border-ink rounded-3xl shadow-neo-lg overflow-hidden text-left">
          
          {/* Tabs */}
          <div className="bg-surface border-b-3 border-ink px-4 py-2.5 flex items-center gap-2 overflow-x-auto font-mono text-xs font-bold">
            {(["npx", "npm", "pnpm", "bun"] as const).map((pm) => (
              <button
                key={pm}
                onClick={() => {
                  setActivePm(pm);
                  playClick();
                }}
                className={`px-3 py-1.5 rounded-xl border-2 transition-all ${
                  activePm === pm
                    ? "bg-accent-yellow border-ink shadow-neo-xs font-black"
                    : "bg-surface border-transparent hover:border-ink hover:bg-accent-yellow/30"
                }`}
              >
                {pm === "npx" ? "⚡ npx (Direct)" : pm}
              </button>
            ))}
          </div>

          {/* Snippet Area */}
          <div className="p-4 sm:p-6 bg-[#121212] flex items-center justify-between gap-4 font-mono text-sm sm:text-base text-white">
            <code className="text-accent-yellow selection:bg-accent-pink selection:text-black overflow-x-auto whitespace-nowrap">
              {commands[activePm]}
            </code>

            <button
              onClick={handleCopy}
              className="shrink-0 bg-accent-yellow text-ink px-4 py-2 rounded-xl border-2 border-ink shadow-neo-xs hover:bg-accent-yellow/90 active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-bold flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-ink stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-ink" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
