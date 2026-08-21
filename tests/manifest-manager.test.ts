import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import { ManifestManager } from "../src/platforms/android/manifest-manager.js";
import { TemplateManager } from "../src/platforms/android/template-manager.js";
import { FileSystem } from "../src/utils/filesystem.js";
import { Web2AppConfig } from "../src/types.js";

describe("ManifestManager", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-manifest-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
    await TemplateManager.prepareAndroidProject(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should update strings.xml app_name and manifest orientation", async () => {
    const config: Web2AppConfig = {
      appName: "Cool Super App & Co",
      packageName: "com.cool.superapp",
      version: "1.0.0",
      versionCode: 1,
      android: {
        minSdk: 24,
        targetSdk: 35,
        compileSdk: 35,
        orientation: "landscape",
        permissions: ["camera", "android.permission.VIBRATE"],
        splashColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
      },
    };

    await ManifestManager.configure(tempDir, config);

    const stringsPath = path.join(
      tempDir,
      ".web2app",
      "android",
      "app",
      "src",
      "main",
      "res",
      "values",
      "strings.xml"
    );
    const stringsContent = await FileSystem.readFile(stringsPath);
    expect(stringsContent).toContain("<string name=\"app_name\">Cool Super App &amp; Co</string>");

    const manifestPath = path.join(
      tempDir,
      ".web2app",
      "android",
      "app",
      "src",
      "main",
      "AndroidManifest.xml"
    );
    const manifestContent = await FileSystem.readFile(manifestPath);
    expect(manifestContent).toContain('android:screenOrientation="landscape"');
    expect(manifestContent).toContain('android:name="android.permission.CAMERA"');
    expect(manifestContent).toContain('android:name="android.permission.VIBRATE"');
  });
});
