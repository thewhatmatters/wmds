# WMDS — What Matters Design System

**Paper** is the token lab and design playground. **Storybook** is the canonical component catalog and interaction truth. This repo holds the runnable layer: `tokens.css` + React components + Storybook.

## Paper vs Storybook

| | **Paper** | **Storybook** |
|--|-----------|----------------|
| **Role** | Token lab + playground for mockups and pre-code exploration | Shipped component catalog — all states, behavior, API |
| **Source of truth for** | Design tokens, type, shadows, motion; visual language | Components, props, hover/focus/motion, exports |
| **Keep in sync?** | Foundation ↔ `tokens.css` — yes | Code — always current |
| **Component artboards** | Reference + exploration only — **not** a mirror of every story | Full matrix — this is the record |

**Workflow:** When vibe-coding a feature, compose mockups in Paper using patterns that match components already in Storybook (Button, Table, Chip, Tab, etc.) — all nodes token-bound. That gives a visible target before implementing the real screen in code. Use `get_jsx` on a frame when promoting layout to React; verify behavior in Storybook.

Do **not** maintain a 1:1 Paper artboard for every Storybook story. Update Paper when designing something **new** or revisiting visual spec — not after every code polish.

## Stack

| Piece | Role |
|-------|------|
| **`src/tokens/tokens.css`** | Canonical token values (sync from Paper Theme tab) |
| **Tailwind v4** | Utility layer in components (`bg-primary`, `hover:bg-primary-hover`) — **not** Tailwind's default palette |
| **React components** | Real `:hover`, `:active`, `:focus-visible`, `disabled` behavior |
| **Storybook** | Browse and interact with states; MCP for Cursor agents |

### Why Tailwind?

Paper's MCP `get_jsx` exports Tailwind classes by default. We map **your** Paper tokens into Tailwind via `@theme` in `src/styles/global.css` — so utilities resolve to `--color-primary`, not `blue-500`.

```
Paper tokens.css  →  @theme bridge  →  bg-primary in Button.tsx
```

**Color modes:** light tokens use `--color-{role}`; dark parallels use `--color-{role}-dark`. Storybook’s **Theme** toolbar sets `data-wmds-theme="dark"`, which maps dark tokens onto the same semantic names via `src/tokens/theme-dark.css` — components stay unchanged. Light neutrals (`--color-bg`, `--color-surface`, borders, secondary steps) are a cool white/grey ramp; dark neutrals are black/grey.

When you update a token in Paper and sync `tokens.css`, every component updates. Tailwind is plumbing, not the design source.

## Icons

WMDS does **not** bundle an icon library. Components accept arbitrary React nodes via **`startSlot`** / **`endSlot`** (or Button shorthands `icon` / `badge`). Any SVG, image, or initials work; icons typically use `stroke-current` / `text-inherit` so they follow foreground color.

