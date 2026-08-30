# WMDS — agent notes

- **Brand:** **WhatMatters** (joined) — never "What Matters" in copy or docs.

## Storybook-first

- **Storybook** is the canonical catalog — Foundation tokens, then Components as they are rebuilt.
- **Theme** lives in `src/theme/` — `colors.css` (semantic roles) + `theme.css` (Tailwind `@theme` bridge). Storybook is the source of truth, not Paper.
- **Dark mode:** `[data-theme="dark"]` on `<html>` or any ancestor — same token names, swapped values in `colors.css`.
- **Authoring (WMDS repo):** **Pattern-first** — ship **components + props + Storybook examples**, not utility recipes for apps. Tailwind utilities belong **inside** `*Styles.ts` / component files. See **ADR-0004**.
- **Consuming apps:** use exported components and typed props; `className` for layout only — not re-theming. Page layout utilities (`gap`, `grid`, `max-w`) are fine between components.
- **Theme tokens:** semantic roles in **`src/theme/colors.css`**; interaction states in **`src/theme/stateColors.css`**. Shades via `color-mix`, not ramp tokens.
- **Motion:** CSS tokens + `motionTransition()` for simple effects; **`motion/react`** for gestures, layout, `AnimatePresence`. Import helpers from **`src/lib/motion.ts`** (reads Theme CSS vars). Storybook wraps `<MotionConfig reducedMotion="user">`.
- **Icons:** **[Lucide](https://lucide.dev/icons/) only** until further notice — import from **`lucide-react`** in components, stories, and examples. Peer dep, not bundled; use `stroke-current` / `ButtonIcon` for sizing. See **Foundation → Icons**.
- **Button:** pill-only; four **roles** (`primary`, `secondary`, `ghost`, `destructive`). Patterns: action, `icon`, `count`, `status` morph — mutually exclusive. No slots. [Motion reference](https://motion.dev/examples/react-multi-state-badge).
- **IconButton:** circular icon-only control ([Astryx IconButton](https://astryx.atmeta.com/components/IconButton)). Patterns: toolbar (ghost), `fab`, `loading`, `title` tooltip. **`aria-label` required** — use `Button` when text is needed.
- **Badge:** solid semantic fills ([Astryx Badge](https://astryx.atmeta.com/components/Badge)). Patterns: label, `count`, `icon` — mutually exclusive where documented. No slots; no StatusDot inside Badge.
- **Chip:** filter/toggle molecule. Patterns: **multi-select filter** (`ChipFilterGroup` + `value`), single-select group, standalone `selected`, **removable** (`onRemove`), **read-only**. Sizes `sm` | `md` | `lg`. Optional `icon`, `count` — not with `onRemove`. No slots.
- **StatusDot:** fixed 8px semantic dot ([Astryx StatusDot](https://astryx.atmeta.com/components/StatusDot)). Patterns: standalone (`label`), `besideLabel`, optional `pulsing`. Not inside Badge.
- **Layers:** Theme → **lib** → Components → Examples. Foundation = Storybook specimens only. Tailwind scan list = **`src/theme/sources.css`**. Package exports tracked in **`src/package.manifest.ts`**.
- **Responsive:** **Mobile-first** — unprefixed utilities = mobile; `sm:` / `md:` / `lg:` scale up. Review at Mobile (390px), Tablet (768px), Desktop (1280px). Atoms: min **44×44px** touch targets. No hover-only core actions. See **ADR-0003** and **Foundation → Breakpoints**.

## Paper

- Paper may stay installed for mockups/reference — it does **not** own tokens and is not synced to `theme.css`.

## Components (atomic design — rebuild in progress)

Brad Frost tiers under **`src/components/`**:

| Tier | Path | Storybook title | Export |
|------|------|-----------------|--------|
| Atoms | `atoms/{Name}/` | `Atoms/{Name}` | Yes |
| Molecules | `molecules/{Name}/` | `Molecules/{Name}` | Yes |
| Organisms | `organisms/{Name}/` | `Organisms/{Name}` | Yes |
| Templates/pages | `examples/{Name}/` | `Examples/{Name}` | No |

**Import rules:** atoms ← molecules ← organisms ← examples. Atoms never import other components.

**Catalog** — see `src/package.manifest.ts` → `atomicExports`. Reclassify via ADR only.

**Farmer Market refresh** — designer harvest order and Find pill composite: **`docs/farmermarket-component-roadmap.md`**. Target FM first; restyle shipped atoms, then Chip → Input → List → Card.

When adding a component: create folder in the correct tier, match Storybook title prefix, add to manifest, export from `src/index.ts` alphabetically within tier. Document **Usage → Anatomy → Best practices → Examples** — the story is the contract (ADR-0004).

## Examples

- **`src/examples/{Name}/`** — Storybook-only; never in `src/index.ts`.

<!-- wire-vault:start -->
## Knowledge vault — project layer

This project's durable knowledge (overview, decisions, gotchas) lives in the
cross-project vault at `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/OBSDN/projects/wmds/`
(default vault: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/OBSDN`).

- **Read first:** before re-deriving an architecture decision or re-debugging
  a non-obvious issue, check `projects/wmds/index.md` there.
- **Write path:** durable insights go through `/curate-vault` (gated) —
  never write vault articles directly.
<!-- wire-vault:end -->
