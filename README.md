# WMDS — WhatMatters Design System

**React components and a Tailwind v4 theme for marketing sites and apps that look designed, not assembled.** MIT licensed.

[npm](https://www.npmjs.com/package/@thewhatmatters/wmds) · Demo: _coming soon_ <!-- TODO demo link --> · Case study: _coming soon_ <!-- TODO case study link -->

## Install

```bash
npm install @thewhatmatters/wmds react react-dom motion lucide-react
```

React 18 or 19. Add `@visx/visx` for **Chart**; **TextSequence** and **RiveHand** need the extra steps in [CONSUMING.md → Requirements](CONSUMING.md#requirements).

## Quickstart

```tsx
import "@thewhatmatters/wmds/styles.css";
import { Button, Input } from "@thewhatmatters/wmds";

export function Signup() {
  return (
    <form>
      <Input label="Work email" type="email" autoComplete="email" />
      <Button type="submit">Get early access</Button>
    </form>
  );
}
```

Dark mode is `data-theme="dark"` on any ancestor. A client's brand is a short `brand.css` imported after `styles.css` ([CONSUMING.md → Brand kit](CONSUMING.md#brand-kit-type-and-section-colours)).

## What's included

- **70+ components** — atoms, molecules and organisms, from Button and Input to SiteNav, AppShell, Carousel, Chart and IntakeModal. Full list under [Status](#status).
- **Tailwind v4 theme** — colour roles with dark mode, a type scale, motion tiers, a page grid and Geist fonts, as one `styles.css` or a `theme.css` for your own Tailwind build.
- **Brand kit** — an allow-listed set of CSS knobs (type, section colours, primary) that re-brands every component without forking it, with contrast kept in check.
- **160+ copy-ready patterns** — every Storybook pattern's code ships in the package (`docs/patterns/`) and as a shadcn-style [`registry.json`](registry.json).
- **`wmds-check`** — `npx wmds-check` audits an app in CI: raw controls and colours, missing labels, brand-kit contrast, and pasted patterns that drifted from the installed version.
- **Agent docs and skills** — component contracts, an export manifest and three agent skills (`skills/`) so coding agents use WMDS the way it's meant to be used.

## Developing WMDS

Tailwind v4 theme + **pattern-first** Storybook catalog. **Storybook is canonical** — prescribed components and their patterns, not utility-class soup.

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

**Shipped (exported from `@thewhatmatters/wmds`):**

| Tier | Components |
|------|------------|
| Atoms | `Avatar`, `Badge`, `Band`, `Button`, `Checkbox`, `IconButton`, `InlinePill`, `Input`, `Kbd`, `Prose`, `Radio`, `RiveHand`, `SectionCaption`, `Skeleton`, `Status`, `Switch`, `Table`, `TextArea`, `TextLink`, `Tooltip` |
| Molecules | `Accordion`, `Breadcrumb`, `CalEmbed`, `Card`, `ChatQa`, `CheckboxGroup`, `Chip`, `Combobox`, `CopyField`, `DescriptionList`, `DisplayControls`, `Dropdown`, `ErrorSummary`, `Field`, `FloatingActionButton`, `HeroIntro`, `IndexList`, `IntakeForm`, `LinkTile`, `LogView`, `NavList`, `Notice`, `PageHeader`, `PillGroup`, `PromptBar`, `RadioGroup`, `Search`, `SegmentedControl`, `Select`, `SelectableCard`, `Stat`, `StepProgress`, `TaskRows`, `TextSequence`, `TileGrid` |
| Organisms | `AppShell`, `Carousel`, `Chart`, `ChatDock`, `Confetti`, `Dialog`, `FilterPanel`, `FooterReveal`, `HeroTileStack`, `IntakeConfirmation`, `IntakeModal`, `MoreMenu`, `Panel`, `ScrollHorizontal`, `Sheet`, `SiteNav`, `Tab`, `Toast` |
| Planned, not built | `Pagination` |

The list is `src/package.manifest.ts`. `npm run build` fails when it and `src/index.ts` disagree.

**Storybook-only:** **Guides/** (cross-component guidance) — page-level compositions for copy-paste; not package exports. Product pages live in each product's app.

**Motion:** CSS tokens for simple transitions; [`motion/react`](https://motion.dev/docs/react) for gestures, layout, and enter/exit. Helpers in **`src/lib/motion.ts`** (reads Theme CSS vars).

**Architecture:** Theme → lib → Atoms → Molecules → Organisms → Guides. **Pattern-first** for consumers ([ADR-0004](docs/adr/0004-pattern-first-not-utility-first.md)). **Mobile-first** on all tiers ([ADR-0003](docs/adr/0003-responsive-mobile-first.md)). See ADR-0001, ADR-0002.

## Paper

Paper may stay installed for mockups — it does **not** own tokens. Design follows Storybook.

See **`CONSUMING.md`** for using WMDS in other apps.

## Licences

WMDS is [MIT](LICENSE). It ships or depends on work under other licences:

| Part | Licence | Notes |
|------|---------|-------|
| Geist and Geist Mono fonts (`dist/files/*.woff2`) | [SIL Open Font License 1.1](https://openfontlicense.org) | © The Geist Project Authors. The licence and copyright notice ship beside the fonts as `dist/files/LICENSE-geist.txt` and `dist/files/LICENSE-geist-mono.txt`; keep them with the fonts if you copy them out. |
| Rive hand art (`public/rive/interactive-icon-set.riv`) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Silvia Sguotti and Gabriele Montinaro — see `public/rive/CREDITS.md`. |
| `gsap`, `@gsap/react` (TextSequence only) | [GSAP Standard "No Charge" License](https://gsap.com/standard-license) | Free, commercial use included; not open source. Not bundled — installed as a dependency. |
