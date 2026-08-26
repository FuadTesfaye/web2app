"use client";

import React from "react";
import { 
  Terminal, 
  Layers, 
  Settings, 
  CheckSquare, 
  HelpCircle, 
  Cpu, 
  Code2,
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
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 lg:sticky lg:top-20 z-40 lg:z-10 h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)] w-72 sm:w-80 bg-surface border-r-3 border-ink p-4 overflow-y-auto no-scrollbar transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? "translate-x-0 shadow-neo-lg" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-ink">
          <div className="flex items-center gap-2 font-display font-black text-sm uppercase tracking-tight text-ink">
            <BookOpen className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
            <span>Docs Navigation</span>
          </div>
          <span className="font-mono text-[10px] font-bold bg-accent-pink text-ink px-1.5 py-0.2 border border-ink shadow-neo-xs uppercase">
            v0.1.0
          </span>
        </div>

        <div className="space-y-6 font-mono text-xs">
          {categories.map((category) => (
            <div key={category.id} className="space-y-1.5">
              <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-wider text-ink-muted px-2 py-1">
                {category.icon}
                <span>{category.title}</span>
              </div>

              <div className="space-y-1 pl-1">
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
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 border-2 text-left font-bold transition-all ${
                        isActive
                          ? "bg-accent-yellow text-ink border-ink shadow-neo-xs font-black"
                          : "bg-transparent text-ink border-transparent hover:border-ink/40 hover:bg-surface-subtle"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <ChevronRight className={`w-3 h-3 shrink-0 ${isActive ? "text-ink stroke-[3]" : "text-ink-muted/40"}`} />
                        <span className="truncate">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1 py-0.2 border border-ink/40 bg-surface text-ink shrink-0 uppercase ml-1">
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
