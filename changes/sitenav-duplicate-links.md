---
bump: patch
---
**SiteNav: two links to the same page keep their own labels.**

- **SiteNav.Links**: each link's id defaulted to its `href`, so a nav with two links to one page (Menu and Slices both to `/menu`) drew the later link's label twice, with no warning. Ids are now unique per item, so every link keeps its own label, its order, and its place in the More menu.
- **SiteNav.Link** `value` still sets the id; it is no longer needed to tell apart links that share an `href`.

### Consumer actions

- None. A `value` passed only to work around this can stay or go.
