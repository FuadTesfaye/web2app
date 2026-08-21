import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import { AssetInjector } from "../src/platforms/android/asset-injector.js";
import { TemplateManager } from "../src/platforms/android/template-manager.js";
import { FileSystem } from "../src/utils/filesystem.js";
import { Paths } from "../src/utils/paths.js";

describe("AndroidBuilder Pipeline Components", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-pipeline-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should prepare Android wrapper and inject web assets correctly", async () => {
    // 1. Prepare Android wrapper
    const androidDir = await TemplateManager.prepareAndroidProject(tempDir);
    expect(await FileSystem.exists(androidDir)).toBe(true);
    expect(await FileSystem.exists(path.join(androidDir, "app", "build.gradle.kts"))).toBe(true);

    // 2. Create mock web build outputs
    const mockWebOut = path.join(tempDir, "out");
    await FileSystem.ensureDir(mockWebOut);
    await FileSystem.writeFile(path.join(mockWebOut, "index.html"), "<h1>App</h1>");
    await FileSystem.writeFile(path.join(mockWebOut, "bundle.js"), "console.log('web');");

    // 3. Inject assets
    const { fileCount, targetDir } = await AssetInjector.injectAssets(tempDir, mockWebOut);
    expect(fileCount).toBe(2);
    expect(await FileSystem.exists(path.join(targetDir, "index.html"))).toBe(true);
    expect(await FileSystem.exists(path.join(targetDir, "bundle.js"))).toBe(true);

    const content = await FileSystem.readFile(path.join(targetDir, "index.html"));
    expect(content).toBe("<h1>App</h1>");
  });

  it("should resolve correct output paths for dist apk", () => {
    const distDir = Paths.getAndroidDistDir(tempDir);
    expect(distDir).toBe(path.join(tempDir, "dist", "android"));

    const gradleApk = Paths.getGradleApkOutputPath(tempDir, "debug");
    expect(gradleApk).toContain("app/build/outputs/apk/debug/app-debug.apk");
  });
});
