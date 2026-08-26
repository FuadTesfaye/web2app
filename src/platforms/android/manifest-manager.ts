import path from "node:path";
import { Web2AppConfig } from "../../types.js";
import { FileSystem } from "../../utils/filesystem.js";
import { Logger } from "../../utils/logger.js";
import { Paths } from "../../utils/paths.js";

export class ManifestManager {
  /**
   * Configure Android Manifest and string resources with user config
   */
  static async configure(
    userProjectRoot: string,
    config: Web2AppConfig
  ): Promise<void> {
    const androidDir = Paths.getAndroidProjectDir(userProjectRoot);

    // 1. Update strings.xml (app_name)
    await this.updateStringsXml(androidDir, config.appName);

    // 2. Update AndroidManifest.xml (orientation, permissions)
    await this.updateManifestXml(androidDir, config);

    // 3. Update MainActivity.kt (start URL & domain)
    await this.updateMainActivity(androidDir, config);
  }

  private static async updateMainActivity(
    androidDir: string,
    config: Web2AppConfig
  ): Promise<void> {
    const activityPath = path.join(
      androidDir,
      "app",
      "src",
      "main",
      "java",
      "com",
      "web2app",
      "template",
      "MainActivity.kt"
    );

    if (!(await FileSystem.exists(activityPath))) {
      return;
    }

    let content = (await FileSystem.readFile(activityPath)) || "";
    if (config.url) {
      let host = "appassets.androidplatform.net";
      try {
        host = new URL(config.url).hostname;
      } catch {}

      content = content.replace(
        /private const val START_URL = "[^"]*"/,
        `private const val START_URL = "${config.url}"`
      );
      content = content.replace(
        /private const val ASSET_DOMAIN = "[^"]*"/,
        `private const val ASSET_DOMAIN = "${host}"`
      );
    }
    await FileSystem.writeFile(activityPath, content);
  }


  /**
   * Escape XML string contents
   */
  private static escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "\\'");
  }

  private static async updateStringsXml(
    androidDir: string,
    appName: string
  ): Promise<void> {
    const stringsPath = path.join(
      androidDir,
      "app",
      "src",
      "main",
      "res",
      "values",
      "strings.xml"
    );

    if (!(await FileSystem.exists(stringsPath))) {
      Logger.debug(`strings.xml not found at ${stringsPath}`);
      return;
    }

    const escapedName = this.escapeXml(appName);
    const content = await FileSystem.readFile(stringsPath);
    if (!content) return;

    const updated = content.replace(
      /<string name="app_name">.*?<\/string>/,
      `<string name="app_name">${escapedName}</string>`
    );

    await FileSystem.writeFile(stringsPath, updated);
  }

  private static async updateManifestXml(
    androidDir: string,
    config: Web2AppConfig
  ): Promise<void> {
    const manifestPath = path.join(
      androidDir,
      "app",
      "src",
      "main",
      "AndroidManifest.xml"
    );

    if (!(await FileSystem.exists(manifestPath))) {
      Logger.debug(`AndroidManifest.xml not found at ${manifestPath}`);
      return;
    }

    let content = (await FileSystem.readFile(manifestPath)) || "";

    // 1. Update orientation
    const orientation = config.android?.orientation || "unspecified";
    content = content.replace(
      /android:screenOrientation="[^"]*"/,
      `android:screenOrientation="${orientation}"`
    );

    // 2. Update permissions
    const permissions = new Set<string>([
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
      ...(config.android?.permissions || []).map((p) =>
        p.startsWith("android.permission.") ? p : `android.permission.${p.toUpperCase()}`
      ),
    ]);

    const permTags = Array.from(permissions)
      .map((p) => `    <uses-permission android:name="${p}" />`)
      .join("\n");

    // Replace or insert permissions before <application>
    if (content.includes("<!-- WEB2APP_PERMISSIONS -->")) {
      content = content.replace("<!-- WEB2APP_PERMISSIONS -->", permTags);
    }

    await FileSystem.writeFile(manifestPath, content);
  }
}
