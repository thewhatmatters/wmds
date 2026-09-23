# ADR-0028 — SiteNav organism

**Status:** Accepted  
**Date:** 2026-09-23

## Context

Marketing surfaces need a site header that starts as a full-width band and collapses into a grid-contained floating pill after vertical scroll. Top-level destinations may open mega menus. NavRail (ADR-0020) was app chrome and has been removed; this is a different pattern.

## Decision

Ship **SiteNav** as an organism under **Components/Navigation**:

- slots `start` | `middle` | `end` in any combination;
- scroll-driven `expanded` → `compact` via `useScrollThreshold` (default `collapseAt` 48px); controlled `state` for specimens;
- expanded band fills `--grid-max`; compact (scrolled) pill hugs content by default — narrower than the grid (`compactLayout="grid"` optional to match expanded width);
- **SiteNav.Links** / **Link** / **Menu** / **MenuSection** / **MenuLink** on Base UI **NavigationMenu**; mega-menu panel is always **`--grid-max` wide** (pill can be narrower); open menu paints a light focus backdrop under the bar (`bg-fg/15`); middle track uses Tab-style **More** + **Dropdown** when items overflow;
- chrome via **Button** (`render` for anchors), **IconButton**, **Sheet** `side="end"` for `mobile` below `md`; brand may be icon-only with `aria-label`;
- Motion `layout` morph with `borderRadius` + medium-tier surface transitions; reduced motion disables layout animation.

## Non-goals for v1

- App / product sidebar navigation (was NavRail).
- Sticky in-page section nav.
- Multi-row mega menus with forms or media carousels.

## Consequences

Consuming apps reserve expanded height (`pt-16` / `siteNavExpandedHeightClasses`) under the fixed header. Brand + CTA + link clusters copy Pattern stories; do not restyle the bar with utilities.

## References

- ADR-0019 (NavList), ADR-0020 (NavRail — superseded), ADR-0026 (intent taxonomy)
- Base UI Navigation Menu
