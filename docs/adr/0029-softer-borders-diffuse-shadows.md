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

## Decision

Keep one hairline token for decorative edges and a separate field-border token so inputs can meet WCAG 2.2 non-text contrast (3:1) while hairlines get softer.

### Light (`:root`)

| Token | Before | After | Used by |
|---|---|---|---|
| `--color-border` | `#00000014` (8%) | `#0000000a` (4%) | SiteNav compact, layout Card, dividers, Dropdown, menus, Stat, Chip, outlined Card |
| `--color-border-emphasized` | `#d4d4d4` | `#d9d9d9` | Section rules, checkbox/radio, text-link underline |
| `--color-border-control` | — | `#8c8c8c` (3.17:1 on `#f8f8f8`, 3.36:1 on white) | Input, TextArea, Select, Search |
| `--color-fill-selected` | — | `#eeeeee` | SiteNav current link (desktop + mobile) |
| `--shadow-drop-sm` / `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 8%)` | `0 2px 4px rgb(0 0 0 / 3%)` | Tooltip, compound fields, `--shadow-raised` |
| `--shadow-drop-md` / `--shadow-md` | Tailwind default (token was undocumented in `theme.css`) | `0 2px 4px rgb(0 0 0 / 3%), 0 8px 28px -8px rgb(0 0 0 / 12%)` | Layout Card, SiteNav compact + mega menu, Dropdown, Sheet, Panel |
| `--shadow-drop-lg` / `--shadow-lg` | Tailwind default | `0 2px 4px rgb(0 0 0 / 4%), 0 12px 40px -12px rgb(0 0 0 / 16%)` | Toast |
| `--color-focus-ring` | primary at 45% | primary at 62% | Focus rings on controls |

Shadow alphas follow the measured header (3% tight layer, 12% at `0 8px 28px -8px`). The ink stays neutral black so the palette does not pick up the reference’s warm `rgb(35, 30, 24)`. The 4% inset ring is `--color-border`, not a third shadow layer. Layout Card `surface` also draws `border-border` so the edge is the token.

### Dark

Hairline steps from `#ffffff1a` (10%) to `#ffffff14` (8%) — softer, but not halved, so edges remain visible on `#1b1b1b`. Emphasized moves `#525252` → `#404040`. Selected fill is `#303030` (the dark current-link sample). Diffuse shadow large layer is `rgb(0 0 0 / 24%)` at the same `8px 28px -8px` offset. Focus ring alpha on the lifted brand moves 40% → 48%.

### Soft

Hairline `#2a241c18` → `#2a241c0a`. Field border `#868686` (3:1 on `#f3eee6`; `#8c8c8c` falls short on that paper). Selected fill `#eee8e0`. Shadows use the warm ink at the same alphas as light.

### Focus indicators

Default and status focus rings that were under 3:1 were raised in `colors.css` / `stateColors.css`. Decorative borders are allowed to stay under 3:1. Checkbox and radio stay on `--color-border-emphasized`.

### Component edits

Only where a surface needed a token it was not already using:

- SiteNav current link → `bg-fill-selected` (it was ink-only). Compact elevation → `shadow-md`.
- Layout Card `surface` → `border-border` plus `shadow-md`.
- Input, TextArea (via the shared shell), Select, Search → `border-border-control`.

## Consequences

- Foundations → Colors → Borders and Foundations → Shadows show the new tokens.
- Apps that restyle with raw `border-border` / `shadow-md` pick this up without class changes.
- `--color-focus-ring` still derives from `--color-primary`, so a brand override keeps the ring; the mix percentage is what holds the 3:1 floor on the default brand.

## References

- ADR-0007 (color roles)
- [anubi.io](https://anubi.io/) computed header, current link, section rule, and card edge
