import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Keep in sync with packageManifest in src/package.manifest.ts */
const LIB_EXPORTS = [
  "cn",
  "motionTransition",
  "motionTransitionProp",
  "pressScaleClass",
  "GridOverlay",
];
const REQUIRED_STYLE_TOKENS = [
  "bg-primary-hover",
  "duration-fast",
  "motion-collapse",
  "grid-page",
  "--grid-cols",
  "--leading-base",
];

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const indexSource = readFileSync(path.join(root, "src/index.ts"), "utf8");
const stylesPath = path.join(root, "dist/styles.css");

let failed = false;

for (const name of LIB_EXPORTS) {
  if (!indexSource.includes(name)) {
    console.error(`manifest: src/index.ts missing export "${name}"`);
    failed = true;
  }
}

let styles = "";
try {
  styles = readFileSync(stylesPath, "utf8");
} catch {
  console.error("manifest: dist/styles.css not found — run npm run build first");
  process.exit(1);
}

for (const token of REQUIRED_STYLE_TOKENS) {
  if (!styles.includes(token)) {
    console.error(`manifest: dist/styles.css missing required utility "${token}"`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("manifest: exports and dist/styles.css utilities OK");
