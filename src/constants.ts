export const CLI_NAME = "web2app";
export const CLI_VERSION = "0.1.0";
export const CLI_DESCRIPTION = "Transform web apps into high-performance native Android apps";

export const CONFIG_FILE_NAMES = [
  "web2app.config.ts",
  "web2app.config.js",
  "web2app.config.mjs",
  "web2app.config.cjs",
  "web2app.config.json",
] as const;

export const DEFAULT_APP_NAME = "My Web App";
export const DEFAULT_PACKAGE_NAME = "com.web2app.app";
export const DEFAULT_VERSION = "1.0.0";
export const DEFAULT_VERSION_CODE = 1;

export const DEFAULT_ANDROID_MIN_SDK = 24; // Android 7.0+ (95%+ device coverage)
export const DEFAULT_ANDROID_TARGET_SDK = 35; // Android 15
export const DEFAULT_ANDROID_COMPILE_SDK = 35;

export const ANDROID_PACKAGE_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;

export const WEB2APP_DIR = ".web2app";
export const ANDROID_DIR_NAME = "android";
export const DIST_DIR = "dist";
export const ANDROID_DIST_DIR = "dist/android";
export const ANDROID_ASSETS_WEB_DIR = "app/src/main/assets/web";
