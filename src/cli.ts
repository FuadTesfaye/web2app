import { Command } from "commander";
import { buildCommand } from "./commands/build.js";
import { cleanCommand } from "./commands/clean.js";
import { doctorCommand } from "./commands/doctor.js";
import { initCommand } from "./commands/init.js";
import { openCommand } from "./commands/open.js";
import { runCommand } from "./commands/run.js";
import { CLI_DESCRIPTION, CLI_NAME, CLI_VERSION } from "./constants.js";
import { Logger } from "./utils/logger.js";

const program = new Command();

program
  .name(CLI_NAME)
  .version(CLI_VERSION, "-v, --version", "Output the current version of web2app")
  .description(CLI_DESCRIPTION);

program
  .command("init")
  .description("Initialize web2app configuration in the current project")
  .option("-y, --yes", "Skip interactive prompts and use defaults")
  .option("-f, --force", "Overwrite existing configuration file")
  .option("--app-name <name>", "Application display name")
  .option("--package-name <id>", "Android package ID (e.g. com.example.myapp)")
  .option("--app-version <ver>", "Application version string")
  .action(async (options) => {
    try {
      await initCommand({
        appName: options.appName,
        packageName: options.packageName,
        version: options.appVersion,
        force: options.force,
        yes: options.yes,
      });
    } catch (err: any) {
      Logger.error("Failed to initialize configuration:", err?.message);
      process.exit(1);
    }
  });

program
  .command("build [platform]")
  .description("Build native application (default: android)")
  .option("-r, --release", "Build release APK instead of debug APK")
  .option("-b, --bundle", "Build Android App Bundle (.aab)")
  .option("--skip-web-build", "Skip web build step and use existing assets")
  .option("-c, --clean", "Clean native wrapper before building")
  .option("-o, --out <dir>", "Custom output directory for generated APK")
  .option("--verbose", "Show detailed build logs")
  .action(async (platform = "android", options) => {
    await buildCommand(platform, options);
  });

program
  .command("doctor")
  .description("Check local environment dependencies (Node, Java, Android SDK, ADB)")
  .action(async () => {
    await doctorCommand();
  });

program
  .command("clean")
  .description("Clean generated .web2app work directory and build outputs")
  .action(async () => {
    await cleanCommand();
  });

program
  .command("run [platform]")
  .description("Build, install, and launch application on connected Android device or emulator")
  .option("-d, --device <id>", "Target specific ADB device serial")
  .option("-r, --release", "Run release build")
  .option("--verbose", "Show detailed logs")
  .action(async (platform = "android", options) => {
    await runCommand(platform, options);
  });

program
  .command("open [platform]")
  .description("Open generated native project in Android Studio")
  .action(async (platform = "android") => {
    await openCommand(platform);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  Logger.banner();
  program.outputHelp();
}
