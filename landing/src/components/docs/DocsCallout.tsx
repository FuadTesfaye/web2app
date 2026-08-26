"use client";

import React from "react";
import { AlertCircle, CheckCircle, Info, Zap, AlertTriangle } from "lucide-react";

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
  const styles = {
    info: {
      bg: "bg-surface",
      border: "border-ink",
      accent: "bg-accent-cyan text-ink",
      icon: <Info className="w-4 h-4 text-ink shrink-0" />,
      defaultTitle: "NOTE",
    },
    tip: {
      bg: "bg-surface",
      border: "border-ink",
      accent: "bg-accent-green text-ink",
      icon: <CheckCircle className="w-4 h-4 text-ink shrink-0" />,
      defaultTitle: "TIP",
    },
    warning: {
      bg: "bg-surface",
      border: "border-ink",
      accent: "bg-accent-yellow text-ink",
      icon: <AlertTriangle className="w-4 h-4 text-ink shrink-0" />,
      defaultTitle: "WARNING",
    },
    important: {
      bg: "bg-surface",
      border: "border-ink",
      accent: "bg-accent-pink text-ink",
      icon: <Zap className="w-4 h-4 text-ink shrink-0" />,
      defaultTitle: "IMPORTANT",
    },
  }[type];

  return (
    <div className={`my-4 p-4 ${styles.bg} border-2 sm:border-3 ${styles.border} shadow-neo-xs sm:shadow-neo-sm flex flex-col gap-2 text-ink`}>
      <div className="flex items-center gap-2 font-mono font-black text-xs uppercase tracking-wider">
        <span className={`px-2 py-0.5 border border-ink ${styles.accent} flex items-center gap-1.5`}>
          {styles.icon}
          <span>{title || styles.defaultTitle}</span>
        </span>
      </div>
      <div className="font-sans text-xs sm:text-sm font-semibold text-ink-muted leading-relaxed pl-0.5">
        {children}
      </div>
    </div>
  );
}
