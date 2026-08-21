import { FileSystem } from "../utils/filesystem.js";
import { Logger } from "../utils/logger.js";
import { Paths } from "../utils/paths.js";

export async function cleanCommand() {
  Logger.banner();
  const rootDir = process.cwd();
  const web2AppDir = Paths.getWeb2AppDir(rootDir);
  const distDir = Paths.getAndroidDistDir(rootDir);

  Logger.info("Cleaning web2app build artifacts and cache...");

  let cleaned = false;
  if (await FileSystem.exists(web2AppDir)) {
    await FileSystem.remove(web2AppDir);
    Logger.debug(`Removed: ${web2AppDir}`);
    cleaned = true;
  }

  if (await FileSystem.exists(distDir)) {
    await FileSystem.remove(distDir);
    Logger.debug(`Removed: ${distDir}`);
    cleaned = true;
  }

  if (cleaned) {
    Logger.success("Successfully cleaned .web2app/ and dist/android/ directories.");
  } else {
    Logger.info("Nothing to clean. Workspace is already clean.");
  }
}
