---
bump: minor
---

**AppShell `asideMode="inset"` and a `toolbar` slot.** From `lg`, an inset aside is a raised card floating inside the page surface, under the title bar and the toolbar, 12px from the end and bottom edges (radius-surface-md, border, shadow-lg). The page narrows beside it and is never covered. Its header is the title bar's 56px band, with the title and description centred. The new `toolbar` prop / **AppShell.Toolbar** slot is a full-width band under the title bar; with an inset aside it spans above both. Below `lg` the aside is the overlay **Panel**, as in the other modes. New `asideFooter`: actions pinned under the aside's scrolling body (Copy, Reset), in every mode (the **Panel** `footer` in overlay). Fixed for docked and inset asides that start open: the server and the first paint no longer render the overlay **Panel** before the desktop query runs (it caused a hydration mismatch and a flash of the overlay). Story **Components/AppShell → State — aside inset, with a toolbar** (interaction test: inside the surface, under the toolbar, 12px gap, 56px header, page not covered, footer pinned).

### Consumer actions

None required. For a live-controls panel that should sit inside the page (the patterns gallery's Type panel), pass `asideMode="inset"`, move the view toolbar into `toolbar`, and put the button that opens the aside at the toolbar's end.
