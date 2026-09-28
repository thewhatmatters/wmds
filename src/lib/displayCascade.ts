/**
 * Display and width utilities that share one element and one specificity.
 *
 * A later stylesheet's `.hidden` or `.flex` beats an earlier `md:` rule,
 * because a media query does not raise specificity. `!` beats a later
 * non-important rule. `max-md:hidden` is not the class `hidden`, so an app's
 * `.hidden` does not match that element.
 */

const DISPLAY = new Set([
  "flex",
  "inline-flex",
  "block",
  "inline-block",
  "inline",
  "grid",
  "inline-grid",
  "table",
  "inline-table",
  "table-row",
  "table-cell",
  "table-caption",
  "contents",
  "flow-root",
  "list-item",
  "hidden",
]);

/** Unprefixed `w-*` utilities. `max-w-*` and `min-w-*` are different properties. */
const WIDTH =
  /^w-(?:\[(?:[^[\]]|\[[^\]]*\])*\]|px|full|screen|dvw|svw|lvw|min|max|fit|auto|\d+(?:\.\d+)?(?:\/\d+)?)$/;

const CLASS_TOKEN = /^!?[a-zA-Z0-9_:[\]()/%.=+*&>@,-]+$/;

export interface ClassCascadeConflict {
  kind: "display" | "width";
  reason: string;
}

interface ParsedUtility {
  variant: boolean;
  important: boolean;
  util: string;
}

function parseUtility(token: string): ParsedUtility {
  const colon = token.lastIndexOf(":");
  let variant = false;
  let util = token;
  if (colon >= 0) {
    variant = true;
    util = token.slice(colon + 1);
  }
  let important = false;
  if (util.startsWith("!")) {
    important = true;
    util = util.slice(1);
  }
  return { variant, important, util };
}

/** Conflict when emission order can change the used display or width. */
export function classCascadeConflict(className: string): ClassCascadeConflict | null {
  const tokens = className.trim().split(/\s+/).filter(Boolean);
  const baseDisplay: ParsedUtility[] = [];
  const variantDisplay: ParsedUtility[] = [];
  const baseWidth: ParsedUtility[] = [];

  for (const token of tokens) {
    if (!CLASS_TOKEN.test(token)) continue;
    const parsed = parseUtility(token);
    if (DISPLAY.has(parsed.util)) {
      if (parsed.variant) variantDisplay.push(parsed);
      else baseDisplay.push(parsed);
    }
    if (!parsed.variant && WIDTH.test(parsed.util)) baseWidth.push(parsed);
  }

  const baseUtils = [...new Set(baseDisplay.map((item) => item.util))];
  const baseHidden = baseUtils.includes("hidden");
  const baseOther = baseUtils.filter((util) => util !== "hidden");

  if (baseHidden && baseOther.length > 0) {
    return {
      kind: "display",
      reason: `unprefixed hidden alongside ${baseOther.join(", ")}`,
    };
  }
  if (baseOther.length > 1) {
    return {
      kind: "display",
      reason: `unprefixed display utilities ${baseOther.join(", ")}`,
    };
  }
  if (baseHidden && variantDisplay.some((item) => item.util !== "hidden" && !item.important)) {
    return {
      kind: "display",
      reason: "unprefixed hidden alongside a non-important display variant",
    };
  }
  if (baseOther.length > 0 && variantDisplay.some((item) => item.util === "hidden" && !item.important)) {
    return {
      kind: "display",
      reason: `unprefixed ${baseOther.join(", ")} alongside a non-important hidden variant`,
    };
  }

  const plainWidths = new Set(baseWidth.filter((item) => !item.important).map((item) => item.util));
  const importantWidths = new Set(baseWidth.filter((item) => item.important).map((item) => item.util));
  if (plainWidths.size > 1 || importantWidths.size > 1) {
    const names = [...new Set([...plainWidths, ...importantWidths])];
    return { kind: "width", reason: `unprefixed widths ${names.join(", ")}` };
  }

  return null;
}

export interface ClassSource {
  /** Repo-relative path, slash-separated. */
  path: string;
  source: string;
}

export interface ClassCascadeHit {
  path: string;
  className: string;
  reason: string;
}

