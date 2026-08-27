"use client";

import React from "react";
import { CheckCircle, Info, Zap, AlertTriangle } from "lucide-react";

interface DocsCalloutProps {
  type?: "info" | "tip" | "warning" | "important";
  title?: string;
  children: React.ReactNode;
}

export default function DocsCallout({
  type = "info",
  title,
  children,
}: DocsCalloutProps) {
  const icon = {
    info: <Info className="w-4 h-4 shrink-0 text-zinc-700 dark:text-zinc-300" />,
    tip: <CheckCircle className="w-4 h-4 shrink-0 text-zinc-700 dark:text-zinc-300" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0 text-zinc-700 dark:text-zinc-300" />,
    important: <Zap className="w-4 h-4 shrink-0 text-zinc-700 dark:text-zinc-300" />,
  }[type];

  const defaultTitle = {
    info: "Note",
    tip: "Tip",
    warning: "Warning",
    important: "Important",
  }[type];

  return (
    <div className="my-5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50 flex gap-3 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
      <div className="mt-0.5 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-sans font-semibold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-1">
          {title || defaultTitle}
        </h5>
        <div className="font-sans text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          {children}
        </div>
      </div>
    </div>
  );
}
