import { AndroidBuilder } from "../platforms/android/android-builder.js";
import { BuildOptions } from "../types.js";
import { Logger } from "../utils/logger.js";

export async function buildCommand(
  platform: string = "android",
  options: BuildOptions = {}
) {
  const normalizedPlatform = (platform || "android").toLowerCase();

  if (normalizedPlatform !== "android") {
    Logger.error(
      `Unsupported platform: "${platform}".`,
      `Currently only "android" is supported in web2app v0.1.0.`
    );
    process.exit(1);
  }

  try {
    await AndroidBuilder.build(process.cwd(), {
      ...options,
      platform: "android",
    });
  } catch (err: any) {
    Logger.error("Build failed!", err?.message || String(err));
    if (options.verbose && err?.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}
