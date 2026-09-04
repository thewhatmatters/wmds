/**
 * Static composition audit — molecules / organisms must compose atoms (ADR-0002, atomic-composition rule).
 * Run via Foundation → Composition audit (Storybook) or `npm run test:unit`.
 */

export type CompositionTier = "molecules" | "organisms";

export interface CompositionAuditRule {
  id: string;
  message: string;
  composeFrom: string;
  /** Return true when the line is a violation. */
  testLine: (line: string) => boolean;
}

export interface CompositionViolation {
  file: string;
  line: number;
  ruleId: string;
  message: string;
  composeFrom: string;
  snippet: string;
}

export interface CompositionAllowlistEntry {
  /** Path suffix — e.g. `components/molecules/Chip/Chip.tsx` */
  file: string;
  ruleId: string;
  reason: string;
}

export interface CompositionAuditReport {
  tier: CompositionTier;
  scannedFiles: string[];
  violations: CompositionViolation[];
  allowlisted: Array<CompositionViolation & { reason: string }>;
  unresolved: CompositionViolation[];
  passed: boolean;
}

/** Documented shell / compose-at-call-site exceptions — keep reasons in sync with Storybook Anatomy. */
export const compositionAuditAllowlist: CompositionAllowlistEntry[] = [
  {
    file: "components/molecules/Accordion/Accordion.tsx",
    ruleId: "lucide-import",
    reason: "Accordion owns the built-in disclosure chevron (ButtonIcon inside the molecule shell).",
  },
  {
    file: "components/molecules/Accordion/Accordion.tsx",
    ruleId: "raw-button",
    reason: "Accordion owns the full-width disclosure trigger — not an action Button.",
  },
  {
    file: "components/molecules/Chip/Chip.tsx",
    ruleId: "lucide-import",
    reason: "Lucide glyph passed to IconButton inset for removable dismiss.",
  },
  {
    file: "components/molecules/Chip/Chip.tsx",
    ruleId: "raw-button",
    reason: "Chip owns the filter/toggle shell (aria-pressed segment control).",
  },
  {
    file: "components/molecules/TaskRows/TaskRows.tsx",
    ruleId: "lucide-import",
    reason: "Check / X passed into Badge iconOnly for default status leading marks.",
  },
  {
    file: "components/molecules/TaskRows/TaskRows.tsx",
    ruleId: "raw-button",
    reason: "TaskRows.Detail row onPress — flat detail line; Button is pill-only (documented gap).",
  },
];

