import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");
const themeDir = path.join(root, "src/theme");
const require = createRequire(import.meta.url);
const run = (command) => execSync(command, { cwd: root, stdio: "inherit" });

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

run("vite build --config vite.lib.config.ts");
run("npx tsc -p tsconfig.lib.json");
run("npx @tailwindcss/cli -i ./src/styles/wmds.css -o ./dist/styles.css --minify");

// Theme partials — every file theme.css imports, so `@import "@thewhatmatters/wmds/theme.css"` resolves in an app.
for (const file of readdirSync(themeDir)) {
  if (file.endsWith(".css")) copyFileSync(path.join(themeDir, file), path.join(dist, file));
}
copyFileSync(path.join(root, "src/lib/collapse.css"), path.join(dist, "collapse.css"));

// styles.css is built from the theme plus the collapse utilities. The package theme entry carries both too.
const sourcesImport = '@import "./sources.css";';
const themeEntry = readFileSync(path.join(dist, "theme.css"), "utf8");
if (!themeEntry.includes(sourcesImport)) {
  throw new Error(`build: src/theme/theme.css no longer has ${sourcesImport} — update scripts/build-package.mjs`);
}
writeFileSync(
  path.join(dist, "theme.css"),
  themeEntry.replace(sourcesImport, `${sourcesImport}\n@import "./collapse.css";`),
);

// Fonts — the package serves Geist itself. Apps do not install or copy the font packages.
const fontImport = /^@import "(@fontsource-variable\/[^"]+)";\n/gm;
const fontsSource = readFileSync(path.join(themeDir, "fonts.css"), "utf8");
const fontPackages = [...fontsSource.matchAll(fontImport)].map((match) => match[1]);
if (fontPackages.length === 0) {
  throw new Error("build: src/theme/fonts.css imports no @fontsource-variable packages");
}
mkdirSync(path.join(dist, "files"), { recursive: true });
const fontFaces = fontPackages.map((name) => {
  const cssPath = require.resolve(name);
  const css = readFileSync(cssPath, "utf8");
  for (const [, file] of css.matchAll(/url\(\.\/files\/([^)]+)\)/g)) {
    copyFileSync(path.join(path.dirname(cssPath), "files", file), path.join(dist, "files", file));
  }
  return css.trim();
});
writeFileSync(
  path.join(dist, "fonts.css"),
  `${fontFaces.join("\n\n")}\n\n${fontsSource.replace(fontImport, "").trim()}\n`,
);

// In an app, Tailwind reads class names from the built modules rather than from src/.
const sources = readFileSync(path.join(themeDir, "sources.css"), "utf8");
const sourceGlob = /^@source "\.\.\/[^"]+";\n/gm;
if (!sourceGlob.test(sources)) {
  throw new Error("build: src/theme/sources.css has no relative @source globs");
}
writeFileSync(
  path.join(dist, "sources.css"),
  sources
    .replace(/^\/\*\*[\s\S]*?\*\/\n/, "/** Tailwind content manifest for apps — class names are read from the built modules. */\n")
    .replace(sourceGlob, "")
    .replace("@source inline(", '@source "./**/*.js";\n\n@source inline('),
);

run("node scripts/validate-manifest.mjs");

console.log("Built @thewhatmatters/wmds → dist/");
