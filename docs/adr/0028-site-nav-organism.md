# ADR-0028 — SiteNav organism

**Status:** Accepted  
**Date:** 2026-09-23  
**Updated:** 2026-09-24

## Context

Marketing surfaces need a site header that starts as a full-width band and collapses into a grid-contained floating pill after vertical scroll. Top-level destinations may open mega menus. NavRail (ADR-0020) was app chrome and has been removed; this is a different pattern.

## Decision

Ship **SiteNav** as an organism under **Components/Navigation**:

- slots `start` | `middle` | `end` in any combination;
- scroll-driven `expanded` → `compact` via private **`useSiteNavCollapse`** (half scrollport by default when `collapseAt` is omitted; explicit px override supported); controlled `state` for specimens. Scroll listening lives in internal `useScrollThreshold` — not a package export;
- two chrome modes: **page** (`placement="fixed"`, optional `scrollContainer`) vs **specimen** (`placement="inline"` without a scroller). Page chrome: one overlay path for the pinned compact pill (fixed to the window, sticky inside a scroller);
- expanded band is **in document flow** (scrolls away with content); compact is a **separate** hug pill that **pins 1rem from the top** (`compactLayout="grid"` optional);
- expanded band fills `--grid-max`; compact hugs content by default;
- **SiteNav.Links** / **Link** / **Menu** / **MenuSection** / **MenuLink** on Base UI **NavigationMenu**; mega body compounds **Featured** / **ReadRow** / **MenuMedia** / **MenuLinkGrid** own layout (do not assemble Card occupant class strings in apps); mega panel is always **`--grid-max` wide**; open menu paints a light focus backdrop (`bg-fg/15`); middle track uses Tab-style **More** + **Dropdown** when items overflow (overflow math shared via `resolveTabOverflow`);
- chrome via **Button** (`render` for anchors), **IconButton**, **Sheet** `side="end"` for `mobile` below `md`; brand may be icon-only with `aria-label`;
- Motion: compact pill slides on **y** (−72px) and feathers with opacity in parallel (medium tween); reduced motion skips the motion.

## Non-goals for v1

- App / product sidebar navigation (was NavRail).
- Sticky in-page section nav.
- Multi-row mega menus with forms or media carousels (static **MenuMedia** wells are in scope).
- Shared More-track UI module with Tab (overflow math is shared; More chrome stays local).

## Consequences

Consuming apps place **SiteNav** in normal document flow (no `pt-16` under a fixed overlay). While compact is pinned, SiteNav keeps an in-flow spacer at the expanded band height. Brand + CTA + mega paste **Pattern** Show code; do not restyle the bar with utilities.

## References

- ADR-0004 (pattern-first), ADR-0019 (NavList), ADR-0020 (NavRail — superseded), ADR-0022 (Tab), ADR-0026 (intent taxonomy)
- Base UI Navigation Menu
