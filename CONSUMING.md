# Using WMDS in other apps

## Philosophy — pattern-first

WMDS is **not** utility-class-first. You do **not** build product UI by composing `bg-primary`, `text-sm`, and ad-hoc borders across the app.

**Do this:**

```tsx
import { Button, Badge, Chip, ChipFilterGroup, IconButton, Input, Status } from "@whatmatters/wmds";
import "@whatmatters/wmds/styles.css";

<Button status={status}>Submit</Button>
<Button role="secondary" count={3}>Inbox</Button>
<Button role="primary" icon={<Plus strokeWidth={2} />}>New item</Button>
<IconButton icon={<Settings strokeWidth={2} />} aria-label="Open settings" title="Settings" />
<Badge variant="success">Online</Badge>
<span className="inline-flex items-center gap-1.5">
  <Status variant="dot" tone="success" besideLabel />
  Online
</span>
```

Browse patterns in Storybook under **Examples/** — copy JSX and state wiring into your app; Examples are not exported from the package.

**Not this:**

```tsx
// Avoid — re-inventing WMDS patterns
<button className="rounded-full bg-primary px-5 …">Submit</button>
<Button startSlot={<img … />} badge="New" variant="success" />
```

Use Tailwind in your app for **page layout** and spacing **between** WMDS components. For a consistent page spine, copy **`grid-page` + `band`** (below) — do not invent a Pitchkit layout atom. Use **`className` on a component** for layout tweaks (width, margin) — not for new variants or colors.

New visuals require a WMDS component or Example pattern — see **`docs/adr/0004-pattern-first-not-utility-first.md`**.

## Requirements

- **React** 18 or 19
- **Tailwind v4** recommended — import WMDS styles or theme
- **Motion** — `npm install motion` when using animated components
- **Lucide** — `lucide-react` for icons passed into component props

## Install

```bash
npm install ../wmds   # local
# or github: / npm when published
```

Build the package:

```bash
cd wmds && npm install && npm run build
```

## Wire up styles

```tsx
import "@whatmatters/wmds/styles.css";
```

Or theme only (if you configure Tailwind yourself):

```css
@import "@whatmatters/wmds/theme.css";
```

## Dark mode

```tsx
<html data-theme={dark ? "dark" : undefined}>
```

Toggle on any ancestor — same token names, values from `colors.css`.

## Grid spine (page layout)

WMDS ships a Müller-Brockmann **app** grid (`--profile=app`): column-line + 8px baseline, relaxed rows. Tokens live in **`src/theme/grid.css`** and are included in `@whatmatters/wmds/styles.css` (and `theme.css` → `grid.css`).

**`--spacing` stays 4px.** Even multiples = 8px baseline. Do not re-scale spacing in the app.

### Tokens (already on `:root` after the style import)

| Token | Meaning |
|-------|---------|
| `--grid-cols` | 4 / 8 (`md`) / 12 (`lg`) |
| `--grid-gutter` / `--grid-margin` | 16px mobile, 24px from `md` |
| `--grid-baseline` | 8px (`calc(var(--spacing) * 2)`) |
| `--leading-base` | 24px — also `leading-base` |
| `--grid-max` | 80rem |

Override on a wrap if a screen needs a different max width (`style={{ "--grid-max": "100%" }}`). Do not fork a second `--grid-*` set in Pitchkit.

### Band classes

```tsx
import { GridOverlay } from "@whatmatters/wmds";

<div className="grid-page">
  <GridOverlay />
  <div className="band">
    <section className="col-span-full lg:col-span-6">…</section>
    <aside className="col-span-full lg:col-span-6">…</aside>
  </div>
</div>
```

- **`grid-page`** — wrap + column tracks. Overlay **must** be a child of this box.
- **`band`** — subgrid of those tracks (`@supports` fallback repeats `--grid-cols`).
- Place by **column line** (`col-span-*` / `col-start-*`). This is layout, not a new atom.

CSS-only (no React overlay): add `class="grid-on"` on `<html>` and an empty `<div class="grid-guides"><div class="grid-guides-cols"></div><div class="grid-guides-baseline"></div>…</div>` inside `grid-page`. Prefer `GridOverlay` when React is present.

### Overlay (`g`)

`GridOverlay` composes the **`tailwindcss-react-grid-overlay` contract** (press **g**, React, columns) but is **bound to `--grid-*` inside `grid-page`**. The npm package paints a viewport overlay — that drifts from a centered max-width grid. WMDS does not depend on it.

- Press **g** (ignored in inputs). Optional `visible` / `visibleByDefault` / `onVisibleChange`.
- Mount in Storybook and local demos. Do **not** lock Pitchkit chrome to the overlay.
- Storybook: **Foundation → Grid**.

Pattern-first: apps **copy this wrap** from WMDS. No Pitchkit `Grid` / `Page` molecule.

## Components

Import from the package — configure via **props**, not utility strings:

```tsx
import {
  Button,
  IconButton,
  Badge,
  Card,
  Chip,
  ChipFilterGroup,
  Input,
  Search,
  Status,
  Accordion,
  TaskRows,
  buttonRoles,
  getNextButtonStatus,
  type ButtonRole,
  type ButtonStatus,
} from "@whatmatters/wmds";
```

| Component | Key props | Storybook |
|-----------|-----------|-----------|
| `Button` | `role`, `size`, `status`, `icon`, `count` | Atoms/Button — copy a **Pattern** story |
| `IconButton` | `icon`, `aria-label`, `role`, `size`, `fab`, `loading`, `title` | Atoms/IconButton — copy a **Pattern** story |
| `Chip` | `size`, `value`, `selected`, `onRemove`, `icon`, `count`, `readOnly` | Molecules/Chip — use `ChipFilterGroup` for multi-select filters |
| `Input` | `label`, `description`, `status`, `message`, `loading`, `endBadge`, `icon`, `size` | Atoms/Input — pill shell; Required via `endBadge={<Badge>…</Badge>}` |
| `Search` | `size`, `placeholder`, `onSubmit` | Molecules/Search — inline input + button row |
| `Card` | `variant`, `shape`, `padding` | Molecules/Card — `Card.Header` (`start` | `end`), **`Card.Body` slot** (no default fill), `Card.Footer` |
| `Accordion` | `variant`, `Accordion.Item` `leading` / `label` / `trailing` / `open` | Molecules/Accordion — FAQ, settings sections |
| `TaskRows` | `variant`, `status`, `meta`, `detailsLayout` | Molecules/TaskRows — composes **Accordion**; **Pattern — status rows** or **capsules** |
| `Badge` | `variant`, `size`, `emphasis`, `count`, `icon`, `iconOnly` | Atoms/Badge — copy a **Pattern** story |
| `Status` | `variant`, `tone`, `label`, `besideLabel`, `pulsing`, `active`, `step` | Atoms/Status — `variant="ring"` or `variant="dot"` |

Copy flow patterns from **Examples/** in Storybook when they ship. See **`src/package.manifest.ts`** for the export contract.

## Icons

**Lucide only** until further notice. Pass icons into component props — do not embed icon styling utilities in app code.

```tsx
import { Plus } from "lucide-react";

<Button icon={<Plus strokeWidth={2} />}>New item</Button>
```

Browse [lucide.dev/icons](https://lucide.dev/icons/).

## Customization

Brand theming: edit semantic roles in **`src/theme/colors.css`**, rebuild, bump the package. Do **not** fork component visuals with per-app utility overrides — extend WMDS via new variants/patterns in the design system repo.