**Recommended:** [Lucide](https://lucide.dev) for What Matters apps and Storybook demos. Install in the **consumer app**, not as a WMDS runtime dependency:

```bash
npm install lucide-react
```

```tsx
import { Plus } from "lucide-react";
import { Button } from "@whatmatters/wmds";

<Button icon={<Plus strokeWidth={2} />}>New item</Button>
```

Storybook uses `lucide-react` as a **devDependency** for examples only. Paper uses inline SVG paths for the same Lucide shapes — no npm coupling in the design file.

## Commands

```bash
npm run storybook   # http://localhost:6006 — interact with buttons
npm run dev         # Vite app (optional)
npm run build       # typecheck + production build
```

## Paper → code workflow

1. **Tokens** — define or change in Paper Theme tab → sync to `src/tokens/tokens.css` (`get_tokens` or manual copy)
2. **New primitive** — sketch in Paper (token-bound) → `get_jsx` → implement component → stories in Storybook
3. **New feature / screen** — mock up in Paper composing existing Storybook patterns → implement in app or Examples story → optional: leave mockup frame or discard after ship
4. **Verify** — interactive states (hover, focus, motion, portals) in Storybook only; Paper stays static

### Paper playground rules

Paper is where we **prove** tokens and **preview** compositions. When building mockups or populating frames:

- Use **`var(--token-name)`** for every color, font, size, spacing, radius, and shadow — never raw `#hex`, `px`, or font names in node styles.
- **Create the token first** (`create_tokens` + `tokens.css`) if it does not exist yet — **color tokens require your review before creation** (agent will propose name, value, and usage; wait for approval)
- After edits, check the Theme tab or `get_computed_styles` — hardcoded values mean a token was skipped.

See `.cursor/rules/wmds-paper-tokens.mdc` for agent enforcement.

## Consuming in other apps

WMDS is an **optional** dependency — use it only where you want this design language. See **[CONSUMING.md](./CONSUMING.md)** for install, styles, dark mode, and examples.

Quick start:

```bash
cd wmds && npm run build          # in this repo first
cd your-app && npm install ../wmds
```

```tsx
import "@whatmatters/wmds/styles.css";
import { Button, Card, List } from "@whatmatters/wmds";
```

Package exports: `@whatmatters/wmds`, `@whatmatters/wmds/styles.css`, `@whatmatters/wmds/tokens.css`.

## Paper file (WMDS)

Reference frames and specimens — not an exhaustive catalog (see Storybook for that). **Foundation** pages stay synced with `tokens.css`. **Components** / **Examples** pages hold key references and active mockups.

| Page | Artboard | Contents |
|------|----------|----------|
| **Foundation** | **Semantic colors — light** / **Semantic colors — dark** | Swatch boards + Theme tab |
| **Foundation** | **Shadows — light** | Elevation shadow specimens |
| **Foundation** | **Typography** | Type scale |
| **Foundation** | **Motion** | Duration, easing, press-scale token reference |
| **Components** | **Buttons** | Variants (incl. success), sizes, states, matrix, loading — all token-bound |
| **Components** | **Badges** | Semantic variants, status/count pills, `startSlot` / `endSlot` (inline chips) |
| **Components** | **Cards** | Variants, elevation, padding; `Header`/`Footer` section borders |
| **Components** | **Carousel** | Insights-style title + count + prev/next slides |
| **Components** | **Chart** | Area hero/compact + sparkline; `chartTheme` helpers |
| **Components** | **Tab group** | Segmented control — agent views + end content (StatusDot, count) |
| **Components** | **Chips** | Filter toolbar + standalone pressed/count states |
| **Components** | **Table** | Surface variant, sticky start/end, row hover, filter composition |
| **Components** | **StatusDot** | 8px semantic variants |
| **Components** | **StatusRing** | 24px count ring + active sweep |
| **Components** | **IconButton & MoreMenu** | Square hit targets + open dropdown panel |
| **Examples** | **Filter table** | Chip filters + table specimen (Storybook-only) |
| **Examples** | **Context chunks** | RAG chunk card + file attachment badges |
| **Examples** | **Restock agent card** | Collapsed agent prompt card (440px) |

Foundation ↔ `tokens.css`. Mockups compose Storybook-known patterns. Full component record lives in Storybook (`Components/*`, `Examples/*`).

## Components vs examples

| Kind | Source | Storybook | Exported from package |
|------|--------|-----------|------------------------|
| **Components** | `src/components/{Name}/` | `Components/*` | Yes (`src/index.ts`) |
| **Examples** | `src/examples/{Name}/` | `Examples/*` | No — specimens that validate tokens + composition against a target UI |

## Components

| Component | Storybook path | Status |
|-----------|----------------|--------|
| **Badge** | `Components / Badge` | Semantic variants; label + count; **`startSlot` / `endSlot`** for inline chips in prose |
| **Button** | `Components / Button` | 7 variants × 4 sizes (xs–lg); `startSlot` / `endSlot` (or `icon` / `badge` shorthands) |
| **Card** | `Components / Card` | Variants, elevation, padding; `Header`/`Footer` section borders |
| **Carousel** | `Components / Carousel` | Title + count + prev/next; compose slides with inline **`Badge`** / **`StatusDot`** / mono figures |
| **Chart** | `Components / Chart` | **`Chart.Area`** hero/compact + **`Chart.Sparkline`**; token theme via `chartTheme` / `resolveChartTone` (peer: **`recharts`**) |
| **Chip** | `Components / Chip` | Interactive filter toggles; `Chip.Group`; optional dot + count |
| **IconButton** | `Components / IconButton` | Icon-only; required `label` + `icon`; square hit targets |
| **List** | `Components / List` | Stacked row layout; **`contained`** (Card dividers) or **`separated`** chips; expandable **`ItemPanel`** (detail width aligns to header meta — chevron lane reserved) |
| **MoreMenu** | `Components / MoreMenu` | Overflow kebab menu; closed `items` API (actions, dividers, sections) |
| **StatusDot** | `Components / StatusDot` | 8px semantic status indicator; use in Badge/Chip or standalone with `label` |
| **StatusRing** | `Components / StatusRing` | 24px count ring; clockwise arc sweep when **`active`** (default when **`count > 0`**) |
| **Tab** | `Components / Tab` | Segmented **`Tab.Group`** + **`Tab`**; **`size`** `xs` \| `sm` \| `md`; `layout="equal"` + `iconOnly` view switchers; hover preview morphs into active on click |
| **Table** | `Components / Table` | Compound table; sticky columns; collapsible rows |

**Order:** keep this table, `src/index.ts` exports, and Storybook `Components/*` titles alphabetically sorted (A→Z).

### Tab vs Chip

Both can sit above a table in the same toolbar slot — different semantics:

| | **Tab** (`Tab.Group`) | **Chip** (`Chip.Group`) |
|--|------------------------|-------------------------|
| **Role** | View switching (`role="tablist"`) | Row filter toggles (`aria-pressed`) |
| **Chrome** | Shared pill track + sliding active indicator; hover preview crossfades as active slides | Individual raised pills, no shared track |
| **Trailing count** | `count={n}` — compact inline pill | `count={n}` on `Chip` |

See `Examples / Filter table` (chips), `Components / Tab → With table` (labeled tabs), and `Components / Tab → Layout switcher (icon-only)`.

### Badge inline chips

When a badge has a **`startSlot`** or **`endSlot`**, it switches to **chip layout** (separate from plain label padding):

- **14px** circular media (`size-3.5`) + **1px** vertical padding + **3px** gap — matches plain pill height (~18px with border)
- Neutral + slot → secondary chip chrome (raised hairline)
- Slot content is **content-agnostic** — logo, Lucide icon, initials; compose at the call site (no `VendorChip` export)

```tsx
<Badge variant="neutral" startSlot={<MediaCircle><img src="…" alt="" /></MediaCircle>}>
  Cone King
</Badge>
<Badge variant="success">7 days</Badge>
```

See `Examples / Restock agent card → Inline badges` for chip + plain pill side by side.

### Card section borders

With `padding="none"`, **`Card.Header`** includes `border-b` and **`Card.Footer`** includes `border-t` — edge-to-edge dividers without a manual `Card.Divider` between header and body. Use **`Card.Divider`** only for extra splits inside the body.

Pair **`Card padding="none"`** + **`List variant="contained"`** for grouped ledger rows (portfolio breakdown, settings lists). Use **`List.ItemRow`** for static lines; **`List.ItemButton`** + **`List.ItemPanel`** for disclosure rows.

### Motion (specimens)

Motion tokens live in `tokens.css` (`--duration-*`, `--ease-out-expo`, `--motion-press-scale`). Specimens use:

- **Expand drawer** — CSS grid `0fr → 1fr` + opacity (`--duration-slower`, `--ease-out-expo`)
- **Body swap** — `.animate-fade-in` (`--duration-base`) on recommendation copy
- **Button press** — `scale(var(--motion-press-scale))` on `:active`
- **Tab indicator** — active surface pill stays on selection; a secondary-hover preview slides on hover and crossfades out as active travels on click (`--duration-slower`, `--ease-out-expo`); respects `prefers-reduced-motion`

`prefers-reduced-motion` collapses transitions globally in `global.css`.

### Table scroll edge cues

Horizontal scroll uses **sticky-column box-shadows** (`.wmds-table-scroll-shadow-start` / `-end`) or scroller inset shadows when no sticky columns — not gradient overlays (alignment + bleed-through issues in practice).

## Examples (not exported)

Source: `src/examples/` — Storybook specimens only; not in `src/index.ts`.

| Specimen | Storybook path | Purpose |
|----------|----------------|---------|
| **Context chunks** | `Examples / Context chunks` | RAG chunk list — Card section borders + Badge file attachment rows |
| **Filter table** | `Examples / Filter table` | Chip filters + Table with animated row collapse |
| **Restock agent card** | `Examples / Restock agent card` | Interactive agent prompt — collapsed default, expandable alternatives drawer, option switching |
| **Task rows** | `Examples / Task rows` | Agent task list — `List` + `Card` + `Badge`; staged expand / fail / resolve motion |

Preview locally:

```bash
npm run storybook
```

Open **Components → Button → Interactive states** to hover, click, and Tab through focus rings.

## When to add a Cursor skill (proposed, not yet)

Stay on **agent + Paper MCP** for now. Revisit creating a `sync-wmds-tokens` (or similar) skill when **any** of these become true:

- Token or font changes need to propagate to **consumer app repos**
- You want a **`verify-tokens` CLI** in CI (Paper ↔ `tokens.css` drift)
- Someone other than you runs sync workflows and keeps missing steps (Google Fonts import, Paper Theme tab, etc.)

Until then, a short prompt (*"sync tokens from Paper to wmds"*) plus this README is enough.

### Changing fonts (no skill needed yet)

1. `get_font_family_info` in Paper for the new family
2. Update `--font-family-sans` / `--font-family-mono` in `tokens.css` **and** Paper Theme tab
3. Update the Google Fonts `@import` in `src/styles/global.css`
4. `npm run build` and spot-check Storybook — components should use `font-sans` / `font-mono` only
