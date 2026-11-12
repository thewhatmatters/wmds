---
bump: patch
---
**Meter, glass cards, and Stat without its tile.**

- **Meter** (new): one thin bar for a static measure in a known range (a share, a score, a level, capacity used). It fits a table cell, a list row or a card. `value`, `min`, `max`, `label` or `aria-labelledby` (or `aria-hidden` beside a written figure), `valueText`, `size` (`xs` 2px, `sm`, `md`) and `tone` (`primary`, `neutral`). Brand knobs: `--meter-fill` and `--meter-track`. For work in flight keep using **Progress**.
- **Card**: `variant="glass"`, a frosted pane for a card over a picture, a video or a canvas. The tint is the surface colour, so it follows the theme and `tone`. Knobs: `--card-glass-tint` (default 70% in light themes and 88% in dark, which keeps primary and muted text at AA over any backdrop) and `--card-glass-blur` (default 12px). It falls back to the solid surface where the browser has no backdrop filter and when the visitor asks for reduced transparency.
- **Stat**: `variant` picks the frame. `tile` (default) is the bordered tile as before, `plain` is the figure alone for a surface that already frames it, and `ruled` sets a hairline above for editorial figure rows.
- **Stat** and **Stat.Group** now pass `id`, `data-*` and `aria-*` to their root, so a page can anchor, test or animate a figure without a wrapper.

### Consumer actions

- None. If you stripped the Stat tile with `className` overrides, switch to `variant="plain"` or `variant="ruled"`.
