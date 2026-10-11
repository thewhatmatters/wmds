# ADR-0046: On a brand-navy field

**Status:** Accepted
**Date:** 2026-10-11

## Context

The Monty unlock page sits on brand navy (`bg-brand`, `#011272`). Two things fail there in the light theme:

- **CopyField**'s label is `text-fg` (`#171717`). On `#011272` that is about **1.14:1**.
- **Button** `role="outline"` is the same dark ink, about **1.14:1**. `role="primary"` in the dark theme is `#5a6d85` on the navy, about **2.98:1**.

`data-theme="dark"` on the section does flip the label and an outline button to `#fafafa` (about **15:1**). It also remaps surfaces to `#262626`. That fill on `#011272` is about **1.04:1** — the pill and a `role="secondary"` button disappear, and the copy control sits on a surface of the same color. **colors.css** already says this navy cannot sit on the dark surface. The navy field elsewhere (**FooterReveal**) is `bg-brand text-on-brand` plus **Button** `role="inverse"`, not a nested dark theme.

## Decision

Do not put `data-theme="dark"` on a brand-navy section.

- **CopyField** label and clipboard hint inherit color (`type-label`, `type-supporting`). A parent with `text-on-brand` paints them white (about **15:1** on the navy). The pill stays `bg-surface`, so the key stays dark on white in the light theme.
- **Button** `role="inverse-outline"` is the hairline on that field: transparent fill, border and label `--color-on-brand`. Hover and active use the inverse fill (`--color-on-brand-hover`) and brand ink, so the label stays readable. No new color. The filled action stays `role="inverse"`.

## Consequences

The unlock page wraps the section in `bg-brand text-on-brand` and pastes **Components/CopyField → Pattern — on a navy field**. `inverse-outline` is for that navy field, the same way `inverse` is.

## References

- ADR-0004, ADR-0045
