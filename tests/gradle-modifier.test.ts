import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import { GradleModifier } from "../src/platforms/android/gradle-modifier.js";
import { TemplateManager } from "../src/platforms/android/template-manager.js";
import { FileSystem } from "../src/utils/filesystem.js";
import { Web2AppConfig } from "../src/types.js";

describe("GradleModifier", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-gradle-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
    await TemplateManager.prepareAndroidProject(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should modify build.gradle.kts with custom configuration values", async () => {
    const config: Web2AppConfig = {
      appName: "Test Notes",
      packageName: "com.test.notes",
      version: "3.2.1",
      versionCode: 15,
      android: {
        minSdk: 28,
        targetSdk: 35,
        compileSdk: 35,
        orientation: "portrait",
        permissions: [],
        splashColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
      },
    };

    await GradleModifier.configureAppGradle(tempDir, config);

    const appGradlePath = path.join(
      tempDir,
      ".web2app",
      "android",
      "app",
      "build.gradle.kts"
    );
    const content = await FileSystem.readFile(appGradlePath);

    expect(content).toContain('namespace = "com.test.notes"');
    expect(content).toContain('applicationId = "com.test.notes"');
    expect(content).toContain("minSdk = 28");
    expect(content).toContain("versionCode = 15");
    expect(content).toContain('versionName = "3.2.1"');
  });
});
