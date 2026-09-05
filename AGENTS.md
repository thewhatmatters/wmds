# WMDS — agent notes

- **Brand:** **WhatMatters** (joined) — never "What Matters" in copy or docs.

## Storybook-first

- **Storybook** is the canonical catalog — Foundation tokens, then Components as they are rebuilt.
- **Theme** lives in `src/theme/` — `colors.css` (semantic roles) + `theme.css` (Tailwind `@theme` bridge). Storybook is the source of truth, not Paper.
- **Dark mode:** `[data-theme="dark"]` on `<html>` or any ancestor — same token names, swapped values in `colors.css`.
- **Authoring (WMDS repo):** **Pattern-first** — ship **components + props + Storybook examples**, not utility recipes for apps. Tailwind utilities belong **inside** `*Styles.ts` / component files. See **ADR-0004**.
- **Consuming apps:** use exported components and typed props; `className` for layout only — not re-theming. Page layout utilities (`gap`, `grid`, `max-w`) are fine between components.
- **Theme tokens:** Astryx-aligned roles in **`src/theme/colors.css`**; typography in **`src/theme/typography.css`** (`type-*` utilities, geometric scale); motion in **`src/theme/motion.css`**; page spine in **`src/theme/grid.css`** (`--grid-*`, `grid-page` / `band`, `--leading-base`). **`--spacing` stays 4px** — do not re-scale; baseline is 8px. See **ADR-0007**, **ADR-0008**, **ADR-0009**, **ADR-0010**, **DESIGN.md → Grid**. Use **`typographyClass()`** — not raw `text-sm` in document copy.
- **Motion:** Astryx-aligned tiers in **`src/theme/motion.css`** — **fast** (hover/focus), **medium** (panels/layout), **slow** (rare). Single **`--ease-standard`**. CSS via `motionTransition()`; Motion via `motionTransitionProp()`. See **ADR-0008**. Storybook wraps `<MotionConfig reducedMotion="user">`.
- **Icons:** **[Lucide](https://lucide.dev/icons/) only** until further notice — import from **`lucide-react`** in components, stories, and examples. Peer dep, not bundled; use `stroke-current` / `ButtonIcon` for sizing. See **Foundation → Icons**.
- **Button:** pill by default; **`layout="row"`** for flat full-width detail/settings lines. Four **roles** (`primary`, `secondary`, `ghost`, `destructive`). Patterns: action, **`row`**, `icon`, `count`, `status` morph — mutually exclusive where documented. No slots. [Motion reference](https://motion.dev/examples/react-multi-state-badge).
- **IconButton:** circular icon-only control ([Astryx IconButton](https://astryx.atmeta.com/components/IconButton)). Patterns: toolbar (ghost), `fab`, `loading`, `title` tooltip, **`inset`** (compact dismiss inside Chip). **`aria-label` required** — use `Button` when text is needed.
- **Badge:** solid and **muted** semantic fills ([Astryx Badge](https://astryx.atmeta.com/components/Badge)). Patterns: label, **`emphasis="muted"`**, `count`, `icon`, **`iconOnly`** — mutually exclusive where documented. **`BadgeSegmentCount`** for filter/tab segment totals (Chip trailing count). No slots; no **Status** dot inside Badge.
- **Chip:** filter/toggle molecule — composes **`BadgeIcon`** / **`ButtonIcon`**, **`IconButton inset`** (remove), **`BadgeSegmentCount`** (count). Patterns: **multi-select filter** (`ChipFilterGroup` + `value`), single-select group, standalone `selected`, **removable** (`onRemove`), **read-only**. Sizes `sm` | `md` | `lg`. Optional `icon`, `count` — not with `onRemove`. No slots.
- **TaskRows:** expandable task rows — composes **Accordion** for disclosure; adds status (**Badge**, **Status**), **meta**, detail rails, and **TaskRows.Detail**. Patterns: **status rows**; **capsules**; **action details** (`detailsLayout="actions"` + `TaskRows.Detail variant="button"` → **Button** `size="xs"`); **tag chips** (`detailsLayout="chips"` + read-only **Chip** `size="sm"`); **detail lines** (`TaskRows.Detail` + `onPress` → **Button** `layout="row"`). Optional **Card.Body**.
- **Accordion:** generic expand/collapse — **leading**, **label**, **trailing**, built-in chevron, `motion-collapse` panel. Variants: `list`, `capsule`, `plain`. **TaskRows** is the task-status pattern on top.
- **Composition audit:** `src/lib/compositionAudit.ts` + **Foundation → Composition audit** — static scan of molecules/organisms for hand-rolled affordances. **`compositionShellExceptions`** = approved molecule shells; **`openGaps`** + **`compositionTrackedOpenGaps`** must stay **empty** (CI fails otherwise). CI: `npm run validate:composition`.
- **Card:** [Astryx Card](https://astryx.atmeta.com/components/Card) — `Card.Header`, `Card.Body`, `Card.Footer`. Layout cards (`padding="none"`): header/footer on the shell; **`Card.Header`** is two horizontal slots (`start` | `end`) at **16px** (`px-4`). **`Card.Body` is a square composition slot** with a **2px** horizontal gutter — no inner pad, no radius, **no default fill**. The **occupant** dictates how the body region looks; use **`cardLayoutBodyOccupantInsetXClasses`** (`px-3.5` / 14px) + **`cardLayoutBodyOccupantPadYClasses`** (`py-[16px]` / literal 16px vertical) when body content should align with header/footer (2px + 14px = 16px horizontal). Inset gray/chart wells → **`cardLayoutBodyOccupantWellClasses`** (`bg-body` + **`rounded-[14px]`** — shell `rounded-2xl` 16px minus 2px gutter) or **`cardLayoutBodyOccupantDotGridWellClasses`**; set **`bodyTerminal`** when there is no **Footer** (2px bottom shell inset). Default **`shape="rounded"`**. **`shape="flush"`** only when a parent owns outer chrome. Simple cards: `padding="md"`.
- **Input:** pill-only. Optional leading `icon`; trailing `endBadge` or status / `loading`. Hero search with inset button → **Search** molecule. See **ADR-0006**.
- **Select:** pill trigger matched to **Input** shell + floating listbox (**Dropdown.Menu** / **Dropdown.Item**). **`size="sm"`** in Card headers beside **Chip sm**. Options support **`start`** / **`end`** slots for icons and shortcuts. See **Molecules/Select**, **Molecules/Dropdown**.
- **Dropdown:** shared menu panel (`p-0.5` inset) + three-slot rows (`start` | label | `end`) — composed by **Select**; future action menus and multi-select.
- **Status:** fixed-scale indicators — **`variant="ring"`** (24px task progress: `active`, `step`) or **`variant="dot"`** (8px semantic: `tone`, `pulsing`). `besideLabel` / `label` for a11y. Not inside Badge.
- **Skeleton:** layout placeholder blocks — Motion horizontal shimmer ([Motion skeleton shimmer](https://motion.dev/examples/react-skeleton-shimmer)); **`index`** staggers sweep. Compose to mirror resolved chrome (title, **Select**, well, footer). **`aria-busy`** on **Card** / page region; shapes **`aria-hidden`**. Not chart-mark state — swap region for **Chart.Loading** or live marks. See **Atoms/Skeleton**, **Organisms/Chart** Card pattern stories.
- **Chart:** composes **[@visx/visx](https://airbnb.io/visx/)** primitives — peer dep, not bundled. WMDS owns shell, tooltip, legend, and **`chartTheme.ts`** token maps. **`Chart.SegmentedBar`** — capacity meter only (no tooltip); **`animate="initial" | "none"`** spring fill on mount. **`Chart.Cartesian`** + **`Chart.Cartesian.Area`** — time series with crosshair tooltip + optional **`Chart.Legend`**; **`animate="initial" | "none"`** path draw + fade enter. **`Chart.Loading`** — spinner + copy for in-flight fetch (**Card.Body**; header stays mounted). Loading model: **Skeleton** (initial layout) → **Chart.Loading** (fetch) → live marks with enter animation. Series colors: semantic **`chartSeriesConfigFromTone`** or categorical **`chartSeriesConfigFromKeys`** / **`chartSeriesColor(index)`** (ADR-0013). Tooltip portal: visx **`unstyled`** — styling only on **`Chart.Tooltip.Content`**. Cartesian host needs explicit **height** for **`ParentSize`**. See **ADR-0012**, **ADR-0014**, **ADR-0015**.
- **Layers:** Theme → **lib** → Components → Examples. Foundation = Storybook specimens only. Tailwind scan list = **`src/theme/sources.css`**. Package exports tracked in **`src/package.manifest.ts`**.
- **Responsive:** **Mobile-first** — unprefixed utilities = mobile; `sm:` / `md:` / `lg:` scale up. Review at Mobile (390px), Tablet (768px), Desktop (1280px). Grid columns step on that same scale (4 / 8 / 12). Atoms: min **44×44px** touch targets. No hover-only core actions. See **ADR-0003** and **Foundation → Grid**.
- **Cluster scale:** shared heights for controls in one row (Card headers, filter rails) — **sm / md / lg** → 28 / 36 / 44px. **Chip** `sm|md|lg` pairs with **IconButton** `xs|sm|md` and compact **Button** `xs|sm|md`. See **Foundation → Cluster** and **ADR-0011**. Use `iconButtonSizeForCluster()` when composing headers.

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

**Import rules:** atoms ← molecules ← organisms ← examples. Molecules may compose other molecules (e.g. TaskRows + Chip). Atoms never import other components.

**Molecule composition:** Every visual affordance inside a molecule must **compose atoms** — not hand-rolled mini-controls. Leading icons → **`ButtonIcon`** / **`BadgeIcon`**. Dismiss / toolbar actions → **`IconButton`** (use **`inset`** inside chips). Counts on segments → **`BadgeSegmentCount`**. Status labels → **`Badge`**. Fields → **`Input`**. Primary/secondary actions → **`Button`**. Detail / settings rows → **`Button layout="row"`**. TaskRows detail actions → **`TaskRows.Detail variant="button"`** ( **Button** `size="xs"` ); tags → read-only **Chip** `size="sm"`. If an atom’s size or pattern doesn’t fit, **extend the atom** and its Storybook spec first — do not fork a one-off in the molecule (see **Chip** removable dismiss). The molecule keeps shell, layout, and state. Rule: **`.cursor/rules/wmds-atomic-composition.mdc`**. Gate: **`npm run validate:composition`**.

**Catalog** — see `src/package.manifest.ts` → `atomicExports`. Reclassify via ADR only. **Card** is a molecule (ADR-0005).

When adding a component: create folder in the correct tier, match Storybook title prefix, add to manifest, export from `src/index.ts` alphabetically within tier. Document **Usage → Anatomy → Best practices → Examples** — the story is the contract (ADR-0004).

**Storybook copy source:** Show code is **off by default** (`preview.tsx` + **`storyMetaDocsDefaults()`** on component meta). Only **Pattern — …** stories opt in via **`storyCopySource()`** / **`withStoryCopySource()`** — drop-in imports + JSX, never CSF. **Anatomy**, **Reference**, and meta Usage/Best-practices markdown do not get Show code.

## Examples

- **`src/examples/{Name}/`** — Storybook-only; never in `src/index.ts`.

## Resume here (Chart loading + Card patterns)

**Shipped on `main` (`bc3cf26`):** **Skeleton** atom (Motion shimmer); **Chart.Loading**; **Chart.Cartesian** / **Chart.SegmentedBar** enter motion (`animate="initial" | "none"`); **Organisms/Chart** Card pattern stories with **body-state** chips (skeleton → retrieving → resolved). KPI + history companions share inset well + header skeleton; KPI keeps **Card.Footer** skeleton on initial load. Prior: **Select** / **Dropdown**; **Chart.Cartesian** + tooltip + **Chart.Legend**; **Card** inset-well recipe. Full decision + gotchas: **ADR-0015**.

| Pick up in Storybook | Path |
|---------------------|------|
| Loading phases (KPI) | **Organisms/Chart → Pattern — occupancy KPI in Card** |
| Loading phases (history) | **Organisms/Chart → Pattern — occupancy history in Card** |
| Skeleton atom | **Atoms/Skeleton** |
| Area chart + tooltip | **Organisms/Chart → Pattern — area (multi series + legend)** |
| Card examples (no state toolbar) | **Molecules/Card → body slot (occupancy KPI / history)** |
| Categorical palette | **Foundation/Charts** |

**Next backlog (ADR-0015):** wire **Select** period → **`chartBucketPeriodData`**; optional **Popover** extract; action **Dropdown** menus.

**Gotchas (don’t re-debug):** visx tooltip **`unstyled`**; Cartesian host **`height` + `minHeight`** for ParentSize; shell **`bodyTerminal`** when no **Footer** (history); inset well radius **14px** not `rounded-lg`; **SegmentedBar** has no empty/error **`state`** prop — loading is layout-level (**Skeleton** / **Chart.Loading**); Card pattern stories use **React `useState`** for body-state chips (not **`useArgs`** — breaks Docs/Canvas when mixed with React hooks); Controls → preview syncs via **`args.bodyState`**; chip → Controls may lag.

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
