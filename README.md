# WMDS — WhatMatters Design System

Tailwind v4 theme + **pattern-first** Storybook catalog. **Storybook is canonical** — prescribed components and Examples, not utility-class soup.

## Stack

| Piece | Role |
|-------|------|
| **`src/theme/colors.css`** | Astryx-aligned semantic roles (light `:root` + `[data-theme="dark"]`) — see **ADR-0007** |
| **`src/theme/theme.css`** | Tailwind `@theme` bridge — import once in apps |
| **`src/theme/fonts.css`** | Geist Sans + Geist Mono |
| **`src/theme/stateColors.css`** | Hover/active states (`color-mix` from base roles) |
| **`src/theme/typography.css`** | Astryx geometric scale + `type-*` semantic utilities — see **ADR-0009** |
| **`src/theme/grid.css`** | App-profile `--grid-*` + `grid-page` / `band` — see **ADR-0010**, **DESIGN.md → Grid** |
| **`src/theme/motion.css`** | Astryx-aligned duration/easing tiers — see **ADR-0008** |
| **`src/lib/motion.ts`** | Motion adapter — CSS vars → Tailwind + Motion |
| **Storybook** | Token catalog + component specs (start at **Introduction**) |

## Dark mode

```html
<html data-theme="dark">
```

Same utility names (`bg-body`, `text-fg`, …) — values swap in `colors.css`. Legacy `bg-bg` aliases `body`.

## Commands

```bash
npm install
npm run storybook   # http://localhost:6006 — read Introduction first
npm run build       # dist/theme.css + dist/styles.css
```

## Status

**Shipped (exported from `@whatmatters/wmds`):**

| Tier | Components |
|------|------------|
| Atoms | `Badge`, `Button`, `IconButton`, `Input`, `StatusDot` |
| Molecules | `Card`, `Chip`, `ChipFilterGroup`, `Search`, `TaskRows` |

**Storybook-only:** `Examples/FarmerMarket` — browse layout + map overlay wiring. Copy patterns into the app; Examples are not package exports.

**Motion:** CSS tokens for simple transitions; [`motion/react`](https://motion.dev/docs/react) for gestures, layout, and enter/exit. Helpers in **`src/lib/motion.ts`** (reads Theme CSS vars).

**Architecture:** Theme → lib → Atoms → Molecules → Organisms → Examples. **Pattern-first** for consumers ([ADR-0004](docs/adr/0004-pattern-first-not-utility-first.md)). **Mobile-first** on all tiers ([ADR-0003](docs/adr/0003-responsive-mobile-first.md)). See ADR-0001, ADR-0002.

## Farmer Market integration

The [farmermarket.us](https://farmermarket.us) harvest is **complete** in WMDS. Engineers wire exported primitives into the existing app stack — see **`CONSUMING.md`** for install, styles, and copy-paste patterns.

| App region | WMDS primitive | Notes |
|------------|----------------|-------|
| Map canvas | App-owned map library | WMDS does not ship map positioning |
| Map overlay | `Card` + `TaskRows` | Copy **`MarketDetailCard`** from `src/examples/FarmerMarket/` or compose from **Molecules/TaskRows → Pattern — FM market detail** |
| List pane | App-owned layout + `Input` + `ChipFilterGroup` | **Examples/FarmerMarket → Browse** |
| Page chrome / nav | App-owned | Not in WMDS |

```bash
npm run storybook   # Examples/FarmerMarket — Browse, Detail, Find morph
```

Roadmap: **`docs/farmermarket-component-roadmap.md`**

## Paper

Paper may stay installed for mockups — it does **not** own tokens. Design follows Storybook.

See **`CONSUMING.md`** for using WMDS in other apps.
