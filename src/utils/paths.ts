import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ANDROID_ASSETS_WEB_DIR,
  ANDROID_DIR_NAME,
  ANDROID_DIST_DIR,
  WEB2APP_DIR,
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
  static getTemplateDir(platform: "android" = "android"): string {
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
   * Dist output directory for built APKs/AABs
   */
  static getAndroidDistDir(cwd: string = process.cwd()): string {
    return path.join(this.getUserProjectRoot(cwd), ANDROID_DIST_DIR);
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
