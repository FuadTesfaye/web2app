import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { CommandRunner } from "./command-runner.js";
import { FileSystem } from "./filesystem.js";
import { Logger } from "./logger.js";

export interface TarEntry {
  path: string; // e.g. "./usr/bin/myapp"
  content?: Buffer | string;
  isDir?: boolean;
  mode?: number; // e.g. 0o755 or 0o644
  mtime?: number;
}

export class DebPackager {
  /**
   * Package a Debian directory structure into a .deb package file
   */
  static async createDeb(
    debianRootDir: string,
    outputDebPath: string
  ): Promise<void> {
    await FileSystem.ensureDir(path.dirname(outputDebPath));

    // Try system dpkg-deb first if available
    const dpkgDeb = await CommandRunner.which("dpkg-deb");
    if (dpkgDeb) {
      try {
        Logger.debug(`Using system dpkg-deb at: ${dpkgDeb}`);
        const res = await CommandRunner.run(dpkgDeb, ["--build", debianRootDir, outputDebPath]);
        if (res.code === 0 && (await FileSystem.exists(outputDebPath))) {
          Logger.debug(`Built .deb with dpkg-deb: ${outputDebPath}`);
          return;
        }
      } catch (err: any) {
        Logger.debug(`dpkg-deb invocation failed, falling back to pure Node packager: ${err?.message}`);
      }
    }

    // Pure Node.js implementation
    await this.createDebPure(debianRootDir, outputDebPath);
  }

  /**
   * Pure Node.js / TypeScript .deb package creator
   */
  static async createDebPure(
    debianRootDir: string,
    outputDebPath: string
  ): Promise<void> {
    // 1. Collect control entries (DEBIAN/*)
    const controlDir = path.join(debianRootDir, "DEBIAN");
    if (!(await FileSystem.exists(controlDir))) {
      throw new Error(`Invalid Debian package directory. Missing DEBIAN/ at: ${debianRootDir}`);
    }

    const controlEntries: TarEntry[] = [{ path: "./", isDir: true, mode: 0o755 }];
    const controlFiles = await fs.readdir(controlDir);

    for (const file of controlFiles) {
      const filePath = path.join(controlDir, file);
      const stat = await fs.stat(filePath);
      const isExec = file === "postinst" || file === "postrm" || file === "preinst" || file === "prerm";
      const content = await fs.readFile(filePath);
      controlEntries.push({
        path: `./${file}`,
        content,
        mode: isExec ? 0o755 : 0o644,
        mtime: Math.floor(stat.mtimeMs / 1000),
      });
    }

    const controlTarGz = this.createTarGz(controlEntries);

    // 2. Collect data entries (all directories except DEBIAN)
    const dataEntries: TarEntry[] = [{ path: "./", isDir: true, mode: 0o755 }];
    await this.collectDataEntries(debianRootDir, debianRootDir, dataEntries);

    const dataTarGz = this.createTarGz(dataEntries);

    // 3. Construct ar archive
    const debianBinary = Buffer.from("2.0\n", "utf-8");

    const arEntries = [
      { name: "debian-binary", content: debianBinary },
      { name: "control.tar.gz", content: controlTarGz },
      { name: "data.tar.gz", content: dataTarGz },
    ];

    const arArchive = this.createArArchive(arEntries);
    await fs.writeFile(outputDebPath, arArchive);
    Logger.debug(`Created pure .deb archive at: ${outputDebPath} (${arArchive.length} bytes)`);
  }

