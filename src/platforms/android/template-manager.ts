import fs from "node:fs/promises";
import path from "node:path";
import { FileSystem } from "../../utils/filesystem.js";
import { Logger } from "../../utils/logger.js";
import { Paths } from "../../utils/paths.js";

export class TemplateManager {
  /**
   * Prepare the .web2app/android directory from the packaged template
   */
  static async prepareAndroidProject(
    userProjectRoot: string,
    options: { forceClean?: boolean } = {}
  ): Promise<string> {
    const templateDir = Paths.getTemplateDir("android");
    const targetAndroidDir = Paths.getAndroidProjectDir(userProjectRoot);

    if (!(await FileSystem.exists(templateDir))) {
      throw new Error(`Android template directory not found at: ${templateDir}`);
    }

    if (options.forceClean && (await FileSystem.exists(targetAndroidDir))) {
      Logger.debug(`Cleaning existing Android wrapper directory: ${targetAndroidDir}`);
      await FileSystem.remove(targetAndroidDir);
    }

    if (!(await FileSystem.exists(targetAndroidDir))) {
      Logger.debug(`Copying Android template from ${templateDir} to ${targetAndroidDir}`);
      await FileSystem.copyDir(templateDir, targetAndroidDir);
    }

    // Ensure gradlew has executable permissions on unix/macos
    if (process.platform !== "win32") {
      const gradlewPath = path.join(targetAndroidDir, "gradlew");
      if (await FileSystem.exists(gradlewPath)) {
        try {
          await fs.chmod(gradlewPath, 0o755);
        } catch (err: any) {
          Logger.debug(`chmod gradlew failed: ${err?.message}`);
        }
      }
    }

    return targetAndroidDir;
  }
}
