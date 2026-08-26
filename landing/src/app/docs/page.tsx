"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarqueeTicker from "@/components/MarqueeTicker";
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
  ExternalLink,
  Sparkles,
  CheckCircle,
  Folder,
  Smartphone,
  Monitor,
  Disc
} from "lucide-react";
import { playClick } from "@/lib/sound";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const categories: DocCategory[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Rocket className="w-3.5 h-3.5 text-accent-yellow" />,
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
      icon: <Cpu className="w-3.5 h-3.5 text-accent-cyan" />,
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
      icon: <Layers className="w-3.5 h-3.5 text-accent-green" />,
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
      icon: <Code2 className="w-3.5 h-3.5 text-accent-pink" />,
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
      icon: <Terminal className="w-3.5 h-3.5 text-accent-purple" />,
      items: [
        { id: "cli-build", title: "web2app build" },
        { id: "cli-init", title: "web2app init" },
        { id: "cli-doctor", title: "web2app doctor", badge: "Diagnostic" },
        { id: "cli-run", title: "web2app run" },
        { id: "cli-clean", title: "web2app clean" },
        { id: "cli-open", title: "web2app open" },
      ],
    },
    {
      id: "config-reference",
      title: "Configuration",
      icon: <Settings className="w-3.5 h-3.5 text-accent-yellow" />,
      items: [
        { id: "config-schema", title: "web2app.config.ts", badge: "Schema" },
        { id: "config-android", title: "Android Options" },
        { id: "config-windows", title: "Windows Options" },
        { id: "config-linux", title: "Debian & Arch Options" },
      ],
    },
    {
      id: "production",
      title: "Production & CI/CD",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />,
      items: [
        { id: "android-keystore", title: "Release Signing & Keystores" },
        { id: "native-permissions", title: "Android Permissions" },
        { id: "ci-cd", title: "GitHub Actions CI/CD" },
        { id: "troubleshooting", title: "Troubleshooting & FAQ" },
      ],
    },
  ];

  // Search filter
  const allDocItems = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.items.map((item) => ({
        ...item,
        categoryTitle: cat.title,
      }))
    );
  }, [categories]);

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

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between w-full max-w-full overflow-x-hidden bg-bg text-ink">
      <div className="w-full max-w-full overflow-x-hidden">
        <MarqueeTicker />
        <Navbar />

        {/* Docs Subheader Breadcrumb & Mobile Bar */}
        <div className="bg-surface border-b-2 sm:border-b-3 border-ink px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3 sticky top-[57px] sm:top-[65px] z-30 shadow-neo-xs">
          <div className="flex items-center gap-2 font-mono text-xs font-bold truncate">
            <span className="text-ink-muted hidden sm:inline">Docs</span>
            <span className="text-ink-muted hidden sm:inline">/</span>
            <span className="bg-accent-yellow text-ink px-2 py-0.5 border border-ink shadow-neo-xs uppercase tracking-wider font-black truncate">
              {allDocItems.find((i) => i.id === activeSection)?.title || "Documentation"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setMobileSidebarOpen(!mobileSidebarOpen);
                playClick();
              }}
              className="lg:hidden btn-sharp px-3 py-1 bg-accent-cyan text-ink border-2 border-ink shadow-neo-xs font-mono text-xs font-black uppercase flex items-center gap-1.5"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>Topics</span>
            </button>
          </div>
        </div>

        {/* Main Docs Content Layout */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row w-full max-w-full">
          
          {/* Sidebar */}
          <DocsSidebar
            categories={categories}
            activeId={activeSection}
            onSelect={handleSelectSection}
            isOpenMobile={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full min-w-0 max-w-full overflow-hidden">
            
            {/* Search Header */}
            <div className="mb-8">
              <div className="inline-block bg-accent-pink text-ink font-mono font-black text-[10px] sm:text-xs px-3 py-1 border-2 border-ink shadow-neo-xs uppercase tracking-widest mb-2">
                [// DOCUMENTATION_PORTAL]
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter">
                web2app Manual & Reference
              </h1>
              <p className="font-sans font-bold text-sm sm:text-base text-ink-muted mt-2">
                Everything you need to convert web apps and live URLs into native standalone Android, Windows, Debian, and Arch packages.
              </p>

              {/* Real-time search bar */}
              <DocsSearch
                query={searchQuery}
                onQueryChange={setSearchQuery}
                resultCount={filteredItems.length}
              />
            </div>

            {/* If search query has results and is active */}
            {searchQuery.trim() !== "" && (
              <div className="mb-10 p-4 bg-surface border-3 border-ink shadow-neo-sm">
                <div className="font-mono font-black text-xs uppercase tracking-wider text-ink-muted mb-3">
                  Quick Navigation Results ({filteredItems.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleSelectSection(item.id);
                        playClick();
                      }}
                      className="btn-sharp p-2.5 bg-surface border-2 border-ink text-left font-mono text-xs font-bold hover:bg-accent-yellow/20 flex items-center justify-between shadow-neo-xs"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] text-ink-muted block uppercase">{item.categoryTitle}</span>
                        <span className="font-black text-ink truncate block">{item.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================================================
                CATEGORY 1: GETTING STARTED
                ========================================================================== */}
            <div className="space-y-16">
              
              {/* SECTION: INTRO */}
              <section id="intro" className="scroll-mt-32">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-pink uppercase">
                  <span># 01.1 Overview</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  What is web2app?
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  <strong className="text-ink">web2app</strong> is a modern, high-performance CLI compiler and packaging engine designed to transform web applications (Next.js, Vite, React, Vue, Python) or any live web URL into native, standalone desktop and mobile applications with <strong>zero runtime bloat</strong>.
                </p>

                <DocsCallout type="tip" title="PHILOSOPHY">
                  Unlike traditional hybrid app frameworks like Electron (which bundles a 150MB Chromium binary) or Cordova (which requires heavy plugin scaffolding), web2app uses your operating system’s built-in web rendering engines (AndroidX WebKit, MS Edge WebView2, native Linux XDG WebKit).
                </DocsCallout>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                  <div className="p-4 bg-surface border-2 border-ink shadow-neo-xs">
                    <span className="font-mono font-black text-xs uppercase text-accent-green-dark">Bundle Footprint</span>
                    <h4 className="font-display font-black text-2xl mt-1">~4 KB – 1 MB</h4>
                    <p className="font-sans text-xs text-ink-muted mt-1 font-semibold">Over 99% smaller than typical Electron builds.</p>
                  </div>
                  <div className="p-4 bg-surface border-2 border-ink shadow-neo-xs">
                    <span className="font-mono font-black text-xs uppercase text-accent-cyan-dark">Compile Speed</span>
                    <h4 className="font-display font-black text-2xl mt-1">~1.4 Seconds</h4>
                    <p className="font-sans text-xs text-ink-muted mt-1 font-semibold">Pure TypeScript packager engine with zero external dependencies.</p>
                  </div>
                  <div className="p-4 bg-surface border-2 border-ink shadow-neo-xs">
                    <span className="font-mono font-black text-xs uppercase text-accent-pink-dark">Platforms</span>
                    <h4 className="font-display font-black text-2xl mt-1">4 Native Targets</h4>
                    <p className="font-sans text-xs text-ink-muted mt-1 font-semibold">Android APK, Windows Desktop, Debian/Ubuntu, and Arch Linux.</p>
                  </div>
                </div>
              </section>

              {/* SECTION: QUICK START */}
              <section id="quick-start" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-green-dark uppercase">
                  <span># 01.2 Quick Start</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  1-Command Instant Conversion
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  You can convert any live web URL or local project immediately using <code className="bg-accent-yellow text-ink px-1.5 py-0.5 border border-ink font-mono font-black">npx</code> without installing anything globally:
                </p>

                <CodeBlock
                  tabs={{
                    "Live URL": "npx web2app https://news.ycombinator.com",
                    "Local Next.js": "npx web2app build",
                    "Target Android Only": "npx web2app build android",
                    "Target Windows Only": "npx web2app build windows",
                  }}
                />

                <p className="font-sans font-semibold text-sm text-ink-muted mt-3">
                  This analyzes your web project, generates native wrappers, and outputs complete standalone packages into the <code className="bg-accent-yellow text-ink px-1.5 py-0.2 border border-ink font-mono font-bold">app/</code> directory.
                </p>
              </section>

              {/* SECTION: INSTALLATION */}
              <section id="installation" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-yellow uppercase">
                  <span># 01.3 Installation</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Global CLI Installation
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  To use the <code className="bg-accent-yellow text-ink px-1.5 border border-ink font-mono">web2app</code> command anywhere in your terminal, install it globally via your favorite package manager:
                </p>

                <CodeBlock
                  tabs={{
                    npm: "npm install -g web2app",
                    pnpm: "pnpm add -g web2app",
                    yarn: "yarn global add web2app",
                    bun: "bun add -g web2app",
                  }}
                />

                <p className="font-sans font-semibold text-sm text-ink-muted mt-4">
                  After installation, verify that the CLI is ready:
                </p>

                <CodeBlock code="web2app --version" language="bash" />
              </section>

              {/* SECTION: INIT WIZARD */}
              <section id="init-wizard" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-purple uppercase">
                  <span># 01.4 Configuration Wizard</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Project Initialization Wizard
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  Run <code className="bg-accent-yellow text-ink px-1.5 border border-ink font-mono">web2app init</code> inside your project root to interactively configure your app name, package ID, target platforms, and icons:
                </p>

                <CodeBlock code="web2app init" language="bash" />

                <DocsCallout type="info" title="AUTOMATED INITIALIZATION">
                  To skip interactive prompts and generate defaults automatically based on your <code>package.json</code>:
                  <div className="mt-2 font-mono font-bold text-ink">web2app init --yes</div>
                </DocsCallout>
              </section>

              {/* ==========================================================================
                  CATEGORY 2: ARCHITECTURE & ENGINE
                  ========================================================================== */}

              {/* SECTION: ZERO BLOAT */}
              <section id="zero-bloat" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-cyan uppercase">
                  <span># 02.1 Architecture</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Zero-Runtime Overhead Architecture
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  Traditional desktop frameworks package entire browser binaries, rendering engines, and Node.js runtimes into each application. web2app takes an architectural approach that relies on native operating system WebViews:
                </p>

                <div className="p-4 sm:p-5 bg-surface border-3 border-ink shadow-neo-sm space-y-4 my-6">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-accent-green text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-black shrink-0">1</span>
                    <div>
                      <h4 className="font-display font-black text-base uppercase">Android: AndroidX WebViewAssetLoader</h4>
                      <p className="font-sans text-xs sm:text-sm font-semibold text-ink-muted mt-0.5">
                        Uses Android’s native WebKit with secure local asset loading, GPU hardware acceleration, and full HTML5 IndexedDB storage support.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-accent-cyan text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-black shrink-0">2</span>
                    <div>
                      <h4 className="font-display font-black text-base uppercase">Windows: MS Edge / Chromium App Mode</h4>
                      <p className="font-sans text-xs sm:text-sm font-semibold text-ink-muted mt-0.5">
                        Leverages Microsoft Edge App Mode with custom window boundaries, silent VBScript launch runners, and Start Menu registry shortcuts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-accent-pink text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-black shrink-0">3</span>
                    <div>
                      <h4 className="font-display font-black text-base uppercase">Linux: Pure TypeScript DebPackager</h4>
                      <p className="font-sans text-xs sm:text-sm font-semibold text-ink-muted mt-0.5">
                        Generates valid Debian binary .deb packages with XDG desktop application entries and scalable SVG/PNG icon hierarchies without requiring dpkg on the host machine.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: OUTPUT STRUCTURE */}
              <section id="output-structure" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-pink uppercase">
                  <span># 02.2 Output Structure</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  The <code className="bg-accent-yellow text-ink px-2 py-0.5 border-2 border-ink font-mono">app/</code> Directory Tree
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  When you run a build, web2app outputs clean, dedicated subdirectories inside the <code className="bg-accent-yellow text-ink px-1 border border-ink font-mono font-bold">app/</code> folder:
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
              <section id="webview-asset-loader" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-green uppercase">
                  <span># 02.3 Asset Loader</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  AndroidX WebViewAssetLoader & CORS Elimination
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  Loading local HTML files using the traditional <code className="bg-surface text-ink px-1 border border-ink font-mono">file:///android_asset/</code> scheme breaks modern web APIs like <code className="font-mono">fetch()</code>, CORS, localStorage, and Web Workers.
                </p>

                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  web2app injects <strong className="text-ink">AndroidX WebViewAssetLoader</strong>, which routes all requests through a secure virtual HTTPS domain:
                </p>

                <CodeBlock
                  code={`https://appassets.androidplatform.net/assets/index.html`}
                  language="text"
                  title="Virtual HTTPS Origin"
                />

                <DocsCallout type="tip" title="BENEFITS OF SECURE ASSET ORIGIN">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Full CORS-compliant <code className="font-mono">fetch()</code> and <code className="font-mono">XMLHttpRequest</code>.</li>
                    <li>Secure Web Storage, IndexedDB, and CacheStorage APIs.</li>
                    <li>Web Workers and WebAssembly execution without origin sandbox restrictions.</li>
                  </ul>
                </DocsCallout>
              </section>

              {/* SECTION: DEB PACKAGER ENGINE */}
              <section id="deb-packager-engine" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-yellow uppercase">
                  <span># 02.4 DebPackager</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Pure TypeScript Debian Packager
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  Traditionally, building Debian <code className="font-mono">.deb</code> packages requires Linux with <code className="font-mono">dpkg-deb</code>, <code className="font-mono">ar</code>, and <code className="font-mono">tar</code> installed.
                </p>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  web2app includes <strong className="text-ink">DebPackager</strong>, a standalone pure TypeScript AR and Tar packaging engine. It computes md5sums, sets correct Unix permissions, generates control metadata, and writes valid binary <code className="font-mono">.deb</code> archives on <strong>macOS, Windows, and Linux</strong> with zero native host dependencies!
                </p>
              </section>

              {/* ==========================================================================
                  CATEGORY 3: TARGET PLATFORMS
                  ========================================================================== */}

              {/* SECTION: ANDROID */}
              <section id="platform-android" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-green uppercase">
                  <span># 03.1 Target Platforms</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-accent-green-dark" />
                  <span>Android Platform Target</span>
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
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

                <div className="my-6 space-y-2 font-mono text-xs">
                  <div className="p-3 bg-surface border-2 border-ink shadow-neo-xs flex items-center justify-between">
                    <span className="font-black">Min SDK:</span>
                    <span className="text-ink-muted font-bold">API 24 (Android 7.0+ / 95%+ device coverage)</span>
                  </div>
                  <div className="p-3 bg-surface border-2 border-ink shadow-neo-xs flex items-center justify-between">
                    <span className="font-black">Target & Compile SDK:</span>
                    <span className="text-ink-muted font-bold">API 35 (Android 15)</span>
                  </div>
                  <div className="p-3 bg-surface border-2 border-ink shadow-neo-xs flex items-center justify-between">
                    <span className="font-black">Output File:</span>
                    <span className="text-accent-green-dark font-black">app/android/app-debug.apk</span>
                  </div>
                </div>
              </section>

              {/* SECTION: WINDOWS */}
              <section id="platform-windows" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-cyan uppercase">
                  <span># 03.2 Target Platforms</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Monitor className="w-6 h-6 text-accent-cyan-dark" />
                  <span>Windows Desktop Platform Target</span>
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  The Windows target scaffolds a clean, standalone desktop application running on Microsoft Edge / Chromium WebView2:
                </p>

                <CodeBlock
                  tabs={{
                    "Build Windows": "web2app build windows",
                    "Launch via Batch": "cd app/windows && launch.bat",
                    "Install Shortcuts": "cd app/windows && install.bat",
                  }}
                />

                <DocsCallout type="tip" title="ZERO INSTALLATION REQUIRED">
                  Windows 10 and 11 already ship with Microsoft Edge WebView2 preinstalled. The generated Windows app starts instantly with zero runtime downloads.
                </DocsCallout>
              </section>

              {/* SECTION: DEBIAN */}
              <section id="platform-debian" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-pink uppercase">
                  <span># 03.3 Target Platforms</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Disc className="w-6 h-6 text-accent-pink-dark" />
                  <span>Debian & Ubuntu Platform Target</span>
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  Builds ready-to-distribute binary <code className="font-mono">.deb</code> packages for Debian, Ubuntu, Linux Mint, and Pop!_OS:
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
              <section id="platform-arch" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-purple uppercase">
                  <span># 03.4 Target Platforms</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-accent-purple-dark" />
                  <span>Arch Linux & AUR Platform Target</span>
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  Generates an Arch Linux User Repository (AUR) compliant <code className="font-mono">PKGBUILD</code> recipe and automated installation script:
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
              <section id="framework-nextjs" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-yellow uppercase">
                  <span># 04.1 Framework Guides</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Next.js App & Pages Router Guide
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  web2app automatically detects Next.js projects and checks for static export configuration.
                </p>

                <p className="font-sans font-semibold text-sm text-ink-muted mb-2">
                  1. In your <code className="bg-surface text-ink px-1 border border-ink font-mono font-bold">next.config.mjs</code> or <code className="bg-surface text-ink px-1 border border-ink font-mono font-bold">next.config.js</code>, configure static export:
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

                <p className="font-sans font-semibold text-sm text-ink-muted my-3">
                  2. Run web2app build in your Next.js project root:
                </p>

                <CodeBlock code="npx web2app build" language="bash" />
              </section>

              {/* SECTION: VITE */}
              <section id="framework-vite" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-cyan uppercase">
                  <span># 04.2 Framework Guides</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Vite / React / Vue / Svelte Guide
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  For Vite-based Single Page Apps, web2app detects your build script and ingests the <code className="bg-surface text-ink px-1 border border-ink font-mono font-bold">dist/</code> directory automatically:
                </p>

                <CodeBlock
                  tabs={{
                    "Direct Build": "npx web2app build",
                    "Custom Out Dir": "npx web2app build --out custom-app",
                  }}
                />
              </section>

              {/* SECTION: PYTHON */}
              <section id="framework-python" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-green uppercase">
                  <span># 04.3 Framework Guides</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Python (Streamlit / Flask / FastAPI)
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
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
              <section id="framework-live-urls" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-pink uppercase">
                  <span># 04.4 Framework Guides</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Live Web URLs & PWAs
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
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
              <section id="cli-build" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-yellow uppercase">
                  <span># 05.1 CLI Reference</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  <code className="font-mono">web2app build</code>
                </h2>
                <p className="font-sans font-semibold text-sm text-ink-muted leading-relaxed mb-4">
                  Compiles and packages applications for target platforms.
                </p>

                <CodeBlock code="web2app build [platformOrUrl] [options]" language="bash" />

                <div className="overflow-x-auto my-4 border-2 border-ink shadow-neo-xs">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-accent-yellow text-ink border-b-2 border-ink font-black uppercase">
                        <th className="p-3 border-r-2 border-ink">Flag / Option</th>
                        <th className="p-3 border-r-2 border-ink">Default</th>
                        <th className="p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-ink font-bold bg-surface">
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>[platformOrUrl]</code></td>
                        <td className="p-3 border-r-2 border-ink"><code>all</code></td>
                        <td className="p-3">Target platform (<code>android</code>, <code>windows</code>, <code>debian</code>, <code>arch</code>, <code>all</code>) or a live URL.</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>-u, --url &lt;url&gt;</code></td>
                        <td className="p-3 border-r-2 border-ink"><code>undefined</code></td>
                        <td className="p-3">Live web page URL to convert.</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>-r, --release</code></td>
                        <td className="p-3 border-r-2 border-ink"><code>false</code></td>
                        <td className="p-3">Build release APK / binary package.</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>-b, --bundle</code></td>
                        <td className="p-3 border-r-2 border-ink"><code>false</code></td>
                        <td className="p-3">Build Android App Bundle (<code>.aab</code>) for Google Play.</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>--skip-web-build</code></td>
                        <td className="p-3 border-r-2 border-ink"><code>false</code></td>
                        <td className="p-3">Skip executing project build script and use existing exported files.</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>-o, --out &lt;dir&gt;</code></td>
                        <td className="p-3 border-r-2 border-ink"><code>app</code></td>
                        <td className="p-3">Custom output directory name.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SECTION: CLI DOCTOR */}
              <section id="cli-doctor" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-green uppercase">
                  <span># 05.2 CLI Reference</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  <code className="font-mono">web2app doctor</code>
                </h2>
                <p className="font-sans font-semibold text-sm text-ink-muted leading-relaxed mb-4">
                  Runs complete diagnostic checks on your environment dependencies (Node.js, JDK / Java, Android SDK, ADB, Gradle, and packaging tools) with actionable fix recommendations:
                </p>

                <CodeBlock code="web2app doctor" language="bash" />
              </section>

              {/* SECTION: CLI INIT */}
              <section id="cli-init" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-cyan uppercase">
                  <span># 05.3 CLI Reference</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  <code className="font-mono">web2app init</code>
                </h2>
                <CodeBlock
                  code="web2app init [--yes] [--force] [--app-name <name>] [--package-name <id>]"
                  language="bash"
                />
              </section>

              {/* SECTION: CLI RUN */}
              <section id="cli-run" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-purple uppercase">
                  <span># 05.4 CLI Reference</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  <code className="font-mono">web2app run</code>
                </h2>
                <p className="font-sans font-semibold text-sm text-ink-muted leading-relaxed mb-4">
                  Builds, installs, and launches the app directly on a connected physical Android device, emulator, or local desktop:
                </p>
                <CodeBlock code="web2app run android" language="bash" />
              </section>

              {/* SECTION: CLI CLEAN */}
              <section id="cli-clean" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-pink uppercase">
                  <span># 05.5 CLI Reference</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  <code className="font-mono">web2app clean</code>
                </h2>
                <p className="font-sans font-semibold text-sm text-ink-muted leading-relaxed mb-4">
                  Cleans the temporary <code className="font-mono">.web2app/</code> workspace and removes generated build outputs in <code className="font-mono">app/</code>.
                </p>
                <CodeBlock code="web2app clean" language="bash" />
              </section>

              {/* SECTION: CLI OPEN */}
              <section id="cli-open" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-yellow uppercase">
                  <span># 05.6 CLI Reference</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  <code className="font-mono">web2app open</code>
                </h2>
                <p className="font-sans font-semibold text-sm text-ink-muted leading-relaxed mb-4">
                  Opens the generated native Android project directly in Android Studio:
                </p>
                <CodeBlock code="web2app open android" language="bash" />
              </section>

              {/* ==========================================================================
                  CATEGORY 6: CONFIGURATION REFERENCE
                  ========================================================================== */}

              {/* SECTION: CONFIG SCHEMA */}
              <section id="config-schema" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-green uppercase">
                  <span># 06.1 Configuration</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Configuration File Schema
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                  web2app supports <code className="bg-surface text-ink px-1 border border-ink font-mono font-bold">web2app.config.ts</code>, <code className="bg-surface text-ink px-1 border border-ink font-mono font-bold">web2app.config.js</code>, or <code className="bg-surface text-ink px-1 border border-ink font-mono font-bold">web2app.config.json</code>:
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
              <section id="config-android" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-cyan uppercase">
                  <span># 06.2 Configuration</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Android Configuration Options
                </h2>
                <div className="overflow-x-auto my-4 border-2 border-ink shadow-neo-xs">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-accent-yellow text-ink border-b-2 border-ink font-black uppercase">
                        <th className="p-3 border-r-2 border-ink">Property</th>
                        <th className="p-3 border-r-2 border-ink">Type</th>
                        <th className="p-3 border-r-2 border-ink">Default</th>
                        <th className="p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-ink font-bold bg-surface">
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>minSdk</code></td>
                        <td className="p-3 border-r-2 border-ink">number</td>
                        <td className="p-3 border-r-2 border-ink"><code>24</code></td>
                        <td className="p-3">Minimum Android API level supported.</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>targetSdk</code></td>
                        <td className="p-3 border-r-2 border-ink">number</td>
                        <td className="p-3 border-r-2 border-ink"><code>35</code></td>
                        <td className="p-3">Target Android API level.</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>orientation</code></td>
                        <td className="p-3 border-r-2 border-ink">string</td>
                        <td className="p-3 border-r-2 border-ink"><code>"unspecified"</code></td>
                        <td className="p-3">Screen orientation lock (<code>portrait</code>, <code>landscape</code>, <code>sensor</code>).</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-r-2 border-ink text-accent-pink-dark"><code>permissions</code></td>
                        <td className="p-3 border-r-2 border-ink">string[]</td>
                        <td className="p-3 border-r-2 border-ink"><code>[]</code></td>
                        <td className="p-3">Android permissions to inject into AndroidManifest.xml.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ==========================================================================
                  CATEGORY 7: PRODUCTION & CI/CD
                  ========================================================================== */}

              {/* SECTION: KEYSTORE */}
              <section id="android-keystore" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-green uppercase">
                  <span># 07.1 Production</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Release Signing & Android Keystores
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
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

                <p className="font-sans font-semibold text-sm text-ink-muted my-3">
                  Then build the release bundle:
                </p>

                <CodeBlock code="web2app build android --release --bundle" language="bash" />
              </section>

              {/* SECTION: CI/CD */}
              <section id="ci-cd" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-cyan uppercase">
                  <span># 07.2 Automation</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  GitHub Actions CI/CD Pipeline
                </h2>
                <p className="font-sans font-semibold text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
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
              <section id="troubleshooting" className="scroll-mt-32 pt-8 border-t-2 border-ink/20">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-black text-accent-pink uppercase">
                  <span># 07.3 Support</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-4">
                  Troubleshooting & Common Inquiries
                </h2>
                
                <div className="space-y-4 my-6">
                  <div className="p-4 bg-surface border-2 border-ink shadow-neo-xs">
                    <h4 className="font-display font-black text-base uppercase">Q: Android build fails with "JAVA_HOME not set"?</h4>
                    <p className="font-sans text-xs sm:text-sm font-semibold text-ink-muted mt-1 leading-relaxed">
                      Ensure you have JDK 17 or 21 installed. Set <code className="font-mono font-bold">export JAVA_HOME=/path/to/jdk</code> in your <code className="font-mono font-bold">~/.bashrc</code> or run <code className="font-mono font-bold">web2app doctor</code> to inspect your Java environment.
                    </p>
                  </div>

                  <div className="p-4 bg-surface border-2 border-ink shadow-neo-xs">
                    <h4 className="font-display font-black text-base uppercase">Q: Next.js images not loading in native offline mode?</h4>
                    <p className="font-sans text-xs sm:text-sm font-semibold text-ink-muted mt-1 leading-relaxed">
                      Add <code className="font-mono font-bold">images: &#123; unoptimized: true &#125;</code> to your <code className="font-mono font-bold">next.config.js</code> so Next.js exports static PNG/WebP files instead of relying on the Node.js image optimization server.
                    </p>
                  </div>

                  <div className="p-4 bg-surface border-2 border-ink shadow-neo-xs">
                    <h4 className="font-display font-black text-base uppercase">Q: Can I build Debian (.deb) packages on Windows or Mac?</h4>
                    <p className="font-sans text-xs sm:text-sm font-semibold text-ink-muted mt-1 leading-relaxed">
                      Yes! web2app includes a pure TypeScript Debian packager that creates binary .deb files on any OS with zero native Linux dependencies.
                    </p>
                  </div>
                </div>
              </section>

            </div>

          </main>
        </div>

      </div>
      <Footer />
    </div>
  );
}
