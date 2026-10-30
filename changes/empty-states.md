---
bump: minor
---

**Empty states (Rule 22).**
- **EmptyState** (new, Z7–Z9): what takes a list's place when it's empty. `kind="first-use"` (what shows up here + the main action), `"no-results"` (names the words or filters; Clear filters via `onClearFilters`, required), `"done"` (a short positive line, no action). Optional 24px icon, no illustrations; at most a quiet "Learn more". Warns on a `no-results` without `onClearFilters` and a `done` with an action. Docs give a sentence template for each kind.
- **Every `empty` slot uses it** (Z7): a plain string in TileGrid, IndexList, TaskRows (table) or LogView `empty` renders an EmptyState (TaskRows' "Nothing waiting" is a `done`). CalEmbed's empty state is an EmptyState with the email route as its action.
- **`resultsLabel`** on TileGrid and IndexList (new, Z6): the result count in a status line, read out when it changes ("0 projects match").
- Story **Components/EmptyState → Pattern — filter to zero** (interaction test: the heading and filters stay, the empty state names the filters, the count is announced, Clear filters brings everything back).

### Consumer actions

None required. Replace hand-built empty messages with **EmptyState**, pick the kind, and pass `resultsLabel` on filtered lists.
