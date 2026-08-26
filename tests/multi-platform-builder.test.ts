import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import { MultiPlatformBuilder } from "../src/platforms/multi-platform-builder.js";
import { FileSystem } from "../src/utils/filesystem.js";

describe("MultiPlatformBuilder", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-multi-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should convert a local web application and create app/ with android, windows, debian, and arch directories", async () => {
    // 1. Create a mock web project with index.html
    await FileSystem.writeFile(
      path.join(tempDir, "index.html"),
      "<!DOCTYPE html><html><head><title>My Local App</title></head><body><h1>Welcome</h1></body></html>"
    );

    // 2. Create web2app.config.json
    await FileSystem.writeJson(path.join(tempDir, "web2app.config.json"), {
      appName: "Dashboard App",
      packageName: "com.company.dashboard",
      version: "1.0.0",
      versionCode: 1,
    });

    // 3. Run multi-platform build for all platforms
    const result = await MultiPlatformBuilder.build(tempDir, {
      platform: "all",
      skipWebBuild: true,
    });

    expect(result.appDir).toBe(path.join(tempDir, "app"));
    expect(await FileSystem.exists(result.appDir)).toBe(true);

    // Check that app/android exists
    const androidDir = path.join(result.appDir, "android");
    expect(await FileSystem.exists(androidDir)).toBe(true);
    expect(result.results.android.success).toBe(true);

    // Check that app/windows exists
    const windowsDir = path.join(result.appDir, "windows");
    expect(await FileSystem.exists(windowsDir)).toBe(true);
    expect(await FileSystem.exists(path.join(windowsDir, "launch.bat"))).toBe(true);
    expect(result.results.windows.success).toBe(true);

    // Check that app/debian exists
    const debianDir = path.join(result.appDir, "debian");
    expect(await FileSystem.exists(debianDir)).toBe(true);
    expect(result.results.debian.success).toBe(true);

    // Check that app/arch exists
    const archDir = path.join(result.appDir, "arch");
    expect(await FileSystem.exists(archDir)).toBe(true);
    expect(await FileSystem.exists(path.join(archDir, "PKGBUILD"))).toBe(true);
    expect(result.results.arch.success).toBe(true);
  });

  it("should convert a live web page URL and create app/ with all platform directories", async () => {
    const targetUrl = "https://news.ycombinator.com";

    const result = await MultiPlatformBuilder.build(tempDir, {
      url: targetUrl,
      platform: "all",
    });

    expect(result.appDir).toBe(path.join(tempDir, "app"));

    // Verify all 4 platform folders exist
    expect(await FileSystem.exists(path.join(result.appDir, "android"))).toBe(true);
    expect(await FileSystem.exists(path.join(result.appDir, "windows"))).toBe(true);
    expect(await FileSystem.exists(path.join(result.appDir, "debian"))).toBe(true);
    expect(await FileSystem.exists(path.join(result.appDir, "arch"))).toBe(true);

    // Verify Windows launch script points to URL
    const winLaunch = await FileSystem.readFile(path.join(result.appDir, "windows", "launch.bat"));
    expect(winLaunch).toContain(`set "TARGET_URL=${targetUrl}"`);

    // Verify Debian control file exists
    const debControl = await FileSystem.readFile(
      path.join(result.appDir, "debian", "pkg-source", "DEBIAN", "control")
    );
    expect(debControl).toContain("Package:");

    // Verify Arch PKGBUILD exists
    const archPkg = await FileSystem.readFile(path.join(result.appDir, "arch", "PKGBUILD"));
    expect(archPkg).toContain("pkgname=");
  });

  it("should build only requested platforms when specified", async () => {
    await FileSystem.writeFile(
      path.join(tempDir, "index.html"),
      "<html><body>Simple</body></html>"
    );

    const result = await MultiPlatformBuilder.build(tempDir, {
      platform: "windows,debian",
      skipWebBuild: true,
    });

    expect(await FileSystem.exists(path.join(result.appDir, "windows"))).toBe(true);
    expect(await FileSystem.exists(path.join(result.appDir, "debian"))).toBe(true);
    expect(result.results.windows).toBeDefined();
    expect(result.results.debian).toBeDefined();
    expect(result.results.android).toBeUndefined();
    expect(result.results.arch).toBeUndefined();
  });
});
