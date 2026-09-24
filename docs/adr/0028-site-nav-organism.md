# ADR-0028 — SiteNav organism

**Status:** Accepted  
**Date:** 2026-09-23

## Context

Marketing surfaces need a site header that starts as a full-width band and collapses into a grid-contained floating pill after vertical scroll. Top-level destinations may open mega menus. NavRail (ADR-0020) was app chrome and has been removed; this is a different pattern.

## Decision

Ship **SiteNav** as an organism under **Components/Navigation**:

- slots `start` | `middle` | `end` in any combination;
- scroll-driven `expanded` → `compact` via `useScrollThreshold` (default **50% of scrollport height** when `collapseAt` is omitted; explicit px override supported); controlled `state` for specimens;
- expanded band is **in document flow** (scrolls away with content); compact is a **separate** hug pill that **pins 1rem from the top** (`fixed` on the window, `sticky` inside a `scrollContainer`; `compactLayout="grid"` optional);
- expanded band fills `--grid-max`; compact hugs content by default;
- **SiteNav.Links** / **Link** / **Menu** / **MenuSection** / **MenuLink** on Base UI **NavigationMenu**; mega-menu panel is always **`--grid-max` wide** (pill can be narrower); open menu paints a light focus backdrop under the bar (`bg-fg/15`); middle track uses Tab-style **More** + **Dropdown** when items overflow;
- chrome via **Button** (`render` for anchors), **IconButton**, **Sheet** `side="end"` for `mobile` below `md`; brand may be icon-only with `aria-label`;
- Motion: compact pill slides on **y** (−72px) and feathers with opacity in parallel (medium tween); reduced motion skips the motion.

## Non-goals for v1

- App / product sidebar navigation (was NavRail).
- Sticky in-page section nav.
- Multi-row mega menus with forms or media carousels.

## Consequences

Consuming apps place **SiteNav** in normal document flow (no `pt-16` under a fixed overlay). While compact is pinned, SiteNav keeps an in-flow spacer at the expanded band height. Brand + CTA + link clusters copy Pattern stories; do not restyle the bar with utilities.

## References

- ADR-0019 (NavList), ADR-0020 (NavRail — superseded), ADR-0026 (intent taxonomy)
- Base UI Navigation Menu
