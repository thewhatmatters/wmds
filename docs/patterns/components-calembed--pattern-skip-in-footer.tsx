// @thewhatmatters/wmds@0.4.4 · Pattern — skip in footer
// Storybook: Components/CalEmbed → Pattern — skip in footer (?path=/story/components-calembed--pattern-skip-in-footer)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, CalEmbed, Card } from "@thewhatmatters/wmds";

export function BookACall() {
  return (
    <Card padding="none" variant="surface">
      <Card.Body>
        <CalEmbed skip={false}>
          <Button role="primary" type="button">
            Confirm this time
          </Button>
        </CalEmbed>
      </Card.Body>
      <Card.Footer>
        <CalEmbed.Skip onSkip={() => undefined} />
        <Button role="secondary" type="button">
          Cancel
        </Button>
      </Card.Footer>
    </Card>
  );
}
