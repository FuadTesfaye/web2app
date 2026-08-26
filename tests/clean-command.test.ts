import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import path from "node:path";
import os from "node:os";
import { cleanCommand } from "../src/commands/clean.js";
import { FileSystem } from "../src/utils/filesystem.js";

describe("CleanCommand", () => {
  let tempDir: string;
  const originalCwd = process.cwd();

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-clean-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await FileSystem.remove(tempDir);
  });

  it("should clean .web2app/ and app/ directories", async () => {
    const appDir = path.join(tempDir, "app");
    const web2appDir = path.join(tempDir, ".web2app");

    await FileSystem.ensureDir(path.join(appDir, "android"));
    await FileSystem.ensureDir(path.join(appDir, "windows"));
    await FileSystem.ensureDir(web2appDir);

    expect(await FileSystem.exists(appDir)).toBe(true);
    expect(await FileSystem.exists(web2appDir)).toBe(true);

    await cleanCommand();

    expect(await FileSystem.exists(appDir)).toBe(false);
    expect(await FileSystem.exists(web2appDir)).toBe(false);
  });
});
