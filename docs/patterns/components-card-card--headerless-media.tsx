// @thewhatmatters/wmds@0.4.6 · Pattern — headerless media
// Storybook: Components/Card/Card → Pattern — headerless media (?path=/story/components-card-card--headerless-media)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import {
  Card,
  cardBodyTextClasses,
  cardLayoutBodyOccupantRadiusClasses,
} from "@thewhatmatters/wmds";

<Card variant="outlined" shape="rounded">
  <Card.Body>
    <img
      className={`aspect-[4/3] w-full object-cover ${cardLayoutBodyOccupantRadiusClasses}`}
      src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"
      alt="Bright kitchen with a coastal dining table"
    />
  </Card.Body>
  <Card.Footer>
    <span className={cardBodyTextClasses}>3.9K likes</span>
    <span className={`${cardBodyTextClasses} text-muted`}>182 comments</span>
  </Card.Footer>
</Card>
