import fs from "node:fs/promises";
import path from "node:path";
import { BuildOptions, PlatformBuildResult, Web2AppConfig } from "../../types.js";
import { FileSystem } from "../../utils/filesystem.js";
import { Logger } from "../../utils/logger.js";
import { Paths } from "../../utils/paths.js";

export class WindowsBuilder {
  /**
   * Build Windows application package in app/windows
   */
  static async build(
    userProjectRoot: string,
    webOutputDir: string | null,
    config: Web2AppConfig,
    options: BuildOptions = {}
  ): Promise<PlatformBuildResult> {
    const startTime = Date.now();
    const outputDir = Paths.getWindowsOutputDir(userProjectRoot, options.out);

    if (options.clean && (await FileSystem.exists(outputDir))) {
      await FileSystem.remove(outputDir);
    }
    await FileSystem.ensureDir(outputDir);

    const safeAppName = config.appName.replace(/[^a-zA-Z0-9_-]/g, " ").trim();
    const safePkgName = config.packageName.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const windowWidth = config.windows?.windowWidth || 1280;
    const windowHeight = config.windows?.windowHeight || 800;
    const isUrl = Boolean(config.url);

    const ignored = new Set([
      ".git",
      ".github",
      ".DS_Store",
      ".web2app",
      "app",
      "dist",
      "node_modules",
      "templates",
      "tests",
      "coverage",
    ]);

    // 1. Copy web assets if local
    let targetEntrypoint = config.url || "";
    if (!isUrl && webOutputDir && (await FileSystem.exists(webOutputDir))) {
      const assetsDir = path.join(outputDir, "assets");
      await FileSystem.remove(assetsDir);
      await FileSystem.ensureDir(assetsDir);
      await FileSystem.copyDir(webOutputDir, assetsDir, (filename) => !ignored.has(filename) && !filename.startsWith(".DS_Store"));
      targetEntrypoint = "assets/index.html";
    }


    // 2. Generate launch.bat (Batch Launcher with Edge App mode)
    const launchBatContent = `@echo off
setlocal
title ${config.appName}

set "APP_DIR=%~dp0"
set "APP_TITLE=${config.appName}"
set "USER_DATA=%LOCALAPPDATA%\\${safePkgName}\\data"

if not exist "%USER_DATA%" mkdir "%USER_DATA%"

${
  isUrl
    ? `set "TARGET_URL=${config.url}"`
    : `set "TARGET_URL=file:///%APP_DIR:\\=/%assets/index.html"`
}

REM Look for Microsoft Edge (installed on 100% of modern Windows)
set "EDGE_PATH=%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"
if not exist "%EDGE_PATH%" set "EDGE_PATH=%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"
if not exist "%EDGE_PATH%" set "EDGE_PATH=%LOCALAPPDATA%\\Microsoft\\Edge\\Application\\msedge.exe"

REM Look for Google Chrome fallback
set "CHROME_PATH=%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"
if not exist "%CHROME_PATH%" set "CHROME_PATH=%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"
if not exist "%CHROME_PATH%" set "CHROME_PATH=%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe"

if exist "%EDGE_PATH%" (
    start "" "%EDGE_PATH%" --app="%TARGET_URL%" --user-data-dir="%USER_DATA%" --window-size=${windowWidth},${windowHeight} --app-id=${safePkgName}
    exit /b 0
)

if exist "%CHROME_PATH%" (
    start "" "%CHROME_PATH%" --app="%TARGET_URL%" --user-data-dir="%USER_DATA%" --window-size=${windowWidth},${windowHeight} --app-id=${safePkgName}
    exit /b 0
)

REM Generic fallback: Open default browser
start "" "%TARGET_URL%"
exit /b 0
`;
    await FileSystem.writeFile(path.join(outputDir, "launch.bat"), launchBatContent);

    // 3. Generate launch.ps1 (PowerShell Runner)
    const launchPs1Content = `<#
.SYNOPSIS
    ${config.appName} Desktop Launcher
#>
$ErrorActionPreference = "SilentlyContinue"
$AppDir = $PSScriptRoot
$UserData = "$env:LOCALAPPDATA\\${safePkgName}\\data"
if (!(Test-Path $UserData)) { New-Item -ItemType Directory -Force -Path $UserData | Out-Null }

${
  isUrl
    ? `$TargetUrl = "${config.url}"`
    : `$TargetUrl = "file:///" + ($AppDir -replace "\\\\", "/") + "/assets/index.html"`
}

$EdgePaths = @(
    "\${env:ProgramFiles(x86)}\\Microsoft\\Edge\\Application\\msedge.exe",
    "\${env:ProgramFiles}\\Microsoft\\Edge\\Application\\msedge.exe",
    "\${env:LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe"
)

$FoundExe = $null
foreach ($p in $EdgePaths) {
    if (Test-Path $p) { $FoundExe = $p; break }
}

if ($FoundExe) {
    Start-Process -FilePath $FoundExe -ArgumentList @(
        "--app=$TargetUrl",
        "--user-data-dir=$UserData",
        "--window-size=${windowWidth},${windowHeight}",
        "--app-id=${safePkgName}"
    )
    Exit 0
}

# Fallback: start default browser
Start-Process $TargetUrl
`;
    await FileSystem.writeFile(path.join(outputDir, "launch.ps1"), launchPs1Content);

    // 4. Generate start.vbs (Silent launcher without terminal window)
    const startVbsContent = `' Silent launcher for ${config.appName}
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c """ & WshShell.CurrentDirectory & "\launch.bat""", 0, False
`;
    await FileSystem.writeFile(path.join(outputDir, "start.vbs"), startVbsContent);

    // 5. Generate install.ps1 and install.bat
    const installPs1Content = `<#
.SYNOPSIS
    ${config.appName} Windows Installer / Shortcut Creator
#>
$AppDir = $PSScriptRoot
$WshShell = New-Object -ComObject WScript.Shell

# 1. Start Menu Shortcut
$StartMenuDir = [Environment]::GetFolderPath("Programs")
$ShortcutPath = Join-Path $StartMenuDir "${safeAppName}.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "wscript.exe"
$Shortcut.Arguments = "\`"$AppDir\\start.vbs\`""
$Shortcut.WorkingDirectory = $AppDir
$Shortcut.Description = "${config.appName}"
$Shortcut.Save()

# 2. Desktop Shortcut
$DesktopDir = [Environment]::GetFolderPath("Desktop")
$DesktopShortcutPath = Join-Path $DesktopDir "${safeAppName}.lnk"
$DesktopShortcut = $WshShell.CreateShortcut($DesktopShortcutPath)
$DesktopShortcut.TargetPath = "wscript.exe"
$DesktopShortcut.Arguments = "\`"$AppDir\\start.vbs\`""
$DesktopShortcut.WorkingDirectory = $AppDir
$DesktopShortcut.Description = "${config.appName}"
$DesktopShortcut.Save()

Write-Host "✔ Shortcuts created for ${config.appName} in Start Menu and Desktop!" -ForegroundColor Green
`;
    await FileSystem.writeFile(path.join(outputDir, "install.ps1"), installPs1Content);

    const installBatContent = `@echo off
title Installing ${config.appName}
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
pause
`;
    await FileSystem.writeFile(path.join(outputDir, "install.bat"), installBatContent);

    // 6. Generate uninstall scripts
    const uninstallPs1Content = `<#
.SYNOPSIS
    ${config.appName} Windows Uninstaller
#>
$StartMenuDir = [Environment]::GetFolderPath("Programs")
$StartMenuShortcut = Join-Path $StartMenuDir "${safeAppName}.lnk"
if (Test-Path $StartMenuShortcut) { Remove-Item $StartMenuShortcut -Force }

$DesktopDir = [Environment]::GetFolderPath("Desktop")
$DesktopShortcut = Join-Path $DesktopDir "${safeAppName}.lnk"
if (Test-Path $DesktopShortcut) { Remove-Item $DesktopShortcut -Force }

$UserData = "$env:LOCALAPPDATA\\${safePkgName}"
if (Test-Path $UserData) { Remove-Item $UserData -Recurse -Force }

Write-Host "✔ Uninstalled shortcuts and cache for ${config.appName}." -ForegroundColor Green
`;
    await FileSystem.writeFile(path.join(outputDir, "uninstall.ps1"), uninstallPs1Content);

    const uninstallBatContent = `@echo off
title Uninstalling ${config.appName}
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0uninstall.ps1"
pause
`;
    await FileSystem.writeFile(path.join(outputDir, "uninstall.bat"), uninstallBatContent);

    // 7. Generate app.manifest & package.json metadata
    const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<assembly manifestVersion="1.0" xmlns="urn:schemas-microsoft-com:asm.v1">
  <assemblyIdentity version="${config.version}.0" name="${safePkgName}"/>
  <description>${config.appName}</description>
  <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1">
    <application>
      <!-- Windows 10 and Windows 11 -->
      <supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}"/>
    </application>
  </compatibility>
  <application xmlns="urn:schemas-microsoft-com:asm.v3">
    <windowsSettings>
      <dpiAware xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings">true/pm</dpiAware>
      <dpiAwareness xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">PerMonitorV2</dpiAwareness>
      <longPathAware xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">true</longPathAware>
    </windowsSettings>
  </application>
</assembly>
`;
    await FileSystem.writeFile(path.join(outputDir, "app.manifest"), manifestContent);

    const appConfigJson = {
      name: safeAppName,
      package: safePkgName,
      version: config.version,
      entrypoint: targetEntrypoint,
      window: {
        width: windowWidth,
        height: windowHeight,
        resizable: config.windows?.resizable ?? true,
      },
    };
    await FileSystem.writeJson(path.join(outputDir, "app.config.json"), appConfigJson);

    // Collect files
    const allFiles = await fs.readdir(outputDir);
    const mainArtifact = path.join(outputDir, "launch.bat");
    let totalSize = 0;
    for (const f of allFiles) {
      const stat = await fs.stat(path.join(outputDir, f));
      if (!stat.isDirectory()) totalSize += stat.size;
    }

    const durationMs = Date.now() - startTime;
    return {
      platform: "windows",
      outputDir,
      mainArtifact,
      files: allFiles,
      fileSize: totalSize,
      formattedSize: FileSystem.formatFileSize(totalSize),
      durationMs,
      success: true,
    };
  }
}
