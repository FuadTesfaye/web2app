import fs from "node:fs/promises";
import path from "node:path";
import { ConfigLoader } from "../../core/config-loader.js";
import { DoctorChecker } from "../../core/doctor-checker.js";
import { ProjectDetector } from "../../core/project-detector.js";
import { WebBuilder } from "../../core/web-builder.js";
import { BuildOptions, PlatformBuildResult, Web2AppConfig } from "../../types.js";
import { FileSystem } from "../../utils/filesystem.js";
import { Logger } from "../../utils/logger.js";
import { Paths } from "../../utils/paths.js";
import { AssetInjector } from "./asset-injector.js";
import { GradleModifier } from "./gradle-modifier.js";
import { GradleBuildResult, GradleRunner } from "./gradle-runner.js";
import { IconProcessor } from "./icon-processor.js";
import { ManifestManager } from "./manifest-manager.js";
import { TemplateManager } from "./template-manager.js";

export class AndroidBuilder {
  /**
   * Run the full Android build workflow and output to app/android
   */
  static async buildPlatform(
    userProjectRoot: string,
    webOutputDir: string | null,
    config: Web2AppConfig,
    options: BuildOptions = {}
  ): Promise<PlatformBuildResult> {
    const startTime = Date.now();
    const outputDir = Paths.getAndroidOutputDir(userProjectRoot, options.out);

    if (options.clean && (await FileSystem.exists(outputDir))) {
      await FileSystem.remove(outputDir);
    }
    await FileSystem.ensureDir(outputDir);

    // 1. Prepare Android Project Wrapper
    const androidProjectDir = await TemplateManager.prepareAndroidProject(userProjectRoot, {
      forceClean: options.clean,
    });

    // 2. Inject Metadata & Resources
    await GradleModifier.configureAppGradle(userProjectRoot, config);
    await ManifestManager.configure(userProjectRoot, config);
    await IconProcessor.processIcon(userProjectRoot, config);

    // 3. Inject Web Assets if static
    if (webOutputDir && (await FileSystem.exists(webOutputDir))) {
      const { fileCount } = await AssetInjector.injectAssets(userProjectRoot, webOutputDir);
      Logger.debug(`Embedded ${fileCount} web files into Android assets`);
    }

    // 4. Always copy configured Android native project files to app/android
    await FileSystem.copyDir(androidProjectDir, outputDir, (filename) => {
      // Exclude build caches when copying project
      return !filename.includes("/build/") && !filename.includes("/.gradle/");
    });

    // 5. Check if Android SDK is available to compile APK
    const sdkPath = await DoctorChecker.findAndroidSdkPath();
    let mainArtifact = outputDir;
    let fileSize = 0;

    const shouldCompileApk = Boolean(
      options.platform === "android" ||
      options.release ||
      options.bundle ||
      process.env.WEB2APP_COMPILE_APK === "true"
    );

    if (shouldCompileApk && sdkPath) {
      try {
        const gradleResult = await GradleRunner.build(userProjectRoot, config, options);
        mainArtifact = gradleResult.apkPath;
        fileSize = gradleResult.fileSize;
      } catch (err: any) {
        Logger.warn(`Gradle APK compilation skipped: ${err?.message || err}`);
        Logger.tip(`The complete native Android project has been exported to ${outputDir}. Open it in Android Studio.`);
      }
    } else if (!sdkPath && shouldCompileApk) {
      Logger.info(`Android SDK not found. Exported complete native Android project to: ${outputDir}`);
      Logger.tip(`To compile APK, install Android SDK or open "${outputDir}" in Android Studio.`);
    }


    const allFiles = await fs.readdir(outputDir);
    if (!fileSize) {
      for (const f of allFiles) {
        try {
          const stat = await fs.stat(path.join(outputDir, f));
          if (!stat.isDirectory()) fileSize += stat.size;
        } catch {}
      }
    }

    const durationMs = Date.now() - startTime;
    return {
      platform: "android",
      outputDir,
      mainArtifact,
      files: allFiles,
      fileSize,
      formattedSize: FileSystem.formatFileSize(fileSize),
      durationMs,
      success: true,
    };
  }

  /**
   * Run the end-to-end Android build workflow (standalone entrypoint)
   */
  static async build(
    userProjectRoot: string = process.cwd(),
    options: BuildOptions = {}
  ): Promise<GradleBuildResult> {
    Logger.setVerbose(Boolean(options.verbose));
    Logger.banner();

    // Step 1: Detect Project & Validate Configuration
    Logger.step(1, 6, "Detecting project & loading configuration");
    const projectInfo = await ProjectDetector.detect(options.url || userProjectRoot);
    const config = await ConfigLoader.load(userProjectRoot, {
      ...(options.url ? { url: options.url } : {}),
    });

    Logger.info(`Framework: ${projectInfo.framework.toUpperCase()}`);
    Logger.info(`App Name: ${config.appName} (${config.packageName} v${config.version})`);

    // Step 2: Build Web Application
    let webOutputDir: string | null = null;
    if (!config.url && projectInfo.framework !== "url") {
      Logger.step(2, 6, "Building web application assets");
      webOutputDir = await WebBuilder.build(projectInfo, config, {
        verbose: options.verbose,
        skipBuild: options.skipWebBuild,
      });
    }

    // Step 3: Prepare Android Project Template
    Logger.step(3, 6, "Preparing Android native wrapper");
    const androidProjectDir = await TemplateManager.prepareAndroidProject(userProjectRoot, {
      forceClean: options.clean,
    });
    Logger.debug(`Android wrapper ready at: ${androidProjectDir}`);

    // Step 4: Inject Metadata & Resources
    Logger.step(4, 6, "Injecting application metadata & resources");
    await GradleModifier.configureAppGradle(userProjectRoot, config);
    await ManifestManager.configure(userProjectRoot, config);
    await IconProcessor.processIcon(userProjectRoot, config);

    // Step 5: Inject Web Assets
    if (webOutputDir) {
      Logger.step(5, 6, "Injecting web assets into native wrapper");
      const { fileCount } = await AssetInjector.injectAssets(userProjectRoot, webOutputDir);
      Logger.info(`Embedded ${fileCount} web files into Android assets`);
    }

    // Step 6: Gradle Compilation & APK Delivery
    Logger.step(6, 6, "Compiling native Android APK with Gradle");
    const result = await GradleRunner.build(userProjectRoot, config, options);

    // Display summary
    console.log();
    Logger.box("🎉 Android APK Build Successful!", [
      `App:       ${config.appName}`,
      `Package:   ${config.packageName}`,
      `Version:   ${config.version} (code: ${config.versionCode})`,
      `Output:    ${result.apkPath}`,
      `Size:      ${result.formattedSize}`,
      `Time:      ${(result.durationMs / 1000).toFixed(1)}s`,
    ]);
    console.log();
    Logger.tip(`To install on a connected device, run: npx web2app run android`);

    return result;
  }
}
