# ⚡ web2app

> Convert Next.js and modern web applications into high-performance native Android apps with a single command.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Why web2app?

Most mobile wrappers (like Capacitor or Cordova) introduce complex runtimes, multi-platform overhead, and heavy plugin layers. 

**`web2app` does one thing extremely well:**  
It takes your web application (Next.js, Vite, React, or static HTML), bundles it with a clean Android WebView wrapper using `androidx.webkit.WebViewAssetLoader`, and produces a standalone `.apk` ready for testing or distribution.

```
Next.js / Web Project
         ↓
  web2app build android
         ↓
  app-debug.apk (Ready to install!)
```

---

## 📦 Quick Start

### 1. Initialize Configuration in your project
```bash
npx web2app init
```
This generates `web2app.config.ts`:
```typescript
import type { Web2AppUserConfig } from "web2app";

const config: Web2AppUserConfig = {
  appName: "My Awesome App",
  packageName: "com.fuad.myawesomeapp",
  version: "1.0.0",

  android: {
    minSdk: 24,
    targetSdk: 35,
    orientation: "portrait",
  },
};

export default config;
```

### 2. Build the Android APK
```bash
npx web2app build android
```

### 3. Install and Run on Device / Emulator
```bash
npx web2app run android
```

---

## 🛠️ Commands Reference

| Command | Description |
|---|---|
| `web2app init` | Interactive setup wizard to configure `web2app.config.ts` |
| `web2app build android` | Detects project, builds web assets, generates Android wrapper, and compiles APK |
| `web2app run android` | Builds APK, connects to ADB device/emulator, installs and launches app |
| `web2app doctor` | Diagnoses local environment (Node.js, Java JDK 17/21, Android SDK, ADB) |
| `web2app clean` | Cleans `.web2app/` work directory and `dist/android/` artifacts |
| `web2app open android` | Opens the generated native Android project in Android Studio |

### Build Options
```bash
npx web2app build android [options]

Options:
  -r, --release          Build release APK
  --skip-web-build       Skip web build step and use existing dist/out assets
  -c, --clean            Clean native wrapper before building
  -o, --out <dir>        Custom output directory (default: dist/android)
  --verbose              Show detailed build and Gradle output
```

---

## 🌐 Next.js Configuration

For local on-device execution inside the native Android WebView, Next.js must be configured with static HTML export (`output: 'export'`):

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

`web2app` automatically detects your Next.js configuration and ensures the exported static files in `out/` are embedded inside the Android APK.

---

## 📱 How It Works

1. **Project Detection**: Identifies framework (Next.js, Vite, static HTML), package manager (`pnpm`, `npm`, `yarn`, `bun`), and export settings.
2. **Web Build**: Runs the static build (`npm run build` / `pnpm build`) to produce HTML/JS/CSS bundles.
3. **Android Wrapper Scaffolding**: Prepares a native Kotlin Android project in `.web2app/android/`.
4. **Configuration Injection**: Modifies `applicationId`, `versionCode`, `versionName`, app name strings, permissions, and app icons.
5. **Asset Loader**: Uses AndroidX `WebViewAssetLoader` to map `https://appassets.androidplatform.net/assets/` to local assets, providing full CORS-free modern web support (localStorage, IndexedDB, Web APIs, fast back-button navigation).
6. **Gradle Compilation**: Invokes Gradle to compile the final `.apk` and places it into `dist/android/`.

---

## 📋 Requirements

- **Node.js**: >= 18.0.0
- **Java**: JDK 17 or JDK 21 (e.g. Eclipse Temurin)
- **Android SDK**: Android SDK Platform (API 34/35) & Build-Tools

Run `npx web2app doctor` at any time to verify your environment setup!

---

## 📄 License

MIT © 2026
