import path from "node:path";
import { FileSystem } from "../utils/filesystem.js";
import { Logger } from "../utils/logger.js";
import { Paths } from "../utils/paths.js";

export async function cleanCommand() {
  Logger.banner();
  const rootDir = process.cwd();
  const web2AppDir = Paths.getWeb2AppDir(rootDir);
  const appDir = Paths.getAppDir(rootDir);
  const legacyDistDir = path.join(rootDir, "dist", "android");

  Logger.info("Cleaning web2app build artifacts and cache...");

  let cleaned = false;
  if (await FileSystem.exists(web2AppDir)) {
    await FileSystem.remove(web2AppDir);
    Logger.debug(`Removed: ${web2AppDir}`);
    cleaned = true;
  }

  if (await FileSystem.exists(appDir)) {
    // Check if this is a Next.js App Router source directory
    const isNextAppDir =
      (await FileSystem.exists(path.join(appDir, "page.tsx"))) ||
      (await FileSystem.exists(path.join(appDir, "layout.tsx"))) ||
      (await FileSystem.exists(path.join(appDir, "page.js"))) ||
      (await FileSystem.exists(path.join(appDir, "layout.js")));

    if (isNextAppDir) {
      // Only clean the generated platform folders inside app/
      for (const platform of ["android", "windows", "debian", "arch"]) {
        const platDir = path.join(appDir, platform);
        if (await FileSystem.exists(platDir)) {
          await FileSystem.remove(platDir);
          Logger.debug(`Removed platform output: ${platDir}`);
          cleaned = true;
        }
      }
    } else {
      await FileSystem.remove(appDir);
      Logger.debug(`Removed: ${appDir}`);
      cleaned = true;
    }
  }


  if (await FileSystem.exists(legacyDistDir)) {
    await FileSystem.remove(legacyDistDir);
    Logger.debug(`Removed: ${legacyDistDir}`);
    cleaned = true;
  }

  if (cleaned) {
    Logger.success("Successfully cleaned .web2app/ and app/ directories.");
  } else {
    Logger.info("Nothing to clean. Workspace is already clean.");
  }
}
