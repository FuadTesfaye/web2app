# ⚡ web2app

> Transform Next.js, Vite, React, Vue, Svelte, Python, or any live web URL into native multi-platform apps (**Android**, **Windows**, **Debian**, **Arch Linux**) with zero runtime bloat.

[![npm version](https://img.shields.io/npm/v/web2app.svg?color=blue)](https://www.npmjs.com/package/web2app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Why web2app?

Traditional hybrid frameworks (like Electron) bundle a 150MB+ Chromium binary, Node.js runtime, and high idle memory consumption.

**`web2app` compiles directly to operating system native WebViews:**  
It takes your web application (Next.js, Vite, React, Vue, Python) or a live web URL, bundles it into clean native wrappers, and generates a structured `app/` folder containing standalone installable packages for all major platforms:

```
Web App / Framework / Live URL
              ↓
        web2app build
              ↓
app/
├── android/   → Android Kotlin Project & Standalone APK (.apk / .aab)
├── windows/   → Windows Desktop App, Launchers (Edge/WebView2) & Installers
├── debian/    → Debian / Ubuntu .deb Binary Package & Desktop Entry
└── arch/      → Arch Linux PKGBUILD, .SRCINFO & Launcher
```

---

## 📦 Installation & Usage

`web2app` can be run globally, locally as a devDependency in your `package.json`, or instantly via `npx`:

### 1. Global Installation (Recommended for Terminal Power Users)
Install `web2app` globally with your favorite package manager:

```bash
# npm
npm install -g web2app

# pnpm
pnpm add -g web2app

# yarn
yarn global add web2app

# bun
bun add -g web2app
```

Now you can run `web2app` anywhere in any directory:
```bash
web2app build
web2app https://news.ycombinator.com
web2app doctor
```

---

### 2. Zero-Install Instant Runner (`npx`)
Run commands directly without installing anything globally:

```bash
# Convert any live website URL into native packages
npx web2app https://news.ycombinator.com

# Build current web project into native Android, Windows, Debian, and Arch apps
npx web2app build

# Run environment diagnostics
npx web2app doctor

# Install AI Agent Skill for Antigravity & Claude Code
npx web2app skill
```

---

### 3. Local Project DevDependency & NPM Scripts
Add `web2app` to your repository so your team and CI/CD pipelines can run automated build scripts:

```bash
npm install -D web2app
```

Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "app:build": "web2app build",
    "app:android": "web2app build android",
    "app:windows": "web2app build windows",
    "app:debian": "web2app build debian",
    "app:arch": "web2app build arch",
    "app:run": "web2app run android",
    "app:doctor": "web2app doctor"
  }
}
```

Then simply execute:
```bash
npm run app:build
```

---

### 4. Local Contributor Linking (`npm link`)
To develop or customize `web2app` locally on your machine:

```bash
git clone https://github.com/FuadTesfaye/web2app.git
cd web2app
npm install
npm run build
npm link
```

---

## 🤖 AI Agent Skill (Antigravity, Cursor, Claude Code)

`web2app` includes an official AI Agent Skill definition. To equip your autonomous coding assistant with complete knowledge of `web2app`, run:

```bash
npx web2app skill
```

This creates `.agents/skills/web2app/SKILL.md` in your project so AI assistants can automatically detect frameworks, configure static exports, and compile multi-platform apps.

---

## 📁 Output Directory Structure

```
app/
├── android/
│   ├── app-debug.apk                  # Compiled Android APK
│   ├── app/src/main/                  # Kotlin source & AndroidManifest
│   └── gradlew                        # Ready to open in Android Studio
├── windows/
│   ├── launch.bat                     # Windows Batch Launcher (Edge App Mode)
│   ├── launch.ps1                     # PowerShell Runner
│   ├── start.vbs                      # Silent background launcher
│   ├── install.bat / install.ps1      # Creates Start Menu shortcuts
│   └── app.manifest                   # Manifest & Window Configuration
├── debian/
│   ├── <app-name>_<ver>_all.deb       # Standalone Debian/Ubuntu binary package
│   ├── DEBIAN/control                 # Package control metadata
│   └── usr/share/applications/*.desktop # Linux desktop launcher
└── arch/
    ├── PKGBUILD                       # Arch AUR-compatible build script
    ├── .SRCINFO                       # Arch package metadata
    └── install.sh                     # Automated installation script
```

---

## 🛠️ CLI Commands

| Command | Description |
|---|---|
| `web2app [url]` | Converts a live web page URL into `app/` (Android, Windows, Debian, Arch) |
| `web2app build` | Builds applications for all supported platforms into `app/` |
| `web2app build <platform>` | Builds for specific platform (`android`, `windows`, `debian`, `arch`) |
| `web2app init` | Interactive setup wizard to configure `web2app.config.ts` |
| `web2app doctor` | Diagnoses local environment (Node.js, Java JDK, Android SDK, ADB, packaging tools) |
| `web2app clean` | Cleans `.web2app/` work directory and `app/` build outputs |
| `web2app run android` | Installs and launches the application on a connected Android device or emulator |
| `web2app open android` | Opens the generated native Android project in Android Studio |
| `web2app skill` | Installs or exports the AI Agent Skill definition (`.agents/skills/web2app/SKILL.md`) |

---

## 🌐 Next.js Static Export Configuration

```typescript
// next.config.ts / next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Required for offline native assets
  },
};

export default nextConfig;
```

---

## 📋 Requirements

- **Node.js**: `>= 18.0.0`
- **Platforms**:
  - **Android**: Java JDK 17/21 + Android SDK (optional for packaging; native wrapper is always exported)
  - **Windows**: Microsoft Edge or Chromium (available on all Windows 10/11 systems)
  - **Debian / Ubuntu**: Pure TypeScript packaging engine (no `dpkg` required to build)
  - **Arch Linux**: `makepkg -si` compatible

---

## 📄 License

MIT © 2026 Fuad Tesfaye