export const compositionAuditRules: CompositionAuditRule[] = [
  {
    id: "lucide-import",
    message: "Do not import lucide-react in molecules/organisms.",
    composeFrom: "ButtonIcon / BadgeIcon / IconButton — pass icons from stories or extend an atom",
    testLine: (line) => /from\s+["']lucide-react["']/.test(line),
  },
  {
    id: "raw-button",
    message: "Raw <button> in component TSX.",
    composeFrom: "Button / IconButton",
    testLine: (line) => /<button\b/.test(line),
  },
  {
    id: "semantic-fill-in-tsx",
    message: "Semantic status/brand fill utility in TSX — belongs in *Styles.ts or an atom.",
    composeFrom: "Badge / Button / *Styles.ts",
    testLine: (line) =>
      /\bbg-(success|error|warning|info|primary|destructive)(?:-muted|-hover|-active)?\b/.test(line),
  },
  {
    id: "raw-typography",
    message: "Raw Tailwind typography utility in component TSX.",
    composeFrom: "typographyClass() from src/lib/typography.ts",
    testLine: (line) => {
      if (line.includes("typographyClass(")) {
        return false;
      }
      return /\btext-(xs|sm|base|lg|xl)\b/.test(line) || /\bfont-(medium|semibold|bold)\b/.test(line);
    },
  },
  {
    id: "local-icon-wrapper",
    message: "Hand-rolled SVG sizing wrapper.",
    composeFrom: "ButtonIcon / BadgeIcon",
    testLine: (line) => /\[\&_svg\]/.test(line) || /\[\&>svg\]/.test(line),
  },
  {
    id: "inline-svg",
    message: "Inline SVG markup in a molecule/organism.",
    composeFrom: "Status / ButtonSpinner / Lucide via atoms",
    testLine: (line) => /<svg\b/.test(line),
  },
  {
    id: "local-icon-component",
    message: "Molecule-local *Icon.tsx wrapper file.",
    composeFrom: "ButtonIcon / BadgeIcon",
    testLine: () => false,
  },
];

function normalizeAuditPath(file: string): string {
  return file.replace(/\\/g, "/").replace(/^src\//, "");
}

export function shouldScanCompositionFile(path: string): boolean {
  const normalized = normalizeAuditPath(path);
  if (!normalized.includes("/molecules/") && !normalized.includes("/organisms/")) {
    return false;
  }
  if (normalized.endsWith(".stories.tsx")) {
    return false;
  }
  if (normalized.endsWith("Styles.ts") || normalized.endsWith("styles.ts")) {
    return false;
  }
  return normalized.endsWith(".tsx") || normalized.endsWith(".ts");
}

function isAllowlisted(file: string, ruleId: string, allowlist: CompositionAllowlistEntry[]): boolean {
  const normalized = normalizeAuditPath(file);
  return allowlist.some(
    (entry) => entry.ruleId === ruleId && normalized.endsWith(entry.file.replace(/^src\//, "")),
  );
}

function findAllowlistReason(
  file: string,
  ruleId: string,
  allowlist: CompositionAllowlistEntry[],
): string | undefined {
  const normalized = normalizeAuditPath(file);
  return allowlist.find(
    (entry) => entry.ruleId === ruleId && normalized.endsWith(entry.file.replace(/^src\//, "")),
  )?.reason;
}

export function auditCompositionSources(
  sources: Record<string, string>,
  options?: {
    allowlist?: CompositionAllowlistEntry[];
    tier?: CompositionTier;
  },
): CompositionAuditReport {
  const allowlist = options?.allowlist ?? compositionAuditAllowlist;
  const violations: CompositionViolation[] = [];

  const scannedFiles = Object.keys(sources)
    .filter(shouldScanCompositionFile)
    .sort();

  for (const file of scannedFiles) {
    const baseName = file.split("/").pop() ?? "";
    if (/Icon\.tsx$/i.test(baseName) && !baseName.startsWith("Button") && !baseName.startsWith("Badge")) {
      violations.push({
        file,
        line: 1,
        ruleId: "local-icon-component",
        message: compositionAuditRules.find((rule) => rule.id === "local-icon-component")!.message,
        composeFrom: "ButtonIcon / BadgeIcon",
        snippet: baseName,
      });
    }

    const content = sources[file];
    const lines = content.split("\n");

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*")) {
        continue;
      }

      for (const rule of compositionAuditRules) {
        if (rule.id === "local-icon-component") {
          continue;
        }
        if (!rule.testLine(line)) {
          continue;
        }

        violations.push({
          file,
          line: index + 1,
          ruleId: rule.id,
          message: rule.message,
          composeFrom: rule.composeFrom,
          snippet: trimmed.slice(0, 120),
        });
      }
    }
  }

  const allowlisted: Array<CompositionViolation & { reason: string }> = [];
  const unresolved: CompositionViolation[] = [];

  for (const violation of violations) {
    if (isAllowlisted(violation.file, violation.ruleId, allowlist)) {
      allowlisted.push({
        ...violation,
        reason: findAllowlistReason(violation.file, violation.ruleId, allowlist) ?? "Allowlisted",
      });
    } else {
      unresolved.push(violation);
    }
  }

  return {
    tier: options?.tier ?? "molecules",
    scannedFiles,
    violations,
    allowlisted,
    unresolved,
    passed: unresolved.length === 0,
  };
}

export function formatCompositionAuditReport(report: CompositionAuditReport): string {
  if (report.passed) {
    return [
      `Composition audit passed (${report.scannedFiles.length} files).`,
      report.allowlisted.length > 0
        ? `${report.allowlisted.length} allowlisted exception(s) documented.`
        : "No allowlisted exceptions.",
    ].join("\n");
  }

  const lines = [
    `Composition audit failed — ${report.unresolved.length} unresolved violation(s):`,
    ...report.unresolved.map(
      (violation) =>
        `  ${violation.file}:${violation.line} [${violation.ruleId}] ${violation.message} → ${violation.composeFrom}`,
    ),
  ];
  return lines.join("\n");
}
