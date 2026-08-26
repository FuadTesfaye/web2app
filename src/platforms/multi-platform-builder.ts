import path from "node:path";
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

    Logger.info(`Target:    ${isUrl ? `🌐 Web Page (${config.url || projectInfo.url})` : `📁 Local Web App (${projectInfo.framework.toUpperCase()})`}`);
    Logger.info(`App Name:  ${config.appName}`);
    Logger.info(`Package:   ${config.packageName} (v${config.version})`);

    // 2. Build web assets if local project
    let webOutputDir: string | null = null;
    if (!isUrl) {
      Logger.step(1, 4, "Building web assets");
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
    Logger.info(`Target Platforms: ${platformsToBuild.map((p) => p.toUpperCase()).join(", ")}`);

    const results: Record<string, PlatformBuildResult> = {};

    // 5. Build for each requested platform
    let currentStep = 2;
    const totalSteps = platformsToBuild.length + 1;

    for (const platform of platformsToBuild) {
      Logger.step(
        currentStep++,
        totalSteps,
        `Building ${platform.toUpperCase()} package in ${path.basename(appDir)}/${platform}`
      );

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

        results[platform] = result;
        Logger.success(`Successfully built ${platform.toUpperCase()} app -> ${result.outputDir}`);
      } catch (err: any) {
        Logger.error(`Failed to build ${platform} package:`, err?.message || String(err));
        results[platform] = {
          platform,
          outputDir: Paths.getPlatformOutputDir(platform, userProjectRoot, options.out),
          files: [],
          durationMs: 0,
          success: false,
          error: err?.message || String(err),
        };
      }
    }

    const durationMs = Date.now() - startTime;

    // 6. Display comprehensive summary
    console.log();
    const summaryLines: string[] = [
      `Application:  ${config.appName} (v${config.version})`,
      `Output Root:  ${appDir}`,
      "",
    ];

    for (const [p, res] of Object.entries(results)) {
      const statusIcon = res.success ? "✔" : "✖";
      const relPath = path.relative(userProjectRoot, res.outputDir) || res.outputDir;
      summaryLines.push(
        `${statusIcon} /${p.padEnd(9)} -> ${relPath} ${res.formattedSize ? `(${res.formattedSize})` : ""}`
      );
      if (res.mainArtifact) {
        summaryLines.push(`    Artifact:  ${path.basename(res.mainArtifact)}`);
      }
    }

    Logger.box("🎉 Multi-Platform Build Completed!", summaryLines);
    console.log();

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
