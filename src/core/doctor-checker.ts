import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { CommandRunner } from "../utils/command-runner.js";
import { FileSystem } from "../utils/filesystem.js";
import { DiagnosticItem, DoctorReport } from "../types.js";

export class DoctorChecker {
  /**
   * Run full environment diagnostics
   */
  static async checkAll(): Promise<DoctorReport> {
    const items: DiagnosticItem[] = [];

    // 1. Node.js
    items.push(await this.checkNode());

    // 2. Java / JDK
    const javaItem = await this.checkJava();
    items.push(javaItem);

    // 3. Android SDK
    const sdkItems = await this.checkAndroidSdk();
    items.push(...sdkItems);

    // 4. ADB & Devices
    const adbItem = await this.checkAdb();
    items.push(adbItem);

    const hasErrors = items.some((i) => i.status === "fail");
    const hasWarnings = items.some((i) => i.status === "warn");

    return {
      items,
      passed: !hasErrors,
      hasWarnings,
    };
  }

  /**
   * Check Node.js runtime version
   */
  static async checkNode(): Promise<DiagnosticItem> {
    const version = process.version;
    const major = parseInt(version.replace("v", "").split(".")[0], 10);

    if (major >= 18) {
      return {
        id: "node",
        category: "node",
        name: "Node.js",
        status: "ok",
        value: version,
      };
    } else {
      return {
        id: "node",
        category: "node",
        name: "Node.js",
        status: "fail",
        value: version,
        message: "Node.js 18 or higher is required.",
        fixTip: "Upgrade Node.js via https://nodejs.org or nvm/fnm.",
      };
    }
  }

  /**
   * Find valid Java JDK 17 or 21 installation
   */
  static async findJdkPath(): Promise<{ path: string; version: string } | null> {
    // 1. Check candidate directories first for optimal AGP compatibility (JDK 17/21)
    const candidates: string[] = [];
    if (process.platform === "linux") {
      candidates.push(
        "/usr/lib/jvm/java-21-temurin-jdk",
        "/usr/lib/jvm/temurin-21-jdk",
        "/usr/lib/jvm/java-21-openjdk",
        "/usr/lib/jvm/java-17-openjdk",
        "/usr/lib/jvm/java-17-temurin-jdk",
        "/usr/lib/jvm/default-java"
      );
    } else if (process.platform === "darwin") {
      candidates.push(
        "/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home",
        "/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home",
        "/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home",
        "/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home"
      );
    } else if (process.platform === "win32") {
      candidates.push(
        "C:\\Program Files\\Eclipse Adoptium\\jdk-21",
        "C:\\Program Files\\Eclipse Adoptium\\jdk-17",
        "C:\\Program Files\\Java\\jdk-21",
        "C:\\Program Files\\Java\\jdk-17"
      );
    }

    for (const cand of candidates) {
      if (await FileSystem.exists(cand)) {
        const ver = await this.getJavaVersionFromHome(cand);
        if (ver) {
          const major = parseInt(ver.split(".")[0], 10);
          if (major === 17 || major === 21) {
            return { path: cand, version: ver };
          }
        }
      }
    }

    // 2. Check JAVA_HOME
    if (process.env.JAVA_HOME && (await FileSystem.exists(process.env.JAVA_HOME))) {
      const ver = await this.getJavaVersionFromHome(process.env.JAVA_HOME);
      if (ver) return { path: process.env.JAVA_HOME, version: ver };
    }

    // 3. Check system java binary
    const javaBin = await CommandRunner.which("java");
    if (javaBin) {
      const res = await CommandRunner.run(javaBin, ["-version"]);
      const out = res.stderr || res.stdout;
      const verMatch = out.match(/version\s+"([^"]+)"/);
      if (verMatch) {
        return { path: path.dirname(path.dirname(javaBin)), version: verMatch[1] };
      }
    }

    // 4. Any candidate directory match fallback
    for (const cand of candidates) {
      if (await FileSystem.exists(cand)) {
        const ver = await this.getJavaVersionFromHome(cand);
        if (ver) return { path: cand, version: ver };
      }
    }

