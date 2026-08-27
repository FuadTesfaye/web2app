"use client";

import React, { useRef, useEffect } from "react";
import { Search, X, Command } from "lucide-react";
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
    <div className="relative w-full max-w-full my-4">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search documentation, CLI commands, configs..."
          className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-24 py-2.5 font-sans text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
        />
        {query ? (
          <button
            onClick={() => {
              onQueryChange("");
              playClick();
            }}
            className="absolute right-3 p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-3 hidden sm:flex items-center gap-1 font-mono text-[11px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded-md">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        )}
      </div>

      {query && typeof resultCount === "number" && (
        <div className="mt-2 px-1 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between font-sans">
          <span>Found <strong className="text-zinc-800 dark:text-zinc-200">{resultCount}</strong> matching section{resultCount === 1 ? "" : "s"}</span>
          <button 
            onClick={() => onQueryChange("")} 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
