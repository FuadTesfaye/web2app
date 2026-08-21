import path from "node:path";
import prompts from "prompts";
import { ConfigLoader } from "../core/config-loader.js";
import { ProjectDetector } from "../core/project-detector.js";
import { InitOptions } from "../types.js";
import { FileSystem } from "../utils/filesystem.js";
import { Logger } from "../utils/logger.js";

export async function initCommand(options: InitOptions = {}) {
  Logger.banner();
  const rootDir = process.cwd();

  const existingConfig = await ConfigLoader.findConfigFile(rootDir);
  if (existingConfig && !options.force) {
    Logger.warn(`Configuration file already exists at: ${existingConfig}`);
    Logger.tip("Use --force to overwrite the existing configuration.");
    return;
  }

  const projectInfo = await ProjectDetector.detect(rootDir);
  const defaultAppName =
    options.appName ||
    (projectInfo.appName ? ConfigLoader.sanitizeAppName(projectInfo.appName) : "My Web App");
  const defaultPackageName =
    options.packageName ||
    (projectInfo.packageName
      ? ConfigLoader.derivePackageName(projectInfo.packageName)
      : "com.example.myapp");
  const defaultVersion = options.version || projectInfo.version || "1.0.0";

  let appName = defaultAppName;
  let packageName = defaultPackageName;
  let version = defaultVersion;

  if (!options.yes) {
    const responses = await prompts([
      {
        type: "text",
        name: "appName",
        message: "What is your application name?",
        initial: defaultAppName,
      },
      {
        type: "text",
        name: "packageName",
        message: "What is your Android package ID (e.g. com.company.app)?",
        initial: defaultPackageName,
        validate: (val) =>
          /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(val)
            ? true
            : "Must be a valid Java package ID (e.g. com.company.app)",
      },
      {
        type: "text",
        name: "version",
        message: "What is the initial version?",
        initial: defaultVersion,
      },
    ]);

    if (!responses.appName || !responses.packageName) {
      Logger.warn("Initialization cancelled.");
      return;
    }

    appName = responses.appName;
    packageName = responses.packageName;
    version = responses.version;
  }

  const targetConfigPath = path.join(rootDir, "web2app.config.ts");
  const configContent = `import type { Web2AppUserConfig } from "web2app";

const config: Web2AppUserConfig = {
  appName: ${JSON.stringify(appName)},
  packageName: ${JSON.stringify(packageName)},
  version: ${JSON.stringify(version)},
  versionCode: 1,

  // Android specific options
  android: {
    minSdk: 24,
    targetSdk: 35,
    orientation: "unspecified",
  },
};

export default config;
`;

  await FileSystem.writeFile(targetConfigPath, configContent);

  Logger.success(`Created configuration file: ${path.basename(targetConfigPath)}`);
  console.log();
  Logger.tip("To build your Android app, run: npx web2app build android");
}
