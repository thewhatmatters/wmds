# ADR-0021: Mobile nav dock (expandable bottom menu)

## Status

Accepted

## Context

Desktop primary nav is **NavRail** (ADR-0020). Mobile needs a primary navigation pattern that:

- Supports **long destination labels** (e.g. "Content performance", "Creator Center") — a fixed 4–5 column bottom tab bar truncates or wraps poorly.
- Feels consistent with WMDS motion (medium scrim, fast stagger) and atomic composition.
- Keeps settings-style secondary navigation compact so page content remains visible on small viewports.

Reference patterns reviewed:

- **Vertical speed-dial** (Airwallex, Binance, Pangea) — items stack above a bottom trigger with full text labels; not a radial arch.
- **Radial menu** (Motion example) — rejected for primary nav; arch layout fights long copy and thumb reach.

Motion+ ships radial-menu and FAB expand source ([react-radial-menu](https://motion.dev/examples/react-radial-menu), [vue-floating-action-button](https://motion.dev/examples/vue-floating-action-button)); WMDS implements a **vertical stack** variant with free Motion APIs (`AnimatePresence`, stagger) — no Motion+ dependency.

## Decision

Ship **MobileNavDock** as **example-tier** chrome in `src/examples/AppShell/` (not exported from the package v1).

### Pattern

| State | Chrome |
|-------|--------|
| **Collapsed** | Floating bottom pill — active destination (`Button layout="nav"` summary) + expand **IconButton** |
| **Expanded** | Scrim (`bg-overlay`) + one elevated `bg-surface` menu containing full-width nav rows |
| **Motion** | `motionNavDockMenuVariants` + `motionNavDockItemVariants` — stagger from bottom (`staggerDirection: -1`) |

### Composition

- Nav rows reuse **NavList** item styling (`navListItem*` classes) + **Button** `layout="nav"`
- The menu owns one border and shadow; rows use borderless selected/hover fills so chrome is never nested
- Toggle: **IconButton** `role="secondary"` at cluster **md**
- Secondary nav: **MobileSecondaryNav** flattens NavList section data into one responsive **Tab** row
- Excess pages move into More; selecting one promotes it before More while keeping the settings content mounted below

### Non-goals (v1)

- Package export / organism tier — promote via ADR when apps need it outside examples
- Radial / arch layout
- Icon-only persistent tab bar (insufficient for long labels)

## Consequences

- **Examples/App shell → Pattern — shell navigation (mobile)** demonstrates the dock
- Example **TabBar** (raw `<button>` stub) removed
- **AppShellMobileLayout** mirrors desktop routing with mobile chrome only

## References

- ADR-0020 (**NavRail** desktop)
- ADR-0019 (**NavList** secondary)
- **Foundation → Motion** — panel + stagger tiers
