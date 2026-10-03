---
name: use-wmds
description: Use before writing or changing any UI in an app that depends on @whatmatters/wmds (the WhatMatters Design System) — pages, components, forms, layout, styling. Finds the right WMDS component or Storybook pattern in the installed package's docs, uses props instead of utility classes, keeps className to layout, uses tokens only, and copies a pattern's Show code verbatim with its version header.
---

# Use WMDS

WMDS is the app's design system. The installed package carries its own docs, matched to the installed version. Read them; do not rely on memory or on a newer Storybook.

## 1. Check the installed version

```bash
node -p "require('@whatmatters/wmds/package.json').version"
```

All paths below are inside `node_modules/@whatmatters/wmds/`.

## 2. Find what to use

1. `docs/exports.json` lists every component with `category`, `summary`, `storybook`, and `patterns` (pattern ids). Search it before writing anything:

   ```bash
   node -e '
   const e = require("@whatmatters/wmds/docs/exports.json");
   const q = (process.argv[1] || "").toLowerCase();
   for (const c of e.components)
     if (!q || [c.name, c.category, c.summary].join(" ").toLowerCase().includes(q))
       console.log(`${c.name} (${c.category}) — ${c.summary}\n  patterns: ${c.patterns.join(", ") || "none"}`);
   ' dialog
   ```

   Names under `planned` do not exist yet.
2. Read the component's entry in `docs/components.md` (and `docs/component-contracts.md` for FooterReveal, HeroTileStack, TextSequence, ScrollHorizontal, RiveHand, PromptBar). It says which props and patterns to use and what not to do.
3. Page-level flows (Sites) are in `docs/patterns/index.json` under titles starting with `Sites/`. Cross-component guidance is under `Guides/`.

## 3. Write the UI

- **Components and props, not utilities.** `<Button role="secondary" size="sm">`, not a `<button>` with classes. Never build a button, input, select, checkbox, card, dialog, sheet, menu, tooltip, or tab from raw elements.
- **`className` is layout only**: margin, width, grid or flex placement between components. Never pass color, type, radius, border, shadow, or `!`-prefixed overrides to a WMDS component. If you need one, it is a gap — see below.
- **Tokens only.** Colors through semantic utilities (`bg-surface`, `text-fg`, `text-muted`, `border-border`). Type through `type-*` utilities (`type-display-1`…`type-display-3`, `type-heading-1`…`type-heading-6`, `type-large`, `type-body`, `type-label`, `type-supporting`, `type-code`, `type-control`) — not `text-sm` or pixel sizes. Motion through `motionTransition("fast" | "medium" | "slow")` and `motionTransitionProp()` — not hand-written durations or easings. No raw hex, rgb, or px font sizes.
- **Pages start on `grid-page`** and place content with `band` and responsive column spans. Narrow an experience by overriding `--grid-max` on that wrapper, not with an ad-hoc centered container.
- **Icons are Lucide** (`lucide-react`), sized through the component (`ButtonIcon`, `stroke-current`).
- **Mobile first.** Unprefixed classes are mobile; scale up with `sm:` / `md:` / `lg:`.

## 4. Copy a pattern when one matches

A pattern is the approved composition for a task. Copying it is the contract.

1. Open `docs/patterns/<id>.tsx` (the id comes from `exports.json` → `patterns`, or `docs/patterns/index.json`).
2. Copy the whole file into the app, **including the three header lines** (`// @whatmatters/wmds@<version> · Pattern — …`). Upgrades find pasted patterns by that header. If the file has `"use client"`, it stays below the header comments.
3. Allowed edits: rename the exported component (or make it the file's default export), replace sample copy, data, URLs, and handlers with the app's, and in Next.js swap a plain `<img>` for `next/image`. Keep the structure, components, props, and classes.
4. One pattern per file is easiest to re-sync later.

## 5. Check before finishing

Run `npx wmds-check` (ships with the package). It flags the items below; fix every error, and every warning you introduced.

- No raw `<button>`, `<input>`, `<select>`, `<textarea>`, or `<dialog>` where a WMDS component exists.
- No `!` overrides or style props on WMDS components; no hex/rgb colors, `text-[…]`, `text-sm`-style sizes, or `duration-[…]`.
- Pasted patterns still carry their header and match `docs/patterns/<id>.tsx` apart from the allowed edits.
- The app's lint, typecheck, and build pass.

## When WMDS does not have it

Do not hand-roll it, override styles, or restructure a pattern to fit. Stop and use the **report-wmds-gap** skill. Tell the user what is missing.
