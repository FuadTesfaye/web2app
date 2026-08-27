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
  const styles = {
    info: {
      container: "bg-blue-500/5 border-blue-500/20 text-blue-950 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-900 dark:text-blue-200",
      textColor: "text-blue-900/80 dark:text-blue-200/80",
      icon: <Info className="w-4 h-4 shrink-0" />,
      defaultTitle: "Note",
    },
    tip: {
      container: "bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-100",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      titleColor: "text-emerald-900 dark:text-emerald-200",
      textColor: "text-emerald-900/80 dark:text-emerald-200/80",
      icon: <CheckCircle className="w-4 h-4 shrink-0" />,
      defaultTitle: "Tip",
    },
    warning: {
      container: "bg-amber-500/5 border-amber-500/20 text-amber-950 dark:text-amber-100",
      iconColor: "text-amber-600 dark:text-amber-400",
      titleColor: "text-amber-900 dark:text-amber-200",
      textColor: "text-amber-900/80 dark:text-amber-200/80",
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
      defaultTitle: "Warning",
    },
    important: {
      container: "bg-violet-500/5 border-violet-500/20 text-violet-950 dark:text-violet-100",
      iconColor: "text-violet-600 dark:text-violet-400",
      titleColor: "text-violet-900 dark:text-violet-200",
      textColor: "text-violet-900/80 dark:text-violet-200/80",
      icon: <Zap className="w-4 h-4 shrink-0" />,
      defaultTitle: "Important",
    },
  }[type];

  return (
    <div className={`my-5 p-4 rounded-xl border ${styles.container} flex gap-3 text-sm leading-relaxed`}>
      <div className={`mt-0.5 ${styles.iconColor}`}>
        {styles.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className={`font-sans font-semibold text-xs uppercase tracking-wider mb-1 ${styles.titleColor}`}>
          {title || styles.defaultTitle}
        </h5>
        <div className={`font-sans text-[13.5px] leading-relaxed ${styles.textColor}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
