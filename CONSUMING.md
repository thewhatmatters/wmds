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
<Button role="ghost" layout="row" type="button" onClick={…}>
  <span>Due date</span>
  <span>Sep 12</span>
</Button>
<IconButton icon={<Settings strokeWidth={2} />} aria-label="Open settings" title="Settings" />
<Badge variant="success">Online</Badge>
<span className="inline-flex items-center gap-1.5">
  <Status variant="dot" tone="success" besideLabel />
  Online
</span>
```

Browse Storybook by intent under **Components/** and **Patterns/**, then use **Examples/** for approved flows — copy the named **Pattern** story JSX and state wiring; do not re-style with utilities. Examples are not exported from the package.

**Show code is the product contract.** Pattern story **Show code** (`storyCopySource`) is the drop-in implementation for consuming apps. It must stay a literal mirror of the live Example canvas — same layout, chrome, spacing, and typography. Copy Show code; do not choose between the Storybook iframe and an older freeze, and do not reconstruct the page from Storybook-only example modules (`*Example.tsx`, `*Styles.ts`). When the canvas changes, Show code is updated to match; apps re-copy the new freeze.

Page-level Example canvases include a Storybook-only grid inspector while designs are being tuned. Show code freezes the approved `--grid-max` / `--grid-column-gap` values and omits **ExampleGridControls** and other development chrome, so the copied result contains only `@whatmatters/wmds` exports and product layout.

**Not this:**

```tsx
// Avoid — re-inventing WMDS patterns
<button className="rounded-full bg-primary px-5 …">Submit</button>
<Button startSlot={<img … />} badge="New" variant="success" />
```

Use Tailwind in your app for **page layout** and spacing **between** WMDS components. For a consistent page spine, copy **`grid-page` + `band`** (below) — do not invent a Pitchkit layout atom. Use **`className` on a component** for layout tweaks (width, margin) — not for new variants or colors.

New visuals require a WMDS component or Example pattern — see **`docs/adr/0004-pattern-first-not-utility-first.md`**.

For a list or rail that overflows its parent, apply **`scroll-fade-y`** or **`scroll-fade-x`** to the scrolling element. Keep the parent surface and border on a wrapper so the mask only dissolves content:

```tsx
<div className="overflow-hidden rounded-lg border border-border bg-card">
  <ul className="scroll-fade-y max-h-64 overflow-y-auto">…</ul>
