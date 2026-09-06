# ADR-0018: PageHeader molecule

**Status:** Accepted  
**Date:** 2026-09-06

## Context

App shell and dashboard pages need a shared horizontal chrome row — canvas title + cluster actions, in-page section titles, and compact filter/toolbars. **Card.Header** is in-card only. The App shell example hand-rolled **AppHeader** with local `*Styles.ts` recipes.

Stat docs previously told apps to compose section chrome with raw heading utilities + **Button** — that duplicated layout and broke alignment with the 56px NavRail logo band.

## Decision

### Tier and API

- **Molecule:** `PageHeader` in `src/components/molecules/PageHeader/`
- **Slots:** `start`, optional `title`, `end` — same mental model as **Card.Header**, page-scoped
- **`variant`:** `app` | `page` | `toolbar`

| Variant | Element | Height / chrome | Title tag |
|---------|---------|-----------------|-----------|
| **app** | `<header>` | 56px band, `--grid-margin` inset, inset bottom hairline | `h1` |
| **page** | `<header>` | Flexible row — section above content | `h2` |
| **toolbar** | `role="toolbar"` | Cluster min-height row (`md` / 36px) | optional `span` (`ui-label`) |

Export **`pageHeaderAppBandHeightClasses`** for shell examples that must align secondary nav / logo rows to the same 56px band.

### Composition

- **PageHeader** owns shell + typography only — actions compose **SegmentedControl**, **Button**, **Avatar**, **Chip**, **MoreMenu** in slots at one cluster tier.
- No slots beyond `start` / `end`; no built-in breadcrumbs or back button (pass via `start`).

### Non-goals (v1)

- Sticky / scroll collapse behavior
- Breadcrumbs molecule
- Subtitle / description row — use `start` or page layout below the header

## Consequences

- **Positive:** App shell uses **PageHeader** `variant="app"` — one contract for canvas chrome.
- **Positive:** Stat / insights docs can point to **PageHeader** instead of ad-hoc flex rows.
- **Follow-up:** ~~**NavRail**, **SideNav** organisms~~ (ADR-0020, ADR-0019); mobile **TabBar**.

## References

- **Examples/App shell** — `PageHeader variant="app"`
- **Molecules/PageHeader** — Pattern stories (app, page, toolbar)
- ADR-0011 (cluster pairing), ADR-0004 (pattern-first)
