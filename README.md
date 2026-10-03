# WMDS — WhatMatters Design System

Tailwind v4 theme + **pattern-first** Storybook catalog. **Storybook is canonical** — prescribed components and Sites patterns, not utility-class soup.

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
npm run build       # dist/ — modules, types, styles.css, theme partials, fonts — then checks the manifest
npm run lint        # oxlint
npm run typecheck   # tsc -b — src, stories, and tests
npm run test:unit
npm run test:interactions     # every story in Chromium, accessibility included
npm run validate:composition  # molecules/organisms must compose atoms (CI)
```

**Agents:** read **`AGENTS.md`** and **`.cursor/rules/`** before authoring components — Storybook patterns are the contract; `npm run validate:composition` enforces atomic composition. **AGENTS.md → Guardrails** lists the rules CI enforces, and **`docs/audits/`** records why.

## Status

**Shipped (exported from `@whatmatters/wmds`):**

| Tier | Components |
|------|------------|
| Atoms | `Avatar`, `Badge`, `Button`, `Checkbox`, `IconButton`, `Input`, `Kbd`, `Radio`, `RiveHand`, `Skeleton`, `Status`, `Switch`, `TextArea`, `TextLink`, `Tooltip` |
| Molecules | `Accordion`, `CalEmbed`, `Card`, `ChatQa`, `CheckboxGroup`, `Chip`, `DisplayControls`, `Dropdown`, `Field`, `FloatingActionButton`, `HeroIntro`, `IntakeForm`, `NavList`, `PageHeader`, `PillGroup`, `PromptBar`, `RadioGroup`, `Search`, `Select`, `SelectableCard`, `SegmentedControl`, `Stat`, `StepProgress`, `TaskRows`, `TextSequence` |
| Organisms | `Chart`, `Confetti`, `Dialog`, `FooterReveal`, `HeroTileStack`, `IntakeConfirmation`, `IntakeModal`, `MoreMenu`, `Panel`, `ScrollHorizontal`, `Sheet`, `SiteNav`, `Tab`, `Toast` |
| Planned, not built | `Carousel`, `Pagination`, `Table` |

The list is `src/package.manifest.ts`. `npm run build` fails when it and `src/index.ts` disagree.

**Storybook-only:** **Sites/** (pages and flows per product — WhatMatters, PitchKit) and **Guides/** (cross-component guidance) — page-level compositions for copy-paste; not package exports.

**Motion:** CSS tokens for simple transitions; [`motion/react`](https://motion.dev/docs/react) for gestures, layout, and enter/exit. Helpers in **`src/lib/motion.ts`** (reads Theme CSS vars).

**Architecture:** Theme → lib → Atoms → Molecules → Organisms → Sites / Guides. **Pattern-first** for consumers ([ADR-0004](docs/adr/0004-pattern-first-not-utility-first.md)). **Mobile-first** on all tiers ([ADR-0003](docs/adr/0003-responsive-mobile-first.md)). See ADR-0001, ADR-0002.

## Paper

Paper may stay installed for mockups — it does **not** own tokens. Design follows Storybook.

See **`CONSUMING.md`** for using WMDS in other apps.
