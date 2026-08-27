import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docsTree } from "@/lib/docs-tree";

export default function RootDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayout
      tree={docsTree}
      nav={{
        title: (
          <div className="flex items-center gap-2 font-bold font-head text-base tracking-tight text-zinc-900 dark:text-white">
            <span className="w-6 h-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded flex items-center justify-center font-mono text-xs shadow-sm">
              ⚡
            </span>
            <span>web2app</span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              v0.1.0
            </span>
          </div>
        ),
      }}
      links={[
        {
          text: "Overview",
          url: "/",
        },
        {
          text: "GitHub",
          url: "https://github.com/FuadTesfaye/web2app",
          external: true,
        },
      ]}
      sidebar={{
        collapsible: true,
        defaultOpenLevel: 1,
      }}
    >
      {children}
    </DocsLayout>
  );
}
