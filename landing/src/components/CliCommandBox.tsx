"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { playClick, playTone } from "@/lib/sound";

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
    <section id="cli-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y-3 border-ink bg-surface-subtle text-ink">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        
        <div className="inline-block bg-accent-green text-ink font-mono font-black text-xs px-3 py-1 border-2 border-ink shadow-neo-xs uppercase tracking-widest mb-3">
          [// 02 QUICK_COMMAND]
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tighter mb-4">
          Convert In One Shell Execution
        </h2>
        <p className="font-sans font-bold text-sm sm:text-base text-ink-muted max-w-lg mb-8">
          Run web2app directly via npx or add it to your project pipeline scripts.
        </p>

        {/* Command Box */}
        <div className="w-full max-w-2xl bg-surface border-4 border-ink shadow-neo-lg overflow-hidden text-left">
          
          {/* Tabs */}
          <div className="bg-surface border-b-3 border-ink px-4 py-2.5 flex items-center gap-2 overflow-x-auto font-mono text-xs font-black uppercase tracking-wider">
            {(["npx", "npm", "pnpm", "bun"] as const).map((pm) => (
              <button
                key={pm}
                onClick={() => {
                  setActivePm(pm);
                  playClick();
                }}
                className={`btn-sharp px-3.5 py-1.5 border-2 transition-all ${
                  activePm === pm
                    ? "bg-accent-yellow text-ink border-ink shadow-neo-xs"
                    : "bg-surface text-ink border-transparent hover:border-ink hover:bg-accent-yellow/30"
                }`}
              >
                {pm === "npx" ? "⚡ npx (Direct)" : pm}
              </button>
            ))}
          </div>

          {/* Snippet Area */}
          <div className="p-4 sm:p-6 bg-[#0C0D10] border-t border-gray-800 flex items-center justify-between gap-4 font-mono text-sm sm:text-base text-white">
            <code className="text-accent-yellow selection:bg-accent-pink selection:text-black overflow-x-auto whitespace-nowrap font-bold">
              {commands[activePm]}
            </code>

            <button
              onClick={handleCopy}
              className="btn-sharp shrink-0 bg-accent-yellow text-ink px-4 py-2 border-2 border-ink shadow-neo-xs hover:bg-accent-yellow/90 font-mono text-xs font-black uppercase flex items-center gap-1.5 tracking-wider"
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