</div>
```

The fade tracks the scroll boundary without JavaScript. See **Foundations → Scroll fade** for one-edge, RTL, and size controls.

## Requirements

- **React** 18 or 19
- **Tailwind v4** recommended — import WMDS styles or theme
- **Motion** — `npm install motion` when using animated components
- **Lucide** — `lucide-react` for icons passed into component props
- **visx** — `npm install @visx/visx` when using **Chart** (peer dep; WMDS composes `@visx/*` primitives — see **ADR-0012**)
- **Rive** — `npm install @rive-app/react-canvas` when using **RiveHand** or **Pattern — marketing hero**. WMDS lists it as a dependency and does not bundle the runtime. Copy `public/rive/interactive-icon-set.riv` into the app at `public/rive/interactive-icon-set.riv` so it is served at `/rive/interactive-icon-set.riv`. Paste the pattern into a Next.js App Router file that starts with `"use client"`. The Show code already includes that directive. Hand art is CC BY 4.0, Silvia Sguotti and Gabriele Montinaro. See **ADR-0034**.
- **GSAP** — `npm install gsap @gsap/react` when using **TextSequence**. WMDS lists both as dependencies and does not bundle the runtime. Only **TextSequence** imports them. Every other component stays on `motion`. See **ADR-0037**.

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
| `--grid-column-gap` | Uniform inter-column gap override; defaults to `--grid-gutter` |
| `--grid-baseline` | 8px (`calc(var(--spacing) * 2)`) |
| `--leading-base` | 24px — also `leading-base` |
| `--grid-max` | 80rem |

Override on a wrap if a screen needs a different max width (`style={{ "--grid-max": "100%" }}`) or column gap (`style={{ "--grid-column-gap": "16px" }}`). Responsive Tailwind arbitrary properties are also valid page layout: `[--grid-column-gap:12px] md:[--grid-column-gap:20px]`. Do not fork a second `--grid-*` set in Pitchkit.

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

- **`grid-page`** — wrap + column tracks. Mount **GridOverlay** as a child of this box so it inherits that page's `--grid-max`, margin, and gutter. Column guides and margin lines then cover the rest of the document, including sections that sit before the page, on those same tracks. An empty page (no bands, only the overlay) still paints those guides over the hero. Baseline stays in the page box. No extra class on the preceding section.
- **`band`** — subgrid of those tracks (`@supports` fallback repeats `--grid-cols`).
- Place by **column line** (`col-span-*` / `col-start-*`). This is layout, not a new atom.

CSS-only (no React overlay): add `class="grid-on"` on `<html>` and an empty `<div class="grid-guides"><div class="grid-guides-cols"></div><div class="grid-guides-baseline"></div>…</div>` inside `grid-page`. That paints inside the page box. Prefer `GridOverlay` when React is present — it is what spreads the column guides over preceding sections.

### Overlay (`g`)

`GridOverlay` composes the **`tailwindcss-react-grid-overlay` contract** (press **g**, React, columns) but stays a child of `grid-page` so the tracks cannot drift from that page. A viewport-sized overlay ignores `--grid-max` and is the misaligned one. WMDS does not depend on the npm package.

- Press **g** (ignored in inputs). Optional `visible` / `visibleByDefault` / `onVisibleChange`.
- Mount in Storybook and local demos. Do **not** lock Pitchkit chrome to the overlay.
- Storybook: **Foundations → Grid**.

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
| `Button` | `role` (`primary` \| `secondary` \| `ghost` \| `destructive` \| `inverse` \| `outline`), `layout` (`pill` \| `row` \| `nav`), `size`, `status`, `icon`, `endIcon`, `mono`, `count` | Components/Actions/Button — copy a **Pattern** story (`row` for flat detail lines; **Pattern — outline mono** for the gallery intro action) |
| `IconButton` | `icon`, `aria-label`, `role`, `size`, `fab`, `loading`, `title` | Components/Actions/IconButton — copy a **Pattern** story |
| `Chip` | `size`, `value`, `selected`, `onRemove`, `icon`, `count`, `readOnly` | Components/Forms/Chip — use `ChipFilterGroup` for multi-select filters |
| `Input` | `label`, `description`, `status`, `message`, `loading`, `endBadge`, `icon`, `size` | Components/Forms/Input — pill shell; Required via `endBadge={<Badge>…</Badge>}` |
| `Search` | `size`, `placeholder`, `onSubmit` | Components/Forms/Search — inline input + button row |
| `Card` | `variant`, `shape`, `padding` | Components/Layout/Card — `Card.Header` (`start` | `end`), **`Card.Body` slot** (no default fill), `Card.Footer` |
| `Accordion` | `variant`, `Accordion.Item` `leading` / `label` / `trailing` / `open` | Components/Layout/Accordion — FAQ, settings sections |
| `TaskRows` | `variant`, `status`, `meta`, `detailsLayout`, `TaskRows.Detail` | Components/Data display/TaskRows — **Pattern — status rows**, **capsules**, **action details** (`Detail variant="button"`), **tag chips** (`Chip readOnly size="sm"`), detail lines (`Detail` + `onPress` → `Button layout="row"`) |
| `Badge` | `variant`, `size`, `emphasis`, `count`, `icon`, `avatar`, `iconOnly`, `eyebrow` | Components/Feedback/Badge — copy a **Pattern** story. `avatar={{ src, alt }}` is a leading round **Avatar** sized to the badge (`badgeAvatarSize`: sm → 20px, md → 24px) and is mutually exclusive with `icon`. Pass `alt=""` when the label already speaks the word. |
| `Status` | `variant`, `tone`, `label`, `besideLabel`, `pulsing`, `active`, `step` | Components/Feedback/Status — `variant="ring"` or `variant="dot"` |
| `FooterReveal` | `FooterReveal.Content`, `FooterReveal.Footer`, `FooterReveal.Brand` (`headline`, `ctaLabel`, `onCtaClick`, optional `ctaHref`, `wordmark`, `socialLinks`), `footerRevealFieldClasses` | Components/Layout/FooterReveal — **Pattern — marketing page** and **Pattern — marketing hero**. Cover sits on the page background; the brand field sticks underneath and sharpens from 12px of blur. Field is `bg-brand` / `text-on-brand` (`#011272`). The wordmark is `--color-brand-soft`, spans the footer width, and is cropped at the bottom edge. CTA is **Button** `role="inverse"` `type="button"` (`onCtaClick` opens the project modal). Pass `ctaHref` only to render a link. Reduced motion stays sharp, including the server render (the SSR snapshot is sharp, so a Next page does not hydrate a leftover blur). The root does not clip, so **GridOverlay** guides still cover the hero. The marketing hero's guide `grid-page` uses `!py-0` so the expanded gallery tile meets the footer with no page-background strip. |
| `HeroIntro` | `lead`, `children`, `className` (layout only) | Components/Layout/HeroIntro — **Pattern — two-line intro**. Also composed by **Components/Layout/HeroTileStack → Pattern — marketing hero**. `lead` is the first sentence (one line from `md`; may wrap below `md`). Children always start on the next line. Both lines are centered `type-large` at `font-normal` on the type-large leading. The shell is `grid-page` with the page block pad removed, columns 4–9 from `lg`. Do not insert a line break in the copy. |
| `TextSequence` | `children`, `stagger`, `delay`, `trigger` (`mount` \| `inView`), `idle` (default off), `lines` (default on), `emphasis` (`alternate` \| `none`), `TextSequence.Shape` `variant` + `tone` (`brand` \| `brand-soft` \| `accent` \| `info-muted`), `className` (layout only) | Components/Layout/TextSequence — **Default**, **Shapes**, **Reduced motion**. **HeroTileStack → Pattern — marketing hero text sequence** sequences the intro only. Words slide up behind a mask; shapes pop between neighbors. Marks are about 1.15em tall (pills about 2.2em wide) with a 14px floor, centered on the line so the leading does not jump. Softer tones use a two-stop gradient between those tokens. `idle` spins asterisks and stretches pills. `prefers-reduced-motion` stays at rest (same as the server render). Shapes are `aria-hidden`. The plain sentence is the accessible name once split. Parent owns the type step. `npm install gsap @gsap/react`. See **ADR-0037**. |
| `HeroTileStack` | `tiles`, `tileSize`, `strength`, `velocityFactor`, `maxVertical`, `spring` | Components/Layout/HeroTileStack — **Pattern — marketing hero**. Square tiles, `--hero-tile-size`, max `tileSize` (400px), tighter pile below `md`. Scatter distances scale with the painted tile. Place **SiteNav** above the hero; the hero section is `min-h-[calc(100svh-var(--site-nav-height))]` and centers its content. The h1 uses `type-display-1` (largest display token). The rock **RiveHand** sits between the e of Are and the W of WhatMatters (e at `z-20`, hand at `z-10`, W at `z-0`), with its drawn pixels on the text baseline; the point hand grips the final s (`em` offsets, `1.7em` box below `md`, `2.2em` from `md`). The intro is **HeroIntro** (`lead` + children): the first sentence stays on one line from `md` and may wrap below `md`; the rest always starts on the next line. Same centered `type-large` leading, on `grid-page` (same `--grid-max`, margin, gap, and column count as the guides): columns 4–9 from `lg` (`lg:col-start-4 lg:col-end-10`, 6 of 12 columns, centered), full width of that page grid below `lg`. The tile fan is the last element. Pointer over the fan springs tiles left and right away from it; a quick move adds a small vertical nudge that settles when the pointer slows; leave springs them back. Default `strength` (`120`) stays near the stack — raise it for a wider scatter. `velocityFactor` (`0.02`) and `maxVertical` (`24`) tune that nudge. Reduced motion stays on the resting fan. Coarse pointers get one gentle tap scatter, then a spring back. |
| `ScrollHorizontal` | `items` (`id`, `label`, optional `color`), `heading` (`sr-only` while pinned, visible when motion is reduced; omitted when `intro` is set), `intro` (`ScrollHorizontal.Intro`: `eyebrow`, `statement`, optional `action`), `expandLast` (default false), `expanded`, `className` (layout only, root) | Components/Layout/ScrollHorizontal — **Pattern — project gallery**. Also under the hero in **HeroTileStack** and **FooterReveal** **Pattern — marketing hero** (`expandLast`). Each card is a solid token-color placeholder; `label` is the accessible name (`sr-only`). `heading` names the section and stays `sr-only` on the pinned window. `intro` (**Pattern — gallery intro**, and the marketing-hero-with-gallery-intro stories) is the first panel: eyebrow **Badge**, `type-display-2` statement, outline mono **Button**. The eyebrow names the section. Tiles follow to the right. Reduced motion stacks the intro above the row. `expandLast` still parks the last card on center before the grow. `300svh` track (`shrink-0` so a flex parent keeps that height), sticky `h-svh` window, translate from the first card centered to the last. `expandLast` uses a `400svh` track: same horizontal distance, then the last tile grows (`clip-path`) to fill the window edge to edge with radius 0 and scrolls away. `expanded` is the slot on that tile. 400×500 / `gap-8` from `sm`; 280×350 / `gap-4` below `sm`; `rounded-xl`. Reduced motion is a native horizontal scroller (`py-12`), including `MotionConfig` `reducedMotion="always"`; with `expandLast` the last tile follows as a static `h-svh` section. The section ends on that tile. **FooterReveal → Pattern — marketing hero** sets `!py-0` on the guide `grid-page` so the tile meets the footer with no page-background strip. |
| `RiveHand` | `hand` (`point` \| `rock`), `size`, `active`, `idle` (default true), `entrance` (`slide-up` \| `grow` \| `none`, default `none`), `className`, `aria-hidden` | Components/Layout/HeroTileStack — **Pattern — marketing hero**. `point` is artboard `31_Cigarette` (cigarette removed). `rock` is `29_Rock`. `handFill` is `--color-surface` (fallback `--color-background-surface`; white in light mode). `outline` is `--color-brand` (`#011272` in both themes; hardcoded fallback `#011272`). The hero clips the rock hand at the baseline (`overflow-clip`, bottom `0.22em`) and slides it up; the point hand grows from its grip about 200ms later. `idle` pulses `Boolean 1` every 4–9s per hand while the tab and the hand are visible. Reduced motion pauses on the first frame, skips the entrance, and does not start idle timers. SSR and hydration render that resting pose; the entrance starts after mount only when motion is allowed. `npm install @rive-app/react-canvas`. Serve `public/rive/interactive-icon-set.riv` at `/rive/interactive-icon-set.riv`. The pattern file starts with `"use client"`. CC BY 4.0, Silvia Sguotti and Gabriele Montinaro. |
| `ConfettiProvider` | `useConfettiOnMount()`, `useConfetti().fire()`, `origin`, `confettiDefaultColors` | Components/Feedback/Confetti — playground. **Examples/RFP submitted → Pattern — RFP submitted**. Fire on the confirmation surface after the async action resolves, not on the submit click. `fire()` does nothing under reduced motion. |

Copy flow patterns from **Examples/** in Storybook when they ship. See **`src/package.manifest.ts`** for the export contract.

### Cluster scale in detail rails

Inside expanded **TaskRows** (and other dense rows), use the **sm / xs** cluster tier so controls sit below row titles — not beside them at default sizes:

| Detail content | Compose |
|----------------|---------|
| External app / map actions | `TaskRows.Detail variant="button"` → **Button** `size="xs"` |
| Tags / attributes | `Chip readOnly size="sm"` in `detailsLayout="chips"` |
| Label / meta line with tap action | `TaskRows.Detail` + `onPress` → **Button** `layout="row"` `role="ghost"` |

Card headers and filter rails use **sm / md / lg** cluster pairing — see **Foundations → Cluster** and **ADR-0011**.

## Icons

**Lucide only** until further notice. Pass icons into component props — do not embed icon styling utilities in app code.

```tsx
import { Plus } from "lucide-react";

<Button icon={<Plus strokeWidth={2} />}>New item</Button>
```

Browse [lucide.dev/icons](https://lucide.dev/icons/).

## Customization

### Brand override (`--color-primary`)

The **only** per-app color hook is the primary brand color. The WhatMatters default palette stays in **`src/theme/colors.css`**; an app overrides it by redefining the allowlisted tokens on `:root` (light) and `[data-theme="dark"]` (dark) in a stylesheet imported **after** `@whatmatters/wmds/styles.css`.

**Allowlist**

| Token | Required | Notes |
|-------|----------|-------|
| `--color-primary` | Yes | One light value on `:root`, one dark value on `[data-theme="dark"]`. |
| `--color-on-primary` | No | Ink on primary fills. Default `#fafafa` / `#fafaf8`; set it when your brand primary is light enough to fail contrast against near-white. |

Everything else is derived, so you set two values and every primary control follows:

- `--color-primary-hover` / `--color-primary-active` — `color-mix` of `--color-primary` (light darkens toward black; dark lifts toward white on hover).
- `--color-focus-ring` — `--color-primary` at 45% alpha (light); lifted toward white then 40% alpha (dark) so the ring stays visible on dark surfaces.

**Snippet — `brand.css`, imported after `styles.css`**

```tsx
// app entry
import "@whatmatters/wmds/styles.css";
import "./brand.css"; // must come after styles.css
```

```css
/* brand.css — keep unlayered so it wins the cascade against WMDS defaults */
:root {
  --color-primary: #7a2e8e;
  /* --color-on-primary: #ffffff;  optional */
}

[data-theme="dark"] {
  --color-primary: #c48ad4;
  /* --color-on-primary: #171717;  optional */
}
```

Rules:

- Import order matters — the override must load after `styles.css` (or after `@import "@whatmatters/wmds/theme.css"` if you configure Tailwind yourself). Do not wrap it in a `@layer`; WMDS defaults are unlayered author styles and a layered override would lose.
- Set both the light and the dark value. Leaving `[data-theme="dark"]` unset falls back to the WhatMatters dark primary, not to your light value.
- Check contrast for `--color-on-primary` on your primary and for `--color-primary` on `--color-body` in both themes.

**Not overridable per app:** brand navy (`--color-brand` `#011272`, `--color-on-brand`, `--color-brand-outline`, `--color-brand-soft`, `--color-on-brand-hover`), accent (`--color-accent*`, `--color-on-accent`), status (`--color-error*`, `--color-success*`, `--color-warning*`, `--color-info*`), chart series, typography (`--font-*`, `--line-height-*`, `type-*`), and grid (`--grid-*`, `--spacing`). Those roles are the shared WMDS contract — change them in `src/theme/`, rebuild, and bump the package. Do **not** fork component visuals with per-app utility overrides — extend WMDS via new variants/patterns in the design system repo.
