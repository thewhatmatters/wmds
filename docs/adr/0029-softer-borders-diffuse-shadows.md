# ADR-0029: Softer borders and diffuse shadows

**Status:** Accepted  
**Date:** 2026-09-26

## Context

Decorative edges (`--color-border` at 8% black, plus tight 1–2px shadows) read harsher than the floating header on [anubi.io](https://anubi.io/). Computed styles from that page (Chromium, 1440×900, light theme) are the reference. Dark-theme header rules were read from the site stylesheet; the live page was light.

### Reference computed values

| Surface | border | box-shadow | background | radius |
|---|---|---|---|---|
| Header pill (`.style_surface__HNEJP`) | `1px solid rgba(255, 255, 255, 0.9)` | `rgba(35, 30, 24, 0.03) 0 2px 4px, rgba(35, 30, 24, 0.12) 0 8px 28px -8px, rgba(35, 30, 24, 0.04) 0 0 0 1px inset` | `rgba(255, 255, 253, 0.9)` | `32px` |
| Current nav link (`aria-current="page"`) | `0` | `none` | `rgb(238, 238, 238)` | `24px` |
| Card media edge (`::after`) | `1px solid rgba(19, 19, 19, 0.06)` | drop varies with depth; authored tight layer `0 1px 2px rgb(26 26 24 / 8%)` | `rgb(232, 232, 228)` | `0` |
| Section rule (`--site-rule`) | `1px solid rgb(217, 217, 211)` (`#d9d9d3`) | `none` | `rgb(252, 252, 250)` | `0` |
| Cookie panel | `1px solid rgb(234, 234, 234)` | `none` | transparent shell | `8px` |

Dark header rule (stylesheet, not a live computed sample): surface `rgba(22, 22, 22, 0.94)`, border `rgba(255, 255, 255, 0.14)`, shadow `rgba(0, 0, 0, 0.24) 0 8px 28px -8px`, current link `rgb(48, 48, 48)`.

A second pass measured the same header, active pill, and section rule in the consumer at 1280×900 against WMDS `aed006b`, and named the sources of harshness: compact SiteNav on `--color-border` (`#00000014`) plus `--shadow-sm` (`0 1px 2px / 8%`), outlined Card as `border-border` with no shadow, and the Resources menu on Tailwind’s default `shadow-md` (the semantic drop was unused). The image tile’s computed shadow was depth-scaled (`0 1px 2px` at 8% plus about `0 22px 35px -12px` at 22%, warm). The adopted card shadow is the calmer pair below, not that scaled tile.

The floating edge is the diffuse shadow plus a near-invisible inset ring. A lighter `--color-border` stroke still reads as a line, so dividers and floating surfaces no longer share one border.

## Decision

### Light

| Token | Before (`aed006b`) | After | Used by |
|---|---|---|---|
| `--color-border` | `#00000014` (8% black) | `rgb(42 36 28 / 6%)` | Dividers, Stat, Chip, section rules that use `border-border` |
| `--color-elevation-edge` | — | `rgb(255 255 253 / 90%)` | Compact SiteNav, mega menu, Dropdown |
| `--color-elevation-surface` | — | `rgb(255 255 253 / 90%)` | Compact SiteNav fill (backdrop blur unchanged) |
| `--color-fill-selected` | — | `#eeeeee` | Current SiteNav link (the nav-active pill; no border) |
| `--color-border-control` | — | `#8c8c8c` (3.17:1 on `#f8f8f8`) | Input, TextArea, Select, Search |
| `--shadow-soft-sm` | — | `0 2px 4px rgb(35 30 24 / 3%), 0 8px 28px -8px rgb(35 30 24 / 12%), inset 0 0 0 1px rgb(35 30 24 / 4%)` | Compact SiteNav, mega menu, Dropdown |
| `--shadow-soft-card` | — | `0 1px 2px rgb(26 26 24 / 6%), 0 16px 32px -12px rgb(26 26 24 / 10%)` | Layout Card `surface` and `outlined`, Sheet, Panel |
| `--shadow-md` | Tailwind default | alias of `--shadow-soft-card` | Leftover `shadow-md` utilities |
| `--color-focus-ring` | primary at 45% | primary at 62% | Focus rings |

`--color-border-emphasized` moves `#d4d4d4` → `#d9d9d9` (section rules, checkbox, radio, link underline). Expanded SiteNav stays `border-transparent` with no shadow. Mega menu stays `rounded-3xl` (24px). Card shell radius stays `--radius-card-shell` (16px) — there is no Card size for a larger radius; that is a follow-up.

### Dark

Divider `--color-border` is `rgb(255 255 255 / 8%)` (was `#ffffff1a`). Elevation edge is `rgb(255 255 255 / 14%)` (the dark header border sample). Elevation surface is `rgb(38 38 38 / 94%)`. `--shadow-soft-sm` deepens the two drops (`22%` / `32%`) and uses a light inset ring at 10%. `--shadow-soft-card` is `0 1px 2px rgb(0 0 0 / 22%), 0 16px 32px -12px rgb(0 0 0 / 28%)`. Selected fill is `#303030`. Focus ring on the lifted brand moves 40% → 48%.

### Soft

Divider matches light (`rgb(42 36 28 / 6%)`). Elevation fill and edge use the warm paper at 90% (`rgb(255 250 244 / 90%)`). Field border stays `#868686` so it clears 3:1 on `#f3eee6`.

### Focus indicators

Default and status focus rings that were under 3:1 were raised in `colors.css` / `stateColors.css`. Decorative dividers stay under 3:1. Checkbox and radio stay on `--color-border-emphasized`.

### Component edits

- Compact SiteNav → `border-elevation-edge`, `bg-elevation-surface`, `shadow-soft-sm`. Current link → `bg-fill-selected`.
- Mega menu and Dropdown → the same edge and `shadow-soft-sm`, replacing `border-border` and Tailwind `shadow-md`.
- Card `outlined` and layout `surface` → `shadow-soft-card`, no stroke.
- Input, TextArea, Select, Search → `border-border-control`.

## Consequences

- Foundations → Colors → Borders and Foundations → Shadows show the tokens.
- `shadow-md` no longer resolves to Tailwind’s default; it aliases `--shadow-soft-card`.
- `--color-focus-ring` still derives from `--color-primary`.

## References

- ADR-0007 (color roles)
- [anubi.io](https://anubi.io/) computed header, current link, section rule, and card tile
- Consumer measurement at 1280×900 against WMDS `aed006b`
