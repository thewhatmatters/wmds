---
bump: minor
---
**Brand kit: a page colour.**

- **Brand kit**: four new knobs colour the page itself in the light theme: `--color-paper` (the page, `bg-body`), `--color-on-paper` (text), `--color-on-paper-muted` (secondary text and field hints) and `--color-paper-rule` (rules and hairlines). Set the paper alone and the muted text, stronger rules, quiet fills and control edges are mixed from it, so they stay warm on a cream page and keep their contrast (muted text 4.5:1, control edges 3:1). With none set, every colour is what it was. Dark, soft and **Band** tones keep their own page. See **Foundations → Brand kit → Page colour** and **CONSUMING.md → Brand kit**.
- **`npx wmds-check`**: `brand-contrast` now also fails a `--color-paper` whose ink or muted text is under 4.5:1 on it, or whose ink is under 4.5:1 on a white card.

### Consumer actions

- None, unless you want a page colour: set `--color-paper` (and the steps you need) on `:root` in `brand.css`, and make sure `<body>` has `className="bg-body text-fg"`. Drop any local override of `--color-background-body`, `--color-text-secondary` or `--color-border` that stood in for it.
