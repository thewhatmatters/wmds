---
name: report-wmds-gap
description: Use when an app built on @thewhatmatters/wmds needs something WMDS does not provide — a missing component, prop, variant, size, token, or pattern; a WMDS bug or accessibility problem; or docs that are wrong — and the alternative would be hand-rolling UI, overriding a component's styles (className or `!` utilities), raw values, or restructuring a pasted pattern. Explains what to file, where, and how to open a pull request in thewhatmatters/wmds that follows its AGENTS.md.
---

# Report a WMDS gap

WMDS and the apps are built in parallel. When an app needs something WMDS lacks, WMDS gets fixed. A patch that only lives in the app is not a fix.

## 1. Recognize the gap

It is a gap when the only way forward is one of:

- a raw `<button>`, `<input>`, `<select>`, or similar where a WMDS component should fit;
- `className` that changes a WMDS component's color, type, radius, border, shadow, spacing inside it, or anything with `!`;
- a raw color, font size, duration, or easing instead of a token;
- changing the structure or styling of a pasted pattern instead of just its content;
- a prop, variant, size, or state that `docs/components.md` does not list;
- a WMDS behavior that is wrong: a bug, an accessibility failure, or a docs error.

## 2. Stop and tell the user

Say what is missing, which page needs it, and what you propose. Do not ship a silent workaround. If the user needs a temporary workaround to ship, keep it in one place and mark it:

```tsx
// WMDS-GAP: <issue URL> — <one line: what WMDS is missing>
```

so it can be found and removed later (`grep -rn "WMDS-GAP" src`).

## 3. File an issue in thewhatmatters/wmds

Open it at <https://github.com/thewhatmatters/wmds/issues/new> (or `gh issue create --repo thewhatmatters/wmds`). Title: `Gap: <Component or token> — <what is needed>`. Body:

```markdown
**App / page:** <repo> — <route or file>
**WMDS version:** <node -p "require('@thewhatmatters/wmds/package.json').version">
**Need:** <the prop, variant, component, token, or fix — one sentence>
**Why the current API does not cover it:** <cite docs/components.md or the pattern id>
**Workaround in the app today:** <code, or "none — blocked">
**Proposed API:** <props and values, e.g. `<Button role="ghost" layout="row" width="hug">`>
**Screenshot:** <if visual>
```

One gap per issue. Link the issue from the `WMDS-GAP` comment.

## 4. Or open a pull request in WMDS

Only when the user asks for it, or WMDS maintainers have agreed on the API in the issue.

1. `git clone https://github.com/thewhatmatters/wmds && cd wmds && npm install`. Read **`AGENTS.md`** in full, including **Guardrails**, and `docs/component-contracts.md` for the component you touch.
2. **Extend the atom first.** A missing variant goes on the component that owns it (for example a Button size or role), not into a molecule or the app.
3. **Storybook is the contract.** Update the component's story: Usage → Anatomy → Best practices → Examples, plus a **Pattern — …** story with Show code (`withStoryCopySource()`). A new component also needs `src/package.manifest.ts`, `src/index.ts`, a `src/storybook/componentCatalog.ts` entry, and a `Components/{Name}` title.
4. **Changelog.** Add the change to the top entry of `CHANGELOG.md`, with the exact app steps under **Consumer actions** (or **None.**), naming any pattern whose Show code changed.
5. **Regenerate package docs:** `npm run docs:generate`.
6. **Run the checks** CI runs: `npm run lint`, `npm run typecheck`, `npm run check:docs`, `npm run test:unit`, `npm run build`, `npm run check:pack`, `npm run test:interactions`.
7. Open the PR against `main` and link the issue. Do not publish; releases go out from CI on a version tag.

After it merges and releases, upgrade the app with the **upgrade-wmds** skill and remove the `WMDS-GAP` workaround.
