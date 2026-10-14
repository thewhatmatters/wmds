# ADR-0049: Side sheet and URL state

**Status:** Accepted
**Date:** 2026-10-13

## Context

Portal pages (approvals, ideas) open a row's detail beside the list. ADR-0016 already gives **Sheet** `side="end"`: portal, scrim, Escape, scrim click, focus trap and return, scroll lock, pinned header and footer, and a scrolling body. Three things were missing: actions in the header next to the close, a phone layout that is not a strip of scrim beside a narrow rail, and a way to keep the open detail in the URL so Back closes it and a link opens it.

## Decision

Extend **Sheet**. No new component, no new variant, no new token.

- **`headerActions`** (new slot on `Sheet.Content`) renders before the close, in the same header cluster (`OverlayPanelHeader` `headerEnd`). **IconButton** `size="sm"` for previous / next, share, open in full.
- **`side="end"` is full-screen below `md`.** No 16px scrim inset, no radius, the close stays top-right. The header and footer stay pinned and the body scrolls. The footer (or the panel bottom when there is none) pads to `max(1rem, env(safe-area-inset-bottom))`. From `md` it is the rail it was, with `bg-overlay/50` as a lighter scrim. `bottom` and `start` are unchanged.
- **The page behind is inert** while a **Sheet** is open (`inert` on the other top-level nodes of `body`), and focus returns to the opener on close. A deep link has no opener, so focus goes to the page's `main` landmark.
- **Reduced motion** fades the panel; it does not slide.
- **`useSheetParam(kind, { initialUrl? })`** (`src/lib/sheetParam`) keeps one sheet in `?sheet=<kind>&id=<id>` with the History API and no router: `pushState` on open, `replaceState` on close, `popstate` closes. It returns `{ open, id, onOpenChange(open, id?) }`. Opening needs an id. It reads the URL with `useSyncExternalStore`, so the browser sees a deep link on the first render and a server render sees `initialUrl`; the two agree when the app passes the request URL. **`readSheetParam(url)`** and **`withSheetParam(url, id | null, kind)`** are pure and exported for routers that own the URL, and for `href`s so a row stays a real link without JavaScript.

### Breakpoint

The plan quoted "md (640px)". In WMDS `md` is 768px and `sm` is 640px (ADR-0003). The sheet already switched at `md`, so full-screen follows `md`.

## Consequences

- Every `side="end"` **Sheet**, including **SiteNav**'s phone menu, is full-screen below `md` and has the lighter scrim. This is the one behavior change apps can see.
- `close` keeps its accessible name "Close sheet".
- Closing replaces the current history entry, so after open then close the history holds the page twice; Back from there goes to the previous page.
- Other portaled UI (Toaster) is inert while a **Sheet** is open.
- The portal wiring (Approvals and Ideas pages) is the app's.

## References

- ADR-0003, ADR-0016, ADR-0048
