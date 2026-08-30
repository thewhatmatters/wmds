# ADR-0004: Pattern-first — not utility-first

**Status:** Accepted  
**Date:** 2026-08-29

## Context

Tailwind is an **implementation layer** in WMDS — it compiles tokens into CSS and powers component internals. It is **not** the consumer API.

A utility-class-first workflow (“compose `bg-primary`, `text-sm`, `p-4` in every screen”) creates interpretation drift: one team uses `success` for tags, another for buttons; spacing and states diverge; Storybook stops being the source of truth.

WhatMatters needs **designed, named patterns** with narrow extension points — the opposite of open-ended utility soup.

## Decision

### Two audiences

| Audience | Uses | Does not |
|----------|------|----------|
| **App engineers** (consuming WMDS) | Exported **components**, **props** (`role`, `size`, `status`, `count`), **Examples** in Storybook | Ad-hoc slots, semantic color variants, utility re-theming |
| **WMDS authors** (this repo) | **Theme tokens**, `*Styles.ts` / `semanticVariants.ts`, **lib** helpers, Tailwind utilities **inside** component files | Shipping raw utility recipes as the public API; documenting “just use `className`” as the primary path |

### Prescribed patterns are the contract

1. **Storybook is canonical** — if a UI pattern is not an **Atom**, **Molecule**, **Organism**, or documented **Example**, it is not approved for product UI yet.
2. **Props over classes** — consumers configure via typed props (`Button` `role`, `status`, `count`; `IconButton` `icon`, `aria-label`, `fab`, `loading`; `Input` `label`, `status`, `message`, `loading`, `icon`, `size`; `Chip` `size`, `value`, `onRemove`, `icon`, `count`, `readOnly` + `ChipFilterGroup`; `Badge` `variant`, `count`, `icon`; `StatusDot` `variant`, `label`, `besideLabel`, `pulsing`). No generic slots. See **ADR-0006** for inputs.
3. **New visuals need a pattern** — a new look (e.g. a seventh button variant) requires a component/API change and Storybook spec, not local Tailwind in an app repo.
4. **Examples are templates** — `src/examples/` shows how to compose organisms for real flows; copy the pattern, don’t re-style with utilities.

### Tailwind’s role (internal)

- **`src/theme/`** — semantic roles bridged to utilities for the **package CSS build**
- **Component `*Styles.ts` files** — centralized class recipes (`buttonStyles.ts`, `semanticVariants.ts`)
- **`sources.css`** — scan list so dist/styles.css includes what components need
- App teams import **`@whatmatters/wmds/styles.css`** for baseline + components; they do **not** need to master the utility catalog to ship UI.

### When utilities are OK in apps

- **Page layout** — grid, flex, gap, max-width, responsive columns (`md:grid-cols-2`)
- **Spacing between WMDS components** — `gap-4`, `mt-6` on wrappers
- **Non-component content** — prose, marketing copy, one-off illustrations

Not OK: styling a button-like div with `bg-primary rounded-full` instead of `<Button>`; creating a new “badge” with `border border-success text-success` instead of `<Badge variant="success">`.

## Consequences

- Documentation and agent rules say **pattern-first**, not “Tailwind utilities first”
- New components ship with **Storybook usage / anatomy / best practices / examples** (Astryx-style)
- PRs that add consumer-facing utility guidance without a component pattern should be rejected
- Theme changes remain centralized; apps customize via **`colors.css`** roles, not per-screen classes

## Related

- ADR-0001 — Theme → lib → Components (utilities live at the bottom of the stack)
- ADR-0002 — atomic tiers define what gets exported vs Storybook-only Examples
- ADR-0003 — responsive rules apply to **component patterns**, not ad-hoc app utilities
- ADR-0006 — input architecture
