import pc from "picocolors";
import { DoctorChecker } from "../core/doctor-checker.js";
import { Logger } from "../utils/logger.js";

export async function doctorCommand() {
  Logger.banner();
  console.log(` ${pc.cyan("🏥")} ${pc.bold(pc.white("Environment Diagnostics & Toolchains"))}`);
  console.log(pc.gray("    Verifying compilers, SDKs, and platform packaging engines\n"));

  const report = await DoctorChecker.checkAll();

  const lines: string[] = [];
  const fixes: Array<{ name: string; tip: string; msg?: string }> = [];

  for (const item of report.items) {
    const padName = item.name.padEnd(20);
    if (item.status === "ok") {
      const valStr = item.value ? pc.gray(` → ${item.value}`) : "";
      console.log(`   ${pc.green("✔")}  ${pc.bold(pc.white(padName))}${valStr}`);
    } else if (item.status === "warn") {
      const valStr = item.value ? pc.gray(` → ${item.value}`) : "";
      console.log(`   ${pc.yellow("▲")}  ${pc.bold(pc.yellow(padName))}${valStr}`);
      if (item.fixTip) {
        fixes.push({ name: item.name, tip: item.fixTip, msg: item.message });
      }
    } else if (item.status === "fail") {
      const valStr = item.value ? pc.red(` → ${item.value}`) : "";
      console.log(`   ${pc.red("✖")}  ${pc.bold(pc.red(padName))}${valStr}`);
      if (item.fixTip) {
        fixes.push({ name: item.name, tip: item.fixTip, msg: item.message });
      }
    }
  }

  console.log();

  if (fixes.length > 0) {
    const fixLines: string[] = [];
    for (const fix of fixes) {
      fixLines.push(`${pc.bold(pc.yellow(fix.name))}`);
      if (fix.msg) fixLines.push(`  ${pc.gray(fix.msg)}`);
      fixLines.push(`  ${pc.cyan("👉 Action:")} ${pc.white(fix.tip)}`);
      fixLines.push("");
    }
    if (fixLines[fixLines.length - 1] === "") fixLines.pop();

    Logger.card("🛠️ Recommended Environment Fixes", fixLines, {
      borderColor: pc.yellow,
    });
  }

  if (report.passed) {
    if (report.hasWarnings) {
      Logger.warn("Environment is ready for multi-platform builds with minor recommendations.");
    } else {
      Logger.success("All environment checks passed! Ready to build all 4 native targets.");
    }
  } else {
    Logger.error(
      "Some required environment dependencies are missing.",
      "Please review the actions above to enable complete native builds."
    );
  }
}
