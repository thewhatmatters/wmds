/**
 * Static composition audit — molecules / organisms must compose atoms (ADR-0002, atomic-composition rule).
 * Run via Foundation → Composition audit (Storybook) or `npm run validate:composition`.
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

export interface CompositionShellException {
  /** Path suffix — e.g. `components/molecules/Chip/Chip.tsx` */
  file: string;
  ruleId: string;
  reason: string;
}

/** @deprecated Use `CompositionShellException`. */
export type CompositionAllowlistEntry = CompositionShellException;

export interface CompositionAuditReport {
  tier: CompositionTier;
  scannedFiles: string[];
  violations: CompositionViolation[];
  /** Hits covered by documented molecule/organism shells — not composition gaps. */
  shellExceptions: Array<CompositionViolation & { reason: string }>;
  /** Unresolved hits — must stay empty for CI to pass. */
  openGaps: CompositionViolation[];
  passed: boolean;
}

/** Approved shell affordances — keep reasons in sync with Storybook Anatomy. */
export const compositionShellExceptions: CompositionShellException[] = [
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
    file: "components/organisms/Chart/Chart.tsx",
    ruleId: "inline-svg",
    reason: "Chart owns visx-composed SVG marks (SegmentedBar, future Cartesian patterns) — ADR-0012.",
  },
];

/**
 * Registry of known composition debt — must stay empty.
 * Add an entry only while fixing a gap; remove when resolved. CI fails when non-empty.
 */
export const compositionTrackedOpenGaps: CompositionShellException[] = [];

/** @deprecated Use `compositionShellExceptions`. */
export const compositionAuditAllowlist = compositionShellExceptions;

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

function isShellException(
  file: string,
  ruleId: string,
  shellExceptions: CompositionShellException[],
): boolean {
  const normalized = normalizeAuditPath(file);
  return shellExceptions.some(
    (entry) => entry.ruleId === ruleId && normalized.endsWith(entry.file.replace(/^src\//, "")),
  );
}

function findShellExceptionReason(
  file: string,
  ruleId: string,
  shellExceptions: CompositionShellException[],
): string | undefined {
  const normalized = normalizeAuditPath(file);
  return shellExceptions.find(
    (entry) => entry.ruleId === ruleId && normalized.endsWith(entry.file.replace(/^src\//, "")),
  )?.reason;
}

export function auditCompositionSources(
  sources: Record<string, string>,
  options?: {
    /** @deprecated Use `shellExceptions`. */
    allowlist?: CompositionShellException[];
    shellExceptions?: CompositionShellException[];
    tier?: CompositionTier;
  },
): CompositionAuditReport {
  const shellExceptions = options?.shellExceptions ?? options?.allowlist ?? compositionShellExceptions;
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

  const shellExceptionHits: Array<CompositionViolation & { reason: string }> = [];
  const openGaps: CompositionViolation[] = [];

  for (const violation of violations) {
    if (isShellException(violation.file, violation.ruleId, shellExceptions)) {
      shellExceptionHits.push({
        ...violation,
        reason: findShellExceptionReason(violation.file, violation.ruleId, shellExceptions) ?? "Shell exception",
      });
    } else {
      openGaps.push(violation);
    }
  }

  return {
    tier: options?.tier ?? "molecules",
    scannedFiles,
    violations,
    shellExceptions: shellExceptionHits,
    openGaps,
    passed: openGaps.length === 0 && compositionTrackedOpenGaps.length === 0,
  };
}

export function formatCompositionAuditReport(report: CompositionAuditReport): string {
  if (compositionTrackedOpenGaps.length > 0) {
    return [
      `Composition audit failed — ${compositionTrackedOpenGaps.length} tracked open gap(s) in compositionTrackedOpenGaps:`,
      ...compositionTrackedOpenGaps.map(
        (entry) => `  ${entry.file} [${entry.ruleId}] ${entry.reason}`,
      ),
    ].join("\n");
  }

  if (report.passed) {
    return [
      `Composition audit passed (${report.scannedFiles.length} files).`,
      report.shellExceptions.length > 0
        ? `${report.shellExceptions.length} approved shell exception(s) documented.`
        : "No shell exceptions.",
    ].join("\n");
  }

  const lines = [
    `Composition audit failed — ${report.openGaps.length} open gap(s):`,
    ...report.openGaps.map(
      (violation) =>
        `  ${violation.file}:${violation.line} [${violation.ruleId}] ${violation.message} → ${violation.composeFrom}`,
    ),
  ];
  return lines.join("\n");
}
