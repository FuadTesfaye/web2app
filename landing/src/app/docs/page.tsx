"use client";

import React, { useState, useMemo, useEffect } from "react";
import DocsSidebar, { DocCategory } from "@/components/docs/DocsSidebar";
import DocsSearch from "@/components/docs/DocsSearch";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsCallout from "@/components/docs/DocsCallout";
import { 
  Rocket, 
  Cpu, 
  Layers, 
  Code2, 
  Terminal, 
  Settings, 
  ShieldCheck, 
  Menu, 
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Monitor,
  Disc,
  Link2,
  ChevronUp,
  Github,
  Home,
  Bot,
  Sparkles
} from "lucide-react";
import { playClick } from "@/lib/sound";

const categories: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Rocket className="w-3.5 h-3.5 text-zinc-400" />,
    items: [
      { id: "intro", title: "Introduction", badge: "Overview" },
      { id: "quick-start", title: "Quick Start", badge: "10s" },
      { id: "installation", title: "Installation" },
      { id: "init-wizard", title: "Project Init Wizard" },
    ],
  },
  {
    id: "architecture",
    title: "Core Architecture",
    icon: <Cpu className="w-3.5 h-3.5 text-zinc-400" />,
    items: [
      { id: "zero-bloat", title: "Zero Runtime Bloat", badge: "vs Electron" },
      { id: "output-structure", title: "app/ Directory Tree" },
      { id: "webview-asset-loader", title: "WebViewAssetLoader" },
      { id: "deb-packager-engine", title: "Pure TS DebPackager" },
    ],
  },
  {
    id: "platforms",
    title: "Target Platforms",
    icon: <Layers className="w-3.5 h-3.5 text-zinc-400" />,
    items: [
      { id: "platform-android", title: "Android APK & AAB", badge: "Kotlin" },
      { id: "platform-windows", title: "Windows Desktop", badge: "Edge / Webview2" },
      { id: "platform-debian", title: "Debian & Ubuntu (.deb)", badge: "DebPackager" },
      { id: "platform-arch", title: "Arch Linux (PKGBUILD)", badge: "AUR" },
    ],
  },
  {
    id: "frameworks",
    title: "Framework Recipes",
    icon: <Code2 className="w-3.5 h-3.5 text-zinc-400" />,
    items: [
      { id: "framework-nextjs", title: "Next.js (App / Pages)", badge: "Static" },
      { id: "framework-vite", title: "Vite / React / Vue / Svelte" },
      { id: "framework-python", title: "Python (Streamlit/Flask)" },
      { id: "framework-live-urls", title: "Live Web URLs" },
    ],
  },
  {
    id: "cli-reference",
    title: "CLI Reference",
    icon: <Terminal className="w-3.5 h-3.5 text-zinc-400" />,
    items: [
      { id: "cli-build", title: "web2app build" },
      { id: "cli-init", title: "web2app init" },
      { id: "cli-doctor", title: "web2app doctor", badge: "Diagnostic" },
      { id: "cli-run", title: "web2app run" },
      { id: "cli-clean", title: "web2app clean" },
      { id: "cli-open", title: "web2app open" },
      { id: "cli-skill", title: "web2app skill", badge: "AI" },
    ],
  },
  {
    id: "config-reference",
    title: "Configuration",
    icon: <Settings className="w-3.5 h-3.5 text-zinc-400" />,
    items: [
      { id: "config-schema", title: "web2app.config.ts", badge: "Schema" },
      { id: "config-android", title: "Android Options" },
    ],
  },
  {
    id: "ai-skills",
    title: "AI & Agent Integration",
    icon: <Bot className="w-3.5 h-3.5 text-zinc-400" />,
    items: [
      { id: "ai-skill-guide", title: "AI Agent Skill (SKILL.md)", badge: "Antigravity" },
      { id: "ai-prompt-recipes", title: "Prompt Recipes for AI", badge: "Copilot" },
    ],
  },
  {
    id: "production",
    title: "Production & CI/CD",
    icon: <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />,
    items: [
      { id: "android-keystore", title: "Release Signing & Keystores" },
      { id: "ci-cd", title: "GitHub Actions CI/CD" },
      { id: "troubleshooting", title: "Troubleshooting & FAQ" },
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Flattened list of all topics
  const allDocItems = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.items.map((item) => ({
        ...item,
        categoryTitle: cat.title,
      }))
    );
  }, []);

  // Search filter
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allDocItems;
    const q = searchQuery.toLowerCase();
    return allDocItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.categoryTitle.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
    );
  }, [searchQuery, allDocItems]);

  // Current item index for prev/next buttons
  const currentIndex = useMemo(() => {
    return allDocItems.findIndex((item) => item.id === activeSection);
  }, [activeSection, allDocItems]);

  const prevItem = currentIndex > 0 ? allDocItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allDocItems.length - 1 ? allDocItems[currentIndex + 1] : null;

  // Scroll spy to highlight active section in sidebar and TOC
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const sectionElements = allDocItems
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      const scrollPosition = window.scrollY + 140;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveSection(el.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allDocItems]);

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    const elem = document.getElementById(id);
    if (elem) {
      const yOffset = -80;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/docs#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    playClick();
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    playClick();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      
      {/* Top Header - Fixed at Top */}
      <header className="sticky top-0 z-50 h-14 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a 
            href="/"
            onClick={playClick}
            className="flex items-center gap-2 font-display font-black text-lg tracking-tight uppercase text-zinc-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            <span className="w-7 h-7 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-sm">
              ⚡
            </span>
            <span>web2app</span>
          </a>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">/</span>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hidden sm:inline">
            Docs
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            onClick={playClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </a>
          <a
            href="https://github.com/FuadTesfaye/web2app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">GitHub</span>
          </a>
          <button
            onClick={() => {
              setMobileSidebarOpen(!mobileSidebarOpen);
              playClick();
            }}
            className="lg:hidden p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Docs Body Layout: Fixed Sidebars + Only Content Scrolls */}
      <div className="w-full relative">
        
        {/* Fixed Left Navigation Sidebar */}
        <DocsSidebar
          categories={categories}
          activeId={activeSection}
          onSelect={handleSelectSection}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Center Main Scrollable Content */}
        <div className="lg:pl-72 xl:pr-64 w-full">
          <main className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
            
            {/* Header / Intro */}
            <div className="mb-10 pb-8 border-b border-zinc-200 dark:border-zinc-800">
              <div className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700 mb-3">
                <span>Documentation & Reference</span>
              </div>
              <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight leading-tight">
                web2app Manual
              </h1>
              <p className="text-base sm:text-[17px] text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                Transform web applications and live URLs into native standalone Android, Windows, Debian, and Arch packages with zero runtime overhead.
              </p>

              {/* Real-time search bar */}
              <DocsSearch
                query={searchQuery}
                onQueryChange={setSearchQuery}
                resultCount={filteredItems.length}
              />
            </div>

            {/* Quick search filter results */}
            {searchQuery.trim() !== "" && (
              <div className="mb-10 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Matching Topics ({filteredItems.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleSelectSection(item.id);
                        playClick();
                      }}
                      className="p-3 bg-white dark:bg-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-600 border border-zinc-200 dark:border-zinc-700 rounded-lg text-left transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-medium">{item.categoryTitle}</span>
                        <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white truncate block mt-0.5">{item.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white shrink-0 ml-2 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================================================
                DOCUMENTATION SECTIONS (STRICTLY MONOCHROME / BASE COLORING)
                ========================================================================== */}
            <div className="space-y-16">
              
              {/* SECTION: INTRO */}
              <section id="intro" className="scroll-mt-20">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">01.1 Overview</span>
                  <button 
                    onClick={() => handleCopyLink("intro")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                    title="Copy section link"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "intro" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  What is web2app?
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">web2app</strong> is a modern, high-performance CLI compiler and packaging engine designed to transform web applications (Next.js, Vite, React, Vue, Python) or any live web URL into native, standalone desktop and mobile applications with <strong>zero runtime bloat</strong>.
                </p>

                <DocsCallout type="tip" title="Core Philosophy">
                  Unlike traditional hybrid frameworks like Electron (which bundles a 150MB+ Chromium binary) or Cordova (which requires heavy plugin scaffolding), web2app uses your operating system’s built-in web rendering engines (AndroidX WebKit, MS Edge WebView2, native Linux XDG WebKit).
                </DocsCallout>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
                  <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">Bundle Footprint</span>
                    <h4 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 mt-1">~4 KB – 1 MB</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">Over 99% smaller than typical Electron builds.</p>
                  </div>
                  <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">Compile Speed</span>
                    <h4 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 mt-1">~1.4 Seconds</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">Pure TypeScript packager engine with zero native dependencies.</p>
                  </div>
                  <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">Platforms</span>
                    <h4 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 mt-1">4 Native Targets</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">Android APK, Windows Desktop, Debian/Ubuntu, and Arch Linux.</p>
                  </div>
                </div>
              </section>

              {/* SECTION: QUICK START */}
              <section id="quick-start" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">01.2 Quick Start</span>
                  <button 
                    onClick={() => handleCopyLink("quick-start")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "quick-start" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  1-Command Instant Conversion
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  You can convert any live web URL or local project immediately using <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-md font-mono text-xs border border-zinc-200 dark:border-zinc-700">npx</code> without installing anything globally:
                </p>

                <CodeBlock
                  tabs={{
                    "Live URL": "npx web2app https://news.ycombinator.com",
                    "Local Next.js": "npx web2app build",
                    "Target Android Only": "npx web2app build android",
                    "Target Windows Only": "npx web2app build windows",
                  }}
                />

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
                  This analyzes your web project, generates native wrappers, and outputs complete standalone packages into the <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">app/</code> directory.
                </p>
              </section>

              {/* SECTION: INSTALLATION */}
              <section id="installation" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">01.3 Installation</span>
                  <button 
                    onClick={() => handleCopyLink("installation")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "installation" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Global CLI Installation
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  To use the <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-md font-mono text-xs border border-zinc-200 dark:border-zinc-700">web2app</code> command anywhere in your terminal, install it globally via your favorite package manager:
                </p>

                <CodeBlock
                  tabs={{
                    npm: "npm install -g web2app",
                    pnpm: "pnpm add -g web2app",
                    yarn: "yarn global add web2app",
                    bun: "bun add -g web2app",
                  }}
                />

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
                  After installation, verify that the CLI is ready:
                </p>

                <CodeBlock code="web2app --version" language="bash" />
              </section>

              {/* SECTION: INIT WIZARD */}
              <section id="init-wizard" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">01.4 Configuration Wizard</span>
                  <button 
                    onClick={() => handleCopyLink("init-wizard")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "init-wizard" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Project Initialization Wizard
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Run <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">web2app init</code> inside your project root to interactively configure your app name, package ID, target platforms, and icons:
                </p>

                <CodeBlock code="web2app init" language="bash" />

                <DocsCallout type="info" title="Automated Initialization">
                  To skip interactive prompts and generate defaults automatically based on your <code>package.json</code>:
                  <div className="mt-2 font-mono font-semibold text-zinc-900 dark:text-zinc-100">web2app init --yes</div>
                </DocsCallout>
              </section>

              {/* ==========================================================================
                  CATEGORY 2: ARCHITECTURE & ENGINE
                  ========================================================================== */}

              {/* SECTION: ZERO BLOAT */}
              <section id="zero-bloat" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">02.1 Architecture</span>
                  <button 
                    onClick={() => handleCopyLink("zero-bloat")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "zero-bloat" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Zero-Runtime Overhead Architecture
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Traditional desktop frameworks package entire browser binaries, rendering engines, and Node.js runtimes into each application. web2app takes an architectural approach that relies on native operating system WebViews:
                </p>

                <div className="bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 my-6">
                  <div className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-zinc-300 dark:border-zinc-700">1</span>
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Android: AndroidX WebViewAssetLoader</h4>
                      <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        Uses Android’s native WebKit with secure local asset loading, GPU hardware acceleration, and full HTML5 IndexedDB storage support.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                    <span className="w-7 h-7 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-zinc-300 dark:border-zinc-700">2</span>
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Windows: MS Edge / Chromium App Mode</h4>
                      <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        Leverages Microsoft Edge App Mode with custom window boundaries, silent VBScript launch runners, and Start Menu registry shortcuts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                    <span className="w-7 h-7 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-zinc-300 dark:border-zinc-700">3</span>
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Linux: Pure TypeScript DebPackager</h4>
                      <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        Generates valid Debian binary .deb packages with XDG desktop application entries and scalable SVG/PNG icon hierarchies without requiring dpkg on the host machine.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: OUTPUT STRUCTURE */}
              <section id="output-structure" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">02.2 Output Structure</span>
                  <button 
                    onClick={() => handleCopyLink("output-structure")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "output-structure" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  The <code className="font-mono text-xl bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">app/</code> Directory Tree
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  When you run a build, web2app outputs clean, dedicated subdirectories inside the <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">app/</code> folder:
                </p>

                <CodeBlock
                  code={`app/
├── android/
│   ├── app-debug.apk                 # Standalone installable Android APK
│   ├── app/src/main/AndroidManifest.xml
│   ├── app/src/main/java/.../MainActivity.kt
│   ├── app/src/main/assets/web/      # Injected static web bundle
│   └── gradlew, gradlew.bat, build.gradle.kts
│
├── windows/
│   ├── launch.bat                    # Windows CMD batch launcher
│   ├── launch.ps1                    # PowerShell runner
│   ├── start.vbs                     # Silent background launcher
│   ├── install.bat                   # Start Menu shortcut installer
│   └── app.ico, manifest.json
│
├── debian/
│   ├── com.example.myapp_1.0.0_all.deb # Ready-to-install Debian package
│   ├── com.example.myapp.desktop      # XDG Desktop application launcher
│   └── icon.svg                      # Scalable vector application icon
│
└── arch/
    ├── PKGBUILD                      # Arch Linux package build recipe
    ├── .SRCINFO                      # Arch package metadata
    └── install.sh                    # Automated makepkg -si script`}
                  language="text"
                  title="Generated File Tree"
                />
              </section>

              {/* SECTION: WEBVIEW ASSET LOADER */}
              <section id="webview-asset-loader" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">02.3 Asset Loader</span>
                  <button 
                    onClick={() => handleCopyLink("webview-asset-loader")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "webview-asset-loader" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  AndroidX WebViewAssetLoader & CORS Elimination
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Loading local HTML files using the traditional <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">file:///android_asset/</code> scheme breaks modern web APIs like <code className="font-mono text-xs">fetch()</code>, CORS, localStorage, and Web Workers.
                </p>

                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  web2app injects <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">AndroidX WebViewAssetLoader</strong>, which routes all requests through a secure virtual HTTPS domain:
                </p>

                <CodeBlock
                  code={`https://appassets.androidplatform.net/assets/index.html`}
                  language="text"
                  title="Virtual HTTPS Origin"
                />

                <DocsCallout type="tip" title="Benefits of Virtual HTTPS Origin">
                  <ul className="list-disc pl-4 space-y-1 text-xs sm:text-[13.5px]">
                    <li>Full CORS-compliant <code className="font-mono text-xs">fetch()</code> and <code className="font-mono text-xs">XMLHttpRequest</code>.</li>
                    <li>Secure Web Storage, IndexedDB, and CacheStorage APIs.</li>
                    <li>Web Workers and WebAssembly execution without origin sandbox restrictions.</li>
                  </ul>
                </DocsCallout>
              </section>

              {/* SECTION: DEB PACKAGER ENGINE */}
              <section id="deb-packager-engine" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">02.4 DebPackager</span>
                  <button 
                    onClick={() => handleCopyLink("deb-packager-engine")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "deb-packager-engine" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Pure TypeScript Debian Packager
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Traditionally, building Debian <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">.deb</code> packages requires Linux with <code className="font-mono text-xs">dpkg-deb</code>, <code className="font-mono text-xs">ar</code>, and <code className="font-mono text-xs">tar</code> installed.
                </p>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  web2app includes <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">DebPackager</strong>, a standalone pure TypeScript AR and Tar packaging engine. It computes md5sums, sets correct Unix permissions, generates control metadata, and writes valid binary <code className="font-mono text-xs">.deb</code> archives on <strong>macOS, Windows, and Linux</strong> with zero native host dependencies.
                </p>
              </section>

              {/* ==========================================================================
                  CATEGORY 3: TARGET PLATFORMS
                  ========================================================================== */}

              {/* SECTION: ANDROID */}
              <section id="platform-android" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">03.1 Target Platforms</span>
                  <button 
                    onClick={() => handleCopyLink("platform-android")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "platform-android" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
                  <Smartphone className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                  <span>Android Platform Target</span>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  The Android target compiles a native Kotlin Android wrapper with Material 3 styling, hardware acceleration, and full offline WebKit capabilities:
                </p>

                <CodeBlock
                  tabs={{
                    "Debug APK": "web2app build android",
                    "Release APK": "web2app build android --release",
                    "App Bundle (.aab)": "web2app build android --bundle",
                    "Run on Device": "web2app run android",
                  }}
                />

                <div className="my-6 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-200/60 dark:divide-zinc-800 text-xs sm:text-[13px]">
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Min SDK:</span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono">API 24 (Android 7.0+ / 95%+ devices)</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Target & Compile SDK:</span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono">API 35 (Android 15)</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Output File:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono font-medium">app/android/app-debug.apk</span>
                  </div>
                </div>
              </section>

              {/* SECTION: WINDOWS */}
              <section id="platform-windows" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">03.2 Target Platforms</span>
                  <button 
                    onClick={() => handleCopyLink("platform-windows")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "platform-windows" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
                  <Monitor className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                  <span>Windows Desktop Platform Target</span>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  The Windows target scaffolds a clean, standalone desktop application running on Microsoft Edge / Chromium WebView2:
                </p>

                <CodeBlock
                  tabs={{
                    "Build Windows": "web2app build windows",
                    "Launch via Batch": "cd app/windows && launch.bat",
                    "Install Shortcuts": "cd app/windows && install.bat",
                  }}
                />

                <DocsCallout type="tip" title="Zero Installation Required">
                  Windows 10 and 11 already ship with Microsoft Edge WebView2 preinstalled. The generated Windows app starts instantly with zero runtime downloads.
                </DocsCallout>
              </section>

              {/* SECTION: DEBIAN */}
              <section id="platform-debian" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">03.3 Target Platforms</span>
                  <button 
                    onClick={() => handleCopyLink("platform-debian")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "platform-debian" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
                  <Disc className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                  <span>Debian & Ubuntu Platform Target</span>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Builds ready-to-distribute binary <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">.deb</code> packages for Debian, Ubuntu, Linux Mint, and Pop!_OS:
                </p>

                <CodeBlock
                  tabs={{
                    "Build .deb": "web2app build debian",
                    "Install on Linux": "sudo dpkg -i app/debian/com.example.myapp_1.0.0_all.deb",
                    "Remove": "sudo apt remove com.example.myapp",
                  }}
                />
              </section>

              {/* SECTION: ARCH */}
              <section id="platform-arch" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">03.4 Target Platforms</span>
                  <button 
                    onClick={() => handleCopyLink("platform-arch")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "platform-arch" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
                  <Terminal className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                  <span>Arch Linux & AUR Platform Target</span>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Generates an Arch Linux User Repository (AUR) compliant <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">PKGBUILD</code> recipe and automated installation script:
                </p>

                <CodeBlock
                  tabs={{
                    "Build Arch": "web2app build arch",
                    "Install on Arch": "cd app/arch && ./install.sh",
                    "Manual makepkg": "cd app/arch && makepkg -si",
                  }}
                />
              </section>

              {/* ==========================================================================
                  CATEGORY 4: FRAMEWORK RECIPES
                  ========================================================================== */}

              {/* SECTION: NEXTJS */}
              <section id="framework-nextjs" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">04.1 Framework Guides</span>
                  <button 
                    onClick={() => handleCopyLink("framework-nextjs")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "framework-nextjs" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Next.js App & Pages Router Guide
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  web2app automatically detects Next.js projects and checks for static export configuration.
                </p>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 font-medium">
                  1. In your <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">next.config.mjs</code> or <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">next.config.js</code>, configure static export:
                </p>

                <CodeBlock
                  code={`/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static HTML export to out/
  images: {
    unoptimized: true, // Required for offline native image assets
  },
};

export default nextConfig;`}
                  language="javascript"
                  title="next.config.mjs"
                />

                <p className="text-sm text-zinc-600 dark:text-zinc-400 my-3 font-medium">
                  2. Run web2app build in your Next.js project root:
                </p>

                <CodeBlock code="npx web2app build" language="bash" />
              </section>

              {/* SECTION: VITE */}
              <section id="framework-vite" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">04.2 Framework Guides</span>
                  <button 
                    onClick={() => handleCopyLink("framework-vite")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "framework-vite" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Vite / React / Vue / Svelte Guide
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  For Vite-based Single Page Apps, web2app detects your build script and ingests the <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">dist/</code> directory automatically:
                </p>

                <CodeBlock
                  tabs={{
                    "Direct Build": "npx web2app build",
                    "Custom Out Dir": "npx web2app build --out custom-app",
                  }}
                />
              </section>

              {/* SECTION: PYTHON */}
              <section id="framework-python" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">04.3 Framework Guides</span>
                  <button 
                    onClick={() => handleCopyLink("framework-python")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "framework-python" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Python (Streamlit / Flask / FastAPI)
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Convert local or hosted Python web dashboards into native apps:
                </p>

                <CodeBlock
                  tabs={{
                    "Local Streamlit": 'npx web2app http://localhost:8501 --app-name "Data App"',
                    "Hosted FastAPI": "npx web2app https://api.my-dashboard.com",
                  }}
                />
              </section>

              {/* SECTION: LIVE URLS */}
              <section id="framework-live-urls" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">04.4 Framework Guides</span>
                  <button 
                    onClick={() => handleCopyLink("framework-live-urls")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "framework-live-urls" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Live Web URLs & PWAs
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  You can turn any live website into standalone native apps with a single execution:
                </p>

                <CodeBlock
                  code={'npx web2app https://news.ycombinator.com --app-name "Hacker News" --package-name "com.ycombinator.news"'}
                  language="bash"
                />
              </section>

              {/* ==========================================================================
                  CATEGORY 5: CLI COMMAND REFERENCE
                  ========================================================================== */}

              {/* SECTION: CLI BUILD */}
              <section id="cli-build" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">05.1 CLI Reference</span>
                  <button 
                    onClick={() => handleCopyLink("cli-build")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "cli-build" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  <code className="font-mono text-2xl">web2app build</code>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Compiles and packages applications for target platforms.
                </p>

                <CodeBlock code="web2app build [platformOrUrl] [options]" language="bash" />

                <div className="overflow-x-auto my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <table className="w-full text-left font-sans text-xs sm:text-[13px] border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 font-semibold">
                        <th className="p-3.5">Option</th>
                        <th className="p-3.5">Default</th>
                        <th className="p-3.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-300">
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">[platformOrUrl]</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">all</td>
                        <td className="p-3.5">Target platform (<code className="font-mono text-xs">android</code>, <code className="font-mono text-xs">windows</code>, <code className="font-mono text-xs">debian</code>, <code className="font-mono text-xs">arch</code>, <code className="font-mono text-xs">all</code>) or a live URL.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">-u, --url &lt;url&gt;</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">undefined</td>
                        <td className="p-3.5">Live web page URL to convert.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">-r, --release</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">false</td>
                        <td className="p-3.5">Build release APK / binary package.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">-b, --bundle</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">false</td>
                        <td className="p-3.5">Build Android App Bundle (<code className="font-mono text-xs">.aab</code>) for Google Play.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">--skip-web-build</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">false</td>
                        <td className="p-3.5">Skip executing project build script and use existing exported files.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">-o, --out &lt;dir&gt;</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">app</td>
                        <td className="p-3.5">Custom output directory name.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SECTION: CLI DOCTOR */}
              <section id="cli-doctor" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">05.2 CLI Reference</span>
                  <button 
                    onClick={() => handleCopyLink("cli-doctor")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "cli-doctor" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  <code className="font-mono text-2xl">web2app doctor</code>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Runs complete diagnostic checks on your environment dependencies (Node.js, JDK / Java, Android SDK, ADB, Gradle, and packaging tools) with actionable fix recommendations:
                </p>

                <CodeBlock code="web2app doctor" language="bash" />
              </section>

              {/* SECTION: CLI INIT */}
              <section id="cli-init" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">05.3 CLI Reference</span>
                  <button 
                    onClick={() => handleCopyLink("cli-init")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "cli-init" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  <code className="font-mono text-2xl">web2app init</code>
                </h2>
                <CodeBlock
                  code="web2app init [--yes] [--force] [--app-name <name>] [--package-name <id>]"
                  language="bash"
                />
              </section>

              {/* SECTION: CLI RUN */}
              <section id="cli-run" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">05.4 CLI Reference</span>
                  <button 
                    onClick={() => handleCopyLink("cli-run")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "cli-run" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  <code className="font-mono text-2xl">web2app run</code>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Builds, installs, and launches the app directly on a connected physical Android device, emulator, or local desktop:
                </p>
                <CodeBlock code="web2app run android" language="bash" />
              </section>

              {/* SECTION: CLI CLEAN */}
              <section id="cli-clean" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">05.5 CLI Reference</span>
                  <button 
                    onClick={() => handleCopyLink("cli-clean")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "cli-clean" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  <code className="font-mono text-2xl">web2app clean</code>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Cleans the temporary <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">.web2app/</code> workspace and removes generated build outputs in <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">app/</code>.
                </p>
                <CodeBlock code="web2app clean" language="bash" />
              </section>

              {/* SECTION: CLI OPEN */}
              <section id="cli-open" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">05.6 CLI Reference</span>
                  <button 
                    onClick={() => handleCopyLink("cli-open")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "cli-open" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  <code className="font-mono text-2xl">web2app open</code>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Opens the generated native Android project directly in Android Studio:
                </p>
                <CodeBlock code="web2app open android" language="bash" />
              </section>

              {/* SECTION: CLI SKILL */}
              <section id="cli-skill" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">05.7 CLI Reference</span>
                  <button 
                    onClick={() => handleCopyLink("cli-skill")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "cli-skill" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  <code className="font-mono text-2xl">web2app skill</code>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Installs or exports the official AI Agent Skill (<code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">.agents/skills/web2app/SKILL.md</code>) so autonomous coding agents can package your web apps automatically:
                </p>
                <CodeBlock
                  tabs={{
                    "Install to Project": "npx web2app skill",
                    "Print to Terminal": "npx web2app skill --print",
                    "Custom Folder": "npx web2app skill -o .agent/skills/web2app",
                  }}
                />
              </section>

              {/* ==========================================================================
                  CATEGORY 6: CONFIGURATION REFERENCE
                  ========================================================================== */}

              {/* SECTION: CONFIG SCHEMA */}
              <section id="config-schema" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">06.1 Configuration</span>
                  <button 
                    onClick={() => handleCopyLink("config-schema")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "config-schema" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Configuration File Schema
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  web2app supports <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">web2app.config.ts</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">web2app.config.js</code>, or <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">web2app.config.json</code>:
                </p>

                <CodeBlock
                  code={`// web2app.config.ts
export default {
  appName: "My Native App",
  packageName: "com.mycompany.myapp",
  version: "1.0.0",
  versionCode: 1,
  
  // Target platforms to build
  platforms: ["android", "windows", "debian", "arch"],
  
  // Custom app icon (PNG or SVG)
  icon: "./public/icon.png",

  // Android-specific settings
  android: {
    minSdk: 24,
    targetSdk: 35,
    orientation: "unspecified", // "portrait" | "landscape" | "unspecified"
    permissions: ["CAMERA", "ACCESS_FINE_LOCATION"],
    splashColor: "#FFE600",
    backgroundColor: "#121212",
  },

  // Windows Desktop settings
  windows: {
    windowWidth: 1280,
    windowHeight: 800,
    resizable: true,
    fullscreen: false,
  },

  // Debian (.deb) settings
  debian: {
    section: "web",
    maintainer: "Developer <dev@example.com>",
    categories: ["Network", "Application"],
  },

  // Arch Linux (PKGBUILD) settings
  arch: {
    pkgdesc: "Standalone desktop application built with web2app",
    license: ["MIT"],
  }
};`}
                  language="typescript"
                  title="web2app.config.ts"
                />
              </section>

              {/* SECTION: CONFIG ANDROID */}
              <section id="config-android" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">06.2 Configuration</span>
                  <button 
                    onClick={() => handleCopyLink("config-android")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "config-android" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Android Configuration Options
                </h2>
                <div className="overflow-x-auto my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <table className="w-full text-left font-sans text-xs sm:text-[13px] border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 font-semibold">
                        <th className="p-3.5">Property</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Default</th>
                        <th className="p-3.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-300">
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">minSdk</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">number</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">24</td>
                        <td className="p-3.5">Minimum Android API level supported.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">targetSdk</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">number</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">35</td>
                        <td className="p-3.5">Target Android API level.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">orientation</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">string</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">&quot;unspecified&quot;</td>
                        <td className="p-3.5">Screen orientation lock (<code className="font-mono text-xs">portrait</code>, <code className="font-mono text-xs">landscape</code>, <code className="font-mono text-xs">sensor</code>).</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">permissions</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">string[]</td>
                        <td className="p-3.5 font-mono text-xs text-zinc-500">[]</td>
                        <td className="p-3.5">Android permissions to inject into AndroidManifest.xml.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ==========================================================================
                  CATEGORY 7: AI & AGENT INTEGRATION
                  ========================================================================== */}

              {/* SECTION: AI SKILL GUIDE */}
              <section id="ai-skill-guide" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">07.1 AI Integration</span>
                  <button 
                    onClick={() => handleCopyLink("ai-skill-guide")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "ai-skill-guide" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
                  <Bot className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                  <span>AI Agent Skill (Antigravity & Claude Code)</span>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  web2app ships with an official <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">AI Skill definition</strong> formatted for Google Antigravity, Claude Code, Cursor, Windsurf, Copilot, and LLM coding agents.
                </p>

                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  By adding the skill to your project, your AI coding assistant learns how to automatically detect frameworks, configure static exports, diagnose Java/Android environments, and compile multi-platform native packages with zero trial-and-error.
                </p>

                <DocsCallout type="tip" title="1-Second 1-Command Skill Installation">
                  Run this command in any web repository to equip your AI agent with the web2app skill:
                  <div className="mt-2 font-mono font-semibold text-zinc-900 dark:text-zinc-100">npx web2app skill</div>
                </DocsCallout>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4 mb-2 font-medium">
                  The skill is saved at <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">.agents/skills/web2app/SKILL.md</code>:
                </p>

                <CodeBlock
                  code={`---
name: web2app
description: >-
  Build, convert, and package web applications (Next.js, Vite, React, Vue, Svelte, Python, Streamlit, Flask, FastAPI) or live web URLs into standalone native Android (APK/AAB), Windows Desktop (WebView2), Debian/Ubuntu (.deb), and Arch Linux (PKGBUILD) apps with zero runtime bloat. Use whenever the user mentions converting a web app to mobile or desktop, compiling an Android APK, testing on Android emulators/devices, generating .deb packages, running web2app doctor/diagnostics, or configuring web2app.config.ts.
---

# web2app AI Assistant Skill

Transform modern web applications and live URLs into native, lightweight, standalone mobile and desktop packages using operating system native WebViews (AndroidX WebKit, Microsoft Edge WebView2, Linux WebKit/XDG).`}
                  language="markdown"
                  title=".agents/skills/web2app/SKILL.md"
                />
              </section>

              {/* SECTION: AI PROMPT RECIPES */}
              <section id="ai-prompt-recipes" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">07.2 AI Integration</span>
                  <button 
                    onClick={() => handleCopyLink("ai-prompt-recipes")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "ai-prompt-recipes" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
                  <Sparkles className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                  <span>Prompt Recipes for AI Assistants</span>
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  You can copy and paste any of these sample natural language prompts to your AI assistant:
                </p>

                <div className="space-y-4 my-6">
                  <div className="p-4 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                      <span>Prompt: Convert Next.js to Android & Windows</span>
                    </div>
                    <p className="text-sm font-sans text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono">
                      &quot;Please install the web2app AI skill, configure my Next.js app for static export in next.config.mjs, run web2app doctor to check my build tools, and compile standalone Android APK and Windows desktop packages.&quot;
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                      <span>Prompt: Convert Live Web App / PWA</span>
                    </div>
                    <p className="text-sm font-sans text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono">
                      &quot;Use web2app to convert https://app.myservice.com into native Android APK and Debian packages with the app name &apos;My Service&apos; and package ID com.myservice.app.&quot;
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                      <span>Prompt: Configure Android Permissions & Landscape Lock</span>
                    </div>
                    <p className="text-sm font-sans text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono">
                      &quot;Create a web2app.config.ts file that locks orientation to landscape, requests CAMERA and ACCESS_FINE_LOCATION permissions, and builds the Android debug APK.&quot;
                    </p>
                  </div>
                </div>
              </section>

              {/* ==========================================================================
                  CATEGORY 8: PRODUCTION & CI/CD
                  ========================================================================== */}

              {/* SECTION: KEYSTORE */}
              <section id="android-keystore" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">08.1 Production</span>
                  <button 
                    onClick={() => handleCopyLink("android-keystore")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "android-keystore" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Release Signing & Android Keystores
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  To publish to the Google Play Store, sign your APK or App Bundle (.aab) with a production keystore:
                </p>

                <CodeBlock
                  code={`// web2app.config.ts
export default {
  android: {
    keystore: {
      path: "./my-release-key.jks",
      alias: "my-key-alias",
      storePassword: process.env.KEYSTORE_PASSWORD,
      keyPassword: process.env.KEY_PASSWORD,
    }
  }
};`}
                  language="typescript"
                  title="Keystore Configuration"
                />

                <p className="text-sm text-zinc-600 dark:text-zinc-400 my-3 font-medium">
                  Then build the release bundle:
                </p>

                <CodeBlock code="web2app build android --release --bundle" language="bash" />
              </section>

              {/* SECTION: CI/CD */}
              <section id="ci-cd" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">08.2 Automation</span>
                  <button 
                    onClick={() => handleCopyLink("ci-cd")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "ci-cd" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  GitHub Actions CI/CD Pipeline
                </h2>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Automate building and releasing all 4 platform artifacts on every GitHub release:
                </p>

                <CodeBlock
                  code={`# .github/workflows/build-apps.yml
name: Build Native Apps
on:
  push:
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npx web2app build all
      - uses: softprops/action-gh-release@v1
        with:
          files: |
            app/android/*.apk
            app/debian/*.deb
            app/windows/*`}
                  language="yaml"
                  title="GitHub Actions Workflow"
                />
              </section>

              {/* SECTION: TROUBLESHOOTING */}
              <section id="troubleshooting" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="group flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">08.3 Support</span>
                  <button 
                    onClick={() => handleCopyLink("troubleshooting")}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedLink === "troubleshooting" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
                  Troubleshooting & Common Inquiries
                </h2>
                
                <div className="space-y-3.5 my-6">
                  <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Q: Android build fails with &quot;JAVA_HOME not set&quot;?</h4>
                    <p className="text-xs sm:text-[13.5px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Ensure you have JDK 17 or 21 installed. Set <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">export JAVA_HOME=/path/to/jdk</code> in your <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">~/.bashrc</code> or run <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">web2app doctor</code> to inspect your Java environment.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Q: Next.js images not loading in native offline mode?</h4>
                    <p className="text-xs sm:text-[13.5px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Add <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">images: &#123; unoptimized: true &#125;</code> to your <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">next.config.js</code> so Next.js exports static PNG/WebP files instead of relying on the Node.js image optimization server.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Q: Can I build Debian (.deb) packages on Windows or Mac?</h4>
                    <p className="text-xs sm:text-[13.5px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Yes! web2app includes a pure TypeScript Debian packager that creates binary .deb files on any OS with zero native Linux dependencies.
                    </p>
                  </div>
                </div>
              </section>

            </div>

            {/* Bottom Prev / Next Navigation Footer */}
            <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 font-sans">
              {prevItem ? (
                <button
                  onClick={() => {
                    handleSelectSection(prevItem.id);
                    playClick();
                  }}
                  className="flex-1 max-w-xs p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl text-left transition-all group"
                >
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1 mb-1 font-medium">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                    Previous
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white truncate block">
                    {prevItem.title}
                  </span>
                </button>
              ) : <div />}

              {nextItem && (
                <button
                  onClick={() => {
                    handleSelectSection(nextItem.id);
                    playClick();
                  }}
                  className="flex-1 max-w-xs p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl text-right transition-all group"
                >
                  <span className="text-[11px] text-zinc-400 flex items-center justify-end gap-1 mb-1 font-medium">
                    Next
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white truncate block">
                    {nextItem.title}
                  </span>
                </button>
              )}
            </div>

            {/* Clean minimalist docs footer */}
            <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-400 dark:text-zinc-500">
              web2app documentation &bull; Built with Next.js & TypeScript
            </div>

          </main>
        </div>

        {/* Fixed Right Sidebar: On this Page Table of Contents */}
        <aside className="hidden xl:block w-64 fixed top-14 right-0 bottom-0 border-l border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 overflow-y-auto no-scrollbar p-6 text-xs z-20">
          <div className="font-semibold uppercase text-[11px] tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
            On this page
          </div>
          <nav className="space-y-1">
            {allDocItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleSelectSection(item.id);
                    playClick();
                  }}
                  className={`w-full text-left px-2 py-1 rounded-md transition-colors text-xs truncate block ${
                    isActive
                      ? "text-zinc-950 dark:text-white font-semibold bg-zinc-100 dark:bg-zinc-800"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </nav>
        </aside>

      </div>

      {/* Floating Scroll to Top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full shadow-lg hover:opacity-90 transition-all z-40"
          title="Back to top"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}
