---
bump: patch
---
**ScrollHorizontal: the expanded content can ride on the last tile.**

- **ScrollHorizontal**: new `expandedReveal` (`fade` by default, or `grow`). With `expandLast`, `grow` makes the `expanded` content the last tile's face from the start: its box rides in the row on that tile and grows with it to the full screen, clipped to the tile's box and radius, so a film can already be playing in the small tile. Give the content `size-full`. `fade` is what it did before (clear until the tile is mostly grown, then fades in on the full screen). Reduced motion shows the content in the static section either way.

### Consumer actions

- None.
