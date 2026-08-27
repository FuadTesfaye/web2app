"use client";

import React from "react";
import { 
  ChevronRight,
  BookOpen
} from "lucide-react";
import { playClick } from "@/lib/sound";

export interface DocCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: {
    id: string;
    title: string;
    badge?: string;
  }[];
}

interface DocsSidebarProps {
  categories: DocCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function DocsSidebar({
  categories,
  activeId,
  onSelect,
  isOpenMobile,
  onCloseMobile,
}: DocsSidebarProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-zinc-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 lg:sticky lg:top-[115px] lg:self-start z-40 lg:z-10 h-[calc(100vh-4rem)] lg:h-[calc(100vh-130px)] w-72 sm:w-76 bg-white dark:bg-zinc-950 border-r border-zinc-200/80 dark:border-zinc-800/80 p-4 lg:py-2 lg:pr-6 overflow-y-auto no-scrollbar transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-2 font-sans font-bold text-sm text-zinc-900 dark:text-zinc-100">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Documentation</span>
          </div>
          <span className="font-mono text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-200/60 dark:border-zinc-700/60">
            v0.1.0
          </span>
        </div>

        <div className="space-y-6 font-sans text-xs">
          {categories.map((category) => (
            <div key={category.id} className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[11.5px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2.5 py-1 select-none">
                <span className="opacity-80">{category.icon}</span>
                <span>{category.title}</span>
              </div>

              <div className="space-y-0.5">
                {category.items.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item.id);
                        playClick();
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[13px] font-medium transition-all ${
                        isActive
                          ? "bg-zinc-100 dark:bg-zinc-800/90 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md shrink-0 uppercase ml-1.5 ${
                          isActive
                            ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
