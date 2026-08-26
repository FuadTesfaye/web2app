import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ANDROID_ASSETS_WEB_DIR,
  ANDROID_DIR_NAME,
  ARCH_DIR_NAME,
  DEBIAN_DIR_NAME,
  DEFAULT_APP_DIR,
  WEB2APP_DIR,
  WINDOWS_DIR_NAME,
} from "../constants.js";

/**
 * Resolves paths relative to the current execution directory or installed package
 */
export class Paths {
  /**
   * Root of the web2app package installation
   */
  static getPackageRoot(): string {
    let currentDir = path.dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 5; i++) {
      if (
        fs.existsSync(path.join(currentDir, "templates", "android")) ||
        fs.existsSync(path.join(currentDir, "package.json"))
      ) {
        return currentDir;
      }
      const parent = path.dirname(currentDir);
      if (parent === currentDir) break;
      currentDir = parent;
    }
    return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  }

  /**
   * Location of packaged templates
   */
  static getTemplateDir(platform: string = "android"): string {
    return path.join(this.getPackageRoot(), "templates", platform);
  }

  /**
   * User project root directory
   */
  static getUserProjectRoot(cwd: string = process.cwd()): string {
    return path.resolve(cwd);
  }

  /**
   * The .web2app work directory in user's project
   */
  static getWeb2AppDir(cwd: string = process.cwd()): string {
    return path.join(this.getUserProjectRoot(cwd), WEB2APP_DIR);
  }

  /**
   * The root output directory named "app" in user's project
   */
  static getAppDir(cwd: string = process.cwd(), customOut?: string): string {
    if (customOut) {
      return path.isAbsolute(customOut)
        ? customOut
        : path.join(this.getUserProjectRoot(cwd), customOut);
    }
    return path.join(this.getUserProjectRoot(cwd), DEFAULT_APP_DIR);
  }

  /**
   * Platform-specific output directory under app/ (e.g. app/android, app/windows, app/debian, app/arch)
   */
  static getPlatformOutputDir(
    platform: string,
    cwd: string = process.cwd(),
    customOut?: string
  ): string {
    return path.join(this.getAppDir(cwd, customOut), platform.toLowerCase());
  }

  /**
   * Output directory for Android: app/android
   */
  static getAndroidOutputDir(cwd: string = process.cwd(), customOut?: string): string {
    return this.getPlatformOutputDir(ANDROID_DIR_NAME, cwd, customOut);
  }

  /**
   * Output directory for Windows: app/windows
   */
  static getWindowsOutputDir(cwd: string = process.cwd(), customOut?: string): string {
    return this.getPlatformOutputDir(WINDOWS_DIR_NAME, cwd, customOut);
  }

  /**
   * Output directory for Debian: app/debian
   */
  static getDebianOutputDir(cwd: string = process.cwd(), customOut?: string): string {
    return this.getPlatformOutputDir(DEBIAN_DIR_NAME, cwd, customOut);
  }

  /**
   * Output directory for Arch: app/arch
   */
  static getArchOutputDir(cwd: string = process.cwd(), customOut?: string): string {
    return this.getPlatformOutputDir(ARCH_DIR_NAME, cwd, customOut);
  }

  /**
   * The .web2app/android directory in user's project
   */
  static getAndroidProjectDir(cwd: string = process.cwd()): string {
    return path.join(this.getWeb2AppDir(cwd), ANDROID_DIR_NAME);
  }

  /**
   * The assets/web folder inside Android project
   */
  static getAndroidAssetsWebDir(cwd: string = process.cwd()): string {
    return path.join(this.getAndroidProjectDir(cwd), ANDROID_ASSETS_WEB_DIR);
  }

  /**
   * Legacy alias for getAndroidOutputDir
   */
  static getAndroidDistDir(cwd: string = process.cwd(), customOut?: string): string {
    return this.getAndroidOutputDir(cwd, customOut);
  }

  /**
   * Android Gradle build output APK path
   */
  static getGradleApkOutputPath(
    cwd: string = process.cwd(),
    mode: "debug" | "release" = "debug"
  ): string {
    return path.join(
      this.getAndroidProjectDir(cwd),
      "app",
      "build",
      "outputs",
      "apk",
      mode,
      `app-${mode}.apk`
    );
  }
}

