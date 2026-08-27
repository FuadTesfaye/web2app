import pc from "picocolors";
import { createSpinner, Spinner } from "nanospinner";

export class Logger {
  private static isVerbose = false;

  static setVerbose(verbose: boolean) {
    this.isVerbose = verbose;
  }

  static get stripAnsi() {
    return (str: string) => str.replace(/\u001b\[\d+m/g, "");
  }

  /**
   * Hero CLI ASCII art banner with calm modern styling
   */
  static banner(compact: boolean = false) {
    console.log();
    if (!compact) {
      const line1 = pc.cyan(" ╦ ╦╔═╗╔╗ ┌─┐╔═╗╔═╗╔═╗");
      const line2 = pc.cyan(" ║║║║╣ ╠╩╗┌─╝╠═╣╠═╝╠═╝");
      const line3 = pc.blue(" ╚╩╝╚═╝╚═╝└─┘╩ ╩╩  ╩  ");

      console.log(line1);
      console.log(line2);
      console.log(line3);
      console.log();
    }

    console.log(
      ` ${pc.cyan("⚡")} ${pc.bold(pc.white("web2app"))} ${pc.gray("v0.1.0")} ${pc.dim("•")} ${pc.dim("Native Multi-Platform Compiler")}`
    );
    console.log(
      `   ${pc.gray("Android")} ${pc.dim("•")} ${pc.gray("Windows Desktop")} ${pc.dim("•")} ${pc.gray("Debian/Ubuntu")} ${pc.dim("•")} ${pc.gray("Arch Linux")}`
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

  static step(current: number, total: number, title: string, extra?: string) {
    const stepTag = pc.cyan(`◆ [${current}/${total}]`);
    const extraStr = extra ? pc.dim(` (${extra})`) : "";
    console.log(`\n${stepTag} ${pc.bold(pc.white(title))}${extraStr}`);
  }

  static tip(message: string) {
    console.log(`${pc.cyan("💡 Tip:")} ${pc.dim(message)}`);
  }

  static kv(key: string, value: string, pad: number = 14) {
    console.log(`   ${pc.dim(key.padEnd(pad))} ${pc.white(value)}`);
  }

  static badge(type: "pass" | "warn" | "fail" | "info" | "tip" | "new", text?: string): string {
    switch (type) {
      case "pass":
        return pc.green(`✔ ${text || "PASS"}`);
      case "warn":
        return pc.yellow(`▲ ${text || "WARN"}`);
      case "fail":
        return pc.red(`✖ ${text || "FAIL"}`);
      case "info":
        return pc.blue(`ℹ ${text || "INFO"}`);
      case "tip":
        return pc.cyan(`💡 ${text || "TIP"}`);
      case "new":
        return pc.cyan(`★ ${text || "NEW"}`);
    }
  }

  static platformIcon(platform: string): string {
    switch (platform.toLowerCase()) {
      case "android":
        return "📱";
      case "windows":
        return "🪟";
      case "debian":
        return "🐧";
      case "arch":
        return "🏹";
      default:
        return "📦";
    }
  }

  /**
   * Render a sleek rounded card with title and content lines
   */
  static card(title: string, lines: string[], options: { borderColor?: (s: string) => string } = {}) {
    const color = options.borderColor || pc.gray;
    const strip = (s: string) => s.replace(/\u001b\[\d+m/g, "");

    const plainTitle = strip(title);
    const maxLineLen = Math.max(
      plainTitle.length + 4,
      ...lines.map((l) => strip(l).length)
    );

    const innerWidth = Math.max(maxLineLen, 48);

    const topBorder = color(`╭─ `) + pc.bold(title) + color(` ${"─".repeat(Math.max(0, innerWidth - plainTitle.length - 2))}╮`);
    const divider = color(`├${"─".repeat(innerWidth + 2)}┤`);
    const bottomBorder = color(`╰${"─".repeat(innerWidth + 2)}╯`);

    console.log();
    console.log(topBorder);
    for (const line of lines) {
      if (line === "---") {
        console.log(divider);
        continue;
      }
      const plainLen = strip(line).length;
      const padding = " ".repeat(Math.max(0, innerWidth - plainLen));
      console.log(`${color("│")}  ${line}${padding}  ${color("│")}`);
    }
    console.log(bottomBorder);
    console.log();
  }

  /**
   * Backwards compatible box method
   */
  static box(title: string, lines: string[]) {
    this.card(title, lines);
  }

  static spinner(title: string): Spinner {
    return createSpinner(title);
  }
}
