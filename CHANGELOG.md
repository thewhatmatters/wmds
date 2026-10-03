# Changelog

Every release of `@whatmatters/wmds` is listed here, newest first.

- **Versions follow semver.** While the major version is `0`, a minor bump (`0.3.0`) can break an app and a patch bump (`0.2.1`) does not. Apps depend on `^0.2.0`, which accepts patches only.
- **Every release has a Consumer actions section**: the exact steps an app takes when it moves to that version. It says **None** when there are none. Agents upgrading an app read every Consumer actions section between the old and new version, oldest first.
- **Pasted patterns:** when a release changes a **Pattern — …** story's Show code, it is named under Consumer actions so apps re-copy it.
- **How to add an entry** (contributors): add your change to the top entry. If that version is already on npm (`npm view @whatmatters/wmds versions`), start a new entry above it and bump `version` in `package.json` to match. `npm run check:changelog` enforces the format.

## 0.2.0

First release on npm. Earlier builds were installed from git commits and all reported `0.1.0`.

### Consumer actions

1. **Move from the git pin to npm.** In `package.json`, replace the `github:` / `git+https:` value for `@whatmatters/wmds` with `^0.2.0`, then run `npm install`. Commit `package.json` and `package-lock.json` together. See **CONSUMING.md → Install**.
2. **Delete `scripts/copy-wmds-fonts.mjs`** and the `package.json` script that runs it (usually `postinstall`). The fonts now ship in `dist/files` and both style entries reference them.
3. **Remove `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`** from the app's dependencies, unless the app imports them for something other than WMDS.
4. **Serve the Rive runtime from the app** (only if the app renders **RiveHand**, for example the marketing hero): copy `node_modules/@rive-app/canvas/rive.wasm` to `public/rive/rive.wasm`. Copy it again whenever `@rive-app/*` changes version. Until it is there, the runtime falls back to its CDN build and logs a warning.
5. **Copy the Rive art from the package** (same apps): `node_modules/@whatmatters/wmds/public/rive/interactive-icon-set.riv` to `public/rive/interactive-icon-set.riv`. Keep the CC BY 4.0 credit from `public/rive/CREDITS.md`.
6. **Install `lucide-react`** if the app does not already have it. It is a peer dependency because 24 shipped modules import it.
7. **Point the app's agents at the shipped docs:** paste the block from `node_modules/@whatmatters/wmds/docs/consumer-agents.md` into the app's `AGENTS.md` (or `CLAUDE.md`).
8. **Update Storybook links** in app docs and code comments. Paths changed: **Examples/…** and **Patterns/…** are now **Sites/WhatMatters/…**, **Sites/PitchKit/…**, or **Guides/…**, and components moved from `Components/{Category}/{Name}` to `Components/{Name}` (families: `Components/Button/…`, `Components/Card/…`, `Components/Checkbox/…`, `Components/Radio/…`). Pattern names and their Show code did not change.

### Changed

- **One module per source file.** An app that imports only `Button` bundles 148 KB minified (48 KB gzip), down from 806 KB. GSAP loads only with **TextSequence**, Rive only with **RiveHand**.
- **Fonts ship in the package** (`dist/files`), and `./theme.css` is self-contained: every partial it imports is in `dist`.
- **RiveHand** loads the Rive runtime from `/rive/rive.wasm` (`riveHandWasmSrc`) instead of a public CDN.
- **`lucide-react`** is a peer dependency.
- **Storybook** is organized as Getting started → Guides → Foundations → Components → Sites (ADR-0026, amended). Components are A–Z with a categorized **Components → Overview**.
- **Agent docs ship in the package** under `docs/`: `exports.json` (every export with category, summary, Storybook page, and patterns), `components.md` (component and token contracts), `component-contracts.md`, and `patterns/<id>.tsx` — every Pattern's Show code with a header naming the pattern and version.
- The package is published to npm under the MIT license. `public/rive/interactive-icon-set.riv` and its credits ship in the package.
