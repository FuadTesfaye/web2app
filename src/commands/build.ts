import { MultiPlatformBuilder } from "../platforms/multi-platform-builder.js";
import { BuildOptions } from "../types.js";
import { Logger } from "../utils/logger.js";

export async function buildCommand(
  platformOrUrl?: string,
  options: BuildOptions = {}
) {
  let targetPlatform = options.platform || platformOrUrl || "all";
  let targetUrl = options.url;

  // Check if first argument is a URL
  if (platformOrUrl && /^https?:\/\//i.test(platformOrUrl)) {
    targetUrl = platformOrUrl;
    targetPlatform = "all";
  }

  const validPlatforms = ["all", "android", "windows", "debian", "arch"];
  const requestedPlatforms = targetPlatform.split(",").map((p) => p.trim().toLowerCase());
  const hasInvalid = requestedPlatforms.some((p) => !validPlatforms.includes(p));

  if (hasInvalid && !targetUrl) {
    Logger.error(
      `Unsupported platform in "${targetPlatform}".`,
      `Supported platforms: "all", "android", "windows", "debian", "arch" (or comma-separated).`
    );
    process.exit(1);
  }

  try {
    await MultiPlatformBuilder.build(process.cwd(), {
      ...options,
      platform: targetPlatform,
      url: targetUrl,
    });
  } catch (err: any) {
    Logger.error("Build failed!", err?.message || String(err));
    if (options.verbose && err?.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}
