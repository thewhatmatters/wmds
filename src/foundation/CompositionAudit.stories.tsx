import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { cn } from "../lib/cn";
import {
  auditCompositionSources,
  compositionAuditAllowlist,
  compositionAuditRules,
  formatCompositionAuditReport,
  type CompositionAuditReport,
  type CompositionViolation,
} from "../lib/compositionAudit";
import { typographyClass } from "../lib/typography";

const componentSources = import.meta.glob("../components/{molecules,organisms}/**/*.{ts,tsx}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function normalizeGlobPath(path: string): string {
  return path.replace(/^\.\.\//, "").replace(/\\/g, "/");
}

function runCompositionAudit(): CompositionAuditReport {
  const sources: Record<string, string> = {};
  for (const [path, content] of Object.entries(componentSources)) {
    sources[normalizeGlobPath(path)] = content;
  }
  return auditCompositionSources(sources);
}

const labelClasses = typographyClass("ui-label");
const bodyClasses = typographyClass("body");
const captionClasses = typographyClass("caption");

function ViolationTable({
  title,
  rows,
  emptyMessage,
}: {
  title: string;
  rows: Array<CompositionViolation & { reason?: string }>;
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-4">
        <h3 className={labelClasses}>{title}</h3>
        <p className={cn(bodyClasses, "mt-2 text-muted")}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-4 py-3">
        <h3 className={labelClasses}>{title}</h3>
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-secondary/40">
            <th className={cn(captionClasses, "px-4 py-2 font-medium")}>File</th>
            <th className={cn(captionClasses, "px-4 py-2 font-medium")}>Line</th>
            <th className={cn(captionClasses, "px-4 py-2 font-medium")}>Rule</th>
            <th className={cn(captionClasses, "px-4 py-2 font-medium")}>Compose from</th>
            <th className={cn(captionClasses, "px-4 py-2 font-medium")}>Snippet / reason</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.file}:${row.line}:${row.ruleId}:${row.snippet}`} className="border-b border-border last:border-b-0">
              <td className={cn(captionClasses, "px-4 py-2 align-top font-mono text-[0.6875rem]")}>{row.file}</td>
              <td className={cn(captionClasses, "px-4 py-2 align-top tabular-nums")}>{row.line}</td>
              <td className={cn(captionClasses, "px-4 py-2 align-top")}>{row.ruleId}</td>
              <td className={cn(captionClasses, "px-4 py-2 align-top")}>{row.composeFrom}</td>
              <td className={cn(captionClasses, "px-4 py-2 align-top")}>{row.reason ?? row.snippet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompositionAuditReportView({ report }: { report: CompositionAuditReport }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 font-sans text-fg">
      <header className="space-y-2">
        <p className={cn(bodyClasses, report.passed ? "text-success" : "text-error")}>
          {report.passed ? "Passed" : "Failed"} — {report.scannedFiles.length} component file
          {report.scannedFiles.length === 1 ? "" : "s"} scanned
        </p>
        <p className={cn(bodyClasses, "text-muted")}>
          Static scan of <code className="font-mono text-[0.8125rem]">src/components/molecules</code> and{" "}
          <code className="font-mono text-[0.8125rem]">organisms</code> TSX (excluding stories and *Styles.ts).
          Enforces the atomic composition rule — atoms compose in molecules; no hand-rolled affordances.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className={labelClasses}>Rules</h2>
        <ul className="list-disc space-y-1 pl-5">
          {compositionAuditRules
            .filter((rule) => rule.id !== "local-icon-component")
            .map((rule) => (
              <li key={rule.id} className={cn(bodyClasses, "text-muted")}>
                <span className="font-mono text-[0.8125rem] text-fg">{rule.id}</span> — {rule.message} →{" "}
                {rule.composeFrom}
              </li>
            ))}
        </ul>
      </section>

      <ViolationTable
        title="Unresolved violations"
        rows={report.unresolved}
        emptyMessage="No gaps — every hit is allowlisted or clean."
      />

      <ViolationTable
        title="Documented exceptions"
        rows={report.allowlisted.map((row) => ({ ...row, reason: row.reason }))}
        emptyMessage="No allowlisted exceptions."
      />

      <section className="rounded-lg border border-border bg-secondary/30 p-4">
        <h3 className={labelClasses}>Scanned files</h3>
        <ul className="mt-2 space-y-1">
          {report.scannedFiles.map((file) => (
            <li key={file} className={cn(captionClasses, "font-mono text-[0.6875rem]")}>
              {file}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundation/Composition audit",
  tags: ["autodocs"],
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Living report for **atomic composition** — scans molecule and organism component sources for hand-rolled affordances (raw \`lucide-react\`, \`<button>\`, semantic fills in TSX, inline SVG, raw typography).

| Surface | Command |
|---------|---------|
| **Storybook** | This page + **Gate** story (automated test) |
| **CI / local** | \`npm run test:unit\` → \`compositionAudit.test.ts\` |

Documented shell exceptions live in \`src/lib/compositionAudit.ts\` → \`compositionAuditAllowlist\`.

## Best practices

- **Do** add allowlist entries with a reason tied to Storybook Anatomy when a shell truly owns an affordance.
- **Do** extend an atom + story spec instead of suppressing a rule without cause.
- **Don't** add raw utilities for status colors or icons in molecule TSX — use \`*Styles.ts\` shell or compose atoms.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Report: Story = {
  name: "Report",
  render: () => <CompositionAuditReportView report={runCompositionAudit()} />,
};

export const Gate: Story = {
  name: "Gate (test)",
  tags: ["!autodocs"],
  parameters: {
    docs: { disable: true },
  },
  render: () => {
    const report = runCompositionAudit();
    return (
      <pre className={cn(typographyClass("code"), "text-fg")}>{formatCompositionAuditReport(report)}</pre>
    );
  },
  play: async () => {
    const report = runCompositionAudit();
    expect(report.unresolved, formatCompositionAuditReport(report)).toEqual([]);
  },
};

export const AllowlistReference: Story = {
  name: "Allowlist reference",
  render: () => (
    <div className="mx-auto max-w-3xl space-y-3 font-sans">
      <p className={cn(bodyClasses, "text-muted")}>
        {compositionAuditAllowlist.length} documented exception(s) in{" "}
        <code className="font-mono text-[0.8125rem]">compositionAuditAllowlist</code>.
      </p>
      <ul className="space-y-2">
        {compositionAuditAllowlist.map((entry) => (
          <li key={`${entry.file}:${entry.ruleId}`} className="rounded-lg border border-border bg-surface p-3">
            <p className={labelClasses}>
              <span className="font-mono text-[0.8125rem]">{entry.file}</span> · {entry.ruleId}
            </p>
            <p className={cn(bodyClasses, "mt-1 text-muted")}>{entry.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  ),
};
