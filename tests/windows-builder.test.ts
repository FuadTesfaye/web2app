import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import { WindowsBuilder } from "../src/platforms/windows/windows-builder.js";
import { Web2AppConfig } from "../src/types.js";
import { FileSystem } from "../src/utils/filesystem.js";

describe("WindowsBuilder", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-win-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should generate complete Windows application files in app/windows for local web app", async () => {
    // Mock web output
    const mockWebOut = path.join(tempDir, "out");
    await FileSystem.ensureDir(mockWebOut);
    await FileSystem.writeFile(path.join(mockWebOut, "index.html"), "<h1>Windows App</h1>");

    const config: Web2AppConfig = {
      appName: "My Cool App",
      packageName: "com.example.coolapp",
      version: "1.2.0",
      versionCode: 2,
      platforms: ["android", "windows", "debian", "arch"],
      android: {
        minSdk: 24,
        targetSdk: 35,
        compileSdk: 35,
        orientation: "unspecified",
        permissions: [],
        splashColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
      },
      windows: {
        windowWidth: 1400,
        windowHeight: 900,
        fullscreen: false,
        resizable: true,
      },
      debian: {
        section: "web",
        priority: "optional",
        architecture: "all",
        maintainer: "test <test@example.com>",
        description: "Test Debian",
        depends: ["bash", "xdg-utils"],
        categories: ["Network"],
      },
      arch: {
        pkgdesc: "Test Arch",
        arch: ["any"],
        license: ["MIT"],
        depends: ["bash", "xdg-utils"],
        categories: ["Network"],
      },
    };

    const result = await WindowsBuilder.build(tempDir, mockWebOut, config);

    expect(result.success).toBe(true);
    expect(result.platform).toBe("windows");
    expect(result.outputDir).toBe(path.join(tempDir, "app", "windows"));

    // Check generated files
    const launchBat = path.join(result.outputDir, "launch.bat");
    const launchPs1 = path.join(result.outputDir, "launch.ps1");
    const startVbs = path.join(result.outputDir, "start.vbs");
    const installPs1 = path.join(result.outputDir, "install.ps1");
    const appManifest = path.join(result.outputDir, "app.manifest");
    const appConfig = path.join(result.outputDir, "app.config.json");
    const assetIndex = path.join(result.outputDir, "assets", "index.html");

    expect(await FileSystem.exists(launchBat)).toBe(true);
    expect(await FileSystem.exists(launchPs1)).toBe(true);
    expect(await FileSystem.exists(startVbs)).toBe(true);
    expect(await FileSystem.exists(installPs1)).toBe(true);
    expect(await FileSystem.exists(appManifest)).toBe(true);
    expect(await FileSystem.exists(appConfig)).toBe(true);
    expect(await FileSystem.exists(assetIndex)).toBe(true);

    const batContent = await FileSystem.readFile(launchBat);
    expect(batContent).toContain("title My Cool App");
    expect(batContent).toContain("msedge.exe");
    expect(batContent).toContain("--window-size=1400,900");

    const assetContent = await FileSystem.readFile(assetIndex);
    expect(assetContent).toBe("<h1>Windows App</h1>");
  });

  it("should configure remote URL in Windows launch scripts", async () => {
    const config: Web2AppConfig = {
      appName: "Hacker News",
      packageName: "com.ycombinator.news",
      version: "1.0.0",
      versionCode: 1,
      url: "https://news.ycombinator.com",
      platforms: ["android", "windows", "debian", "arch"],
      android: {
        minSdk: 24,
        targetSdk: 35,
        compileSdk: 35,
        orientation: "unspecified",
        permissions: [],
        splashColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
      },
      windows: {
        windowWidth: 1200,
        windowHeight: 800,
        fullscreen: false,
        resizable: true,
      },
      debian: {
        section: "web",
        priority: "optional",
        architecture: "all",
        maintainer: "test <test@example.com>",
        description: "Test",
        depends: ["bash"],
        categories: ["Network"],
      },
      arch: {
        pkgdesc: "Test",
        arch: ["any"],
        license: ["MIT"],
        depends: ["bash"],
        categories: ["Network"],
      },
    };

    const result = await WindowsBuilder.build(tempDir, null, config);
    expect(result.success).toBe(true);

    const launchBat = path.join(result.outputDir, "launch.bat");
    const content = await FileSystem.readFile(launchBat);
    expect(content).toContain('set "TARGET_URL=https://news.ycombinator.com"');
  });
});
