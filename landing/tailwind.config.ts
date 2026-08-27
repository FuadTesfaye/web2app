import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-subtle": "var(--surface-subtle)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "border-color": "var(--border-color)",
        
        "accent-yellow": "var(--accent-yellow)",
        "accent-pink": "var(--accent-pink)",
        "accent-cyan": "var(--accent-cyan)",
        "accent-green": "var(--accent-green)",
        "accent-purple": "var(--accent-purple)",

        "accent-green-dark": "var(--accent-green-dark)",
        "accent-cyan-dark": "var(--accent-cyan-dark)",
        "accent-pink-dark": "var(--accent-pink-dark)",
        "accent-purple-dark": "var(--accent-purple-dark)",
      },
      boxShadow: {
        "neo-xs": "2px 2px 0px 0px var(--shadow-color)",
        "neo-sm": "4px 4px 0px 0px var(--shadow-color)",
        "neo-md": "6px 6px 0px 0px var(--shadow-color)",
        "neo-lg": "8px 8px 0px 0px var(--shadow-color)",
        "neo-xl": "12px 12px 0px 0px var(--shadow-color)",
      },
      borderWidth: {
        2: "2px",
        3: "3px",
        4: "4px",
      },
      fontFamily: {
        display: ["Syne", "Space Grotesk", "sans-serif"],
        head: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },

    },
  },
  plugins: [],
};

export default config;
