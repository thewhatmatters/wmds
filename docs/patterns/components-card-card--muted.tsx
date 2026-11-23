// @thewhatmatters/wmds@0.4.55 · Pattern — muted (a quiet cell)
// Storybook: Components/Card/Card → Pattern — muted (a quiet cell) (?path=/story/components-card-card--muted)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Card } from "@thewhatmatters/wmds";

export function QuietCell() {
  return (
    <Card variant="muted" padding="lg" className="max-w-sm gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="type-heading-3">Sign-off in one place</h3>
        <p className="type-body text-muted">Every approval, with who gave it and when.</p>
      </div>
      <Card padding="md">
        <p className="type-body">Homepage copy: approved by Sam, 12 Dec</p>
      </Card>
    </Card>
  );
}
