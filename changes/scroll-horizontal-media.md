---
bump: patch
---
**ScrollHorizontal: tiles take media.**

- **ScrollHorizontal**: an item's new `media` (one node: a cover image, a video, a canvas) fills its tile in place of the solid color. The node takes the tile's size and 12px radius and clips its own content; a tile with media does not clip, so the node may lean or lift on hover. `label` stays the accessible name. With `expandLast`, the last tile is still the color layer that grows, and media on it is not shown. Items without `media` are unchanged.

### Consumer actions

- None.
