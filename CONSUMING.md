# Using WMDS in other apps

## Philosophy — pattern-first

WMDS is **not** utility-class-first. You do **not** build product UI by composing `bg-primary`, `text-sm`, and ad-hoc borders across the app.

**Do this:**

```tsx
import { Button, Badge, IconButton, StatusDot } from "@whatmatters/wmds";
import "@whatmatters/wmds/styles.css";

<Button status={status}>Submit</Button>
<Button role="secondary" count={3}>Inbox</Button>
<Button role="primary" icon={<Plus strokeWidth={2} />}>New item</Button>
<IconButton icon={<Settings strokeWidth={2} />} aria-label="Open settings" title="Settings" />
<Badge variant="success">Online</Badge>
<span className="inline-flex items-center gap-1.5">
  <StatusDot variant="success" besideLabel />
  Online
</span>
```

**Not this:**

```tsx
// Avoid — re-inventing WMDS patterns
<button className="rounded-full bg-primary px-5 …">Submit</button>
<Button startSlot={<img … />} badge="New" variant="success" />
```

Use Tailwind in your app for **page layout** (`grid`, `gap`, `max-w`, responsive columns) and spacing **between** WMDS components. Use **`className` on a component** for layout tweaks (width, margin) — not for new variants or colors.

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

## Components

Import from the package — configure via **props**, not utility strings:

```tsx
import {
  Button,
  IconButton,
  Badge,
  StatusDot,
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
| `Badge` | `variant`, `size`, `count`, `icon` | Atoms/Badge — copy a **Pattern** story |
| `StatusDot` | `variant`, `label`, `besideLabel`, `pulsing` | Atoms/StatusDot — copy a **Pattern** story |

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
