import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import { ConfigLoader } from "../src/core/config-loader.js";
import { FileSystem } from "../src/utils/filesystem.js";

describe("ConfigLoader", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-config-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should sanitize package names to human readable app names", () => {
    expect(ConfigLoader.sanitizeAppName("@scope/my-cool-app")).toBe("My Cool App");
    expect(ConfigLoader.sanitizeAppName("notes_app")).toBe("Notes App");
  });

  it("should derive valid Android package names from npm name", () => {
    expect(ConfigLoader.derivePackageName("@fuad/notes-app")).toBe("com.fuad.notes.app");
    expect(ConfigLoader.derivePackageName("my-app")).toBe("com.my.app");
  });

  it("should load configuration from web2app.config.json", async () => {
    await FileSystem.writeJson(path.join(tempDir, "web2app.config.json"), {
      appName: "Custom App",
      packageName: "com.custom.app",
      version: "2.0.0",
      versionCode: 42,
      android: {
        minSdk: 26,
        targetSdk: 35,
        orientation: "portrait",
      },
    });

    const config = await ConfigLoader.load(tempDir);
    expect(config.appName).toBe("Custom App");
    expect(config.packageName).toBe("com.custom.app");
    expect(config.version).toBe("2.0.0");
    expect(config.versionCode).toBe(42);
    expect(config.android.minSdk).toBe(26);
    expect(config.android.orientation).toBe("portrait");
  });

  it("should throw for invalid Android package name format", async () => {
    await FileSystem.writeJson(path.join(tempDir, "web2app.config.json"), {
      appName: "Bad App",
      packageName: "123invalid_package",
    });

    await expect(ConfigLoader.load(tempDir)).rejects.toThrow("Invalid web2app configuration");
  });
});
