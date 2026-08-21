import pc from "picocolors";
import { createSpinner, Spinner } from "nanospinner";

export class Logger {
  private static isVerbose = false;

  static setVerbose(verbose: boolean) {
    this.isVerbose = verbose;
  }

  static banner() {
    console.log();
    console.log(
      pc.bold(pc.cyan("⚡ web2app")) +
        pc.dim(" v0.1.0 — ") +
        pc.gray("Convert web apps into native Android apps")
    );
    console.log();
  }

  static info(message: string) {
    console.log(`${pc.blue("ℹ")} ${message}`);
  }

  static success(message: string) {
    console.log(`${pc.green("✔")} ${pc.bold(message)}`);
  }

  static warn(message: string) {
    console.log(`${pc.yellow("▲")} ${pc.yellow(message)}`);
  }

  static error(message: string, detail?: string) {
    console.error(`${pc.red("✖")} ${pc.red(pc.bold(message))}`);
    if (detail) {
      console.error(pc.dim(`  ${detail}`));
    }
  }

  static debug(message: string) {
    if (this.isVerbose) {
      console.log(`${pc.magenta("⚙")} ${pc.dim(message)}`);
    }
  }

  static step(current: number, total: number, title: string) {
    console.log(
      `\n${pc.cyan(`[${current}/${total}]`)} ${pc.bold(pc.white(title))}`
    );
  }

  static tip(message: string) {
    console.log(`${pc.cyan("💡 Tip:")} ${pc.dim(message)}`);
  }

  static box(title: string, lines: string[]) {
    const maxLen = Math.max(
      title.length,
      ...lines.map((l) => l.replace(/\u001b\[\d+m/g, "").length)
    );
    const border = "─".repeat(maxLen + 4);
    console.log(pc.dim(`┌${border}┐`));
    console.log(pc.dim(`│  `) + pc.bold(title) + " ".repeat(maxLen - title.length) + pc.dim(`  │`));
    console.log(pc.dim(`├${border}┤`));
    for (const line of lines) {
      const plainLen = line.replace(/\u001b\[\d+m/g, "").length;
      const padding = " ".repeat(Math.max(0, maxLen - plainLen));
      console.log(pc.dim(`│  `) + line + padding + pc.dim(`  │`));
    }
    console.log(pc.dim(`└${border}┘`));
  }

  static spinner(title: string): Spinner {
    return createSpinner(title);
  }
}
