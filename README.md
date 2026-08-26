# ⚡ web2app

> Convert Next.js, web applications, and live web pages into native multi-platform apps (**Android**, **Windows**, **Debian**, **Arch Linux**) with a single command.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Why web2app?

Most desktop/mobile wrappers (like Capacitor or Electron boilerplate) introduce complex runtimes, high memory footprint, and multi-platform configuration headaches.

**`web2app` makes converting any web page or web app fast, clean, and universal:**  
It takes your web application (Next.js, Vite, React, static HTML) or a live web URL, bundles it into clean native wrappers, and generates a structured `app/` folder containing ready-to-run/install packages for all major platforms:

```
Web Page or Web App
        ↓
  web2app build
        ↓
app/
├── android/   → Android Kotlin Project & Standalone APK
├── windows/   → Windows Desktop App, Launchers (Edge/WebView2) & Installers
├── debian/    → Debian / Ubuntu .deb Package & Desktop Entry
└── arch/      → Arch Linux PKGBUILD, .SRCINFO & Launcher
```

---

## 📦 Quick Start

### Option A: Convert Any Web Page URL Directly
```bash
npx web2app https://news.ycombinator.com
```
Instantly produces your native packages in `./app/` for Android, Windows, Debian, and Arch Linux!

### Option B: Convert a Local Web Project (Next.js, Vite, React, HTML)
```bash
# 1. Initialize Configuration (optional)
npx web2app init

# 2. Build for all platforms (creates app/android, app/windows, app/debian, app/arch)
npx web2app build
```

---

## 📁 Output Directory Structure

When running `web2app build` or converting any web page, `web2app` creates a root directory named `app` with dedicated subdirectories for each platform:

```
app/
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
    └── <app-id>                       # Executable launcher
```

---

## 🛠️ Commands Reference

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

### Build Options
```bash
npx web2app build [platformOrUrl] [options]

Options:
  -u, --url <url>        Convert a live web page URL into apps
  -r, --release          Build release APK / package
  -b, --bundle           Build Android App Bundle (.aab)
  --skip-web-build       Skip web build step and use existing dist/out assets
  -c, --clean            Clean native wrapper before building
  -o, --out <dir>        Custom output directory (default: app)
  --verbose              Show detailed build logs
```

---

## 🌐 Next.js Configuration

For local on-device execution inside standalone apps, Next.js must be configured with static HTML export (`output: 'export'`):

```typescript
// next.config.ts / next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
```

---

## 📋 Requirements

- **Node.js**: >= 18.0.0
- **Platforms**:
  - **Android**: Java JDK 17/21 + Android SDK (optional for packaging; project wrapper is always exported)
  - **Windows**: Microsoft Edge or Chromium (available on all Windows 10/11 systems)
  - **Debian / Ubuntu**: `bash`, `xdg-utils` (packages built via pure TypeScript engine)
  - **Arch Linux**: `bash`, `xdg-utils` (AUR `makepkg` compatible)

Run `npx web2app doctor` at any time to verify your environment setup!

---

## 📄 License

MIT © 2026
