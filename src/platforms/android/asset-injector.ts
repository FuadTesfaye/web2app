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
    await FileSystem.copyDir(webOutputDir, androidAssetsDir, (filename) => {
      // Ignore hidden files and system temp files
      if (filename.startsWith(".DS_Store") || filename.startsWith(".git")) {
        return false;
      }
      fileCount++;
      return true;
    });

    Logger.debug(`Injected ${fileCount} assets into Android project`);
    return { fileCount, targetDir: androidAssetsDir };
  }
}
