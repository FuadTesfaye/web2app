import pc from "picocolors";
import { DoctorChecker } from "../core/doctor-checker.js";
import { Logger } from "../utils/logger.js";

export async function doctorCommand() {
  Logger.banner();
  console.log(pc.bold("🏥 Running web2app Environment Diagnostics...\n"));

  const report = await DoctorChecker.checkAll();

  for (const item of report.items) {
    if (item.status === "ok") {
      const valStr = item.value ? pc.dim(` (${item.value})`) : "";
      console.log(`${pc.green("✔")} ${pc.bold(item.name)}${valStr}`);
    } else if (item.status === "warn") {
      console.log(`${pc.yellow("▲")} ${pc.bold(pc.yellow(item.name))}`);
      if (item.message) console.log(pc.dim(`    ${item.message}`));
      if (item.fixTip) console.log(pc.cyan(`    👉 Fix: ${item.fixTip}`));
    } else if (item.status === "fail") {
      console.log(`${pc.red("✖")} ${pc.bold(pc.red(item.name))}`);
      if (item.value) console.log(pc.dim(`    Detected: ${item.value}`));
      if (item.message) console.log(pc.dim(`    ${item.message}`));
      if (item.fixTip) console.log(pc.cyan(`    👉 Fix: ${item.fixTip}`));
    }
  }

  console.log();
  if (report.passed) {
    if (report.hasWarnings) {
      Logger.warn("Environment is ready for builds, with some optional recommendations.");
    } else {
      Logger.success("All environment checks passed! Ready to build Android applications.");
    }
  } else {
    Logger.error(
      "Some required environment dependencies are missing.",
      "Please resolve the issues above before running Android builds."
    );
  }
}
