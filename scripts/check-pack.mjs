/**
 * Tarball gate. Lists what `npm pack` would publish (run `npm run build` first) and fails when
 * a file apps need is missing or a file that must not ship is present.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const fail = (messages) => {
  for (const message of messages) console.error(`check-pack: ${message}`);
  process.exit(1);
};

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
// npm 10 still runs `prepare` (the build) during pack and prints its log to stdout before the JSON.
const output = execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
const jsonStart = output.search(/^\[\s*$/m);
if (jsonStart === -1) fail(["npm pack printed no JSON report"]);
const [report] = JSON.parse(output.slice(jsonStart));
const files = new Set(report.files.map((file) => file.path));

const exportTargets = Object.values(pkg.exports).flatMap((target) =>
  typeof target === "string" ? [target] : Object.values(target),
);
const required = [
  "package.json",
  "LICENSE",
  "README.md",
  "CONSUMING.md",
  "CHANGELOG.md",
  "public/rive/interactive-icon-set.riv",
  "public/rive/CREDITS.md",
  ...exportTargets.map((target) => target.replace(/^\.\//, "")),
];

const forbidden = [
  [/^src\//, "source files"],
  [/\.stories\.[jt]sx?$/, "stories"],
  [/\.test\.[jt]sx?$/, "tests"],
  [/^\.storybook\//, "Storybook config"],
  [/^\.github\//, "workflows"],
  [/(^|\/)node_modules\//, "node_modules"],
  [/(^|\/)\.env/, "env files"],
  [/rive\.wasm$/, "the Rive runtime (apps copy it from @rive-app/canvas)"],
  [/^docs\/(adr|audits)\//, "decision records"],
];

const problems = [];
for (const file of required) if (!files.has(file)) problems.push(`missing ${file}`);
if (![...files].some((file) => /^dist\/files\/.+\.woff2$/.test(file))) problems.push("missing fonts in dist/files");
for (const file of files) {
  for (const [pattern, label] of forbidden) if (pattern.test(file)) problems.push(`must not ship ${label}: ${file}`);
}
if (report.name !== pkg.name || report.version !== pkg.version) problems.push(`packed ${report.name}@${report.version}`);
if (problems.length) fail(problems);

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
console.log(
  `check-pack: ${report.name}@${report.version} — ${report.entryCount} files, ${mb(report.size)} packed, ${mb(report.unpackedSize)} unpacked`,
);
