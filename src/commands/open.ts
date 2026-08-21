import { ConfigLoader } from "../core/config-loader.js";
import { TemplateManager } from "../platforms/android/template-manager.js";
import { CommandRunner } from "../utils/command-runner.js";
import { Logger } from "../utils/logger.js";
import { Paths } from "../utils/paths.js";

export async function openCommand(platform: string = "android") {
  const normalized = (platform || "android").toLowerCase();
  if (normalized !== "android") {
    Logger.error(`Platform "${platform}" not supported. Use "android".`);
    process.exit(1);
  }

  Logger.banner();
  const rootDir = process.cwd();
  const androidDir = Paths.getAndroidProjectDir(rootDir);

  // Ensure template is prepared
  await TemplateManager.prepareAndroidProject(rootDir);
  Logger.info(`Opening Android project at: ${androidDir}`);

  // Try Android Studio command line binary
  const studioBins = [
    "studio",
    "android-studio",
    "/Applications/Android Studio.app/Contents/MacOS/studio",
  ];

  let opened = false;
  for (const bin of studioBins) {
    const found = await CommandRunner.which(bin);
    if (found) {
      try {
        await CommandRunner.run(found, [androidDir]);
        opened = true;
        break;
      } catch {}
    }
  }

  if (!opened) {
    // Fallback to system open
    const openCmd =
      process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
        ? "explorer"
        : "xdg-open";

    try {
      await CommandRunner.run(openCmd, [androidDir]);
      opened = true;
    } catch {}
  }

  if (opened) {
    Logger.success("Android project opened in Android Studio / File Manager.");
  } else {
    Logger.info(`Project directory is ready at: ${androidDir}`);
    Logger.tip(`Open "${androidDir}" directly in Android Studio.`);
  }
}
