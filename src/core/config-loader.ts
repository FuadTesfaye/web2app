import path from "node:path";
import { pathToFileURL } from "node:url";
import { CONFIG_FILE_NAMES, DEFAULT_APP_NAME, DEFAULT_PACKAGE_NAME, DEFAULT_VERSION } from "../constants.js";
import { Web2AppConfig, Web2AppConfigSchema, Web2AppUserConfig } from "../types.js";
import { FileSystem } from "../utils/filesystem.js";
import { Logger } from "../utils/logger.js";

export class ConfigLoader {
  /**
   * Look for existing config file in target directory
   */
  static async findConfigFile(projectRoot: string): Promise<string | null> {
    for (const configName of CONFIG_FILE_NAMES) {
      const fullPath = path.join(projectRoot, configName);
      if (await FileSystem.exists(fullPath)) {
        return fullPath;
      }
    }
    return null;
  }

  /**
   * Load and validate configuration
   */
  static async load(projectRoot: string = process.cwd()): Promise<Web2AppConfig> {
    const configPath = await this.findConfigFile(projectRoot);
    let rawConfig: Partial<Web2AppUserConfig> = {};

    if (configPath) {
      Logger.debug(`Loading config from ${configPath}`);
      if (configPath.endsWith(".json")) {
        const jsonContent = await FileSystem.readJson<Partial<Web2AppUserConfig>>(configPath);
        if (jsonContent) rawConfig = jsonContent;
      } else {
        try {
          // Dynamic import for JS/TS/MJS
          const fileUrl = pathToFileURL(configPath).href;
          const imported = await import(fileUrl);
          rawConfig = imported.default || imported;
        } catch (err: any) {
          Logger.warn(`Could not load ${path.basename(configPath)} dynamically: ${err?.message || err}. Reading as static object...`);
        }
      }
    } else {
      Logger.debug("No web2app.config.* found, deriving config from project metadata");
    }

    // Read package.json for fallbacks if fields are missing
    const pkgPath = path.join(projectRoot, "package.json");
    const pkg = await FileSystem.readJson<{ name?: string; version?: string; displayName?: string }>(pkgPath);

    const derivedAppName =
      rawConfig.appName ||
      pkg?.displayName ||
      (pkg?.name ? this.sanitizeAppName(pkg.name) : DEFAULT_APP_NAME);

    const derivedPackageName =
      rawConfig.packageName ||
      (pkg?.name ? this.derivePackageName(pkg.name) : DEFAULT_PACKAGE_NAME);

    const derivedVersion = rawConfig.version || pkg?.version || DEFAULT_VERSION;

    const merged = {
      ...rawConfig,
      appName: derivedAppName,
      packageName: derivedPackageName,
      version: derivedVersion,
    };

    const parsed = Web2AppConfigSchema.safeParse(merged);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
      throw new Error(`Invalid web2app configuration:\n${errors}`);
    }

    return parsed.data;
  }

  /**
   * Sanitize npm package name into friendly App Name (e.g. "my-awesome-app" -> "My Awesome App")
   */
  static sanitizeAppName(rawName: string): string {
    const clean = rawName.replace(/^@[^/]+\//, ""); // remove scope
    return clean
      .split(/[-_]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  /**
   * Derive a valid Android package name from npm package name
   */
  static derivePackageName(rawName: string): string {
    const clean = rawName.replace(/^@/, "").replace(/[/\\-]/g, ".");
    const parts = clean
      .split(".")
      .filter(Boolean)
      .map((p) => p.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())
      .filter((p) => /^[a-zA-Z]/.test(p));

    if (parts.length >= 2) {
      return `com.${parts.join(".")}`;
    }
    return `com.web2app.${parts[0] || "app"}`;
  }
}
