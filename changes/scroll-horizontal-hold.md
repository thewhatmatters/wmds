---
bump: patch
---
**ScrollHorizontal: the full-bleed last tile can stay pinned.**

- **ScrollHorizontal**: new `expandHold` (0 to 4 viewports, default 0). With `expandLast`, the last tile stays pinned for that many more viewports of scroll after it has filled the screen, so a reel in `expanded` has time to play before the page moves on. The track grows by 100svh per held viewport; the sideways travel and the grow keep their scroll distance. While the tile is held, `--scroll-horizontal-hold` on the `expanded` slot runs from 0 to 1, for a "keep scrolling" cue. Reduced motion ignores it. Without `expandHold` nothing changes.

### Consumer actions

- None.
