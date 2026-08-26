import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import { ArchBuilder } from "../src/platforms/arch/arch-builder.js";
import { Web2AppConfig } from "../src/types.js";
import { FileSystem } from "../src/utils/filesystem.js";

describe("ArchBuilder", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-arch-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should generate Arch Linux PKGBUILD, .SRCINFO, launcher and desktop files in app/arch", async () => {
    const mockWebOut = path.join(tempDir, "out");
    await FileSystem.ensureDir(mockWebOut);
    await FileSystem.writeFile(path.join(mockWebOut, "index.html"), "<h1>Arch App</h1>");

    const config: Web2AppConfig = {
      appName: "Arch Web Viewer",
      packageName: "com.arch.viewer",
      version: "1.0.0",
      versionCode: 1,
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
        pkgdesc: "Arch Web Viewer application package",
        arch: ["any"],
        license: ["GPL3"],
        depends: ["bash", "xdg-utils"],
        categories: ["Network", "WebBrowser"],
      },
    };

    const result = await ArchBuilder.build(tempDir, mockWebOut, config);

    expect(result.success).toBe(true);
    expect(result.platform).toBe("arch");
    expect(result.outputDir).toBe(path.join(tempDir, "app", "arch"));

    // Check PKGBUILD
    const pkgbuildPath = path.join(result.outputDir, "PKGBUILD");
    expect(await FileSystem.exists(pkgbuildPath)).toBe(true);
    const pkgbuildContent = await FileSystem.readFile(pkgbuildPath);
    expect(pkgbuildContent).toContain("pkgname='com.arch.viewer'");
    expect(pkgbuildContent).toContain("pkgver=1.0.0");
    expect(pkgbuildContent).toContain("license=('GPL3')");
    expect(pkgbuildContent).toContain("package() {");

    // Check .SRCINFO
    const srcinfoPath = path.join(result.outputDir, ".SRCINFO");
    expect(await FileSystem.exists(srcinfoPath)).toBe(true);
    const srcinfoContent = await FileSystem.readFile(srcinfoPath);
    expect(srcinfoContent).toContain("pkgbase = com.arch.viewer");

    // Check launcher script and desktop entry
    const launcherPath = path.join(result.outputDir, "com.arch.viewer");
    const desktopPath = path.join(result.outputDir, "com.arch.viewer.desktop");
    const installShPath = path.join(result.outputDir, "install.sh");


    expect(await FileSystem.exists(launcherPath)).toBe(true);
    expect(await FileSystem.exists(desktopPath)).toBe(true);
    expect(await FileSystem.exists(installShPath)).toBe(true);
  });
});
