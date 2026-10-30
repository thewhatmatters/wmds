// @thewhatmatters/wmds@0.4.40 · Pattern — skip above the calendar
// Storybook: Components/CalEmbed → Pattern — skip above the calendar (?path=/story/components-calembed--pattern-skip-above)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { CalEmbed, Card } from "@thewhatmatters/wmds";

export function BookACall() {
  return (
    <Card padding="none" variant="surface">
      <Card.Header start={<span className="type-label">Pick a time (optional)</span>} end={<CalEmbed.Skip onSkip={() => undefined} />} />
      <Card.Body>
        <CalEmbed skip={false}>{/* Mount the Cal.com embed here. */}</CalEmbed>
      </Card.Body>
    </Card>
  );
}
