import path from "node:path";
import { ConfigLoader } from "../core/config-loader.js";
import { DoctorChecker } from "../core/doctor-checker.js";
import { AndroidBuilder } from "../platforms/android/android-builder.js";
import { RunOptions } from "../types.js";
import { CommandRunner } from "../utils/command-runner.js";
import { FileSystem } from "../utils/filesystem.js";
import { Logger } from "../utils/logger.js";
import { Paths } from "../utils/paths.js";

export async function runCommand(
  platform: string = "android",
  options: RunOptions = {}
) {
  const normalizedPlatform = (platform || "android").toLowerCase();
  if (normalizedPlatform !== "android") {
    Logger.error(`Platform "${platform}" not supported. Use "android".`);
    process.exit(1);
  }

  Logger.setVerbose(Boolean(options.verbose));
  Logger.banner();
  const rootDir = process.cwd();

  // 1. Locate ADB
  const sdkPath = await DoctorChecker.findAndroidSdkPath();
  let adbBin = await CommandRunner.which("adb");
  if (!adbBin && sdkPath) {
    const candidate = path.join(
      sdkPath,
      "platform-tools",
      process.platform === "win32" ? "adb.exe" : "adb"
    );
    if (await FileSystem.exists(candidate)) {
      adbBin = candidate;
    }
  }

  if (!adbBin) {
    Logger.error(
      "ADB (Android Debug Bridge) not found.",
      "Please ensure Android SDK platform-tools are installed and added to PATH."
    );
    process.exit(1);
  }

  // 2. Check connected devices
  const devicesRes = await CommandRunner.run(adbBin, ["devices"]);
  const lines = devicesRes.stdout
    .split("\n")
    .slice(1)
    .map((l) => l.trim())
    .filter(Boolean);
  const connectedDevices = lines
    .filter((l) => l.includes("\tdevice"))
    .map((l) => l.split("\t")[0]);

  if (connectedDevices.length === 0) {
    Logger.error(
      "No active Android devices or running emulators found.",
      "Start an Android emulator in Android Studio or connect a physical device via USB with USB Debugging enabled."
    );
    process.exit(1);
  }

  const targetDevice = options.device || connectedDevices[0];
  Logger.info(`Target device: ${targetDevice}`);

  // 3. Build APK
  Logger.info("Building application...");
  const config = await ConfigLoader.load(rootDir);
  const buildResult = await AndroidBuilder.build(rootDir, {
    verbose: options.verbose,
    release: options.release,
  });

  const apkPath = buildResult.apkPath;

  // 4. Install APK onto device
  const installSpinner = Logger.spinner(`Installing APK onto ${targetDevice}...`).start();
  const installArgs = ["-s", targetDevice, "install", "-r", apkPath];
  const installRes = await CommandRunner.run(adbBin, installArgs);

  if (installRes.code !== 0 || !installRes.stdout.includes("Success")) {
    installSpinner.error({ text: "Installation failed!" });
    Logger.error("Failed to install APK:", installRes.stderr || installRes.stdout);
    process.exit(1);
  }
  installSpinner.success({ text: "APK installed successfully" });

  // 5. Launch application
  const launchSpinner = Logger.spinner(`Launching ${config.appName}...`).start();
  const launchArgs = [
    "-s",
    targetDevice,
    "shell",
    "monkey",
    "-p",
    config.packageName,
    "-c",
    "android.intent.category.LAUNCHER",
    "1",
  ];
  const launchRes = await CommandRunner.run(adbBin, launchArgs);

  if (launchRes.code !== 0) {
    launchSpinner.error({ text: "Failed to launch application!" });
    Logger.warn(
      `Could not automatically launch app. Please open "${config.appName}" manually on your device.`
    );
  } else {
    launchSpinner.success({ text: `Application "${config.appName}" is now running on ${targetDevice}!` });
  }
}
