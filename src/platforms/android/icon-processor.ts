import path from "node:path";
import fs from "node:fs/promises";
import { Web2AppConfig } from "../../types.js";
import { FileSystem } from "../../utils/filesystem.js";
import { Logger } from "../../utils/logger.js";
import { Paths } from "../../utils/paths.js";

export class IconProcessor {
  /**
   * Process and inject user icon if configured
   */
  static async processIcon(
    userProjectRoot: string,
    config: Web2AppConfig
  ): Promise<void> {
    if (!config.icon) {
      Logger.debug("No custom icon configured, using template default launcher icon");
      return;
    }

    const iconPath = path.resolve(userProjectRoot, config.icon);
    if (!(await FileSystem.exists(iconPath))) {
      Logger.warn(`Specified icon file does not exist: ${iconPath}`);
      return;
    }

    const androidDir = Paths.getAndroidProjectDir(userProjectRoot);
    const resDir = path.join(androidDir, "app", "src", "main", "res");

    if (iconPath.endsWith(".png") || iconPath.endsWith(".webp") || iconPath.endsWith(".jpg")) {
      const ext = path.extname(iconPath);
      const mipmapFolders = [
        "mipmap-mdpi",
        "mipmap-hdpi",
        "mipmap-xhdpi",
        "mipmap-xxhdpi",
        "mipmap-xxxhdpi",
      ];

      for (const folder of mipmapFolders) {
        const destFolder = path.join(resDir, folder);
        await FileSystem.ensureDir(destFolder);
        const destFile = path.join(destFolder, `ic_launcher${ext}`);
        try {
          await fs.copyFile(iconPath, destFile);
        } catch (err: any) {
          Logger.debug(`Could not copy icon to ${destFolder}: ${err?.message}`);
        }
      }

      Logger.debug(`Injected custom icon from ${config.icon}`);
    } else if (iconPath.endsWith(".xml")) {
      // Vector drawable
      const drawableDir = path.join(resDir, "drawable");
      await FileSystem.ensureDir(drawableDir);
      const destFile = path.join(drawableDir, "ic_launcher_foreground.xml");
      try {
        await fs.copyFile(iconPath, destFile);
        Logger.debug(`Injected custom vector icon to ${destFile}`);
      } catch (err: any) {
        Logger.debug(`Could not copy vector icon: ${err?.message}`);
      }
    }
  }
}
