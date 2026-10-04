# ADR-0040: Index list and filter panel

**Status:** Accepted
**Date:** 2026-10-04

## Context

The whatmatters.so blog index is a filtered post list: a display title with a live count, a "/ Filters" side panel with a Topic checkbox group, and "/ Date" and "/ Name" captions over rows of a date and a large linked title. The app placed most of it by hand. WMDS had no row for an editorial index (Table is planned; **Accordion** rows are 44px one-liners whose whole row is the trigger; **TaskRows** is for status), no count on **Checkbox**, no caption type style, and only the underlined prose link. A closed **Accordion** panel kept its controls in the tab order, so the app could not make its filter group collapsible.

## Decision

| Piece | Where |
|-------|-------|
| **IndexList** + **IndexList.Item** | New molecule, Components/IndexList |
| **Guides/Filter panel → Pattern — filtered index** | Guide; Show code is the page |
| **Checkbox** / **CheckboxGroup.Item** `count`, `countLabel` | Atom / molecule props |
| `type-eyebrow` | Utility in `src/theme/typography.css`; `typographyClass("eyebrow")` |
| **TextLink** `variant` (`prose` \| `quiet`) | Atom prop |
| **Accordion** `flush` | Molecule prop, plain variant |
| `.motion-collapse` closed panels | `visibility: hidden` once folded |

- **IndexList is a list, not a Table variant.** Rows are `li` in a `ul role="list"`. The title is a heading wrapping a quiet **TextLink**; the preview is a separate **IconButton** disclosure at the row's end, so a row both links and expands. Captions are visual (`aria-hidden`) — they are not associated with the rows, and the meta reads on its own (a `<time>`).
- **Tracks come from a container query.** Two tracks (7.5rem meta, title) once the list is 32rem wide, one column below. A list in a tablet column beside a filter panel reads like a phone without the app knowing the breakpoint. Captions hide in one column.
- **`type-eyebrow` is a new role, not the `caption` role.** `caption` stays sentence-case supporting text and `overline` stays the sans uppercase label inside app UI. The eyebrow is small uppercase mono for editorial captions. The "/" marker is not part of the utility. *Amended by ADR-0041:* **SectionCaption** and **IndexList** captions draw the marker themselves, `aria-hidden`, on an emphasized rule.
- **The checkbox count is read in parentheses after the label** ("Guides (2)", or "Guides (2 posts)" with `countLabel`). The visible number is `aria-hidden`.
- **Closed collapse panels turn `visibility: hidden` after the fold.** `visibility` animates as "visible" for the whole transition, so a CSS transition on it hides the panel only once the fold ends and shows it at once on open. This avoids the `inert` attribute, whose React typing differs between 18 and 19.
- **Accordion `flush`** drops the plain variant's 16px inset so labels line up with the text around it. The trigger reaches 8px past each edge for a rounded hover band and an inset focus ring that a scroll container cannot clip.
- **The filter panel is a guide, not a component.** It composes **Accordion**, **CheckboxGroup**, **Button**, **IndexList**, and **Sheet** (bottom, below `md`). Filter state stays in the app.

**Pagination** stays planned; the blog has four posts.

## Consequences

The blog index replaces its hand-placed grid, caption classes, and count-in-label with the pattern. Any app using `.motion-collapse` gets the focus fix. Tests that query content inside a closed panel by role must open it first.

## References

- ADR-0004, ADR-0006, ADR-0009, ADR-0026, ADR-0039
