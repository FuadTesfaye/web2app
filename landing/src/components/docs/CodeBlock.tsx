"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
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
    <div className="my-4 bg-[#0C0D10] text-[#F8FAFC] border-2 sm:border-3 border-ink shadow-neo-sm overflow-hidden font-mono text-xs sm:text-sm w-full max-w-full">
      {/* Header / Tabs Bar */}
      <div className="bg-[#15171C] border-b-2 border-ink px-3 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {tabs && tabKeys.length > 0 ? (
          <div className="flex items-center gap-1.5 shrink-0">
            {tabKeys.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  playClick();
                }}
                className={`btn-sharp px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border transition-all ${
                  activeTab === tab
                    ? "bg-accent-yellow text-ink border-ink shadow-neo-xs font-black"
                    : "bg-[#1E222B] text-gray-300 border-transparent hover:border-ink hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 bg-[#FF5C8A] inline-block shrink-0"></span>
            <span className="w-2.5 h-2.5 bg-[#FEE75C] inline-block shrink-0"></span>
            <span className="w-2.5 h-2.5 bg-[#57F287] inline-block shrink-0"></span>
            {title ? (
              <span className="text-gray-300 font-bold text-xs truncate ml-1">{title}</span>
            ) : (
              <span className="text-gray-400 font-bold text-[11px] uppercase tracking-wider ml-1">
                {language}
              </span>
            )}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="btn-sharp shrink-0 bg-[#242933] text-gray-200 hover:text-white hover:bg-accent-yellow hover:text-ink px-2.5 py-1 border border-gray-600 hover:border-ink text-[11px] font-black uppercase flex items-center gap-1 transition-all"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent-green stroke-[3]" />
              <span className="text-accent-green">Copied</span>
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
      <div className="p-3.5 sm:p-4 overflow-x-auto no-scrollbar leading-relaxed">
        <pre className="text-gray-200 font-mono text-[11px] sm:text-xs leading-relaxed selection:bg-accent-yellow selection:text-black">
          <code>
            {showLineNumbers
              ? lines.map((line, idx) => (
                  <div key={idx} className="flex">
                    <span className="w-8 select-none text-gray-600 text-right pr-3 shrink-0 font-mono">
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
