---
bump: patch
---
**SiteNav: an `overMedia` page no longer jumps when the bar goes compact.**

- **SiteNav**: with `overMedia`, the expanded bar lies over the picture and takes no room in the page. When the compact pill appeared, the nav still put in the placeholder that holds the expanded bar's room, so everything below moved down by `--site-nav-height` (64px by default), and an in-page link landed that far short. The placeholder is now left out over media. Without `overMedia` nothing changes.

### Consumer actions

- None.
