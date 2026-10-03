# Block for a consuming repo's AGENTS.md

Paste everything between the lines into the app's `AGENTS.md` (or `CLAUDE.md`). It is short on purpose: the details live in the installed package, so they always match the version the app uses.

---

## UI: WhatMatters Design System (WMDS)

This app's UI is built on `@thewhatmatters/wmds`. Before writing or changing UI, read the docs that ship with the installed version:

- `node_modules/@thewhatmatters/wmds/docs/README.md` — where to look
- `node_modules/@thewhatmatters/wmds/docs/exports.json` — every component, its category, and its patterns
- `node_modules/@thewhatmatters/wmds/docs/components.md` — component and token contracts
- `node_modules/@thewhatmatters/wmds/docs/patterns/` — Show code for every Storybook pattern
- `node_modules/@thewhatmatters/wmds/CHANGELOG.md` — what changed, and **Consumer actions** for each upgrade

Skills (installed with `npx skills add 'thewhatmatters/wmds#v<version>' -s use-wmds -s upgrade-wmds -s report-wmds-gap -a claude-code -y`):

- **use-wmds** — before writing or changing UI
- **upgrade-wmds** — when bumping `@thewhatmatters/wmds`
- **report-wmds-gap** — when WMDS is missing something the app needs

Rules:

1. **Use WMDS components and their props.** Do not rebuild a button, input, card, dialog, or menu from raw elements and utilities.
2. **`className` is for layout only** (margin, grid placement, width between components). Never re-style a WMDS component with color, type, radius, or `!important` overrides.
3. **Tokens only.** Colors, type, spacing, radius, shadows, and motion come from WMDS tokens and helpers — no raw hex, px font sizes, or hand-written durations.
4. **Patterns are copied verbatim.** When a pattern matches, copy `docs/patterns/<id>.tsx` whole, keeping its header line that names the pattern and version. Change content and data, not structure or styling.
5. **Pages start on `grid-page`** and place content with `band` and column spans.
6. **Gaps go to WMDS, not into the app.** If a component, prop, variant, or token is missing, stop and report it to the WMDS repository (**report-wmds-gap**) instead of adding a one-off in the app.
7. **Check before you finish:** `npx wmds-check` flags raw controls, `!` overrides on WMDS components, raw color, type, and motion values, and pasted patterns that drifted from the installed version. Add it to CI.
8. **Upgrading:** `npm install @thewhatmatters/wmds@<version>`, then do every **Consumer actions** step between the old and new version and re-copy the patterns it names (**upgrade-wmds**).

---