function unescapeString(literal: string): string | null {
  const quote = literal[0];
  if ((quote !== '"' && quote !== "'" && quote !== "`") || literal.at(-1) !== quote) return null;
  if (quote === "`" && literal.includes("${")) return null;
  return literal.slice(1, -1);
}

function splitTop(source: string, separator: string): string[] {
  const parts: string[] = [];
  let start = 0;
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (char === "\\") {
        i += 1;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "(" || char === "[" || char === "{") depth += 1;
    else if (char === ")" || char === "]" || char === "}") depth -= 1;
    else if (depth === 0 && source.startsWith(separator, i)) {
      parts.push(source.slice(start, i));
      i += separator.length - 1;
      start = i + 1;
    }
  }
  parts.push(source.slice(start));
  return parts;
}

function readBalanced(source: string, openIndex: number, open: string, close: string): string | null {
  if (source[openIndex] !== open) return null;
  let depth = 0;
  let quote: string | null = null;
  for (let i = openIndex; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (char === "\\") {
        i += 1;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === open) depth += 1;
    else if (char === close) {
      depth -= 1;
      if (depth === 0) return source.slice(openIndex + 1, i);
    }
  }
  return null;
}

function isClassList(value: string): boolean {
  const tokens = value.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;
  return tokens.every((token) => CLASS_TOKEN.test(token));
}

function evalExpr(expr: string, scope: Map<string, string>): string | null {
  const trimmed = expr.trim().replace(/^\(([\s\S]*)\)$/, "$1").trim();
  if (!trimmed) return null;
  const literal = unescapeString(trimmed);
  if (literal != null) return literal;
  if (/^[\w$]+$/.test(trimmed)) return scope.get(trimmed) ?? null;

  if (trimmed.startsWith("cn(") && trimmed.endsWith(")")) {
    const args = splitTop(trimmed.slice(3, -1), ",");
    const parts: string[] = [];
    for (const arg of args) {
      const pieces = splitTop(arg, "&&");
      const value = evalExpr(pieces[pieces.length - 1] ?? "", scope);
      if (value == null) continue;
      parts.push(value);
    }
    return parts.length > 0 ? parts.join(" ") : null;
  }

  const join = trimmed.match(/^\[([\s\S]*)\]\.join\(\s*(["'`]) \2\s*\)$/);
  if (join?.[1] != null && join[2] === " ") {
    const parts: string[] = [];
    for (const arg of splitTop(join[1], ",")) {
      const value = evalExpr(arg, scope);
      if (value == null) return null;
      parts.push(value);
    }
    return parts.join(" ");
  }

  const added = splitTop(trimmed, "+");
  if (added.length > 1) {
    const parts: string[] = [];
    for (const part of added) {
      const value = evalExpr(part, scope);
      if (value == null) return null;
      parts.push(value);
    }
    return parts.join("");
  }

  const ternary = splitTop(trimmed, "?");
  if (ternary.length === 2) {
    const branches = splitTop(ternary[1] ?? "", ":");
    if (branches.length === 2) {
      const left = evalExpr(branches[0] ?? "", scope);
      const right = evalExpr(branches[1] ?? "", scope);
      if (left != null && right != null) return `${left} ${right}`;
    }
  }

  return null;
}

function localBindings(source: string): Map<string, string> {
  const scope = new Map<string, string>();
  const declarator = /(?:export\s+)?(?:const|let)\s+(\w+)\s*=\s*/g;
  const exprs: Array<{ name: string; expr: string }> = [];
  let match: RegExpExecArray | null;
  while ((match = declarator.exec(source))) {
    const name = match[1];
    if (!name) continue;
    const start = match.index + match[0].length;
    let end = start;
    let depth = 0;
    let quote: string | null = null;
    for (let i = start; i < source.length; i++) {
      const char = source[i];
      if (quote) {
        if (char === "\\") {
          i += 1;
          continue;
        }
        if (char === quote) quote = null;
        continue;
      }
      if (char === '"' || char === "'" || char === "`") {
        quote = char;
        continue;
      }
      if (char === "(" || char === "[" || char === "{") depth += 1;
      else if (char === ")" || char === "]" || char === "}") depth -= 1;
      else if (char === ";" && depth === 0) {
        end = i;
        break;
      }
    }
    if (end > start) exprs.push({ name, expr: source.slice(start, end) });
  }

  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const binding of exprs) {
      if (scope.has(binding.name)) continue;
      const value = evalExpr(binding.expr, scope);
      if (value != null && isClassList(value)) {
        scope.set(binding.name, value);
        progressed = true;
      }
    }
  }
  return scope;
}

function importedBindings(source: string, path: string, files: Map<string, string>): Map<string, string> {
  const scope = new Map<string, string>();
  const importRe = /import\s*\{([^}]+)\}\s*from\s*["'](\.[^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = importRe.exec(source))) {
    const names = match[1] ?? "";
    const specifier = match[2] ?? "";
    const from = resolveImport(path, specifier, files);
    if (!from) continue;
    const exported = localBindings(files.get(from) ?? "");
    for (const part of names.split(",")) {
      const piece = part.trim();
      if (!piece || piece.startsWith("type ")) continue;
      const [rawName, rawAlias] = piece.split(/\s+as\s+/);
      const name = rawName?.trim();
      const alias = (rawAlias ?? rawName)?.trim();
      if (!name || !alias) continue;
      const value = exported.get(name);
      if (value) scope.set(alias, value);
    }
  }
  return scope;
}

function resolveImport(fromPath: string, specifier: string, files: Map<string, string>): string | null {
  const base = fromPath.split("/").slice(0, -1);
  for (const segment of specifier.split("/")) {
    if (segment === ".") continue;
    if (segment === "..") base.pop();
    else base.push(segment);
  }
  const joined = base.join("/");
  const candidates = [joined, `${joined}.ts`, `${joined}.tsx`];
  return candidates.find((candidate) => files.has(candidate)) ?? null;
}

function stringLiterals(source: string): string[] {
  const values: string[] = [];
  let quote: string | null = null;
  let start = 0;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (char === "\\") {
        i += 1;
        continue;
      }
      if (char === quote) {
        const literal = source.slice(start, i + 1);
        const value = unescapeString(literal);
        if (value != null && isClassList(value)) values.push(value);
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      start = i;
    }
  }
  return values;
}

