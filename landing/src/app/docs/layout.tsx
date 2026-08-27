"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docsTree } from "@/lib/docs-tree";

export default function RootDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-pattern flex flex-col selection:bg-accent-yellow selection:text-ink">
      <Navbar />
      <div className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <DocsLayout
          tree={docsTree}
          nav={{
            enabled: false, // Use our rich landing page Navbar with multi-theme switcher and sound FX
          }}
          sidebar={{
            collapsible: true,
            defaultOpenLevel: 1,
          }}
        >
          {children}
        </DocsLayout>
      </div>
    </div>
  );
}
