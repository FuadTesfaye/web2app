import { z } from "zod";
import {
  DEFAULT_ANDROID_COMPILE_SDK,
  DEFAULT_ANDROID_MIN_SDK,
  DEFAULT_ANDROID_TARGET_SDK,
  DEFAULT_APP_NAME,
  DEFAULT_PACKAGE_NAME,
  DEFAULT_VERSION,
  DEFAULT_VERSION_CODE,
} from "./constants.js";

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
  icon: z.string().optional(),
  webDir: z.string().optional(),
  buildCommand: z.string().optional(),
  android: AndroidConfigSchema.default({}),
});

export type Web2AppConfig = z.infer<typeof Web2AppConfigSchema>;
export type Web2AppUserConfig = z.input<typeof Web2AppConfigSchema>;

/**
 * Supported web frameworks
 */
export type WebFramework = "nextjs" | "vite" | "cra" | "static" | "unknown";

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
}

/**
 * Diagnostic check status and results
 */
export type CheckStatus = "ok" | "warn" | "fail";

export interface DiagnosticItem {
  id: string;
  category: "node" | "java" | "android" | "project" | "device";
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
  platform?: "android";
  release?: boolean;
  bundle?: boolean;
  skipWebBuild?: boolean;
  clean?: boolean;
  verbose?: boolean;
  out?: string;
}

/**
 * Run CLI options
 */
export interface RunOptions {
  platform?: "android";
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
  force?: boolean;
  yes?: boolean;
}
