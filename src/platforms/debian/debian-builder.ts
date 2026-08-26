import fs from "node:fs/promises";
import path from "node:path";
import { BuildOptions, PlatformBuildResult, Web2AppConfig } from "../../types.js";
import { DebPackager } from "../../utils/deb-packager.js";
import { FileSystem } from "../../utils/filesystem.js";
import { Logger } from "../../utils/logger.js";
import { Paths } from "../../utils/paths.js";

export class DebianBuilder {
  /**
   * Build Debian package in app/debian
   */
  static async build(
    userProjectRoot: string,
    webOutputDir: string | null,
    config: Web2AppConfig,
    options: BuildOptions = {}
  ): Promise<PlatformBuildResult> {
    const startTime = Date.now();
    const outputDir = Paths.getDebianOutputDir(userProjectRoot, options.out);

    if (options.clean && (await FileSystem.exists(outputDir))) {
      await FileSystem.remove(outputDir);
    }
    await FileSystem.ensureDir(outputDir);

    const safePkgName = config.packageName
      .toLowerCase()
      .replace(/[^a-z0-9+.-]/g, "-")
      .replace(/^[^a-z0-9]+/, "")
      .replace(/[^a-z0-9]+$/, "") || "web2app-app";
    const appVersion = config.version || "1.0.0";
    const appName = config.appName;
    const isUrl = Boolean(config.url);

    // Package staging tree inside app/debian/staging
    const stagingDir = path.join(outputDir, "pkg-source");
    await FileSystem.remove(stagingDir);
    await FileSystem.ensureDir(stagingDir);

    // 1. DEBIAN/control
    const controlDir = path.join(stagingDir, "DEBIAN");
    await FileSystem.ensureDir(controlDir);

    const debSection = config.debian?.section || "web";
    const debPriority = config.debian?.priority || "optional";
    const debArch = config.debian?.architecture || "all";
    const debMaintainer = config.debian?.maintainer || "web2app <web2app@localhost>";
    const debDesc = config.debian?.description || `${appName} - Web application packaged by web2app`;
    const debDepends = (config.debian?.depends || ["bash", "xdg-utils"]).join(", ");

    const controlContent = `Package: ${safePkgName}
Version: ${appVersion}
Section: ${debSection}
Priority: ${debPriority}
Architecture: ${debArch}
Maintainer: ${debMaintainer}
Depends: ${debDepends}
Description: ${debDesc}
`;
    await FileSystem.writeFile(path.join(controlDir, "control"), controlContent);

    // 2. DEBIAN/postinst & postrm
    const postinstContent = `#!/bin/sh
set -e
if [ -x /usr/bin/update-desktop-database ]; then
    update-desktop-database -q || true
fi
if [ -x /usr/bin/gtk-update-icon-cache ]; then
    gtk-update-icon-cache -q /usr/share/icons/hicolor || true
fi
chmod 755 /usr/bin/${safePkgName} || true
exit 0
`;
    await FileSystem.writeFile(path.join(controlDir, "postinst"), postinstContent);

    const postrmContent = `#!/bin/sh
set -e
if [ -x /usr/bin/update-desktop-database ]; then
    update-desktop-database -q || true
fi
if [ -x /usr/bin/gtk-update-icon-cache ]; then
    gtk-update-icon-cache -q /usr/share/icons/hicolor || true
fi
exit 0
`;
    await FileSystem.writeFile(path.join(controlDir, "postrm"), postrmContent);

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

    // 3. usr/share/<pkgname>/assets
    const shareAppDir = path.join(stagingDir, "usr", "share", safePkgName);
    await FileSystem.ensureDir(shareAppDir);

    if (!isUrl && webOutputDir && (await FileSystem.exists(webOutputDir))) {
      const assetsDir = path.join(shareAppDir, "assets");
      await FileSystem.ensureDir(assetsDir);
      await FileSystem.copyDir(webOutputDir, assetsDir, (filename) => !ignored.has(filename) && !filename.startsWith(".DS_Store"));
    }


    // 4. usr/bin/<pkgname> (Launcher script)
    const binDir = path.join(stagingDir, "usr", "bin");
    await FileSystem.ensureDir(binDir);

    const launcherPath = path.join(binDir, safePkgName);
    const launcherScript = `#!/usr/bin/env bash
set -e

APP_NAME="${appName}"
APP_ID="${safePkgName}"
USER_DATA_DIR="\${XDG_CONFIG_HOME:-$HOME/.config}/$APP_ID"
mkdir -p "$USER_DATA_DIR"

${
  isUrl
    ? `TARGET_URL="${config.url}"`
    : `TARGET_URL="file:///usr/share/$APP_ID/assets/index.html"`
}

# Supported browsers in order of preference
BROWSERS=(
    "google-chrome"
    "google-chrome-stable"
    "chromium"
    "chromium-browser"
    "brave-browser"
    "microsoft-edge"
    "microsoft-edge-stable"
    "vivaldi"
)

for BROWSER in "\${BROWSERS[@]}"; do
    if command -v "$BROWSER" >/dev/null 2>&1; then
        exec "$BROWSER" --app="$TARGET_URL" --user-data-dir="$USER_DATA_DIR" --class="$APP_ID" "$@"
    fi
done

# Fallback to firefox or xdg-open
if command -v firefox >/dev/null 2>&1; then
    exec firefox --new-window "$TARGET_URL" "$@"
fi

exec xdg-open "$TARGET_URL"
`;
    await FileSystem.writeFile(launcherPath, launcherScript);
    if (process.platform !== "win32") {
      try {
        await fs.chmod(launcherPath, 0o755);
      } catch {}
    }

    // 5. usr/share/applications/<pkgname>.desktop
    const desktopDir = path.join(stagingDir, "usr", "share", "applications");
    await FileSystem.ensureDir(desktopDir);

    const desktopCategories = (config.debian?.categories || ["Network", "Application"]).join(";") + ";";
    const desktopContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=${appName}
Comment=${debDesc}
Exec=/usr/bin/${safePkgName} %U
Icon=${safePkgName}
Terminal=false
StartupWMClass=${safePkgName}
Categories=${desktopCategories}
`;
    await FileSystem.writeFile(path.join(desktopDir, `${safePkgName}.desktop`), desktopContent);

    // 6. usr/share/icons/hicolor/scalable/apps/<pkgname>.svg (Default Icon)
    const iconDir = path.join(stagingDir, "usr", "share", "icons", "hicolor", "scalable", "apps");
    await FileSystem.ensureDir(iconDir);
    const defaultSvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="28" fill="#3B82F6"/>
  <circle cx="64" cy="64" r="42" fill="#FFFFFF" fill-opacity="0.2"/>
  <path d="M44 48 L84 48 L84 56 L68 56 L68 88 L60 88 L60 56 L44 56 Z" fill="#FFFFFF"/>
</svg>`;
    await FileSystem.writeFile(path.join(iconDir, `${safePkgName}.svg`), defaultSvgIcon);

    // 7. Package into .deb file in app/debian
    const debFileName = `${safePkgName}_${appVersion}_${debArch}.deb`;
    const targetDebPath = path.join(outputDir, debFileName);

    Logger.info(`Building Debian package (${debFileName})...`);
    await DebPackager.createDeb(stagingDir, targetDebPath);

    const stat = await fs.stat(targetDebPath);
    const durationMs = Date.now() - startTime;
    const allFiles = await fs.readdir(outputDir);

    return {
      platform: "debian",
      outputDir,
      mainArtifact: targetDebPath,
      files: allFiles,
      fileSize: stat.size,
      formattedSize: FileSystem.formatFileSize(stat.size),
      durationMs,
      success: true,
    };
  }
}
