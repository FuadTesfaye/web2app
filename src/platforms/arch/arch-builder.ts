import fs from "node:fs/promises";
import path from "node:path";
import { BuildOptions, PlatformBuildResult, Web2AppConfig } from "../../types.js";
import { CommandRunner } from "../../utils/command-runner.js";
import { FileSystem } from "../../utils/filesystem.js";
import { Logger } from "../../utils/logger.js";
import { Paths } from "../../utils/paths.js";

export class ArchBuilder {
  /**
   * Build Arch Linux package directory in app/arch
   */
  static async build(
    userProjectRoot: string,
    webOutputDir: string | null,
    config: Web2AppConfig,
    options: BuildOptions = {}
  ): Promise<PlatformBuildResult> {
    const startTime = Date.now();
    const outputDir = Paths.getArchOutputDir(userProjectRoot, options.out);

    if (options.clean && (await FileSystem.exists(outputDir))) {
      await FileSystem.remove(outputDir);
    }
    await FileSystem.ensureDir(outputDir);

    const safePkgName = config.packageName
      .toLowerCase()
      .replace(/[^a-z0-9+.-]/g, "-")
      .replace(/^[^a-z0-9]+/, "")
      .replace(/[^a-z0-9]+$/, "") || "web2app-app";
    // Arch package versions cannot have hyphens
    const appVersion = (config.version || "1.0.0").replace(/-/g, ".");
    const appName = config.appName;
    const isUrl = Boolean(config.url);
    const pkgDesc = config.arch?.pkgdesc || `${appName} - Web application packaged by web2app`;
    const archList = (config.arch?.arch || ["any"]).map((a) => `'${a}'`).join(" ");
    const licenseList = (config.arch?.license || ["MIT"]).map((l) => `'${l}'`).join(" ");
    const dependsList = (config.arch?.depends || ["bash", "xdg-utils"]).map((d) => `'${d}'`).join(" ");

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
    if (!isUrl && webOutputDir && (await FileSystem.exists(webOutputDir))) {
      const assetsDir = path.join(outputDir, "assets");
      await FileSystem.remove(assetsDir);
      await FileSystem.ensureDir(assetsDir);
      await FileSystem.copyDir(webOutputDir, assetsDir, (filename) => !ignored.has(filename) && !filename.startsWith(".DS_Store"));
    }


    // 2. Generate launcher script
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

BROWSERS=(
    "google-chrome"
    "google-chrome-stable"
    "chromium"
    "chromium-browser"
    "brave"
    "brave-browser"
    "microsoft-edge-stable"
    "vivaldi"
)

for BROWSER in "\${BROWSERS[@]}"; do
    if command -v "$BROWSER" >/dev/null 2>&1; then
        exec "$BROWSER" --app="$TARGET_URL" --user-data-dir="$USER_DATA_DIR" --class="$APP_ID" "$@"
    fi
done

if command -v firefox >/dev/null 2>&1; then
    exec firefox --new-window "$TARGET_URL" "$@"
fi

exec xdg-open "$TARGET_URL"
`;
    const launcherPath = path.join(outputDir, safePkgName);
    await FileSystem.writeFile(launcherPath, launcherScript);
    if (process.platform !== "win32") {
      try {
        await fs.chmod(launcherPath, 0o755);
      } catch {}
    }

    // 3. Generate .desktop file
    const desktopCategories = (config.arch?.categories || ["Network", "Application"]).join(";") + ";";
    const desktopContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=${appName}
Comment=${pkgDesc}
Exec=/usr/bin/${safePkgName} %U
Icon=${safePkgName}
Terminal=false
StartupWMClass=${safePkgName}
Categories=${desktopCategories}
`;
    await FileSystem.writeFile(path.join(outputDir, `${safePkgName}.desktop`), desktopContent);

    // 4. Generate SVG Icon
    const defaultSvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="28" fill="#0EA5E9"/>
  <circle cx="64" cy="64" r="42" fill="#FFFFFF" fill-opacity="0.2"/>
  <path d="M44 48 L84 48 L84 56 L68 56 L68 88 L60 88 L60 56 L44 56 Z" fill="#FFFFFF"/>
</svg>`;
    await FileSystem.writeFile(path.join(outputDir, `${safePkgName}.svg`), defaultSvgIcon);

    // 5. Generate PKGBUILD
    const pkgbuildContent = `# Maintainer: web2app <web2app@localhost>
pkgname='${safePkgName}'
pkgver=${appVersion}
pkgrel=1
pkgdesc="${pkgDesc}"
arch=(${archList})
license=(${licenseList})
depends=(${dependsList})
source=()

package() {
    # 1. Install launcher
    install -Dm755 "${safePkgName}" "$pkgdir/usr/bin/${safePkgName}"

    # 2. Install desktop entry
    install -Dm644 "${safePkgName}.desktop" "$pkgdir/usr/share/applications/${safePkgName}.desktop"

    # 3. Install icon
    install -Dm644 "${safePkgName}.svg" "$pkgdir/usr/share/icons/hicolor/scalable/apps/${safePkgName}.svg"

    # 4. Install assets if present
    if [ -d "assets" ]; then
        mkdir -p "$pkgdir/usr/share/${safePkgName}/assets"
        cp -r assets/* "$pkgdir/usr/share/${safePkgName}/assets/"
    fi
}
`;
    await FileSystem.writeFile(path.join(outputDir, "PKGBUILD"), pkgbuildContent);

    // 6. Generate .SRCINFO
    const srcinfoContent = `pkgbase = ${safePkgName}
	pkgdesc = ${pkgDesc}
	pkgver = ${appVersion}
	pkgrel = 1
	arch = any
	license = MIT
	depends = bash
	depends = xdg-utils

pkgname = ${safePkgName}
`;
    await FileSystem.writeFile(path.join(outputDir, ".SRCINFO"), srcinfoContent);

    // 7. Generate install.sh helper
    const installShContent = `#!/usr/bin/env bash
set -e
echo "Building and installing ${appName} with makepkg..."
if command -v makepkg >/dev/null 2>&1; then
    makepkg -si --noconfirm
else
    echo "makepkg not found. Copying files to system directly (requires sudo)..."
    sudo install -Dm755 "${safePkgName}" "/usr/bin/${safePkgName}"
    sudo install -Dm644 "${safePkgName}.desktop" "/usr/share/applications/${safePkgName}.desktop"
    sudo install -Dm644 "${safePkgName}.svg" "/usr/share/icons/hicolor/scalable/apps/${safePkgName}.svg"
    if [ -d "assets" ]; then
        sudo mkdir -p "/usr/share/${safePkgName}/assets"
        sudo cp -r assets/* "/usr/share/${safePkgName}/assets/"
    fi
    echo "✔ Successfully installed ${appName}!"
fi
`;
    await FileSystem.writeFile(path.join(outputDir, "install.sh"), installShContent);
    if (process.platform !== "win32") {
      try {
        await fs.chmod(path.join(outputDir, "install.sh"), 0o755);
      } catch {}
    }

    // Try building with makepkg if on Arch Linux
    const makepkg = await CommandRunner.which("makepkg");
    let mainArtifact = path.join(outputDir, "PKGBUILD");
    if (makepkg) {
      try {
        Logger.info("Running makepkg for Arch Linux package...");
        const res = await CommandRunner.run(makepkg, ["-cf", "--nodeps"], {
          cwd: outputDir,
          verbose: options.verbose,
        });
        if (res.code === 0) {
          const files = await fs.readdir(outputDir);
          const pkgFile = files.find((f) => f.endsWith(".pkg.tar.zst") || f.endsWith(".pkg.tar.xz"));
          if (pkgFile) {
            mainArtifact = path.join(outputDir, pkgFile);
          }
        }
      } catch {}
    }

    const allFiles = await fs.readdir(outputDir);
    let totalSize = 0;
    for (const f of allFiles) {
      const stat = await fs.stat(path.join(outputDir, f));
      if (!stat.isDirectory()) totalSize += stat.size;
    }

    const durationMs = Date.now() - startTime;
    return {
      platform: "arch",
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
