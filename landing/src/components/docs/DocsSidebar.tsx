"use client";

import React from "react";
import { BookOpen } from "lucide-react";
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container - Fixed on the left for viewport locking */}
      <aside
        className={`fixed top-14 left-0 bottom-0 z-40 lg:z-30 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-4 lg:py-6 lg:pl-6 lg:pr-4 overflow-y-auto no-scrollbar transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 font-sans font-bold text-sm text-zinc-900 dark:text-zinc-100">
            <BookOpen className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Documentation</span>
          </div>
          <span className="font-mono text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700">
            v0.1.0
          </span>
        </div>

        <div className="space-y-6 font-sans text-xs">
          {categories.map((category) => (
            <div key={category.id} className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2.5 py-1 select-none">
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
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[13px] transition-all ${
                        isActive
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-semibold shadow-2xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 uppercase ml-1.5 ${
                          isActive
                            ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold"
                            : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
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
