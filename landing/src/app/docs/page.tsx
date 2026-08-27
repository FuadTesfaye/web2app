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
  CheckCircle2,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { playClick, playTone } from "@/lib/sound";

const toc: TableOfContents = [
  { title: "Introduction & Motivation", url: "#introduction", depth: 2 },
  { title: "Quick Start", url: "#quick-start", depth: 2 },
  { title: "Installation & Scripts", url: "#installation", depth: 2 },
  { title: "Project Init Wizard", url: "#init-wizard", depth: 2 },
  { title: "Zero-Bloat Architecture", url: "#zero-bloat", depth: 2 },
  { title: "Unified app/ Directory Tree", url: "#output-structure", depth: 2 },
  { title: "Android (APK / AAB)", url: "#platform-android", depth: 2 },
  { title: "Windows Desktop (WebView2)", url: "#platform-windows", depth: 2 },
  { title: "Debian & Ubuntu (.deb)", url: "#platform-debian", depth: 2 },
  { title: "Arch Linux (PKGBUILD)", url: "#platform-arch", depth: 2 },
  { title: "Next.js (App Router)", url: "#framework-nextjs", depth: 2 },
  { title: "Vite, React & SPA", url: "#framework-vite", depth: 2 },
  { title: "Python, Streamlit & Flask", url: "#framework-python", depth: 2 },
  { title: "CLI Commands Reference", url: "#cli-reference", depth: 2 },
  { title: "web2app.config.ts Schema", url: "#config-schema", depth: 2 },
  { title: "AI Agent Skill Integration", url: "#ai-agent-skill", depth: 2 },
  { title: "AI Prompt Recipes", url: "#ai-prompts", depth: 2 },
  { title: "Android Keystore & Signing", url: "#signing", depth: 2 },
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
    playTone(700, "sine", 0.08);
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
      {/* Hero Header */}
      <div className="border-3 border-ink bg-surface shadow-neo-md p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-ink opacity-5 font-display font-black text-9xl pointer-events-none select-none">
          DOCS
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-accent-yellow text-ink border-2 border-ink font-mono font-bold text-xs uppercase shadow-neo-xs flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Official Documentation
          </span>
          <span className="px-2 py-0.5 bg-accent-pink text-ink border border-ink font-mono font-bold text-[11px] shadow-neo-xs">
            v0.1.0
          </span>
          <span className="px-2 py-0.5 bg-accent-cyan text-ink border border-ink font-mono font-bold text-[11px] shadow-neo-xs">
            FUMADOCS ENGINE
          </span>
        </div>

        <DocsTitle className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-ink tracking-tight uppercase">
          web2app Developer Guide
        </DocsTitle>

        <DocsDescription className="text-sm sm:text-base text-ink-muted mt-3 font-mono font-medium max-w-2xl leading-relaxed">
          Compile Next.js, Vite, React, Vue, Svelte, Python, or live URLs into standalone native Android, Windows, Debian, and Arch apps with zero runtime bloat.
        </DocsDescription>
      </div>

      <DocsBody className="space-y-12 text-ink">
        {/* ==========================================================================
            CATEGORY 1: GETTING STARTED
            ========================================================================== */}

        {/* SECTION: INTRODUCTION */}
        <section id="introduction" className="scroll-mt-24">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 01.1 Overview"}</span>
            <button 
              onClick={() => handleCopyLink("introduction")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
              title="Copy section link"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "introduction" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>
          
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Introduction &amp; Motivation
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            Traditional desktop and mobile packaging toolchains (like Electron, Cordova, or standard hybrid shells) bundle a 150MB+ Chromium browser binary and separate Node.js runtime into every application. This leads to massive file sizes, high idle RAM consumption, and complicated configuration workflows.
          </p>

          <p className="text-[15px] text-ink leading-relaxed mb-6 font-sans">
            <strong>web2app compiles directly to native operating system WebViews:</strong> It takes your web application (Next.js, Vite, React, static HTML) or a live web URL, bundles it into clean native wrappers, and generates a structured <code className="bg-surface-subtle text-ink px-1.5 py-0.5 border border-ink font-mono text-xs shadow-neo-xs font-bold">app/</code> directory containing ready-to-run packages for Android, Windows, Debian/Ubuntu, and Arch Linux.
          </p>

          {/* Platform Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
            <div className="p-4 bg-surface border-3 border-ink shadow-neo-sm hover:shadow-neo-md hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center group">
              <div className="w-10 h-10 mx-auto mb-2 bg-accent-green text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-bold text-lg group-hover:rotate-6 transition-transform">
                📱
              </div>
              <div className="font-display font-black text-xs sm:text-sm uppercase text-ink">Android APK</div>
              <div className="text-[10px] font-mono font-bold text-ink-muted mt-1 bg-surface-subtle border border-ink py-0.5">&lt; 3 MB APK</div>
            </div>

            <div className="p-4 bg-surface border-3 border-ink shadow-neo-sm hover:shadow-neo-md hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center group">
              <div className="w-10 h-10 mx-auto mb-2 bg-accent-cyan text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-bold text-lg group-hover:rotate-6 transition-transform">
                🪟
              </div>
              <div className="font-display font-black text-xs sm:text-sm uppercase text-ink">Windows App</div>
              <div className="text-[10px] font-mono font-bold text-ink-muted mt-1 bg-surface-subtle border border-ink py-0.5">MS Edge App</div>
            </div>

            <div className="p-4 bg-surface border-3 border-ink shadow-neo-sm hover:shadow-neo-md hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center group">
              <div className="w-10 h-10 mx-auto mb-2 bg-accent-pink text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-bold text-lg group-hover:rotate-6 transition-transform">
                🐧
              </div>
              <div className="font-display font-black text-xs sm:text-sm uppercase text-ink">Debian .deb</div>
              <div className="text-[10px] font-mono font-bold text-ink-muted mt-1 bg-surface-subtle border border-ink py-0.5">Pure TS Engine</div>
            </div>

            <div className="p-4 bg-surface border-3 border-ink shadow-neo-sm hover:shadow-neo-md hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center group">
              <div className="w-10 h-10 mx-auto mb-2 bg-accent-purple text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-bold text-lg group-hover:rotate-6 transition-transform">
                🏹
              </div>
              <div className="font-display font-black text-xs sm:text-sm uppercase text-ink">Arch Linux</div>
              <div className="text-[10px] font-mono font-bold text-ink-muted mt-1 bg-surface-subtle border border-ink py-0.5">AUR PKGBUILD</div>
            </div>
          </div>
        </section>

        {/* SECTION: QUICK START */}
        <section id="quick-start" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 01.2 Quick Start"}</span>
            <button 
              onClick={() => handleCopyLink("quick-start")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "quick-start" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Instant 10-Second Conversion
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            You can convert any live web URL or local project without installing anything beforehand using <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">npx</code>:
          </p>

          <h3 className="font-display font-black text-base uppercase text-ink mt-6 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 bg-accent-yellow border border-ink flex items-center justify-center text-xs shadow-neo-xs">A</span>
            Convert a Live Web Page URL
          </h3>
          <CodeBlock code="npx web2app https://news.ycombinator.com" language="bash" />

          <h3 className="font-display font-black text-base uppercase text-ink mt-6 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 bg-accent-cyan border border-ink flex items-center justify-center text-xs shadow-neo-xs">B</span>
            Convert Current Project (Next.js / Vite / React / HTML)
          </h3>
          <CodeBlock code="npx web2app build" language="bash" />

          <Callout type="info">
            When you run <code>web2app build</code>, the compiler auto-detects your web framework, compiles static production assets, copies native wrappers, and generates the complete <code>app/</code> directory.
          </Callout>
        </section>

        {/* SECTION: INSTALLATION */}
        <section id="installation" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 01.3 Installation"}</span>
            <button 
              onClick={() => handleCopyLink("installation")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "installation" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Installation &amp; Script Runner Setup
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            web2app can be used as a <strong>global CLI</strong>, an <strong>npm devDependency</strong> with automated scripts in your <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink font-mono text-xs font-bold shadow-neo-xs">package.json</code>, or executed instantly via <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink font-mono text-xs font-bold shadow-neo-xs">npx</code>.
          </p>

          <h3 className="font-display font-black text-base uppercase text-ink mt-6 mb-2">
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

          <h3 className="font-display font-black text-base uppercase text-ink mt-6 mb-2">
            2. Project DevDependency &amp; NPM Scripts
          </h3>
          <p className="text-sm text-ink-muted mb-3 font-mono font-medium">
            Add web2app directly to your project dependencies so teammates and CI/CD pipelines can run automated build scripts:
          </p>

          <CodeBlock code="npm install -D web2app" language="bash" />

          <p className="text-sm text-ink-muted my-3 font-mono font-medium">
            Add these standard script targets to your <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink font-mono text-xs font-bold shadow-neo-xs">package.json</code>:
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

          <h3 className="font-display font-black text-base uppercase text-ink mt-6 mb-2">
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
        <section id="init-wizard" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 01.4 Configuration Wizard"}</span>
            <button 
              onClick={() => handleCopyLink("init-wizard")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "init-wizard" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Project Initialization Wizard
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            Run <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">web2app init</code> inside your project root to interactively configure your app name, package ID, target platforms, and icons:
          </p>

          <CodeBlock code="web2app init" language="bash" />

          <Callout type="info">
            To skip interactive prompts and generate defaults automatically based on your <code>package.json</code>:
            <div className="mt-2 font-mono font-bold text-ink bg-surface-subtle p-2 border border-ink shadow-neo-xs">web2app init --yes</div>
          </Callout>
        </section>

        {/* ==========================================================================
            CATEGORY 2: ARCHITECTURE & ENGINE
            ========================================================================== */}

        {/* SECTION: ZERO BLOAT */}
        <section id="zero-bloat" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 02.1 Architecture"}</span>
            <button 
              onClick={() => handleCopyLink("zero-bloat")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "zero-bloat" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Zero-Runtime Overhead Architecture
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            Traditional desktop frameworks package entire browser binaries, rendering engines, and Node.js runtimes into each application. web2app takes an architectural approach that relies on native operating system WebViews:
          </p>

          <div className="bg-surface border-3 border-ink shadow-neo-md p-5 space-y-4 my-6">
            <div className="flex items-start gap-3.5">
              <span className="w-8 h-8 bg-accent-yellow text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-mono font-black text-sm shrink-0">1</span>
              <div>
                <h4 className="font-display font-black text-base uppercase text-ink">Android: AndroidX WebViewAssetLoader</h4>
                <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed font-sans">
                  Uses Android’s native WebKit with secure local asset loading, GPU hardware acceleration, and full HTML5 IndexedDB storage support.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-3 border-t-2 border-ink">
              <span className="w-8 h-8 bg-accent-cyan text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-mono font-black text-sm shrink-0">2</span>
              <div>
                <h4 className="font-display font-black text-base uppercase text-ink">Windows: MS Edge / Chromium App Mode</h4>
                <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed font-sans">
                  Leverages Microsoft Edge App Mode with custom window boundaries, silent VBScript launch runners, and Start Menu registry shortcuts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-3 border-t-2 border-ink">
              <span className="w-8 h-8 bg-accent-pink text-ink border-2 border-ink shadow-neo-xs flex items-center justify-center font-mono font-black text-sm shrink-0">3</span>
              <div>
                <h4 className="font-display font-black text-base uppercase text-ink">Linux: Pure TypeScript DebPackager</h4>
                <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed font-sans">
                  Generates valid Debian binary .deb packages with XDG desktop application entries and scalable SVG/PNG icon hierarchies without requiring dpkg on the host machine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: OUTPUT STRUCTURE */}
        <section id="output-structure" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 02.2 Output Hierarchy"}</span>
            <button 
              onClick={() => handleCopyLink("output-structure")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "output-structure" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Unified <code className="text-ink font-mono">app/</code> Directory Structure
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            When you run <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">web2app build</code>, the compiler produces clean, modular platform packages in <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">./app/</code>:
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
        <section id="platform-android" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 03.1 Target Platform"}</span>
            <button 
              onClick={() => handleCopyLink("platform-android")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "platform-android" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4 flex items-center gap-2">
            <Smartphone className="w-7 h-7 text-accent-green" />
            Android Packaging (APK / AAB)
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            The Android engine generates a lightweight Kotlin project utilizing modern <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">androidx.webkit.WebViewAssetLoader</code>.
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
        <section id="platform-windows" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 03.2 Target Platform"}</span>
            <button 
              onClick={() => handleCopyLink("platform-windows")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "platform-windows" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4 flex items-center gap-2">
            <Monitor className="w-7 h-7 text-accent-cyan" />
            Windows Desktop (WebView2 &amp; App Mode)
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            Generates a standalone Windows Desktop application folder in <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">app/windows/</code> with silent background launchers (<code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">start.vbs</code>) and installation scripts.
          </p>

          <CodeBlock code="npx web2app build windows" language="bash" />
        </section>

        {/* SECTION: DEBIAN */}
        <section id="platform-debian" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 03.3 Target Platform"}</span>
            <button 
              onClick={() => handleCopyLink("platform-debian")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "platform-debian" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4 flex items-center gap-2">
            <Disc className="w-7 h-7 text-accent-pink" />
            Debian / Ubuntu (.deb) Binary Packages
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            web2app includes an internal, pure TypeScript <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">DebPackager</code> engine that constructs valid Unix ar archives and tar.gz payloads without requiring <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">dpkg-deb</code> on the build machine.
          </p>

          <CodeBlock code="npx web2app build debian" language="bash" />
        </section>

        {/* SECTION: ARCH */}
        <section id="platform-arch" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 03.4 Target Platform"}</span>
            <button 
              onClick={() => handleCopyLink("platform-arch")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "platform-arch" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4 flex items-center gap-2">
            <Layers className="w-7 h-7 text-accent-purple" />
            Arch Linux (PKGBUILD &amp; AUR)
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            Generates standard Arch Linux <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">PKGBUILD</code> and <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">.SRCINFO</code> files compatible with <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink text-xs font-mono font-bold text-ink shadow-neo-xs">makepkg -si</code> and AUR publication.
          </p>

          <CodeBlock code="npx web2app build arch" language="bash" />
        </section>

        {/* ==========================================================================
            CATEGORY 4: FRAMEWORK GUIDES
            ========================================================================== */}

        {/* SECTION: NEXTJS */}
        <section id="framework-nextjs" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 04.1 Framework Guide"}</span>
            <button 
              onClick={() => handleCopyLink("framework-nextjs")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "framework-nextjs" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Next.js (App Router &amp; Pages Router)
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            To bundle your Next.js application for offline execution inside standalone native apps, configure static HTML export in <code className="bg-surface-subtle px-1.5 py-0.5 border border-ink font-mono text-xs font-bold shadow-neo-xs">next.config.ts</code>:
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
            <div className="mt-2 font-mono font-bold text-ink bg-surface-subtle p-2 border border-ink shadow-neo-xs">
              npx web2app https://my-app.vercel.app --app-name &quot;My App&quot;
            </div>
          </Callout>
        </section>

        {/* SECTION: VITE */}
        <section id="framework-vite" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 04.2 Framework Guide"}</span>
            <button 
              onClick={() => handleCopyLink("framework-vite")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "framework-vite" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Vite, React, Vue &amp; Svelte
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            Vite and Single Page Applications work out of the box. Ensure your asset base path is set to relative (<code className="bg-surface-subtle px-1.5 py-0.5 border border-ink font-mono text-xs font-bold shadow-neo-xs">base: &apos;./&apos;</code>):
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
        <section id="framework-python" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 04.3 Framework Guide"}</span>
            <button 
              onClick={() => handleCopyLink("framework-python")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "framework-python" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Python (Streamlit, Flask, FastAPI)
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            For Python web applications, deploy your app or launch a local server and pass the URL to web2app:
          </p>

          <CodeBlock code="npx web2app http://localhost:8501 --app-name &apos;My Streamlit App&apos;" language="bash" />
        </section>

        {/* ==========================================================================
            CATEGORY 5: CLI & CONFIGURATION
            ========================================================================== */}

        {/* SECTION: CLI REFERENCE */}
        <section id="cli-reference" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 05.1 CLI Reference"}</span>
            <button 
              onClick={() => handleCopyLink("cli-reference")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "cli-reference" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            CLI Commands Reference
          </h2>

          <div className="overflow-x-auto my-6 border-3 border-ink shadow-neo-sm bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-subtle border-b-2 border-ink text-ink font-mono text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Command</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink font-mono text-xs">
                <tr>
                  <td className="p-3.5 font-black text-ink">web2app [url]</td>
                  <td className="p-3.5 text-ink-muted font-sans text-xs">Converts a live URL into Android, Windows, Debian, and Arch apps</td>
                  <td className="p-3.5 text-ink font-bold">--app-name, --out</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-black text-ink">web2app build</td>
                  <td className="p-3.5 text-ink-muted font-sans text-xs">Builds all target platforms into ./app/</td>
                  <td className="p-3.5 text-ink font-bold">--release, --bundle, --out</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-black text-ink">web2app doctor</td>
                  <td className="p-3.5 text-ink-muted font-sans text-xs">Diagnoses Java JDK, Android SDK, ADB, and packaging tools</td>
                  <td className="p-3.5 text-ink font-bold">-</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-black text-ink">web2app init</td>
                  <td className="p-3.5 text-ink-muted font-sans text-xs">Interactive setup wizard for web2app.config.ts</td>
                  <td className="p-3.5 text-ink font-bold">--yes, --force</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-black text-ink">web2app run android</td>
                  <td className="p-3.5 text-ink-muted font-sans text-xs">Builds and installs APK onto connected emulator or device</td>
                  <td className="p-3.5 text-ink font-bold">--device</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-black text-ink">web2app skill</td>
                  <td className="p-3.5 text-ink-muted font-sans text-xs">Installs AI Agent Skill definition in .agents/skills/web2app</td>
                  <td className="p-3.5 text-ink font-bold">--print, --force</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION: CONFIG SCHEMA */}
        <section id="config-schema" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 05.2 Configuration Schema"}</span>
            <button 
              onClick={() => handleCopyLink("config-schema")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "config-schema" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            <code className="text-ink font-mono">web2app.config.ts</code> Reference
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
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
        <section id="ai-agent-skill" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 06.1 AI Integration"}</span>
            <button 
              onClick={() => handleCopyLink("ai-agent-skill")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "ai-agent-skill" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4 flex items-center gap-2">
            <Bot className="w-7 h-7 text-accent-cyan" />
            AI Agent Skill Integration
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            web2app includes a standardized AI Assistant Skill formatted for <strong>Google Antigravity</strong>, <strong>Claude Code</strong>, <strong>Cursor</strong>, <strong>Windsurf</strong>, and <strong>Copilot</strong>.
          </p>

          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            Install the skill into your project with a single command:
          </p>

          <CodeBlock code="npx web2app skill" language="bash" />

          <Callout type="info">
            This creates <code>.agents/skills/web2app/SKILL.md</code> in your workspace. AI coding assistants will automatically detect frameworks, configure static exports, run doctor checks, and compile native targets.
          </Callout>
        </section>

        {/* SECTION: AI PROMPTS */}
        <section id="ai-prompts" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 06.2 AI Recipes"}</span>
            <button 
              onClick={() => handleCopyLink("ai-prompts")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "ai-prompts" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-accent-yellow" />
            Ready-to-Use AI Prompt Recipes
          </h2>

          <div className="space-y-4 my-6">
            <div className="p-5 bg-surface border-3 border-ink shadow-neo-sm">
              <div className="text-xs font-mono font-black text-ink uppercase mb-2 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-accent-green inline-block border border-ink"></span>
                Prompt: Full Project Conversion to Android
              </div>
              <div className="text-xs font-mono text-ink bg-surface-subtle p-3 border-2 border-ink shadow-neo-xs select-all leading-relaxed">
                &quot;Use the web2app skill to convert this web project into a standalone Android APK. Run web2app doctor, configure next.config.ts for static export if needed, build the APK, and verify the artifact.&quot;
              </div>
            </div>

            <div className="p-5 bg-surface border-3 border-ink shadow-neo-sm">
              <div className="text-xs font-mono font-black text-ink uppercase mb-2 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-accent-pink inline-block border border-ink"></span>
                Prompt: Multi-Platform Release Packaging
              </div>
              <div className="text-xs font-mono text-ink bg-surface-subtle p-3 border-2 border-ink shadow-neo-xs select-all leading-relaxed">
                &quot;Compile this web app for Android, Windows, Debian, and Arch Linux using web2app build. Verify the generated packages in the app/ directory.&quot;
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            CATEGORY 7: PRODUCTION & CI/CD
            ========================================================================== */}

        {/* SECTION: SIGNING */}
        <section id="signing" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 07.1 Production"}</span>
            <button 
              onClick={() => handleCopyLink("signing")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "signing" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-accent-green" />
            Android Keystore &amp; APK Signing
          </h2>
          
          <p className="text-[15px] text-ink leading-relaxed mb-4 font-sans">
            For Google Play Store distribution, generate a release keystore and sign your production APK / AAB:
          </p>

          <CodeBlock
            code={`keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-app-key`}
            language="bash"
            title="Generate Keystore"
          />
        </section>

        {/* SECTION: CI/CD */}
        <section id="cicd" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 07.2 Automation"}</span>
            <button 
              onClick={() => handleCopyLink("cicd")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "cicd" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
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
        <section id="troubleshooting" className="scroll-mt-24 pt-8 border-t-3 border-ink">
          <div className="group flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-black uppercase text-ink-muted">{"// 08.1 Reference"}</span>
            <button 
              onClick={() => handleCopyLink("troubleshooting")}
              className="opacity-0 group-hover:opacity-100 text-ink hover:text-accent-pink transition-opacity"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {copiedLink === "troubleshooting" && <span className="text-[10px] text-accent-pink font-mono font-bold">COPIED!</span>}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight uppercase mb-4">
            Troubleshooting &amp; FAQ
          </h2>

          <div className="space-y-4 my-6">
            <div className="p-5 bg-surface border-3 border-ink shadow-neo-sm">
              <h4 className="font-display font-black text-base uppercase text-ink">
                1. How do I fix &quot;JAVA_HOME not set&quot; during Android builds?
              </h4>
              <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed font-sans">
                Install OpenJDK 17 or 21 (e.g. <code className="font-mono text-xs font-bold text-ink bg-surface-subtle px-1 border border-ink">sudo apt install openjdk-21-jdk</code> on Ubuntu or <code className="font-mono text-xs font-bold text-ink bg-surface-subtle px-1 border border-ink">brew install openjdk@21</code> on macOS) and run <code className="font-mono text-xs font-bold text-ink bg-surface-subtle px-1 border border-ink">web2app doctor</code>.
              </p>
            </div>

            <div className="p-5 bg-surface border-3 border-ink shadow-neo-sm">
              <h4 className="font-display font-black text-base uppercase text-ink">
                2. Can I convert web apps with real-time WebSockets and IndexedDB?
              </h4>
              <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed font-sans">
                Yes! All native WebViews (AndroidX WebKit, MS Edge WebView2, Linux WebKit) fully support modern HTML5 APIs including WebSockets, IndexedDB, Web Workers, Canvas, WebGL, and LocalStorage.
              </p>
            </div>
          </div>
        </section>
      </DocsBody>
    </DocsPage>
  );
}
