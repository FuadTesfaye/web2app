import { describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import zlib from "node:zlib";
import { DebPackager } from "../src/utils/deb-packager.js";
import { FileSystem } from "../src/utils/filesystem.js";

describe("DebPackager", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `web2app-test-deb-${Date.now()}`);
    await FileSystem.ensureDir(tempDir);
  });

  afterEach(async () => {
    await FileSystem.remove(tempDir);
  });

  it("should create valid USTAR tar and tar.gz buffer", () => {
    const entries = [
      { path: "./usr/bin/hello", content: "#!/bin/sh\necho hello\n", mode: 0o755 },
      { path: "./usr/share/doc/README.txt", content: "Documentation", mode: 0o644 },
    ];

    const tarBuffer = DebPackager.createTar(entries);
    expect(tarBuffer.length % 512).toBe(0);
    expect(tarBuffer.toString("ascii", 257, 262)).toBe("ustar");

    const tarGz = DebPackager.createTarGz(entries);
    const unzipped = zlib.gunzipSync(tarGz);
    expect(unzipped.toString("ascii", 257, 262)).toBe("ustar");
  });

  it("should create a valid .deb archive with debian-binary, control.tar.gz, data.tar.gz", async () => {
    // Setup mock debian staging dir
    const stagingDir = path.join(tempDir, "staging");
    await FileSystem.ensureDir(path.join(stagingDir, "DEBIAN"));
    await FileSystem.writeFile(
      path.join(stagingDir, "DEBIAN", "control"),
      "Package: test-app\nVersion: 1.0.0\nArchitecture: all\nDescription: Test App\n"
    );

    await FileSystem.ensureDir(path.join(stagingDir, "usr", "bin"));
    await FileSystem.writeFile(
      path.join(stagingDir, "usr", "bin", "test-app"),
      "#!/bin/sh\necho 'Running test-app'\n"
    );

    const outputDeb = path.join(tempDir, "test-app_1.0.0_all.deb");
    await DebPackager.createDebPure(stagingDir, outputDeb);

    expect(await FileSystem.exists(outputDeb)).toBe(true);

    const debContent = await fs.readFile(outputDeb);
    // 1. Check ar signature
    expect(debContent.subarray(0, 8).toString("ascii")).toBe("!<arch>\n");

    // 2. Check entries inside ar
    const debString = debContent.toString("latin1");
    expect(debString).toContain("debian-binary");
    expect(debString).toContain("control.tar.gz");
    expect(debString).toContain("data.tar.gz");
  });
});
