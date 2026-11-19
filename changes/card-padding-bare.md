---
bump: patch
---
**Card: `padding="bare"` for content that lays itself out.**

- **Card** `padding="bare"` (new): the layout card's surface, shape and soft shadow with no section room: no 16px above and below, no 12px gap between parts. For a bento cell's own grid or a picture that runs to the card's edges. `padding="none"` is unchanged: it keeps the room `Card.Header`, `Card.Body` and `Card.Footer` need.

### Consumer actions

- None. Where a pattern took the room back with `!py-0 !gap-0` on a `padding="none"` card, switch to `padding="bare"` and drop the overrides.
