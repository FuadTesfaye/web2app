import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";

export class FileSystem {
  /**
   * Check if a file or directory exists
   */
  static async exists(targetPath: string): Promise<boolean> {
    try {
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check synchronous existence
   */
  static existsSync(targetPath: string): boolean {
    return fsSync.existsSync(targetPath);
  }

  /**
   * Ensure directory exists (mkdir -p)
   */
  static async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  /**
   * Remove directory and its contents (rm -rf)
   */
  static async remove(targetPath: string): Promise<void> {
    if (await this.exists(targetPath)) {
      await fs.rm(targetPath, { recursive: true, force: true });
    }
  }

  /**
   * Read file as UTF-8 string, returning null if not found
   */
  static async readFile(filePath: string): Promise<string | null> {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch {
      return null;
    }
  }

  /**
   * Write UTF-8 string to file, ensuring parent directory exists
   */
  static async writeFile(filePath: string, content: string): Promise<void> {
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, "utf-8");
  }

  /**
   * Read and parse JSON file
   */
  static async readJson<T = unknown>(filePath: string): Promise<T | null> {
    const raw = await this.readFile(filePath);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /**
   * Write formatted JSON to file
   */
  static async writeJson(filePath: string, data: unknown): Promise<void> {
    const content = JSON.stringify(data, null, 2) + "\n";
    await this.writeFile(filePath, content);
  }

  /**
   * Recursively copy directory with optional filter
   */
  static async copyDir(
    srcDir: string,
    destDir: string,
    filter?: (filename: string) => boolean
  ): Promise<void> {
    const resolvedSrc = path.resolve(srcDir);
    const resolvedDest = path.resolve(destDir);

    await this.ensureDir(destDir);
    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      const resolvedEntry = path.resolve(srcPath);

      // Prevent copying the destination directory into itself
      if (resolvedEntry === resolvedDest || resolvedDest.startsWith(resolvedEntry + path.sep)) {
        continue;
      }

      if (filter && !filter(entry.name)) {
        continue;
      }

      if (entry.isDirectory()) {
        await this.copyDir(srcPath, destPath, filter);
      } else if (entry.isFile()) {
        await this.ensureDir(path.dirname(destPath));
        await fs.copyFile(srcPath, destPath);
      }
    }
  }


  /**
   * Replace string patterns inside a text file
   */
  static async replaceInFile(
    filePath: string,
    replacements: Array<{ search: string | RegExp; replace: string }>
  ): Promise<boolean> {
    const content = await this.readFile(filePath);
    if (content === null) return false;

    let updated = content;
    for (const { search, replace } of replacements) {
      if (typeof search === "string") {
        updated = updated.split(search).join(replace);
      } else {
        updated = updated.replace(search, replace);
      }
    }

    if (updated !== content) {
      await this.writeFile(filePath, updated);
      return true;
    }
    return false;
  }

  /**
   * Get human readable file size
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Get file stats (size in bytes)
   */
  static async getFileSize(filePath: string): Promise<number> {
    try {
      const stat = await fs.stat(filePath);
      return stat.size;
    } catch {
      return 0;
    }
  }
}
