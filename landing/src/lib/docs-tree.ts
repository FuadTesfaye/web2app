import type { PageTree } from "fumadocs-core/server";

export const docsTree: PageTree.Root = {
  name: "Documentation",
  children: [
    {
      type: "folder",
      name: "01. Getting Started",
      children: [
        { type: "page", name: "Introduction", url: "/docs#introduction" },
        { type: "page", name: "Quick Start", url: "/docs#quick-start" },
        { type: "page", name: "Installation & Scripts", url: "/docs#installation" },
        { type: "page", name: "Configuration Wizard", url: "/docs#init-wizard" },
      ],
    },
    {
      type: "folder",
      name: "02. Architecture & Engine",
      children: [
        { type: "page", name: "Zero-Bloat Runtime", url: "/docs#zero-bloat" },
        { type: "page", name: "Multi-Platform Pipeline", url: "/docs#pipeline" },
      ],
    },
    {
      type: "folder",
      name: "03. Supported Platforms",
      children: [
        { type: "page", name: "Android (APK / AAB)", url: "/docs#platform-android" },
        { type: "page", name: "Windows Desktop", url: "/docs#platform-windows" },
        { type: "page", name: "Debian & Ubuntu (.deb)", url: "/docs#platform-debian" },
        { type: "page", name: "Arch Linux (PKGBUILD)", url: "/docs#platform-arch" },
      ],
    },
    {
      type: "folder",
      name: "04. Framework Guides",
      children: [
        { type: "page", name: "Next.js (App Router)", url: "/docs#framework-nextjs" },
        { type: "page", name: "Vite, React & SPA", url: "/docs#framework-vite" },
        { type: "page", name: "Python, Streamlit & Flask", url: "/docs#framework-python" },
      ],
    },
    {
      type: "folder",
      name: "05. CLI & Configuration",
      children: [
        { type: "page", name: "CLI Commands Reference", url: "/docs#cli-reference" },
        { type: "page", name: "web2app.config.ts Schema", url: "/docs#config-schema" },
      ],
    },
    {
      type: "folder",
      name: "06. AI Agent Skill",
      children: [
        { type: "page", name: "AI Agent Integration", url: "/docs#ai-agent-skill" },
        { type: "page", name: "AI Prompt Recipes", url: "/docs#ai-prompts" },
      ],
    },
    {
      type: "folder",
      name: "07. Production & CI/CD",
      children: [
        { type: "page", name: "Android Keystore & Signing", url: "/docs#signing" },
        { type: "page", name: "GitHub Actions CI/CD", url: "/docs#cicd" },
      ],
    },
    {
      type: "folder",
      name: "08. Help & Reference",
      children: [
        { type: "page", name: "Troubleshooting & FAQ", url: "/docs#troubleshooting" },
      ],
    },
  ],
};