  /**
   * Recursively collect files and directories for data.tar.gz
   */
  private static async collectDataEntries(
    rootDir: string,
    currentDir: string,
    entries: TarEntry[]
  ): Promise<void> {
    const items = await fs.readdir(currentDir);

    for (const item of items) {
      if (currentDir === rootDir && item === "DEBIAN") {
        continue;
      }

      const fullPath = path.join(currentDir, item);
      const relativePath = "./" + path.relative(rootDir, fullPath).replace(/\\/g, "/");
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        entries.push({
          path: relativePath + "/",
          isDir: true,
          mode: 0o755,
          mtime: Math.floor(stat.mtimeMs / 1000),
        });
        await this.collectDataEntries(rootDir, fullPath, entries);
      } else {
        const isBin = relativePath.startsWith("./usr/bin");
        const content = await fs.readFile(fullPath);
        entries.push({
          path: relativePath,
          content,
          mode: isBin ? 0o755 : 0o644,
          mtime: Math.floor(stat.mtimeMs / 1000),
        });
      }
    }
  }

  /**
   * Create a tar.gz buffer from tar entries
   */
  static createTarGz(entries: TarEntry[]): Buffer {
    const tarBuffer = this.createTar(entries);
    return zlib.gzipSync(tarBuffer, { level: 9 });
  }

  /**
   * Create a standard USTAR tar buffer
   */
  static createTar(entries: TarEntry[]): Buffer {
    const blocks: Buffer[] = [];

    for (const entry of entries) {
      const isDir = Boolean(entry.isDir || entry.path.endsWith("/"));
      let cleanPath = entry.path;
      if (isDir && !cleanPath.endsWith("/")) cleanPath += "/";

      const contentBuffer = entry.content
        ? Buffer.isBuffer(entry.content)
          ? entry.content
          : Buffer.from(entry.content, "utf-8")
        : Buffer.alloc(0);

      const size = isDir ? 0 : contentBuffer.length;
      const mode = entry.mode || (isDir ? 0o755 : 0o644);
      const mtime = entry.mtime || 1700000000;

      const header = Buffer.alloc(512);

      // 0..99: filename (100 bytes)
      header.write(cleanPath, 0, Math.min(100, cleanPath.length), "utf-8");

      // 100..107: mode (8 bytes, octal)
      header.write(mode.toString(8).padStart(6, "0") + " \0", 100, 8, "ascii");

      // 108..115: uid (8 bytes)
      header.write("0000000 \0", 108, 8, "ascii");

      // 116..123: gid (8 bytes)
      header.write("0000000 \0", 116, 8, "ascii");

      // 124..135: size (12 bytes, octal)
      header.write(size.toString(8).padStart(11, "0") + " ", 124, 12, "ascii");

      // 136..147: mtime (12 bytes, octal)
      header.write(mtime.toString(8).padStart(11, "0") + " ", 136, 12, "ascii");

      // 148..155: chksum spaces for now
      header.fill(32, 148, 156);

      // 156: typeflag (1 byte: '5' dir, '0' file)
      header.write(isDir ? "5" : "0", 156, 1, "ascii");

      // 257..262: magic (6 bytes)
      header.write("ustar\0", 257, 6, "ascii");

      // 263..264: version (2 bytes)
      header.write("00", 263, 2, "ascii");

      // 265..296: uname (32 bytes)
      header.write("root", 265, 4, "ascii");

      // 297..328: gname (32 bytes)
      header.write("root", 297, 4, "ascii");

      // Calculate checksum
      let chksum = 0;
      for (let i = 0; i < 512; i++) {
        chksum += header[i];
      }
      const chksumStr = chksum.toString(8).padStart(6, "0") + "\0 ";
      header.write(chksumStr, 148, 8, "ascii");

      blocks.push(header);

      if (!isDir && contentBuffer.length > 0) {
        blocks.push(contentBuffer);
        const remainder = contentBuffer.length % 512;
        if (remainder !== 0) {
          blocks.push(Buffer.alloc(512 - remainder));
        }
      }
    }

    // End of tar: two 512 zero blocks
    blocks.push(Buffer.alloc(1024));

    return Buffer.concat(blocks);
  }

  /**
   * Create an ar archive buffer containing files
   */
  static createArArchive(entries: Array<{ name: string; content: Buffer }>): Buffer {
    const buffers: Buffer[] = [];

    // Global ar header
    buffers.push(Buffer.from("!<arch>\n", "ascii"));

    for (const entry of entries) {
      const header = Buffer.alloc(60);
      const namePadded = entry.name.padEnd(16, " ");
      const timestampPadded = "0           "; // 12 chars
      const ownerPadded = "0     "; // 6 chars
      const groupPadded = "0     "; // 6 chars
      const modePadded = "100644  "; // 8 chars
      const sizePadded = entry.content.length.toString().padEnd(10, " "); // 10 chars
      const endMagic = "`\n"; // 2 chars

      const headerStr = `${namePadded}${timestampPadded}${ownerPadded}${groupPadded}${modePadded}${sizePadded}${endMagic}`;
      header.write(headerStr, 0, 60, "ascii");

      buffers.push(header);
      buffers.push(entry.content);

      if (entry.content.length % 2 !== 0) {
        buffers.push(Buffer.from("\n", "ascii"));
      }
    }

    return Buffer.concat(buffers);
  }
}
