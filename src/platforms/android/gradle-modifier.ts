import path from "node:path";
import { Web2AppConfig } from "../../types.js";
import { FileSystem } from "../../utils/filesystem.js";
import { Logger } from "../../utils/logger.js";
import { Paths } from "../../utils/paths.js";

export class GradleModifier {
  /**
   * Modify app/build.gradle.kts to inject user configuration
   */
  static async configureAppGradle(
    userProjectRoot: string,
    config: Web2AppConfig
  ): Promise<void> {
    const androidDir = Paths.getAndroidProjectDir(userProjectRoot);
    const appGradlePath = path.join(androidDir, "app", "build.gradle.kts");

    if (!(await FileSystem.exists(appGradlePath))) {
      throw new Error(`app/build.gradle.kts not found at: ${appGradlePath}`);
    }

    let content = (await FileSystem.readFile(appGradlePath)) || "";

    const minSdk = config.android?.minSdk || 24;
    const targetSdk = config.android?.targetSdk || 35;
    const compileSdk = config.android?.compileSdk || 35;
    const packageName = config.packageName;
    const versionCode = config.versionCode || 1;
    const versionName = config.version || "1.0.0";

    Logger.debug(
      `Injecting Gradle config: pkg=${packageName}, vCode=${versionCode}, vName=${versionName}, minSdk=${minSdk}, targetSdk=${targetSdk}`
    );

    // Replace namespace
    content = content.replace(/namespace\s*=\s*"[^"]*"/, `namespace = "${packageName}"`);

    // Replace applicationId
    content = content.replace(/applicationId\s*=\s*"[^"]*"/, `applicationId = "${packageName}"`);

    // Replace compileSdk
    content = content.replace(/compileSdk\s*=\s*\d+/, `compileSdk = ${compileSdk}`);

    // Replace minSdk
    content = content.replace(/minSdk\s*=\s*\d+/, `minSdk = ${minSdk}`);

    // Replace targetSdk
    content = content.replace(/targetSdk\s*=\s*\d+/, `targetSdk = ${targetSdk}`);

    // Replace versionCode
    content = content.replace(/versionCode\s*=\s*\d+/, `versionCode = ${versionCode}`);

    // Replace versionName
    content = content.replace(/versionName\s*=\s*"[^"]*"/, `versionName = "${versionName}"`);

    await FileSystem.writeFile(appGradlePath, content);
  }
}
