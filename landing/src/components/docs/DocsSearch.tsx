"use client";

import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { playClick } from "@/lib/sound";

interface DocsSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount?: number;
}

export default function DocsSearch({
  query,
  onQueryChange,
  resultCount,
}: DocsSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.ctrlKey && e.key === "k") || (e.metaKey && e.key === "k")) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        playClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-full my-3">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-ink-muted absolute left-3.5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search docs, CLI flags, platforms, config (Press '/' or Ctrl+K)..."
          className="w-full bg-surface text-ink border-2 sm:border-3 border-ink pl-10 pr-20 py-2.5 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:bg-accent-yellow/15 shadow-neo-xs sm:shadow-neo-sm placeholder:text-ink-muted/60 transition-colors"
        />
        {query ? (
          <button
            onClick={() => {
              onQueryChange("");
              playClick();
            }}
            className="absolute right-3 p-1 hover:bg-accent-pink/30 text-ink"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-3 hidden sm:flex items-center gap-1 font-mono text-[10px] font-black text-ink-muted bg-surface-subtle border border-ink px-1.5 py-0.5 shadow-neo-xs">
            <span>/</span>
          </div>
        )}
      </div>

      {query && typeof resultCount === "number" && (
        <div className="mt-1.5 px-1 font-mono text-[11px] font-bold text-ink-muted flex items-center justify-between">
          <span>Found {resultCount} matching section{resultCount === 1 ? "" : "s"}</span>
          <button 
            onClick={() => onQueryChange("")} 
            className="text-accent-pink-dark underline uppercase text-[10px] font-black hover:opacity-80"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
