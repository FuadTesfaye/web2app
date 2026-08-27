"use client";

import React, { useState } from "react";
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type { TableOfContents } from "fumadocs-core/server";
import CodeBlock from "@/components/docs/CodeBlock";
import { 
  Rocket, 
  Cpu, 
  Layers, 
  Code2, 
  Terminal, 
  Settings, 
  ShieldCheck, 
  ArrowRight,
  Smartphone,
  Monitor,
  Disc,
  Link2,
  Bot,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react";
import { playClick } from "@/lib/sound";

const toc: TableOfContents = [
  { title: "Introduction", url: "#introduction", depth: 2 },
  { title: "Quick Start", url: "#quick-start", depth: 2 },
  { title: "Installation & Scripts", url: "#installation", depth: 2 },
  { title: "Configuration Wizard", url: "#init-wizard", depth: 2 },
  { title: "Zero-Bloat Architecture", url: "#zero-bloat", depth: 2 },
  { title: "app/ Directory Structure", url: "#output-structure", depth: 2 },
  { title: "Android (APK / AAB)", url: "#platform-android", depth: 2 },
  { title: "Windows Desktop", url: "#platform-windows", depth: 2 },
  { title: "Debian & Ubuntu (.deb)", url: "#platform-debian", depth: 2 },
  { title: "Arch Linux (PKGBUILD)", url: "#platform-arch", depth: 2 },
  { title: "Next.js (App Router)", url: "#framework-nextjs", depth: 2 },
  { title: "Vite, React & SPA", url: "#framework-vite", depth: 2 },
  { title: "Python, Streamlit & Flask", url: "#framework-python", depth: 2 },
  { title: "CLI Commands Reference", url: "#cli-reference", depth: 2 },
  { title: "web2app.config.ts Schema", url: "#config-schema", depth: 2 },
  { title: "AI Agent Skill", url: "#ai-agent-skill", depth: 2 },
  { title: "AI Prompt Recipes", url: "#ai-prompts", depth: 2 },
  { title: "Android Keystore Signing", url: "#signing", depth: 2 },
  { title: "GitHub Actions CI/CD", url: "#cicd", depth: 2 },
  { title: "Troubleshooting & FAQ", url: "#troubleshooting", depth: 2 },
];

export default function DocumentationPage() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyLink = (sectionId: string) => {
    const url = `${window.location.origin}/docs#${sectionId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(sectionId);
    playClick();
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <DocsPage 
      toc={toc} 
      tableOfContent={{
        style: "clerk",
        single: false,
      }}
      breadcrumb={{
        enabled: true,
      }}
    >
      <DocsTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-head flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-mono text-base shadow-sm">
          ⚡
        </span>
        web2app Documentation
      </DocsTitle>

      <DocsDescription className="text-base text-zinc-600 dark:text-zinc-400 mt-2 font-normal leading-relaxed">
        Transform Next.js, Vite, React, Vue, Svelte, Python, or any live web URL into standalone native Android, Windows, Debian, and Arch apps with zero runtime bloat.
      </DocsDescription>

      <DocsBody className="mt-8 space-y-12">
        {/* ==========================================================================
            CATEGORY 1: GETTING STARTED
            ========================================================================== */}

        {/* SECTION: INTRODUCTION */}
        <section id="introduction" className="scroll-mt-20">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">01.1 Overview</span>
            <button 
              onClick={() => handleCopyLink("introduction")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
              title="Copy link"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "introduction" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
            Introduction &amp; Motivation
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            Most desktop and mobile packaging toolchains (like Electron or Cordova) package a complete 150MB+ Chromium browser binary and separate Node.js runtime into every application. This leads to massive file sizes, high idle RAM consumption, and complicated configuration workflows.
          </p>

          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
            <strong>web2app compiles directly to native operating system WebViews:</strong> It takes your web application (Next.js, Vite, React, static HTML) or a live web URL, bundles it into clean native wrappers, and generates a structured <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5 rounded font-mono text-xs border border-zinc-200 dark:border-zinc-700">app/</code> directory containing ready-to-run packages for Android, Windows, Debian/Ubuntu, and Arch Linux.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-center">
              <Smartphone className="w-5 h-5 mx-auto mb-1.5 text-zinc-700 dark:text-zinc-300" />
              <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Android APK / AAB</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">&lt; 3 MB APK</div>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-center">
              <Monitor className="w-5 h-5 mx-auto mb-1.5 text-zinc-700 dark:text-zinc-300" />
              <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Windows Desktop</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">Edge WebView2</div>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-center">
              <Disc className="w-5 h-5 mx-auto mb-1.5 text-zinc-700 dark:text-zinc-300" />
              <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Debian / Ubuntu</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">.deb Binary Package</div>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-center">
              <Layers className="w-5 h-5 mx-auto mb-1.5 text-zinc-700 dark:text-zinc-300" />
              <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Arch Linux</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">PKGBUILD &amp; AUR</div>
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
            Instant 10-Second Conversion
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            You can convert any live web URL or local project without installing anything beforehand using <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">npx</code>:
          </p>

          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
            Option A: Convert a Live Web Page URL
          </h3>
          <CodeBlock code="npx web2app https://news.ycombinator.com" language="bash" />

          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
            Option B: Convert Current Project (Next.js / Vite / React / HTML)
          </h3>
          <CodeBlock code="npx web2app build" language="bash" />

          <Callout type="info">
            When you run <code>web2app build</code>, the compiler auto-detects your web framework, compiles static production assets, copies native wrappers, and generates the complete <code>app/</code> directory.
          </Callout>
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
            Installation &amp; Script Runner Setup
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            web2app can be used as a <strong>global CLI</strong>, an <strong>npm devDependency</strong> with automated scripts in your <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">package.json</code>, or executed instantly via <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">npx</code>.
          </p>

          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
            1. Global Installation (Recommended for Terminal Users)
          </h3>
          
          <Tabs items={["npm", "pnpm", "yarn", "bun"]}>
            <Tab value="npm">
              <CodeBlock code="npm install -g web2app" language="bash" />
            </Tab>
            <Tab value="pnpm">
              <CodeBlock code="pnpm add -g web2app" language="bash" />
            </Tab>
            <Tab value="yarn">
              <CodeBlock code="yarn global add web2app" language="bash" />
            </Tab>
            <Tab value="bun">
              <CodeBlock code="bun add -g web2app" language="bash" />
            </Tab>
          </Tabs>

          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
            2. Project DevDependency &amp; NPM Scripts
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            Add web2app directly to your project dependencies so teammates and CI/CD pipelines can run automated build scripts:
          </p>

          <CodeBlock code="npm install -D web2app" language="bash" />

          <p className="text-sm text-zinc-600 dark:text-zinc-400 my-3">
            Add these standard script targets to your <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">package.json</code>:
          </p>

          <CodeBlock
            code={`{
  "scripts": {
    "app:build": "web2app build",
    "app:android": "web2app build android",
    "app:windows": "web2app build windows",
    "app:debian": "web2app build debian",
    "app:arch": "web2app build arch",
    "app:doctor": "web2app doctor",
    "app:run": "web2app run android"
  }
}`}
            language="json"
            title="package.json"
          />

          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
            3. Local Contributor Linking
          </h3>
          <CodeBlock
            code={`git clone https://github.com/FuadTesfaye/web2app.git
cd web2app
npm install
npm run build
npm link`}
            language="bash"
            title="Terminal"
          />
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

          <Callout type="info">
            To skip interactive prompts and generate defaults automatically based on your <code>package.json</code>:
            <div className="mt-2 font-mono font-semibold text-zinc-900 dark:text-zinc-100">web2app init --yes</div>
          </Callout>
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
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">02.2 Output Hierarchy</span>
            <button 
              onClick={() => handleCopyLink("output-structure")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "output-structure" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
            Unified <code className="text-zinc-900 dark:text-white font-mono">app/</code> Directory Structure
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            When you run <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">web2app build</code>, the compiler produces clean, modular platform packages in <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">./app/</code>:
          </p>

          <CodeBlock
            code={`app/
├── android/
│   ├── app-debug.apk                  # Compiled Android APK (if SDK available)
│   ├── app/src/main/                  # Kotlin source & AndroidManifest
│   └── gradlew                        # Ready to open in Android Studio
├── windows/
│   ├── launch.bat                     # Windows Batch Launcher (Edge App Mode)
│   ├── launch.ps1                     # PowerShell Runner
│   ├── start.vbs                      # Silent launcher (no command prompt)
│   ├── install.bat / install.ps1      # Creates Desktop & Start Menu shortcuts
│   ├── app.manifest / app.config.json # Manifest & Window Config
│   └── assets/                        # Bundled static web files
├── debian/
│   ├── <app-name>_<ver>_all.deb       # Standalone Debian/Ubuntu binary package
│   ├── DEBIAN/control                 # Package control metadata
│   └── usr/
│       ├── bin/<app-id>               # Linux executable launcher
│       ├── share/applications/*.desktop # Linux desktop shortcut
│       └── share/icons/               # App icon
└── arch/
    ├── PKGBUILD                       # Arch AUR-compatible build script
    ├── .SRCINFO                       # Arch package metadata
    ├── <app-id>.desktop               # Desktop entry
    ├── install.sh                     # Installation script (makepkg -si)
    └── <app-id>                       # Executable launcher`}
            language="bash"
            title="app/ directory structure"
          />
        </section>

        {/* ==========================================================================
            CATEGORY 3: TARGET PLATFORMS
            ========================================================================== */}

        {/* SECTION: ANDROID */}
        <section id="platform-android" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">03.1 Target Platform</span>
            <button 
              onClick={() => handleCopyLink("platform-android")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "platform-android" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            Android Packaging (APK / AAB)
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            The Android engine generates a lightweight Kotlin project utilizing modern <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">androidx.webkit.WebViewAssetLoader</code>.
          </p>

          <CodeBlock
            tabs={{
              Debug: "npx web2app build android",
              Release: "npx web2app build android --release",
              Bundle: "npx web2app build android --bundle",
              Run: "npx web2app run android",
            }}
          />
        </section>

        {/* SECTION: WINDOWS */}
        <section id="platform-windows" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">03.2 Target Platform</span>
            <button 
              onClick={() => handleCopyLink("platform-windows")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "platform-windows" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <Monitor className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            Windows Desktop (WebView2 &amp; App Mode)
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            Generates a standalone Windows Desktop application folder in <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">app/windows/</code> with silent background launchers (<code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">start.vbs</code>) and installation scripts.
          </p>

          <CodeBlock code="npx web2app build windows" language="bash" />
        </section>

        {/* SECTION: DEBIAN */}
        <section id="platform-debian" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">03.3 Target Platform</span>
            <button 
              onClick={() => handleCopyLink("platform-debian")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "platform-debian" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <Disc className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            Debian / Ubuntu (.deb) Binary Packages
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            web2app includes an internal, pure TypeScript <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">DebPackager</code> engine that constructs valid Unix ar archives and tar.gz payloads without requiring <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">dpkg-deb</code> on the build machine.
          </p>

          <CodeBlock code="npx web2app build debian" language="bash" />
        </section>

        {/* SECTION: ARCH */}
        <section id="platform-arch" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">03.4 Target Platform</span>
            <button 
              onClick={() => handleCopyLink("platform-arch")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "platform-arch" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <Layers className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            Arch Linux (PKGBUILD &amp; AUR)
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            Generates standard Arch Linux <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">PKGBUILD</code> and <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">.SRCINFO</code> files compatible with <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200">makepkg -si</code> and AUR publication.
          </p>

          <CodeBlock code="npx web2app build arch" language="bash" />
        </section>

        {/* ==========================================================================
            CATEGORY 4: FRAMEWORK GUIDES
            ========================================================================== */}

        {/* SECTION: NEXTJS */}
        <section id="framework-nextjs" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">04.1 Framework Guide</span>
            <button 
              onClick={() => handleCopyLink("framework-nextjs")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "framework-nextjs" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
            Next.js (App Router &amp; Pages Router)
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            To bundle your Next.js application for offline execution inside standalone native apps, configure static HTML export in <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">next.config.ts</code>:
          </p>

          <CodeBlock
            code={`// next.config.ts / next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Required for static HTML export
  },
};

export default nextConfig;`}
            language="typescript"
            title="next.config.ts"
          />

          <Callout type="warn">
            If your Next.js application requires active server endpoints (e.g. Node.js Server Actions or dynamic API routes), deploy it to Vercel/Cloudflare and compile it as a <strong>Live Web URL</strong>:
            <div className="mt-2 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
              npx web2app https://my-app.vercel.app --app-name &quot;My App&quot;
            </div>
          </Callout>
        </section>

        {/* SECTION: VITE */}
        <section id="framework-vite" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">04.2 Framework Guide</span>
            <button 
              onClick={() => handleCopyLink("framework-vite")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "framework-vite" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
            Vite, React, Vue &amp; Svelte
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            Vite and Single Page Applications work out of the box. Ensure your asset base path is set to relative (<code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">base: &apos;./&apos;</code>):
          </p>

          <CodeBlock
            code={`// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Relative asset paths for native file loaders
});`}
            language="typescript"
            title="vite.config.ts"
          />
        </section>

        {/* SECTION: PYTHON */}
        <section id="framework-python" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">04.3 Framework Guide</span>
            <button 
              onClick={() => handleCopyLink("framework-python")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "framework-python" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
            Python (Streamlit, Flask, FastAPI)
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            For Python web applications, deploy your app or launch a local server and pass the URL to web2app:
          </p>

          <CodeBlock code="npx web2app http://localhost:8501 --app-name &apos;My Streamlit App&apos;" language="bash" />
        </section>

        {/* ==========================================================================
            CATEGORY 5: CLI & CONFIGURATION
            ========================================================================== */}

        {/* SECTION: CLI REFERENCE */}
        <section id="cli-reference" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">05.1 CLI Reference</span>
            <button 
              onClick={() => handleCopyLink("cli-reference")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "cli-reference" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
            CLI Commands Reference
          </h2>

          <div className="overflow-x-auto my-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100/70 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Command</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-xs">
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">web2app [url]</td>
                  <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans text-xs">Converts a live URL into Android, Windows, Debian, and Arch apps</td>
                  <td className="p-3.5 text-zinc-500">--app-name, --out</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">web2app build</td>
                  <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans text-xs">Builds all target platforms into ./app/</td>
                  <td className="p-3.5 text-zinc-500">--release, --bundle, --out</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">web2app doctor</td>
                  <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans text-xs">Diagnoses Java JDK, Android SDK, ADB, and packaging tools</td>
                  <td className="p-3.5 text-zinc-500">-</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">web2app init</td>
                  <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans text-xs">Interactive setup wizard for web2app.config.ts</td>
                  <td className="p-3.5 text-zinc-500">--yes, --force</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">web2app run android</td>
                  <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans text-xs">Builds and installs APK onto connected emulator or device</td>
                  <td className="p-3.5 text-zinc-500">--device</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">web2app skill</td>
                  <td className="p-3.5 text-zinc-600 dark:text-zinc-300 font-sans text-xs">Installs AI Agent Skill definition in .agents/skills/web2app</td>
                  <td className="p-3.5 text-zinc-500">--print, --force</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION: CONFIG SCHEMA */}
        <section id="config-schema" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">05.2 Configuration Schema</span>
            <button 
              onClick={() => handleCopyLink("config-schema")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "config-schema" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
            <code className="text-zinc-900 dark:text-white font-mono">web2app.config.ts</code> Reference
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            Complete TypeScript interface for customizing application metadata, platform targets, orientation, permissions, and icons:
          </p>

          <CodeBlock
            code={`import type { Web2AppUserConfig } from "web2app";

const config: Web2AppUserConfig = {
  appName: "My Web Application",
  packageName: "com.company.myapp",
  version: "1.0.0",
  versionCode: 1,

  // Target platforms to compile
  platforms: ["android", "windows", "debian", "arch"],

  // Android specific options
  android: {
    minSdk: 24,
    targetSdk: 35,
    orientation: "portrait", // "portrait" | "landscape" | "unspecified"
    permissions: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
    ],
  },

  // Linux (.deb & PKGBUILD) options
  debian: {
    categories: ["Network", "Utility"],
    maintainer: "Team <dev@company.com>",
  },
};

export default config;`}
            language="typescript"
            title="web2app.config.ts"
          />
        </section>

        {/* ==========================================================================
            CATEGORY 6: AI AGENT SKILL
            ========================================================================== */}

        {/* SECTION: AI AGENT SKILL */}
        <section id="ai-agent-skill" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">06.1 AI Integration</span>
            <button 
              onClick={() => handleCopyLink("ai-agent-skill")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "ai-agent-skill" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <Bot className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            AI Agent Skill Integration
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            web2app includes a standardized AI Assistant Skill formatted for <strong>Google Antigravity</strong>, <strong>Claude Code</strong>, <strong>Cursor</strong>, <strong>Windsurf</strong>, and <strong>Copilot</strong>.
          </p>

          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            Install the skill into your project with a single command:
          </p>

          <CodeBlock code="npx web2app skill" language="bash" />

          <Callout type="info">
            This creates <code>.agents/skills/web2app/SKILL.md</code> in your workspace. AI coding assistants will automatically detect frameworks, configure static exports, run doctor checks, and compile native targets.
          </Callout>
        </section>

        {/* SECTION: AI PROMPTS */}
        <section id="ai-prompts" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">06.2 AI Recipes</span>
            <button 
              onClick={() => handleCopyLink("ai-prompts")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "ai-prompts" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            Ready-to-Use AI Prompt Recipes
          </h2>

          <div className="space-y-4 my-6">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Prompt: Full Project Conversion to Android
              </div>
              <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 select-all">
                &quot;Use the web2app skill to convert this web project into a standalone Android APK. Run web2app doctor, configure next.config.ts for static export if needed, build the APK, and verify the artifact.&quot;
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Prompt: Multi-Platform Release Packaging
              </div>
              <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 select-all">
                &quot;Compile this web app for Android, Windows, Debian, and Arch Linux using web2app build. Verify the generated packages in the app/ directory.&quot;
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            CATEGORY 7: PRODUCTION & CI/CD
            ========================================================================== */}

        {/* SECTION: SIGNING */}
        <section id="signing" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">07.1 Production</span>
            <button 
              onClick={() => handleCopyLink("signing")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "signing" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            Android Keystore &amp; APK Signing
          </h2>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            For Google Play Store distribution, generate a release keystore and sign your production APK / AAB:
          </p>

          <CodeBlock
            code={`keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-app-key`}
            language="bash"
            title="Generate Keystore"
          />
        </section>

        {/* SECTION: CI/CD */}
        <section id="cicd" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">07.2 Automation</span>
            <button 
              onClick={() => handleCopyLink("cicd")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "cicd" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
            GitHub Actions CI/CD Pipeline
          </h2>

          <CodeBlock
            code={`name: Build Multi-Platform Native Apps

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'
      - name: Install dependencies
        run: npm ci
      - name: Build all native packages
        run: npx web2app build
      - name: Upload Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: native-apps
          path: app/`}
            language="yaml"
            title=".github/workflows/build-apps.yml"
          />
        </section>

        {/* ==========================================================================
            CATEGORY 8: TROUBLESHOOTING & FAQ
            ========================================================================== */}

        {/* SECTION: TROUBLESHOOTING */}
        <section id="troubleshooting" className="scroll-mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">08.1 Reference</span>
            <button 
              onClick={() => handleCopyLink("troubleshooting")}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            {copiedLink === "troubleshooting" && <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Copied!</span>}
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight mb-4">
            Troubleshooting &amp; FAQ
          </h2>

          <div className="space-y-4 my-6">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                1. How do I fix &quot;JAVA_HOME not set&quot; during Android builds?
              </h4>
              <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                Install OpenJDK 17 or 21 (e.g. <code className="font-mono text-xs">sudo apt install openjdk-21-jdk</code> on Ubuntu or <code className="font-mono text-xs">brew install openjdk@21</code> on macOS) and run <code className="font-mono text-xs">web2app doctor</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                2. Can I convert web apps with real-time WebSockets and IndexedDB?
              </h4>
              <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                Yes! All native WebViews (AndroidX WebKit, MS Edge WebView2, Linux WebKit) fully support modern HTML5 APIs including WebSockets, IndexedDB, Web Workers, Canvas, WebGL, and LocalStorage.
              </p>
            </div>
          </div>
        </section>
      </DocsBody>
    </DocsPage>
  );
}
