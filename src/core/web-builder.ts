import path from "node:path";
import { ProjectInfo, Web2AppConfig } from "../types.js";
import { CommandRunner } from "../utils/command-runner.js";
import { FileSystem } from "../utils/filesystem.js";
import { Logger } from "../utils/logger.js";

export class WebBuilder {
  /**
   * Run the web build process and return the path to the built web assets
   */
  static async build(
    projectInfo: ProjectInfo,
    config: Web2AppConfig,
    options: { verbose?: boolean; skipBuild?: boolean } = {}
  ): Promise<string> {
    const rootDir = projectInfo.rootDir;
    const outputSubdir = config.webDir || projectInfo.webOutputDir;
    const outputDir = path.resolve(rootDir, outputSubdir);

    // If skipBuild is requested, verify assets already exist
    if (options.skipBuild) {
      Logger.info(`Skipping web build (--skip-web-build) using: ${outputDir}`);
      await this.validateOutputDir(outputDir);
      return outputDir;
    }

    // Handle static HTML projects (no build required)
    if (projectInfo.framework === "static" && !config.buildCommand && !projectInfo.hasBuildScript) {
      Logger.info("Static project detected. Skipping web build step.");
      await this.validateOutputDir(outputDir);
      return outputDir;
    }

    // Check Next.js export configuration
    if (projectInfo.framework === "nextjs" && !projectInfo.hasNextExportConfig) {
      Logger.warn(
        "Next.js project detected without `output: 'export'` configured in next.config."
      );
      Logger.tip(
        "For standalone Android APKs, Next.js must be configured with static HTML export:\n" +
          "  // next.config.ts / next.config.mjs\n" +
          "  const nextConfig = { output: 'export', images: { unoptimized: true } };\n" +
          "  export default nextConfig;"
      );
    }

    // Determine build command to run
    let cmd = "";
    let args: string[] = [];

    if (config.buildCommand) {
      const parts = config.buildCommand.split(" ").filter(Boolean);
      cmd = parts[0];
      args = parts.slice(1);
    } else {
      const pm = projectInfo.packageManager;
      if (pm === "npm") {
        cmd = "npm";
        args = ["run", "build"];
      } else if (pm === "pnpm") {
        cmd = "pnpm";
        args = ["build"];
      } else if (pm === "yarn") {
        cmd = "yarn";
        args = ["build"];
      } else if (pm === "bun") {
        cmd = "bun";
        args = ["run", "build"];
      }
    }

    Logger.info(`Running web build: ${cmd} ${args.join(" ")}`);
    const spinner = Logger.spinner("Building web application...").start();

    try {
      const res = await CommandRunner.run(cmd, args, {
        cwd: rootDir,
        verbose: options.verbose,
        env: {
          // Instruct Next.js and frontend tools to build in export/standalone mode if supported
          NEXT_EXPORT: "true",
          CI: "true",
        },
      });

      if (res.code !== 0) {
        spinner.error({ text: "Web build failed!" });
        throw new Error(
          `Web build command '${cmd} ${args.join(" ")}' exited with code ${res.code}.\n\nOutput:\n${res.stderr || res.stdout}`
        );
      }

      spinner.success({ text: "Web build completed successfully" });
    } catch (err: any) {
      spinner.error({ text: "Web build failed!" });
      throw err;
    }

    // Validate that the output directory exists and contains index.html
    await this.validateOutputDir(outputDir);
    return outputDir;
  }

  /**
   * Validate that web output directory exists and has index.html
   */
  static async validateOutputDir(outputDir: string): Promise<void> {
    if (!(await FileSystem.exists(outputDir))) {
      throw new Error(
        `Web build output directory does not exist: ${outputDir}\n` +
          `Please check your build scripts or specify "webDir" in web2app.config.ts.`
      );
    }

    const indexHtml = path.join(outputDir, "index.html");
    if (!(await FileSystem.exists(indexHtml))) {
      Logger.warn(
        `Warning: No 'index.html' found directly in '${outputDir}'. ` +
          `Make sure your static site generator or Next.js export generates index.html.`
      );
    }
  }
}
