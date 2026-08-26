import { z } from "zod";
import {
  DEFAULT_ANDROID_COMPILE_SDK,
  DEFAULT_ANDROID_MIN_SDK,
  DEFAULT_ANDROID_TARGET_SDK,
  DEFAULT_APP_NAME,
  DEFAULT_PACKAGE_NAME,
  DEFAULT_VERSION,
  DEFAULT_VERSION_CODE,
  SUPPORTED_PLATFORMS,
} from "./constants.js";

export type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number] | "all";

/**
 * Android-specific configuration schema
 */
export const AndroidConfigSchema = z.object({
  minSdk: z.number().int().min(21).max(36).default(DEFAULT_ANDROID_MIN_SDK),
  targetSdk: z.number().int().min(24).max(36).default(DEFAULT_ANDROID_TARGET_SDK),
  compileSdk: z.number().int().min(24).max(36).default(DEFAULT_ANDROID_COMPILE_SDK),
  orientation: z.enum(["portrait", "landscape", "unspecified", "sensor"]).default("unspecified"),
  permissions: z.array(z.string()).default([]),
  keystore: z
    .object({
      path: z.string(),
      alias: z.string(),
      storePassword: z.string().optional(),
      keyPassword: z.string().optional(),
    })
    .optional(),
  splashColor: z.string().default("#FFFFFF"),
  backgroundColor: z.string().default("#FFFFFF"),
});

export type AndroidConfig = z.infer<typeof AndroidConfigSchema>;

/**
 * Windows-specific configuration schema
 */
export const WindowsConfigSchema = z.object({
  windowWidth: z.number().int().positive().default(1280),
  windowHeight: z.number().int().positive().default(800),
  fullscreen: z.boolean().default(false),
  resizable: z.boolean().default(true),
  title: z.string().optional(),
  icon: z.string().optional(),
});

export type WindowsConfig = z.infer<typeof WindowsConfigSchema>;

/**
 * Debian-specific configuration schema
 */
export const DebianConfigSchema = z.object({
  section: z.string().default("web"),
  priority: z.string().default("optional"),
  architecture: z.string().default("all"),
  maintainer: z.string().default("web2app <web2app@localhost>"),
  description: z.string().default("Application packaged with web2app"),
  depends: z.array(z.string()).default(["bash", "xdg-utils"]),
  categories: z.array(z.string()).default(["Network", "Application"]),
  icon: z.string().optional(),
});

export type DebianConfig = z.infer<typeof DebianConfigSchema>;

/**
 * Arch Linux configuration schema
 */
export const ArchConfigSchema = z.object({
  pkgdesc: z.string().default("Application packaged with web2app"),
  arch: z.array(z.string()).default(["any"]),
  license: z.array(z.string()).default(["MIT"]),
  depends: z.array(z.string()).default(["bash", "xdg-utils"]),
  categories: z.array(z.string()).default(["Network", "Application"]),
  icon: z.string().optional(),
});

export type ArchConfig = z.infer<typeof ArchConfigSchema>;

/**
 * Root web2app configuration schema
 */
export const Web2AppConfigSchema = z.object({
  appName: z.string().min(1).default(DEFAULT_APP_NAME),
  packageName: z
    .string()
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/,
      "Invalid package name format. Must be like com.example.myapp"
    )
    .default(DEFAULT_PACKAGE_NAME),
  version: z.string().default(DEFAULT_VERSION),
  versionCode: z.number().int().min(1).default(DEFAULT_VERSION_CODE),
  url: z.string().url().optional(),
  icon: z.string().optional(),
  webDir: z.string().optional(),
  buildCommand: z.string().optional(),
  platforms: z
    .array(z.enum(["android", "windows", "debian", "arch", "all"]))
    .default(["android", "windows", "debian", "arch"]),
  android: AndroidConfigSchema.default({}),
  windows: WindowsConfigSchema.default({}),
  debian: DebianConfigSchema.default({}),
  arch: ArchConfigSchema.default({}),
});

export type Web2AppConfig = z.infer<typeof Web2AppConfigSchema>;
export type Web2AppUserConfig = z.input<typeof Web2AppConfigSchema>;

/**
 * Supported web frameworks
 */
export type WebFramework = "nextjs" | "vite" | "cra" | "static" | "url" | "unknown";

/**
 * Supported package managers
 */
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

/**
 * Detected project metadata
 */
export interface ProjectInfo {
  rootDir: string;
  framework: WebFramework;
  frameworkVersion?: string;
  packageManager: PackageManager;
  packageName?: string;
  appName?: string;
  version?: string;
  hasPackageJson: boolean;
  hasBuildScript: boolean;
  webOutputDir: string;
  nextConfigPath?: string;
  hasNextExportConfig?: boolean;
  url?: string;
}

/**
 * Diagnostic check status and results
 */
export type CheckStatus = "ok" | "warn" | "fail";

export interface DiagnosticItem {
  id: string;
  category: "node" | "java" | "android" | "linux" | "windows" | "project" | "device";
  name: string;
  status: CheckStatus;
  value?: string;
  message?: string;
  fixTip?: string;
}

export interface DoctorReport {
  items: DiagnosticItem[];
  passed: boolean;
  hasWarnings: boolean;
}

/**
 * Build CLI options
 */
export interface BuildOptions {
  platform?: string; // "all", "android", "windows", "debian", "arch" or comma-separated
  url?: string;
  release?: boolean;
  bundle?: boolean;
  skipWebBuild?: boolean;
  clean?: boolean;
  verbose?: boolean;
  out?: string;
}

/**
 * Platform build outcome
 */
export interface PlatformBuildResult {
  platform: string;
  outputDir: string;
  mainArtifact?: string;
  files: string[];
  fileSize?: number;
  formattedSize?: string;
  durationMs: number;
  success: boolean;
  error?: string;
}

export interface MultiPlatformBuildResult {
  appDir: string;
  results: Record<string, PlatformBuildResult>;
  durationMs: number;
}

/**
 * Run CLI options
 */
export interface RunOptions {
  platform?: string;
  device?: string;
  release?: boolean;
  verbose?: boolean;
}

/**
 * Init CLI options
 */
export interface InitOptions {
  appName?: string;
  packageName?: string;
  version?: string;
  url?: string;
  force?: boolean;
  yes?: boolean;
}

