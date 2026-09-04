# ADR-0011: Cluster control scale

**Status:** Accepted  
**Date:** 2026-09-04

## Context

**Chip**, **IconButton**, and compact **Button** controls often sit in one horizontal row — Card header `end` slots, filter rails, toolbar groups. Each component had its own size ladder:

- Chip `sm` = 28px, IconButton `sm` = 32px (mismatch in Card header stories)
- No canonical pairing; developers expected `sm` + `sm` to align

Primary **Button** `md` (44px) remains the default action size — cluster scale is for **dense rows**, not every button on the page.

## Decision

### Shared cluster tiers (`src/theme/cluster.css`)

| Cluster tier | Token | Height (4px spacing) |
|--------------|-------|----------------------|
| **sm** | `--cluster-height-sm` | 28px (7× spacing) |
| **md** | `--cluster-height-md` | 36px (9× spacing) |
| **lg** | `--cluster-height-lg` | 44px (11× spacing) |

Class recipes live in **`src/lib/clusterScale.ts`**. Storybook: **Foundation → Cluster**.

### Component size props (canonical pairing)

| Cluster tier | Chip | IconButton | Button (compact) |
|--------------|------|------------|------------------|
| **sm** | `sm` | `xs` | `xs` |
| **md** | `md` | `sm` | `sm` |
| **lg** | `lg` | `md` | `md` |

Use **`iconButtonSizeForCluster()`** / **`buttonSizeForCluster()`** when composing headers — do not guess prop names.

### Extended sizes (outside cluster)

- **IconButton `lg`** — 48px FAB / hero icon actions
- **Button `lg`** — 48px extended actions
- **IconButton `inset`** — dismiss inside Chip shell (smaller than cluster sm)
- **Search** inner track — composite molecule recipe; not forced onto cluster tiers

### `--spacing` unchanged

Cluster heights derive from **7 / 9 / 11 × `--spacing`** (4px base). **Component classes** use matching Tailwind utilities (`h-7`, `h-9`, `min-h-11`, `size-7`, …) via `clusterScale.ts` — not `length:var(--cluster-*)` in class strings.

## Consequences

- Card header clusters: **`Chip sm` + `IconButton xs`** share 28px; **`Chip md` + `IconButton sm`** share 36px
- **Button `sm`** moves from 32px → **36px** (cluster md) — intentional alignment break for early catalog
- New header/toolbar patterns must reference Foundation → Cluster pairing table
- Tab organism (when shipped) should use cluster scale for segment controls

## Related

- ADR-0003 — cluster **lg** = 44px touch target
- ADR-0007 — spacing base
- ADR-0010 — page grid spine (orthogonal to control clusters)
