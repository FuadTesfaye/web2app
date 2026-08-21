import { ConfigLoader } from "../../core/config-loader.js";
import { DoctorChecker } from "../../core/doctor-checker.js";
import { ProjectDetector } from "../../core/project-detector.js";
import { WebBuilder } from "../../core/web-builder.js";
import { BuildOptions } from "../../types.js";
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
   * Run the end-to-end Android build workflow
   */
  static async build(
    userProjectRoot: string = process.cwd(),
    options: BuildOptions = {}
  ): Promise<GradleBuildResult> {
    Logger.setVerbose(Boolean(options.verbose));
    Logger.banner();

    // Step 1: Detect Project & Validate Configuration
    Logger.step(1, 6, "Detecting project & loading configuration");
    const projectInfo = await ProjectDetector.detect(userProjectRoot);
    const config = await ConfigLoader.load(userProjectRoot);

    Logger.info(`Framework: ${projectInfo.framework.toUpperCase()}`);
    Logger.info(`App Name: ${config.appName} (${config.packageName} v${config.version})`);

    // Step 2: Build Web Application
    Logger.step(2, 6, "Building web application assets");
    const webOutputDir = await WebBuilder.build(projectInfo, config, {
      verbose: options.verbose,
      skipBuild: options.skipWebBuild,
    });

    // Step 3: Prepare Android Project Template
    Logger.step(3, 6, "Preparing Android native wrapper");
    const androidProjectDir = await TemplateManager.prepareAndroidProject(
      userProjectRoot,
      { forceClean: options.clean }
    );
    Logger.debug(`Android wrapper ready at: ${androidProjectDir}`);

    // Step 4: Inject Metadata & Resources
    Logger.step(4, 6, "Injecting application metadata & resources");
    await GradleModifier.configureAppGradle(userProjectRoot, config);
    await ManifestManager.configure(userProjectRoot, config);
    await IconProcessor.processIcon(userProjectRoot, config);

    // Step 5: Inject Web Assets
    Logger.step(5, 6, "Injecting web assets into native wrapper");
    const { fileCount } = await AssetInjector.injectAssets(userProjectRoot, webOutputDir);
    Logger.info(`Embedded ${fileCount} web files into Android assets`);

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
