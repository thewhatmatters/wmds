---
bump: patch
---
**Table: a ruled grid for pricing tables.**

- **Table** `rules="grid"` (new): a rule between every column and round the outside, so each cell is a ruled box. With a `colgroup` the columns are equal, so packages can head the same columns as the rows under them (Pricing — Ruled Table; Randy, 2026-11-06). Default stays `"rows"`.
- **Table** `stickyHeader` (new, with `rules="grid"`): the header row stays at the top of the page while the rows scroll under it, so each row's column is always clear (Heron-style pricing; Randy, 2026-11-06). `--table-sticky-top` sits it under a fixed nav.
- **TableHead** `wrap` (new): a header cell that holds more than a label (a heading, a price, a button) wraps, sits at the top and gets more room.

### Consumer actions

- None.
