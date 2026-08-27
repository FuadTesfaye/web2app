"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, FileCode } from "lucide-react";
import { playClick, playTone } from "@/lib/sound";

interface CodeBlockProps {
  tabs?: Record<string, string>;
  code?: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  tabs,
  code,
  language = "bash",
  title,
  showLineNumbers = false,
}: CodeBlockProps) {
  const tabKeys = tabs ? Object.keys(tabs) : [];
  const [activeTab, setActiveTab] = useState<string>(tabKeys.length > 0 ? tabKeys[0] : "");
  const [copied, setCopied] = useState(false);

  const currentCode = tabs ? tabs[activeTab] || "" : code || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode.trim());
      setCopied(true);
      playClick();
      playTone(880, "sine", 0.08);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const lines = currentCode.split("\n");

  return (
    <div className="my-5 border-3 border-ink bg-surface text-ink shadow-neo-sm overflow-hidden font-mono text-xs sm:text-[13px] w-full max-w-full">
      {/* Header / Tabs Bar */}
      <div className="bg-surface-subtle border-b-2 border-ink px-3.5 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {tabs && tabKeys.length > 0 ? (
          <div className="flex items-center gap-1.5 shrink-0">
            {tabKeys.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    playClick();
                    playTone(600, "triangle", 0.05);
                  }}
                  className={`px-2.5 py-1 text-xs border-2 transition-all font-mono font-bold uppercase ${
                    isActive
                      ? "bg-accent-yellow text-ink border-ink shadow-neo-xs"
                      : "bg-surface text-ink-muted border-transparent hover:border-ink hover:text-ink"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1 mr-1 select-none">
              <span className="w-2.5 h-2.5 bg-accent-pink border border-ink inline-block"></span>
              <span className="w-2.5 h-2.5 bg-accent-yellow border border-ink inline-block"></span>
              <span className="w-2.5 h-2.5 bg-accent-green border border-ink inline-block"></span>
            </div>
            {title ? (
              <span className="text-ink font-mono font-bold text-xs truncate flex items-center gap-1.5 uppercase">
                <FileCode className="w-3.5 h-3.5 text-accent-cyan" />
                {title}
              </span>
            ) : (
              <span className="text-ink-muted font-mono font-bold text-xs flex items-center gap-1.5 uppercase">
                <Terminal className="w-3 h-3 text-ink" />
                {language}
              </span>
            )}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 border-2 border-ink bg-surface text-ink shadow-neo-xs hover:bg-accent-yellow active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-mono font-bold uppercase"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Snippet Content */}
      <div className="p-4 bg-surface-subtle/40 overflow-x-auto no-scrollbar leading-relaxed">
        <pre className="text-ink font-mono text-[12px] sm:text-[13px] leading-relaxed selection:bg-accent-yellow selection:text-ink">
          <code>
            {showLineNumbers
              ? lines.map((line, idx) => (
                  <div key={idx} className="flex">
                    <span className="w-8 select-none text-ink-muted text-right pr-4 shrink-0 font-mono text-[11px] opacity-60">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                ))
              : currentCode}
          </code>
        </pre>
      </div>
    </div>
  );
}
