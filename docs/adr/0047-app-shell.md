# ADR-0047: AppShell

**Status:** Accepted
**Date:** 2026-10-12

## Context

A signed-in WhatMatters product needs page chrome: a sidebar, a title bar, a page, and sometimes a detail rail. Apps were assembling it from **NavList**, **PageHeader**, **Sheet**, and **Panel** by hand, and each copy chose its own gutters, collapse behavior, and landmarks. **Pattern — app sidebar** (ADR-0019) shows the sidebar and the phone **Sheet** but not the title bar, the collapse toggle, or the aside.

The reference shows a sidebar on the page background and the page as an inset, rounded, raised surface a few pixels from the edges.

## Decision

Add **AppShell** (organism, `Components/AppShell`). It composes existing components and adds no color, radius, shadow, variant, or token.

- **Sidebar** — a column on `bg-body` from `lg`, holding a brand row and a **NavList** (`className="w-full"`). Below `lg` the same content opens in a **Sheet** `side="start"`; a choice inside the nav closes it.
- **Surface** — the page, inset 8px, with the **Card** shell radius (`--radius-card-shell`) and `shadow-soft-card` on `bg-surface`. It is not a **Card**: a layout **Card** adds 16px top padding and a 12px gap, which would move the title bar off the sidebar's brand row. It is not a **Panel**: a **Panel** is a fixed edge flyover, not a layout region.
- **Title bar** — **PageHeader** `variant="app"`: the `h1` is `title`, the toggle is `start`, and `header` is `end`.
- **One height** — the brand row uses `pageHeaderAppBandHeightClasses` (56px), the same token as **PageHeader** `variant="app"`. Both start 8px from the top, so their bottom edges align.
- **Toggle** — a ghost **IconButton** with Lucide `PanelLeft`. From `lg` it collapses the sidebar (`aria-expanded`, `aria-controls`); below it, it opens the **Sheet**. **Ctrl** or **⌘** + **B** does the same, and a **Tooltip** with **Kbd** shows it. The shortcut is ignored in `contenteditable`. Focus inside a sidebar that collapses returns to the toggle.
- **Aside** — a **Panel** `side="end"`: non-blocking, no scroll lock, Escape closes it and focus returns to the control that opened it. The app owns the state (`asideOpen`, `onAsideOpenChange`) so a title-bar button can open it. **Panel** does not move focus into the aside on open; that is its contract.
- **API** — `<AppShell title brand sidebar header aside>…</AppShell>`, or the slots **AppShell.Brand**, **Sidebar**, **Header**, **Aside** as children. Everything else in `children` is the page. `sidebarOpen` / `defaultSidebarOpen` / `onSidebarOpenChange` and the same three for the aside are controlled or uncontrolled. `useAppShell()` returns the state for children.
- **Landmarks** — **NavList** is the `navigation`, the title bar is the `banner`, and the page is `main` (a sibling of the title bar, so `header` stays a banner). The sidebar and the **Sheet** carry one **NavList** each; only one is visible at a time.
- **Lucide** — the toggle glyph is the one `lucide-react` import in the organism, listed in `compositionShellExceptions` as **SiteNav**'s menu glyph is.

## Consequences

- Apps get one tested shell. The portal dashboard in **Components/AppShell → Pattern — portal dashboard** is the Show code to copy.
- The sidebar has two states, expanded and collapsed (hidden). An icon rail is not part of this decision.
- The desktop and phone toggles are two buttons, one hidden by CSS per breakpoint, so the server render needs no viewport query.
- Using it for marketing pages is wrong; that is **SiteNav**.

## References

- ADR-0003, ADR-0004, ADR-0016, ADR-0018, ADR-0019