    return null;
  }

  private static async getJavaVersionFromHome(javaHome: string): Promise<string | null> {
    const javaBin = path.join(javaHome, "bin", process.platform === "win32" ? "java.exe" : "java");
    if (!(await FileSystem.exists(javaBin))) return null;
    try {
      const res = await CommandRunner.run(javaBin, ["-version"]);
      const out = res.stderr || res.stdout;
      const verMatch = out.match(/version\s+"([^"]+)"/);
      return verMatch ? verMatch[1] : "unknown";
    } catch {
      return null;
    }
  }

  /**
   * Check Java environment
   */
  static async checkJava(): Promise<DiagnosticItem> {
    const jdk = await this.findJdkPath();
    if (!jdk) {
      return {
        id: "java",
        category: "java",
        name: "Java JDK (17 or 21)",
        status: "fail",
        message: "No compatible Java Development Kit (JDK 17 or 21) was detected.",
        fixTip:
          "Install OpenJDK 17/21 (e.g. Eclipse Temurin from https://adoptium.net) and set JAVA_HOME.",
      };
    }

    const major = parseInt(jdk.version.split(".")[0], 10);
    if (major < 17) {
      return {
        id: "java",
        category: "java",
        name: "Java JDK",
        status: "fail",
        value: `Version ${jdk.version} at ${jdk.path}`,
        message: "Android builds require JDK 17 or 21 (detected older version).",
        fixTip: "Install JDK 17 or 21 and point JAVA_HOME to it.",
      };
    }

    return {
      id: "java",
      category: "java",
      name: "Java JDK",
      status: "ok",
      value: `JDK ${jdk.version} (${jdk.path})`,
    };
  }

  /**
   * Find Android SDK location
   */
  static async findAndroidSdkPath(): Promise<string | null> {
    const envSdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
    if (envSdk && (await FileSystem.exists(envSdk))) {
      return envSdk;
    }

    const home = os.homedir();
    const standardPaths = [
      path.join(home, "Android", "Sdk"),
      path.join(home, "Library", "Android", "sdk"),
      path.join(home, "AppData", "Local", "Android", "Sdk"),
      "/opt/android-sdk",
    ];

    for (const candidate of standardPaths) {
      if (await FileSystem.exists(candidate)) {
        return candidate;
      }
    }

    return null;
  }

  /**
   * Check Android SDK, platforms and build tools
   */
  static async checkAndroidSdk(): Promise<DiagnosticItem[]> {
    const results: DiagnosticItem[] = [];
    const sdkPath = await this.findAndroidSdkPath();

    if (!sdkPath) {
      results.push({
        id: "android-sdk",
        category: "android",
        name: "Android SDK",
        status: "fail",
        message: "Android SDK not found. ANDROID_HOME is not set.",
        fixTip:
          "Install Android Studio / Command-line Tools and export ANDROID_HOME=path/to/sdk",
      });
      return results;
    }

    results.push({
      id: "android-sdk",
      category: "android",
      name: "Android SDK",
      status: "ok",
      value: sdkPath,
    });

    // Check platforms
    const platformsDir = path.join(sdkPath, "platforms");
    let platforms: string[] = [];
    if (await FileSystem.exists(platformsDir)) {
      try {
        platforms = await fs.readdir(platformsDir);
      } catch {}
    }

    if (platforms.length > 0) {
      results.push({
        id: "android-platforms",
        category: "android",
        name: "Android Platforms",
        status: "ok",
        value: platforms.join(", "),
      });
    } else {
      results.push({
        id: "android-platforms",
        category: "android",
        name: "Android Platforms",
        status: "warn",
        message: "No installed Android SDK platform (e.g. android-34 or android-35) found.",
        fixTip: "Install platform via Android Studio SDK Manager or sdkmanager 'platforms;android-35'.",
      });
    }

    // Check build-tools
    const buildToolsDir = path.join(sdkPath, "build-tools");
    let buildTools: string[] = [];
    if (await FileSystem.exists(buildToolsDir)) {
      try {
        buildTools = await fs.readdir(buildToolsDir);
      } catch {}
    }

    if (buildTools.length > 0) {
      results.push({
        id: "android-build-tools",
        category: "android",
        name: "Android Build-Tools",
        status: "ok",
        value: buildTools.sort().reverse()[0],
      });
    } else {
      results.push({
        id: "android-build-tools",
        category: "android",
        name: "Android Build-Tools",
        status: "warn",
        message: "No build-tools found in Android SDK.",
        fixTip: "Install build-tools via SDK Manager or sdkmanager 'build-tools;35.0.0'.",
      });
    }

    return results;
  }

  /**
   * Check ADB command and connected devices
   */
  static async checkAdb(): Promise<DiagnosticItem> {
    const sdkPath = await this.findAndroidSdkPath();
    let adbBin = await CommandRunner.which("adb");

    if (!adbBin && sdkPath) {
      const sdkAdb = path.join(
        sdkPath,
        "platform-tools",
        process.platform === "win32" ? "adb.exe" : "adb"
      );
      if (await FileSystem.exists(sdkAdb)) {
        adbBin = sdkAdb;
      }
    }

    if (!adbBin) {
      return {
        id: "adb",
        category: "device",
        name: "Android Debug Bridge (adb)",
        status: "warn",
        message: "adb binary not found on PATH.",
        fixTip: "Add $ANDROID_HOME/platform-tools to your system PATH.",
      };
    }

    try {
      const res = await CommandRunner.run(adbBin, ["devices"]);
      const lines = res.stdout.split("\n").slice(1).map((l) => l.trim()).filter(Boolean);
      const devices = lines.filter((l) => l.includes("\tdevice")).map((l) => l.split("\t")[0]);

      if (devices.length > 0) {
        return {
          id: "adb",
          category: "device",
          name: "ADB Devices",
          status: "ok",
          value: `${devices.length} connected (${devices.join(", ")})`,
        };
      } else {
        return {
          id: "adb",
          category: "device",
          name: "ADB Devices",
          status: "ok",
          value: "Ready (no connected device or running emulator)",
        };
      }
    } catch {
      return {
        id: "adb",
        category: "device",
        name: "ADB",
        status: "ok",
        value: adbBin,
      };
    }
  }
}
