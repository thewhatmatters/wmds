import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

execSync("vite build --config vite.lib.config.ts", { cwd: root, stdio: "inherit" });
execSync("npx tsc -p tsconfig.lib.json", { cwd: root, stdio: "inherit" });
execSync(
  "npx @tailwindcss/cli -i ./src/styles/wmds.css -o ./dist/styles.css --minify",
  { cwd: root, stdio: "inherit" },
);

copyFileSync(path.join(root, "src/tokens/tokens.css"), path.join(dist, "tokens.css"));
copyFileSync(path.join(root, "src/tokens/theme-dark.css"), path.join(dist, "theme-dark.css"));

console.log("Built @whatmatters/wmds → dist/");
