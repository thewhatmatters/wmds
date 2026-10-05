// @thewhatmatters/wmds@0.4.5 · Pattern — pinned height
// Storybook: Components/Card/Card → Pattern — pinned height (?path=/story/components-card-card--pinned-height)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import {
  Button,
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantWellClasses,
  cardSubtitleClasses,
  cardTitleClasses,
} from "@thewhatmatters/wmds";

<Card shape="rounded" padding="none" variant="surface" className="h-[280px] max-w-lg">
  <Card.Header
    start={
      <>
        <h2 className={cardTitleClasses}>About you</h2>
        <p className={cardSubtitleClasses}>A few sentences is enough.</p>
      </>
    }
  />
  <Card.Body>
    <div className={cardLayoutBodyOccupantWellClasses + " " + cardLayoutBodyOccupantInsetXClasses + " flex flex-col gap-3 py-3"}>
      <p>Name</p>
      <p>Email</p>
      <p>Company</p>
      <p>Project details that run longer than the pinned shell.</p>
      <p>Extra lines stay in the body scrollport.</p>
      <p>Header and footer do not move.</p>
    </div>
  </Card.Body>
  <Card.Footer>
    <div className="ml-auto flex items-center gap-2">
      <Button role="secondary" size="md" type="button">Cancel</Button>
      <Button role="primary" size="md" type="button">Next</Button>
    </div>
  </Card.Footer>
</Card>
