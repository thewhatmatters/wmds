// @thewhatmatters/wmds@0.4.54 · Pattern — media to the edges
// Storybook: Components/Card/Card → Pattern — media to the edges (?path=/story/components-card-card--media)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Card } from "@thewhatmatters/wmds";

export function MediaCards() {
  return (
    <div className="grid max-w-3xl gap-4 md:grid-cols-2">
      <Card as="article" padding="lg" className="gap-4">
        <Card.Media className="aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"
            alt="Bright kitchen with a coastal dining table"
          />
        </Card.Media>
        <h3 className="type-heading-3">Harbour Street kitchen</h3>
      </Card>
      <Card as="article" padding="lg" className="gap-4">
        <h3 className="type-heading-3">Every project on one board</h3>
        <p className="type-body text-muted">Stage, owner and next date for each job.</p>
        <Card.Media bleed="end" fade className="h-48">
          <div className="h-full rounded-ss-[var(--radius-card-body)] border-s border-t border-border bg-body p-4">
            <p className="type-body">Harbour Street bakery site</p>
            <p className="type-body text-muted">Building · 12 Dec</p>
          </div>
        </Card.Media>
      </Card>
    </div>
  );
}
