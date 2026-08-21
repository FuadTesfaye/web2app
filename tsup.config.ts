import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "src/cli.ts",
    index: "src/index.ts",
  },
  format: ["esm"],
  target: "node18",
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  shims: true,
  banner: {
    js: "// web2app CLI - Convert web apps to native Android apps\n",
  },
});
