import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import { ProjectDetector } from "../src/core/project-detector.js";
import { FileSystem } from "../src/utils/filesystem.js";

describe("ProjectDetector", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-detector-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should detect Next.js project with static export config", async () => {
    await FileSystem.writeJson(path.join(tempDir, "package.json"), {
      name: "my-next-app",
      dependencies: {
        next: "14.2.0",
        react: "^18.0.0",
      },
      scripts: {
        build: "next build",
      },
    });

    await FileSystem.writeFile(
      path.join(tempDir, "next.config.mjs"),
      `export default { output: 'export' };`
    );

    await FileSystem.writeFile(path.join(tempDir, "pnpm-lock.yaml"), "");

    const info = await ProjectDetector.detect(tempDir);

    expect(info.framework).toBe("nextjs");
    expect(info.packageManager).toBe("pnpm");
    expect(info.hasBuildScript).toBe(true);
    expect(info.hasNextExportConfig).toBe(true);
    expect(info.webOutputDir).toBe("out");
  });

  it("should detect Vite React project", async () => {
    await FileSystem.writeJson(path.join(tempDir, "package.json"), {
      name: "my-vite-app",
      devDependencies: {
        vite: "^5.0.0",
      },
      scripts: {
        build: "vite build",
      },
    });

    await FileSystem.writeFile(path.join(tempDir, "package-lock.json"), "{}");

    const info = await ProjectDetector.detect(tempDir);

    expect(info.framework).toBe("vite");
    expect(info.packageManager).toBe("npm");
    expect(info.webOutputDir).toBe("dist");
  });

  it("should detect static HTML project", async () => {
    await FileSystem.writeFile(
      path.join(tempDir, "index.html"),
      "<!DOCTYPE html><html><body>Hello</body></html>"
    );

    const info = await ProjectDetector.detect(tempDir);

    expect(info.framework).toBe("static");
    expect(info.hasPackageJson).toBe(false);
  });
});
