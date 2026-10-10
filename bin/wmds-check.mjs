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
 *   pattern-drift     warn   a pasted pattern's markup or classes differ from docs/patterns/<id>.tsx in the
 *                             installed package (its elements, className / style values, *Classes constants);
 *                             content, data, handlers, and exports may change
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

// Hex colors, not character references such as &#039; or &#x27;.
const colorValue = /(?<![&\w])#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(/;
const colorMatch = /(?<![&\w])#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|oklch\(.*?\)/;

/** The index past the end of the string literal that opens at `start` (quote or backtick). */
const skipString = (code, start) => {
  const quote = code[start];
  for (let index = start + 1; index < code.length; index++) {
    const char = code[index];
    if (char === "\\") {
      index++;
    } else if (quote === "`" && char === "$" && code[index + 1] === "{") {
      index = skipBalanced(code, index + 1) - 1;
    } else if (char === quote) {
      return index + 1;
    }
  }
  return code.length;
};

/** The index past the bracket that closes the one at `start`, skipping strings. */
const skipBalanced = (code, start) => {
  let depth = 0;
  for (let index = start; index < code.length; index++) {
    const char = code[index];
    if (char === '"' || char === "'" || char === "`") {
      index = skipString(code, index) - 1;
    } else if ("{([".includes(char)) {
      depth++;
    } else if ("})]".includes(char)) {
      depth--;
      if (depth === 0) return index + 1;
    }
  }
  return code.length;
};

/** One attribute value from `start`: a quoted string or a {…} expression. */
const readValue = (code, start) => {
  const char = code[start];
  if (char === '"' || char === "'") return code.slice(start, skipString(code, start));
  if (char === "{") return code.slice(start, skipBalanced(code, start));
  return "";
};

/** A declaration's value from `start` to the semicolon that ends it. */
const readDeclaration = (code, start) => {
  let depth = 0;
  for (let index = start; index < code.length; index++) {
    const char = code[index];
    if (char === '"' || char === "'" || char === "`") index = skipString(code, index) - 1;
    else if ("{([".includes(char)) depth++;
    else if ("})]".includes(char)) depth--;
    else if (char === ";" && depth === 0) return code.slice(start, index);
  }
  return code.slice(start);
};

const squash = (text) => text.replace(/\s+/g, " ").trim();

/**
 * What a pasted pattern must keep: its JSX elements in order, every className and style value, and
 * every *Classes constant. Text, data, handler bodies, and names an app exports are content — they
 * can change without drift.
 */
const patternStructure = (source) => {
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");
  const parts = [];
  const tokens = /(?<![\w.$)\]])<([A-Za-z][\w.]*)|\b(className|style)=|\bconst\s+(\w*Classes)\b[^=]*=\s*/g;
  for (const match of code.matchAll(tokens)) {
    const end = match.index + match[0].length;
    if (match[1]) parts.push(`<${match[1]}>`);
    else if (match[2]) parts.push(`${match[2]}=${squash(readValue(code, end))}`);
    else parts.push(`${match[3]} = ${squash(readDeclaration(code, end))}`);
  }
  return parts;
};

/** The first place two structures part, for the finding's message — clipped around where they differ. */
const firstDifference = (shipped, pasted) => {
  const length = Math.max(shipped.length, pasted.length);
  for (let index = 0; index < length; index++) {
    const want = shipped[index];
    const have = pasted[index];
    if (want === have) continue;
    let common = 0;
    while (want != null && have != null && common < want.length && want[common] === have[common]) common++;
    const from = Math.max(0, common - 24);
    const clip = (text) =>
      text == null ? "nothing" : `${from > 0 ? "…" : ""}${text.slice(from, from + 64)}${text.length > from + 64 ? "…" : ""}`;
    return `${clip(have)} where the pattern has ${clip(want)}`;
  }
  return "";
};

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
      if (colorValue.test(line) && !/var\(--/.test(line.match(colorMatch)?.[0] ?? "") && !ignored(lines, index, "raw-color")) {
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
  // The header is the file's first comment line. A "use client" / "use server" directive or blank
  // lines may come before it.
  const headerIndex = lines.findIndex((line) => line.trim() !== "" && !/^\s*["']use (client|server)["'];?\s*$/.test(line));
  const headerLine = headerIndex === -1 ? 0 : headerIndex;
  const header = lines[headerLine]?.match(/^\/\/ @thewhatmatters\/wmds@([\w.-]+) · (.+)$/);
  const id = source.match(/\?path=\/story\/([\w-]+)/)?.[1];
  if (header && id && packageRoot) {
    const shipped = path.join(packageRoot, "docs", "patterns", `${id}.tsx`);
    if (!existsSync(shipped)) {
      report(file, headerLine + 1, "pattern-removed", "error", `pattern ${id} no longer ships in ${packageVersion} — see CHANGELOG.md`);
    } else {
      if (header[1] !== packageVersion) {
        report(file, headerLine + 1, "pattern-stale", "warn", `pasted from ${header[1]}, installed ${packageVersion} — re-copy if CHANGELOG names it`);
      }
      const shippedStructure = patternStructure(readFileSync(shipped, "utf8"));
      const pastedStructure = patternStructure(source);
      if (shippedStructure.join("\n") !== pastedStructure.join("\n")) {
        report(
          file,
          headerLine + 1,
          "pattern-drift",
          "warn",
          `markup or classes differ from docs/patterns/${id}.tsx (${firstDifference(shippedStructure, pastedStructure)}) — allowed edits are content, data, handlers, exports`,
        );
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
