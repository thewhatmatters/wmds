---
bump: patch
---
**ScrollHorizontal: keyboard focus never lands on a control the scroll has moved off screen.**

- **ScrollHorizontal** (fix): tabbing to a link or button inside the gallery (the intro's action, a tile's `media`, the `expanded` slot) could leave focus on something out of sight, because the browser scrolled the page into the pinned range and the travel then carried the control past the window's edge. On keyboard focus the page now scrolls to where that control shows: the start of the travel for the intro, its tile centered for a tile, the full tile for `expanded`. A control already whole on screen leaves the page where it is. Pointer focus and reduced motion are unchanged.

### Consumer actions

- None.
