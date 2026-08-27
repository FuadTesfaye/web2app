import path from "node:path";
import pc from "picocolors";
import { ConfigLoader } from "../core/config-loader.js";
import { ProjectDetector } from "../core/project-detector.js";
import { WebBuilder } from "../core/web-builder.js";
import {
  BuildOptions,
  MultiPlatformBuildResult,
  PlatformBuildResult,
  SupportedPlatform,
  Web2AppConfig,
} from "../types.js";
import { FileSystem } from "../utils/filesystem.js";
import { Logger } from "../utils/logger.js";
import { Paths } from "../utils/paths.js";
import { AndroidBuilder } from "./android/android-builder.js";
import { ArchBuilder } from "./arch/arch-builder.js";
import { DebianBuilder } from "./debian/debian-builder.js";
import { WindowsBuilder } from "./windows/windows-builder.js";

export class MultiPlatformBuilder {
  /**
   * Run multi-platform conversion and build
   */
  static async build(
    userProjectRoot: string = process.cwd(),
    options: BuildOptions = {}
  ): Promise<MultiPlatformBuildResult> {
    const startTime = Date.now();
    Logger.setVerbose(Boolean(options.verbose));
    Logger.banner();

    // 1. Detect project or URL
    const target = options.url || userProjectRoot;
    const projectInfo = await ProjectDetector.detect(target);
    const config = await ConfigLoader.load(userProjectRoot, {
      ...(options.url ? { url: options.url } : {}),
    });

    const isUrl = Boolean(config.url || projectInfo.url);

    Logger.kv("Target:", isUrl ? `🌐 Web Page (${pc.cyan(config.url || projectInfo.url)})` : `📁 Local Web App (${pc.cyan(projectInfo.framework.toUpperCase())})`);
    Logger.kv("App Name:", pc.bold(config.appName));
    Logger.kv("Package:", `${config.packageName} ${pc.gray(`(v${config.version})`)}`);

    // 2. Build web assets if local project
    let webOutputDir: string | null = null;
    if (!isUrl) {
      Logger.step(1, 4, "Building web assets", projectInfo.framework);
      webOutputDir = await WebBuilder.build(projectInfo, config, {
        verbose: options.verbose,
        skipBuild: options.skipWebBuild,
      });
    }

    // 3. Ensure root app/ output directory exists
    const appDir = Paths.getAppDir(userProjectRoot, options.out);
    await FileSystem.ensureDir(appDir);

    // 4. Determine platforms to build
    const platformsToBuild = this.resolvePlatforms(options.platform, config);
    Logger.kv("Platforms:", platformsToBuild.map((p) => `${Logger.platformIcon(p)} ${p}`).join("  "));

    const results: Record<string, PlatformBuildResult> = {};

    // 5. Build for each requested platform
    let currentStep = 2;
    const totalSteps = platformsToBuild.length + 1;

    for (const platform of platformsToBuild) {
      const icon = Logger.platformIcon(platform);
      Logger.step(
        currentStep++,
        totalSteps,
        `Compiling ${platform.toUpperCase()} target`,
        `${path.basename(appDir)}/${platform}`
      );

      const platStartTime = Date.now();

      try {
        let result: PlatformBuildResult;

        switch (platform) {
          case "windows":
            result = await WindowsBuilder.build(userProjectRoot, webOutputDir, config, options);
            break;

          case "debian":
            result = await DebianBuilder.build(userProjectRoot, webOutputDir, config, options);
            break;

          case "arch":
            result = await ArchBuilder.build(userProjectRoot, webOutputDir, config, options);
            break;

          case "android":
          default: {
            const androidRes = await AndroidBuilder.buildPlatform(
              userProjectRoot,
              webOutputDir,
              config,
              options
            );
            result = androidRes;
            break;
          }
        }

        result.durationMs = Date.now() - platStartTime;
        results[platform] = result;
        const durationStr = `${(result.durationMs / 1000).toFixed(2)}s`;
        Logger.success(`${icon} Built ${platform.toUpperCase()} package ${pc.gray(`(${durationStr})`)}`);
      } catch (err: any) {
        Logger.error(`Failed to build ${platform} package:`, err?.message || String(err));
        results[platform] = {
          platform,
          outputDir: Paths.getPlatformOutputDir(platform, userProjectRoot, options.out),
          files: [],
          durationMs: Date.now() - platStartTime,
          success: false,
          error: err?.message || String(err),
        };
      }
    }

    const durationMs = Date.now() - startTime;
    const totalSeconds = (durationMs / 1000).toFixed(2);

    // 6. Display modern comprehensive summary card
    const summaryLines: string[] = [
      `${pc.dim("Application:")}  ${pc.bold(config.appName)} ${pc.gray(`(v${config.version})`)}  ${pc.dim("•")}  ${pc.cyan(`${totalSeconds}s total`)}`,
      `${pc.dim("Output Root:")}  ${pc.white(appDir)}`,
      "---",
    ];

    for (const [p, res] of Object.entries(results)) {
      const statusIcon = res.success ? pc.green("✔") : pc.red("✖");
      const icon = Logger.platformIcon(p);
      const relPath = path.relative(userProjectRoot, res.outputDir) || res.outputDir;
      const sizeStr = res.formattedSize ? pc.dim(` [${res.formattedSize}]`) : "";
      const timeStr = res.durationMs ? pc.gray(` (${(res.durationMs / 1000).toFixed(2)}s)`) : "";

      summaryLines.push(
        `${statusIcon} ${icon} ${pc.bold(p.toUpperCase().padEnd(8))} ${pc.white(relPath)}${sizeStr}${timeStr}`
      );
      if (res.mainArtifact) {
        summaryLines.push(`     ${pc.dim("Artifact:")}  ${pc.cyan(path.basename(res.mainArtifact))}`);
      }
    }

    summaryLines.push("---");
    summaryLines.push(`${pc.dim("Quick Actions:")}`);
    summaryLines.push(`  • Run on Android:   ${pc.cyan("npx web2app run android")}`);
    summaryLines.push(`  • Open in Studio:   ${pc.cyan("npx web2app open android")}`);
    summaryLines.push(`  • Install AI Skill: ${pc.cyan("npx web2app skill")}`);

    Logger.card(`⚡ Multi-Platform Build Complete`, summaryLines, {
      borderColor: pc.cyan,
    });

    return {
      appDir,
      results,
      durationMs,
    };
  }

  /**
   * Resolve platform list from option or config
   */
  static resolvePlatforms(
    requestedPlatform?: string,
    config?: Web2AppConfig
  ): Array<"android" | "windows" | "debian" | "arch"> {
    if (!requestedPlatform || requestedPlatform === "all") {
      return ["android", "windows", "debian", "arch"];
    }

    const rawList = requestedPlatform
      .split(",")
      .map((p) => p.trim().toLowerCase())
      .filter(Boolean);

    const validPlatforms: Array<"android" | "windows" | "debian" | "arch"> = [];

    for (const p of rawList) {
      if (p === "all") {
        return ["android", "windows", "debian", "arch"];
      }
      if (p === "android" || p === "windows" || p === "debian" || p === "arch") {
        if (!validPlatforms.includes(p)) {
          validPlatforms.push(p);
        }
      }
    }

    return validPlatforms.length > 0 ? validPlatforms : ["android", "windows", "debian", "arch"];
  }
}
