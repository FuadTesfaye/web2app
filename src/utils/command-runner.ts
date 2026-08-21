import { spawn, SpawnOptions } from "node:child_process";
import { Logger } from "./logger.js";

export interface CommandResult {
  stdout: string;
  stderr: string;
  code: number;
}

export interface RunCommandOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  silent?: boolean;
  verbose?: boolean;
  onStdout?: (data: string) => void;
  onStderr?: (data: string) => void;
}

export class CommandRunner {
  /**
   * Execute a command and return stdout/stderr/code
   */
  static async run(
    command: string,
    args: string[] = [],
    options: RunCommandOptions = {}
  ): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
      const spawnOptions: SpawnOptions = {
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...options.env },
        stdio: ["ignore", "pipe", "pipe"],
      };

      Logger.debug(`Executing: ${command} ${args.join(" ")} in ${options.cwd || process.cwd()}`);

      const child = spawn(command, args, spawnOptions);
      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        stdout += text;
        if (options.onStdout) {
          options.onStdout(text);
        }
        if (options.verbose) {
          process.stdout.write(text);
        }
      });

      child.stderr?.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        stderr += text;
        if (options.onStderr) {
          options.onStderr(text);
        }
        if (options.verbose) {
          process.stderr.write(text);
        }
      });

      child.on("error", (error) => {
        reject(error);
      });

      child.on("close", (code) => {
        const exitCode = code ?? 0;
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          code: exitCode,
        });
      });
    });
  }

  /**
   * Check if a command is available on the system PATH
   */
  static async which(binaryName: string): Promise<string | null> {
    try {
      const isWindows = process.platform === "win32";
      const cmd = isWindows ? "where" : "which";
      const res = await this.run(cmd, [binaryName]);
      if (res.code === 0 && res.stdout.length > 0) {
        return res.stdout.split("\n")[0].trim();
      }
      return null;
    } catch {
      return null;
    }
  }
}
