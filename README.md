# WMDS — What Matters Design System

Paper is the visual source of truth. This repo holds the **runnable** version: CSS tokens + React components + Storybook for interactive states.

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

**Color modes:** light tokens use `--color-{role}`; dark parallels use `--color-{role}-dark`. Storybook’s **Theme** toolbar sets `data-wmds-theme="dark"`, which maps dark tokens onto the same semantic names via `src/tokens/theme-dark.css` — components stay unchanged.

When you update a token in Paper and sync `tokens.css`, every component updates. Tailwind is plumbing, not the design source.

## Icons

WMDS does **not** bundle an icon library. Components accept icons as React nodes via `icon`, `startSlot`, or `endSlot` — any SVG works; styling uses `stroke-current` / `text-inherit` so icons follow button foreground color.

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

1. Design tokens + button matrix in Paper (static state frames for reference)
2. Sync tokens: copy Theme tab → `src/tokens/tokens.css`, or ask Cursor + Paper MCP to `get_tokens`
3. Export layout: `get_jsx` on a button frame → refine into `Button.tsx`
4. Verify states in Storybook (hover, active, focus, disabled)

### Paper components must use tokens

Paper is where we **prove** the design system works. When building or populating any component frame:

- Use **`var(--token-name)`** for every color, font, size, spacing, radius, and shadow — never raw `#hex`, `px`, or font names in node styles.
- **Create the token first** (`create_tokens` + `tokens.css`) if it does not exist yet — **color tokens require your review before creation** (agent will propose name, value, and usage; wait for approval)
- After edits, check the Theme tab or `get_computed_styles` — hardcoded values mean a token was skipped.

See `.cursor/rules/wmds-paper-tokens.mdc` for agent enforcement.

## Consuming from other apps (later)

Publish as `@whatmatters/design-system` (or install from GitHub). Other repos:

```bash
npm install @whatmatters/design-system
```

```tsx
import { Button } from "@whatmatters/design-system";
import "@whatmatters/design-system/tokens.css";
```

No MCP or server required at runtime — just npm.

## Paper file (WMDS)

| Page | Artboard | Contents |
|------|----------|----------|
| **Foundation** | **Semantic colors — light** / **Dark mode — semantic colors** | Swatch boards + Theme tab |
| **Components** | **Buttons** | Variants (incl. success), sizes, states, matrix, loading — all token-bound |
| **Components** | **Badges** | Semantic variants, status labels, count pills |
| **Components** | **Cards** | Variants, elevation, padding, composed slots |
| **Components** | **Restock card** | DS specimen — proves target agent UI is token-generatable (not a shipped component) |
| **Components** | **Restock card (reference)** | Original inspiration — user cleanup |

Paper = visual spec. Storybook = interactive code. Sync is manual/agent-driven (`get_jsx` on a frame → refine `Button.tsx`).

## Components vs examples

| Kind | Storybook | Exported from package |
|------|-----------|------------------------|
| **Components** | `Components/*` | Yes (`src/index.ts`) |
| **Examples** | `Examples/*` | No — specimens that validate tokens + composition against a target UI |

## Components

| Component | Storybook path | Status |
|-----------|----------------|--------|
| **Button** | `Components / Button` | 7 variants × 4 sizes (xs–lg); slots: `icon` / `badge` (pass Lucide or any SVG) |
| **Card** | `Components / Card` | Variants, elevation, padding, compound slots |
| **Badge** | `Components / Badge` | Semantic variants, label + count appearances (Astryx-aligned) |

## Examples (not exported)

| Specimen | Storybook path | Purpose |
|----------|----------------|---------|
| **Restock agent card** | `Examples / Restock agent card` | Target agent prompt UI — confirms WMDS can reproduce it with tokens + Button |

Preview locally:

```bash
npm run storybook
```

Open **Components → Button → Interactive states** to hover, click, and Tab through focus rings.

## When to add a Cursor skill (proposed, not yet)

Stay on **agent + Paper MCP** for now. Revisit creating a `sync-wmds-tokens` (or similar) skill when **any** of these become true:

- 5+ components exist in Paper **and** code
- Token or font changes need to propagate to **consumer app repos**
- You want a **`verify-tokens` CLI** in CI (Paper ↔ `tokens.css` drift)
- Someone other than you runs sync workflows and keeps missing steps (Google Fonts import, Paper Theme tab, etc.)

Until then, a short prompt (*"sync tokens from Paper to wmds"*) plus this README is enough.

### Changing fonts (no skill needed yet)

1. `get_font_family_info` in Paper for the new family
2. Update `--font-family-sans` / `--font-family-mono` in `tokens.css` **and** Paper Theme tab
3. Update the Google Fonts `@import` in `src/styles/global.css`
4. `npm run build` and spot-check Storybook — components should use `font-sans` / `font-mono` only
