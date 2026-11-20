// @thewhatmatters/wmds@0.4.54 · Pattern — bare (a bento cell)
// Storybook: Components/Card/Card → Pattern — bare (a bento cell) (?path=/story/components-card-card--bare)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Card } from "@thewhatmatters/wmds";

export function BentoCell() {
  return (
    <Card as="article" padding="bare" className="max-w-sm">
      <div className="flex flex-col gap-2 p-6">
        <h3 className="type-heading-3">Every project on one board</h3>
        <p className="type-body text-muted">Stage, owner and next date for each job.</p>
      </div>
      <div className="aspect-[4/3] bg-body" aria-hidden="true" />
    </Card>
  );
}
