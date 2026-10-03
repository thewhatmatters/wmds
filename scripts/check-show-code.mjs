/**
 * Show code must pass a consumer's checks. Packs WMDS, installs it into fixtures/next-consumer
 * (Next 16, React 19, strict TypeScript, eslint-config-next — the create-next-app 16 setup), writes
 * every docs/patterns/*.tsx into it unchanged, and runs `tsc --noEmit` and `eslint --max-warnings 0`.
 *
 *   node scripts/check-show-code.mjs                 # pack, install, check (CI)
 *   node scripts/check-show-code.mjs --skip-install  # reuse the fixture's node_modules
 *
 * Run `npm run build` and `npm run docs:generate` first; the patterns come from docs/patterns.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, renameSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixture = path.join(root, "fixtures", "next-consumer");
const skipInstall = process.argv.includes("--skip-install");

const run = (command, args, cwd = fixture) => {
  console.log(`$ ${command} ${args.join(" ")}`);
  execFileSync(command, args, { cwd, stdio: "inherit" });
};

if (!skipInstall || !existsSync(path.join(fixture, "node_modules"))) {
  rmSync(path.join(fixture, "wmds.tgz"), { force: true });
  const packed = execFileSync("npm", ["pack", "--ignore-scripts", "--pack-destination", fixture], {
    cwd: root,
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .pop();
  renameSync(path.join(fixture, packed), path.join(fixture, "wmds.tgz"));
  rmSync(path.join(fixture, "node_modules", "@thewhatmatters"), { recursive: true, force: true });
  run("npm", ["install", "--no-audit", "--no-fund", "--no-package-lock"]);
}

const patternsSource = path.join(root, "docs", "patterns");
const patternsTarget = path.join(fixture, "patterns");
rmSync(patternsTarget, { recursive: true, force: true });
cpSync(patternsSource, patternsTarget, { recursive: true, filter: (file) => !file.endsWith(".json") });
console.log(`${readdirSync(patternsTarget).length} patterns copied into ${path.relative(root, patternsTarget)}`);

let failed = false;
for (const [command, args] of [
  ["npx", ["tsc", "--noEmit", "-p", "."]],
  ["npx", ["eslint", "--max-warnings", "0", "patterns", "app"]],
]) {
  try {
    run(command, args);
  } catch {
    failed = true;
  }
}
if (failed) {
  console.error("check-show-code: Show code fails a consumer's checks. Fix the story's Show code, then `npm run docs:generate`.");
  console.error("check-show-code: docs/patterns/index.json → source names the story file for each pattern id.");
  process.exit(1);
}
console.log("check-show-code: every pattern passes tsc and eslint in the Next 16 fixture");
