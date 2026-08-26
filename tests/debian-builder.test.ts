import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import { DebianBuilder } from "../src/platforms/debian/debian-builder.js";
import { Web2AppConfig } from "../src/types.js";
import { FileSystem } from "../src/utils/filesystem.js";

describe("DebianBuilder", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-debian-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should generate Debian package structure and .deb file in app/debian", async () => {
    const mockWebOut = path.join(tempDir, "out");
    await FileSystem.ensureDir(mockWebOut);
    await FileSystem.writeFile(path.join(mockWebOut, "index.html"), "<h1>Debian App</h1>");

    const config: Web2AppConfig = {
      appName: "Ubuntu Notes",
      packageName: "com.ubuntu.notes",
      version: "2.1.0",
      versionCode: 3,
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
        section: "editors",
        priority: "optional",
        architecture: "all",
        maintainer: "Fuad <fuad@example.com>",
        description: "Notes application for Ubuntu and Debian",
        depends: ["bash", "xdg-utils"],
        categories: ["Office", "Utility"],
      },
      arch: {
        pkgdesc: "Notes",
        arch: ["any"],
        license: ["MIT"],
        depends: ["bash"],
        categories: ["Utility"],
      },
    };

    const result = await DebianBuilder.build(tempDir, mockWebOut, config);

    expect(result.success).toBe(true);
    expect(result.platform).toBe("debian");
    expect(result.outputDir).toBe(path.join(tempDir, "app", "debian"));

    // Check .deb binary package
    expect(result.mainArtifact).toBeDefined();
    expect(await FileSystem.exists(result.mainArtifact!)).toBe(true);
    expect(result.mainArtifact!).toContain(".deb");

    // Check staging package structure
    const controlFile = path.join(result.outputDir, "pkg-source", "DEBIAN", "control");
    expect(await FileSystem.exists(controlFile)).toBe(true);

    const controlContent = await FileSystem.readFile(controlFile);
    expect(controlContent).toContain("Package: com.ubuntu.notes");
    expect(controlContent).toContain("Version: 2.1.0");
    expect(controlContent).toContain("Maintainer: Fuad <fuad@example.com>");
    expect(controlContent).toContain("Section: editors");

    const desktopFile = path.join(
      result.outputDir,
      "pkg-source",
      "usr",
      "share",
      "applications",
      "com.ubuntu.notes.desktop"
    );
    expect(await FileSystem.exists(desktopFile)).toBe(true);
    const desktopContent = await FileSystem.readFile(desktopFile);
    expect(desktopContent).toContain("Name=Ubuntu Notes");
    expect(desktopContent).toContain("Exec=/usr/bin/com.ubuntu.notes %U");

  });
});
