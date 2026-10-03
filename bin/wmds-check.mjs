#!/usr/bin/env node
/**
 * wmds-check — a consumer audit for apps built on @thewhatmatters/wmds. Run it in the app's CI:
 *
 *   npx wmds-check                 # scans ./src, ./app, ./components, ./pages (whichever exist)
 *   npx wmds-check app components  # or name the folders
 *   npx wmds-check --json          # machine-readable output
 *   npx wmds-check --max-warnings 0
 *
 * Rules (errors fail the run; warnings fail it only past --max-warnings):
 *   raw-control       error  <button>, <input>, <select>, <textarea> where a WMDS component exists
 *   important-override error `!` utilities in className on a component imported from @thewhatmatters/wmds
 *   raw-color         error  hex / rgb / hsl colors in className or style
 *   raw-type          warn   text-xs…text-9xl or text-[…] sizes — use type-* utilities
 *   raw-motion        warn   duration-[…] / ease-[…] / delay-[…] utilities, or numeric Motion durations
 *   pattern-drift     warn   a pasted pattern differs from docs/patterns/<id>.tsx in the installed package
 *   pattern-stale     warn   a pasted pattern's header names an older package version
 *   pattern-removed   error  a pasted pattern's id no longer ships
 *
 * Silence one line with a trailing or preceding comment: `wmds-check-ignore raw-control <reason>`.
 * The checks are line-based heuristics, not a parser: they favor few false negatives, and every
 * finding names the line so a reviewer can judge it.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const args = process.argv.slice(2);
const json = args.includes("--json");
const maxWarningsIndex = args.indexOf("--max-warnings");
const maxWarnings = maxWarningsIndex === -1 ? Infinity : Number(args[maxWarningsIndex + 1]);
const roots = args.filter((arg, index) => !arg.startsWith("--") && (maxWarningsIndex === -1 || index !== maxWarningsIndex + 1));
const cwd = process.cwd();
const scanRoots = (roots.length ? roots : ["src", "app", "components", "pages"]).filter((dir) =>
  existsSync(path.resolve(cwd, dir)),
);

const require = createRequire(path.join(cwd, "package.json"));
let packageRoot = null;
let packageVersion = null;
try {
  const manifest = require.resolve("@thewhatmatters/wmds/package.json");
  packageRoot = path.dirname(manifest);
  packageVersion = JSON.parse(readFileSync(manifest, "utf8")).version;
} catch {
  // Not installed: the pattern rules are skipped.
}

const skipDirs = new Set(["node_modules", ".next", "dist", "build", "out", ".git", "coverage", "storybook-static"]);
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) {
      if (!skipDirs.has(name)) walk(file);
    } else if (/\.(tsx|jsx|ts|js|mdx)$/.test(name) && !/\.(test|spec|stories)\./.test(name)) {
      files.push(file);
    }
  }
};
for (const root of scanRoots) walk(path.resolve(cwd, root));

const findings = [];
const report = (file, line, rule, severity, message) =>
  findings.push({ file: path.relative(cwd, file), line, rule, severity, message });

const ignored = (lines, index, rule) => {
  const here = lines[index] ?? "";
  const above = lines[index - 1] ?? "";
  return [here, above].some((text) => text.includes("wmds-check-ignore") && (text.includes(rule) || !/wmds-check-ignore\s+[a-z-]+/.test(text)));
};

const rawControls = [
  ["button", "Button / IconButton"],
  ["input", "Input / Checkbox / Radio / Switch"],
  ["select", "Select"],
  ["textarea", "TextArea / PromptBar"],
];

const strip = (source) =>
  source
    .split("\n")
    .filter((line) => !/^\/\/ (@thewhatmatters\/wmds@|Storybook:|Show code)/.test(line))
    .join("\n")
    .trim();

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const lines = source.split("\n");

  // WMDS components imported in this file.
  const wmdsNames = new Set();
  for (const match of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']@thewhatmatters\/wmds["']/g)) {
    for (const part of match[1].split(",")) {
      const name = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop();
      if (name && /^[A-Z]/.test(name)) wmdsNames.add(name);
    }
  }

  lines.forEach((line, index) => {
    const n = index + 1;
    for (const [tag, use] of rawControls) {
      const element = new RegExp(`<${tag}(\\s|>|/)`);
      if (element.test(line) && !(tag === "input" && /type=["']hidden["']/.test(line)) && !ignored(lines, index, "raw-control")) {
        report(file, n, "raw-control", "error", `raw <${tag}> — use WMDS ${use}`);
      }
    }

    const tagMatch = line.match(/<([A-Z][\w.]*)\b/);
    const component = tagMatch?.[1].split(".")[0];
    if (component && wmdsNames.has(component)) {
      // className on this line or the next few lines of the same element.
      const element = lines.slice(index, index + 8).join("\n").split(/\/?>/)[0];
      const classes = element.match(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/);
      const value = classes?.[1] ?? classes?.[2] ?? classes?.[3] ?? "";
      const important = value.split(/\s+/).filter((token) => /(^|:)!/.test(token));
      if (important.length && !ignored(lines, index, "important-override")) {
        report(file, n, "important-override", "error", `${important.join(" ")} on <${tagMatch[1]}> — className is layout only; ask WMDS for the variant`);
      }
    }

    if (/(className|class|style)=/.test(line) || /(color|background|border|fill|stroke)\s*:/.test(line)) {
      if (/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(/.test(line) && !/var\(--/.test(line.match(/#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|oklch\(.*?\)/)?.[0] ?? "") && !ignored(lines, index, "raw-color")) {
        report(file, n, "raw-color", "error", "raw color value — use a semantic color utility or token");
      }
    }
    if (/className=/.test(line) || /\bcn\(|clsx\(/.test(line)) {
      const sizes = line.match(/(^|[\s"'`:])text-(xs|sm|base|lg|[2-9]?xl|\[\d[^\]]*\])(?=[\s"'`]|$)/g);
      if (sizes && !ignored(lines, index, "raw-type")) {
        report(file, n, "raw-type", "warn", `${sizes.map((s) => s.trim()).join(" ")} — use type-* utilities`);
      }
      const motion = line.match(/\b(duration|ease|delay)-\[[^\]]+\]/g);
      if (motion && !ignored(lines, index, "raw-motion")) {
        report(file, n, "raw-motion", "warn", `${motion.join(" ")} — use duration-fast|medium|slow and ease-standard`);
      }
    }
    if (/transition=\{\{[^}]*\bduration:\s*\d/.test(line) && !/duration:\s*0\b/.test(line) && !ignored(lines, index, "raw-motion")) {
      report(file, n, "raw-motion", "warn", "numeric Motion duration — use motionTransitionProp()");
    }
  });

  // Pasted patterns.
  const header = lines[0]?.match(/^\/\/ @thewhatmatters\/wmds@([\w.-]+) · (.+)$/);
  const id = source.match(/\?path=\/story\/([\w-]+)/)?.[1];
  if (header && id && packageRoot) {
    const shipped = path.join(packageRoot, "docs", "patterns", `${id}.tsx`);
    if (!existsSync(shipped)) {
      report(file, 1, "pattern-removed", "error", `pattern ${id} no longer ships in ${packageVersion} — see CHANGELOG.md`);
    } else {
      if (header[1] !== packageVersion) {
        report(file, 1, "pattern-stale", "warn", `pasted from ${header[1]}, installed ${packageVersion} — re-copy if CHANGELOG names it`);
      }
      if (strip(readFileSync(shipped, "utf8")) !== strip(source)) {
        report(file, 1, "pattern-drift", "warn", `differs from docs/patterns/${id}.tsx — allowed edits are content, data, handlers, exports`);
      }
    }
  }
}

const errors = findings.filter((finding) => finding.severity === "error").length;
const warnings = findings.length - errors;

if (json) {
  console.log(JSON.stringify({ package: packageVersion, scanned: files.length, errors, warnings, findings }, null, 2));
} else {
  for (const finding of findings) {
    console.log(`${finding.file}:${finding.line}  ${finding.severity === "error" ? "error" : "warn "}  ${finding.rule}  ${finding.message}`);
  }
  console.log(
    `wmds-check: ${files.length} files, ${errors} error${errors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"}${packageVersion ? ` (@thewhatmatters/wmds ${packageVersion})` : " (@thewhatmatters/wmds not installed: pattern rules skipped)"}`,
  );
}
process.exit(errors > 0 || warnings > maxWarnings ? 1 : 0);
