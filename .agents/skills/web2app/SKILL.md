---
name: web2app
description: >-
  Build, convert, and package web applications (Next.js, Vite, React, Vue, Svelte, Python, Streamlit, Flask, FastAPI) or live web URLs into standalone native Android (APK/AAB), Windows Desktop (WebView2), Debian/Ubuntu (.deb), and Arch Linux (PKGBUILD) apps with zero runtime bloat. Use whenever the user mentions converting a web app to mobile or desktop, compiling an Android APK, testing on Android emulators/devices, generating .deb packages, running web2app doctor/diagnostics, or configuring web2app.config.ts.
---

# web2app AI Assistant Skill

Transform modern web applications and live URLs into native, lightweight, standalone mobile and desktop packages using operating system native WebViews (AndroidX WebKit, Microsoft Edge WebView2, Linux WebKit/XDG).

---

## 1. Quick Decision Tree

| Goal | Command | Output Artifact |
| :--- | :--- | :--- |
| Convert any live website URL | `npx web2app https://example.com` | `app/android/*.apk`, `app/windows/`, `app/debian/*.deb`, `app/arch/` |
| Build all platforms for current project | `npx web2app build` | Complete `app/` folder for all 4 targets |
| Build only Android APK | `npx web2app build android` | `app/android/app-debug.apk` |
| Build Android Release Bundle (.aab) | `npx web2app build android --release --bundle` | `app/android/app-release.aab` |
| Build Windows Desktop wrapper | `npx web2app build windows` | `app/windows/launch.bat`, `start.vbs`, `install.bat` |
| Build Debian / Ubuntu package | `npx web2app build debian` | `app/debian/*.deb` (pure TS packager, no host Linux req) |
| Build Arch Linux AUR recipe | `npx web2app build arch` | `app/arch/PKGBUILD`, `install.sh` |
| Check local build tool dependencies | `npx web2app doctor` | System diagnostic report (JDK, Android SDK, ADB) |
| Launch on connected Android device | `npx web2app run android` | Installs and launches on device/emulator |

---

## 2. Standard Workflow for AI Agents

When a user asks to turn their web project into a native app, follow these precise steps:

### Step 1: Check Environment Health
Run `web2app doctor` to inspect Node.js, JDK (Java 17/21), Android SDK, and ADB:
```bash
npx web2app doctor
```

### Step 2: Ensure Static Web Export is Configured
web2app ingests static web assets into native wrappers. Verify the user's framework configuration:

#### A. Next.js (`next.config.js` or `next.config.mjs`)
Ensure `output: 'export'` and `images: { unoptimized: true }` are configured:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs static HTML/JS/CSS to out/
  images: {
    unoptimized: true, // Offline image asset support
  },
};

export default nextConfig;
```

#### B. Vite / React / Vue / Svelte (`vite.config.ts`)
Set relative base path if needed:
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures assets load correctly relative to root
});
```

### Step 3: Initialize Configuration (Optional)
To customize app name, package ID, permissions, or icons, generate `web2app.config.ts`:
```bash
npx web2app init --yes --app-name "My App" --package-name "com.mycompany.myapp"
```

Example configuration schema (`web2app.config.ts`):
```typescript
export default {
  appName: "My App",
  packageName: "com.mycompany.myapp",
  version: "1.0.0",
  platforms: ["android", "windows", "debian", "arch"],
  icon: "./public/icon.png",
  
  android: {
    minSdk: 24,
    targetSdk: 35,
    orientation: "portrait", // "portrait" | "landscape" | "unspecified"
    permissions: ["INTERNET", "CAMERA", "ACCESS_FINE_LOCATION"],
  },
  
  windows: {
    windowWidth: 1280,
    windowHeight: 800,
    resizable: true,
  },
  
  debian: {
    section: "web",
    categories: ["Network", "Utility"],
  }
};
```

### Step 4: Execute Build
Run the compiler:
```bash
# Build all platforms
npx web2app build

# Or build specific platform
npx web2app build android
```

### Step 5: Verify Artifacts
Check the generated outputs in the `app/` directory:
- **Android**: `app/android/app-debug.apk`
- **Windows**: `app/windows/launch.bat` & `start.vbs`
- **Debian**: `app/debian/com.mycompany.myapp_1.0.0_all.deb`
- **Arch**: `app/arch/PKGBUILD`

---

## 3. Common Troubleshooting for Agents

1. **Android Build Fails with "JAVA_HOME not set"**:
   - Check if JDK 17 or 21 is installed: `java -version`
   - Set environment variable: `export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which javac))))`

2. **Next.js API Routes / SSR Server Actions**:
   - If the project relies on active Node.js server endpoints, compile the app as a **Live Web URL target**:
     ```bash
     npx web2app https://my-deployed-app.vercel.app --app-name "My App"
     ```

3. **Pure TypeScript Debian Packager**:
   - `web2app build debian` uses an internal pure-TypeScript `.deb` generator. It does **not** require `dpkg` or Linux, and builds `.deb` binaries directly on macOS or Windows!
