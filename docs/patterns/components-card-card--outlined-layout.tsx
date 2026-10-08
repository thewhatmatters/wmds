// @thewhatmatters/wmds@0.4.7 · Pattern — outlined layout
// Storybook: Components/Card/Card → Pattern — outlined layout (?path=/story/components-card-card--outlined-layout)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Card, cardTitleClasses } from "@thewhatmatters/wmds";

<Card variant="outlined" shape="rounded" className="max-w-lg">
  <Card.Header
    start={<h2 className={cardTitleClasses}>Audience fit</h2>}
  />
  <Card.Body>
    <div className="min-h-32 px-3.5 py-4">
      Card body occupant
    </div>
  </Card.Body>
</Card>
