# ADR-0020: NavRail organism

## Status

Accepted

## Context

Some dense desktop products need a **primary icon-only rail** on `bg-accent` — brand mark, main destinations, and an optional footer (e.g. settings).

Secondary navigation is already **NavList** (ADR-0019). **PageHeader** `variant="app"` (ADR-0018) defines the shared 56px canvas band height aligned with the rail logo.

Product mockups showed optional **glass** hover polish on inactive items — frosted ring + inset highlight — while the active item uses a static plate (no Motion thumb).

## Decision

Ship **NavRail** as an **organism** under `src/components/organisms/NavRail/`.

### API

- `items` + `activeId` + `onSelect`; optional `footerItems`
- `brand` slot — default **NavRailBrandMark**; `null` hides brand band content
- `itemSurface`: `"glass"` (default) | `"flat"`
  - **Glass:** active plate uses `backdrop-blur-sm`, inset highlight, ring; inactive hover gets subtle glass ring/blur
  - **Flat:** solid `bg-on-accent/25` active plate + simple hover fills
- `className` — layout only (margin beside workspace); shell stays `w-14`

### Composition

- **IconButton** at cluster **md** (`navRailClusterTier`) — ghost role on accent
- Static active indicator `<span>` behind button — not button fill
- Brand band uses **`pageHeaderAppBandHeightClasses`** (56px)

### Styles

- Class recipes live in **`navRailStyles.ts`**

### Non-goals

- No Motion `layoutId` thumb — instant active swap only
- Not for secondary section lists — **NavList**
- Mobile navigation

## Consequences

- Storybook: **Components/Navigation/NavRail → Pattern — accent rail (glass)** + flat reference
- Exported from package manifest + `src/index.ts`

## References

- ADR-0018 (PageHeader app band)
- ADR-0019 (NavList secondary nav)