function buttonClassNames(source: string, scope: Map<string, string>): string[] {
  const values: string[] = [];
  const tagRe = /<(?:Button|IconButton)\b/g;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(source))) {
    const open = match.index;
    let depth = 0;
    let quote: string | null = null;
    let end = -1;
    for (let i = open; i < source.length; i++) {
      const char = source[i];
      if (quote) {
        if (char === "\\") {
          i += 1;
          continue;
        }
        if (char === quote) quote = null;
        continue;
      }
      if (char === '"' || char === "'" || char === "`") {
        quote = char;
        continue;
      }
      if (char === "<") depth += 1;
      else if (char === ">") {
        depth -= 1;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end < 0) continue;
    const tag = source.slice(open, end);
    const classAttr = /className\s*=\s*/.exec(tag);
    if (!classAttr) continue;
    const after = classAttr.index + classAttr[0].length;
    let value: string | null = null;
    if (tag[after] === '"' || tag[after] === "'" || tag[after] === "`") {
      const literalEnd = tag.indexOf(tag[after]!, after + 1);
      value = literalEnd > after ? tag.slice(after + 1, literalEnd) : null;
    } else if (tag[after] === "{") {
      const inner = readBalanced(tag, after, "{", "}");
      value = inner == null ? null : evalExpr(inner, scope);
    }
    if (value && isClassList(value)) values.push(`inline-flex ${value}`);
  }
  return values;
}

function snippet(className: string): string {
  return className.length > 180 ? `${className.slice(0, 180)}…` : className;
}

/** Class lists in components, stories, and examples whose display or width depends on emission order. */
export function auditClassCascade(files: ClassSource[]): ClassCascadeHit[] {
  const byPath = new Map(files.map((file) => [file.path, file.source]));
  const hits: ClassCascadeHit[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const scope = localBindings(file.source);
    for (const [name, value] of importedBindings(file.source, file.path, byPath)) {
      if (!scope.has(name)) scope.set(name, value);
    }
    const lists = [
      ...scope.values(),
      ...stringLiterals(file.source),
      ...buttonClassNames(file.source, scope),
    ];
    for (const className of lists) {
      const conflict = classCascadeConflict(className);
      if (!conflict) continue;
      const key = `${file.path}\0${conflict.reason}\0${className}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({ path: file.path, reason: conflict.reason, className: snippet(className) });
    }
  }

  return hits;
}
