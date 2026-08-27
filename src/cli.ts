import { Command } from "commander";
import { buildCommand } from "./commands/build.js";
import { cleanCommand } from "./commands/clean.js";
import { doctorCommand } from "./commands/doctor.js";
import { initCommand } from "./commands/init.js";
import { openCommand } from "./commands/open.js";
import { runCommand } from "./commands/run.js";
import { skillCommand } from "./commands/skill.js";
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
  .option("--url <url>", "Live web page URL to convert")
  .action(async (options) => {
    try {
      await initCommand({
        appName: options.appName,
        packageName: options.packageName,
        version: options.appVersion,
        url: options.url,
        force: options.force,
        yes: options.yes,
      });
    } catch (err: any) {
      Logger.error("Failed to initialize configuration:", err?.message);
      process.exit(1);
    }
  });

program
  .command("build [platformOrUrl]")
  .description("Build applications for platforms (android, windows, debian, arch, all) or a URL")
  .option("-u, --url <url>", "Convert a live web page URL into apps")
  .option("-r, --release", "Build release APK / package")
  .option("-b, --bundle", "Build Android App Bundle (.aab)")
  .option("--skip-web-build", "Skip web build step and use existing assets")
  .option("-c, --clean", "Clean native wrapper before building")
  .option("-o, --out <dir>", "Custom output directory (default: app)")
  .option("--verbose", "Show detailed build logs")
  .action(async (platformOrUrl = "all", options) => {
    await buildCommand(platformOrUrl, options);
  });

program
  .command("doctor")
  .description("Check local environment dependencies (Node, Java, Android SDK, ADB, packaging tools)")
  .action(async () => {
    await doctorCommand();
  });

program
  .command("clean")
  .description("Clean generated .web2app work directory and app/ build outputs")
  .action(async () => {
    await cleanCommand();
  });

program
  .command("run [platform]")
  .description("Build, install, and launch application on Android device or local system")
  .option("-d, --device <id>", "Target specific ADB device serial")
  .option("-r, --release", "Run release build")
  .option("--verbose", "Show detailed logs")
  .action(async (platform = "android", options) => {
    await runCommand(platform, options);
  });

program
  .command("open [platform]")
  .description("Open generated native project in Android Studio or file explorer")
  .action(async (platform = "android") => {
    await openCommand(platform);
  });

program
  .command("skill")
  .description("Install or export the AI Agent Skill definition (.agents/skills/web2app/SKILL.md)")
  .option("-o, --out <dir>", "Custom output directory (default: .agents/skills/web2app)")
  .option("-f, --force", "Overwrite existing skill file")
  .option("-p, --print", "Print SKILL.md content to standard output")
  .action(async (options) => {
    await skillCommand(options);
  });

// Handle direct invocation like `web2app https://example.com` or `web2app`
const args = process.argv.slice(2);
const knownCommands = ["init", "build", "doctor", "clean", "run", "open", "skill", "-v", "--version", "-h", "--help"];

if (args.length > 0 && !knownCommands.includes(args[0]) && !args[0].startsWith("-")) {
  // Argument is a URL or custom platform/path
  const target = args[0];
  const isUrl = /^https?:\/\//i.test(target);
  await buildCommand(isUrl ? target : "all", isUrl ? { url: target } : {});
} else {
  program.parse(process.argv);

  if (!args.length) {
    Logger.banner();
    program.outputHelp();
  }
}
