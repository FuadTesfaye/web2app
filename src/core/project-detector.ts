import fs from "node:fs/promises";
import path from "node:path";
import { PackageManager, ProjectInfo, WebFramework } from "../types.js";
import { FileSystem } from "../utils/filesystem.js";
import { Logger } from "../utils/logger.js";
import { ConfigLoader } from "./config-loader.js";

export class ProjectDetector {
  /**
   * Detect web project characteristics from the target directory or URL
   */
  static async detect(rootDirOrUrl: string = process.cwd()): Promise<ProjectInfo> {
    // If target is a remote URL
    if (/^https?:\/\//i.test(rootDirOrUrl)) {
      const { appName, packageName } = ConfigLoader.deriveFromUrl(rootDirOrUrl);
      return {
        rootDir: process.cwd(),
        framework: "url",
        packageManager: "npm",
        packageName,
        appName,
        version: "1.0.0",
        hasPackageJson: false,
        hasBuildScript: false,
        webOutputDir: "",
        url: rootDirOrUrl,
      };
    }

    const rootDir = path.resolve(rootDirOrUrl);

    // If target is a single HTML file
    if ((await FileSystem.exists(rootDir)) && !(await fs.stat(rootDir)).isDirectory()) {
      const parentDir = path.dirname(rootDir);
      return {
        rootDir: parentDir,
        framework: "static",
        packageManager: "npm",
        appName: "Web App",
        packageName: "com.web2app.app",
        version: "1.0.0",
        hasPackageJson: false,
        hasBuildScript: false,
        webOutputDir: parentDir,
      };
    }

    const pkgPath = path.join(rootDir, "package.json");
    const hasPackageJson = await FileSystem.exists(pkgPath);

    let pkg: any = {};
    if (hasPackageJson) {
      pkg = (await FileSystem.readJson(pkgPath)) || {};
    }

    const packageManager = await this.detectPackageManager(rootDir);
    const frameworkInfo = await this.detectFramework(rootDir, pkg);
    const hasBuildScript = Boolean(pkg?.scripts?.build);

    const projectInfo: ProjectInfo = {
      rootDir,
      framework: frameworkInfo.framework,
      frameworkVersion: frameworkInfo.version,
      packageManager,
      packageName: pkg.name,
      appName: pkg.displayName || pkg.name,
      version: pkg.version,
      hasPackageJson,
      hasBuildScript,
      webOutputDir: frameworkInfo.outputDir,
      nextConfigPath: frameworkInfo.nextConfigPath,
      hasNextExportConfig: frameworkInfo.hasNextExportConfig,
    };

    Logger.debug(`Detected project: ${JSON.stringify(projectInfo)}`);
    return projectInfo;
  }


  /**
   * Detect package manager via lockfiles
   */
  static async detectPackageManager(rootDir: string): Promise<PackageManager> {
    if (
      (await FileSystem.exists(path.join(rootDir, "bun.lockb"))) ||
      (await FileSystem.exists(path.join(rootDir, "bun.lock")))
    ) {
      return "bun";
    }
    if (await FileSystem.exists(path.join(rootDir, "pnpm-lock.yaml"))) {
      return "pnpm";
    }
    if (await FileSystem.exists(path.join(rootDir, "yarn.lock"))) {
      return "yarn";
    }
    return "npm";
  }

  /**
   * Detect framework, output dir, and Next.js specific config
   */
  private static async detectFramework(
    rootDir: string,
    pkg: any
  ): Promise<{
    framework: WebFramework;
    version?: string;
    outputDir: string;
    nextConfigPath?: string;
    hasNextExportConfig?: boolean;
  }> {
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    // 1. Next.js
    if (deps.next) {
      const nextConfigDetails = await this.checkNextConfig(rootDir);
      return {
        framework: "nextjs",
        version: deps.next,
        outputDir: "out",
        nextConfigPath: nextConfigDetails.path,
        hasNextExportConfig: nextConfigDetails.hasExport,
      };
    }

    // 2. Vite
    if (deps.vite) {
      return {
        framework: "vite",
        version: deps.vite,
        outputDir: "dist",
      };
    }

    // 3. Create React App
    if (deps["react-scripts"]) {
      return {
        framework: "cra",
        version: deps["react-scripts"],
        outputDir: "build",
      };
    }

    // 4. Static HTML (index.html at root or in public/dist/out)
    if (await FileSystem.exists(path.join(rootDir, "index.html"))) {
      return {
        framework: "static",
        outputDir: ".",
      };
    }

    if (await FileSystem.exists(path.join(rootDir, "public", "index.html"))) {
      return {
        framework: "static",
        outputDir: "public",
      };
    }

    if (await FileSystem.exists(path.join(rootDir, "dist", "index.html"))) {
      return {
        framework: "static",
        outputDir: "dist",
      };
    }

    return {
      framework: "unknown",
      outputDir: "out",
    };
  }

  /**
   * Check for Next.js config files and inspect for output: 'export'
   */
  static async checkNextConfig(
    rootDir: string
  ): Promise<{ path?: string; hasExport: boolean }> {
    const candidateFiles = [
      "next.config.ts",
      "next.config.mjs",
      "next.config.js",
      "next.config.cjs",
    ];

    for (const fileName of candidateFiles) {
      const fullPath = path.join(rootDir, fileName);
      if (await FileSystem.exists(fullPath)) {
        const content = (await FileSystem.readFile(fullPath)) || "";
        const hasExport =
          /output\s*:\s*['"`]export['"`]/.test(content) ||
          content.includes("output: 'export'") ||
          content.includes('output: "export"');

        return {
          path: fullPath,
          hasExport,
        };
      }
    }

    return {
      hasExport: false,
    };
  }
}
