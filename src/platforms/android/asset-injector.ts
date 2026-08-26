import path from "node:path";
import { FileSystem } from "../../utils/filesystem.js";
import { Logger } from "../../utils/logger.js";
import { Paths } from "../../utils/paths.js";

export class AssetInjector {
  /**
   * Copy web build artifacts into the Android app's assets/web directory
   */
  static async injectAssets(
    userProjectRoot: string,
    webOutputDir: string
  ): Promise<{ fileCount: number; targetDir: string }> {
    const androidAssetsDir = Paths.getAndroidAssetsWebDir(userProjectRoot);

    Logger.debug(`Injecting web assets from ${webOutputDir} into ${androidAssetsDir}`);

    // Ensure clean target directory
    await FileSystem.remove(androidAssetsDir);
    await FileSystem.ensureDir(androidAssetsDir);

    // Copy web build files
    let fileCount = 0;
    const ignored = new Set([
      ".git",
      ".github",
      ".DS_Store",
      ".web2app",
      "app",
      "dist",
      "node_modules",
      "templates",
      "tests",
      "coverage",
    ]);

    await FileSystem.copyDir(webOutputDir, androidAssetsDir, (filename) => {
      if (ignored.has(filename) || filename.startsWith(".DS_Store")) {
        return false;
      }
      fileCount++;
      return true;
    });

    Logger.debug(`Injected ${fileCount} assets into Android project`);
    return { fileCount, targetDir: androidAssetsDir };

  }
}
