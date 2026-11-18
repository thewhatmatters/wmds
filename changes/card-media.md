---
bump: patch
---
**Card: `Card.Media` cuts a picture or a product screen at the card's edges.**

- **Card.Media** (new): a picture, a video or a product screen that reaches the card's edges through the card's own padding (as the first child it meets the top edge, as the last the bottom edge, sinking to it when the card is stretched in a row), cut by the card's rounded shell. Images and videos directly inside cover the box; size it with `className`. `bleed="end"` starts it at the card's text inset and lets it run off the end edge; `fade` fades its bottom into the card's fill with a mask. Works with every `padding`; with `padding="bare"`, `--card-inset` on the card sets where `bleed="end"` starts (default 1.5rem).
- New exports: `cardMediaBleeds`, `CardMediaBleed`, `CardMediaProps`.

### Consumer actions

- None. Where a pattern built its own visual box inside a card (a `div` with negative margins or `!py-0`), switch to `Card.Media`.
