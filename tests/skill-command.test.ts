import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import path from "node:path";
import os from "node:os";
import { skillCommand } from "../src/commands/skill.js";
import { FileSystem } from "../src/utils/filesystem.js";

describe("SkillCommand", () => {
  let tempDir: string;
  const originalCwd = process.cwd();

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-skill-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await FileSystem.remove(tempDir);
  });

  it("should install SKILL.md in .agents/skills/web2app by default", async () => {
    await skillCommand();

    const expectedPath = path.join(tempDir, ".agents", "skills", "web2app", "SKILL.md");
    expect(await FileSystem.exists(expectedPath)).toBe(true);

    const content = await FileSystem.readFile(expectedPath);
    expect(content).toContain("name: web2app");
    expect(content).toContain("web2app AI Assistant Skill");
  });

  it("should support custom output path", async () => {
    const customOut = "custom-skills/web2app";
    await skillCommand({ out: customOut });

    const expectedPath = path.join(tempDir, customOut, "SKILL.md");
    expect(await FileSystem.exists(expectedPath)).toBe(true);
  });

  it("should print skill content when print option is true", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await skillCommand({ print: true });

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toContain("name: web2app");
    logSpy.mockRestore();
  });
});
