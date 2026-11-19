---
bump: patch
---
**Table: `fit` lets a small table wrap inside a narrow box.**

- **Table** `fit` (new): the table takes its box's width instead of its content's, and its cells, header cells included, wrap (figures, `align="end"`, stay on one line). A small table in a narrow box (a bento cell, a card on a 320px phone) no longer scrolls sideways inside its region. Off by default: a data table still keeps its columns at their content's width and scrolls. `rules="grid"` already fit its box and is unchanged.

### Consumer actions

- None. Where a pattern took the scroll away with its own overrides, drop them and set `fit`.
