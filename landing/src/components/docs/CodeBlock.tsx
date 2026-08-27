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
    <div className="my-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs overflow-hidden font-mono text-xs sm:text-[13px] w-full max-w-full">
      {/* Header / Tabs Bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-3.5 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {tabs && tabKeys.length > 0 ? (
          <div className="flex items-center gap-1 shrink-0">
            {tabKeys.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    playClick();
                  }}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all font-sans font-medium ${
                    isActive
                      ? "bg-zinc-800 text-white shadow-2xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 mr-1 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block"></span>
            </div>
            {title ? (
              <span className="text-zinc-300 font-sans font-medium text-xs truncate flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                {title}
              </span>
            ) : (
              <span className="text-zinc-400 font-sans text-xs flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-zinc-500" />
                {language}
              </span>
            )}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-zinc-100 stroke-[2.5]" />
              <span className="text-zinc-100 font-medium">Copied</span>
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
      <div className="p-4 overflow-x-auto no-scrollbar leading-relaxed">
        <pre className="text-zinc-200 font-mono text-[12px] sm:text-[13px] leading-relaxed selection:bg-zinc-700 selection:text-white">
          <code>
            {showLineNumbers
              ? lines.map((line, idx) => (
                  <div key={idx} className="flex">
                    <span className="w-8 select-none text-zinc-600 text-right pr-4 shrink-0 font-mono text-[11px]">
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
