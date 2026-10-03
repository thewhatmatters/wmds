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
8. **Install the agent skills** (optional, recommended): `npx skills add 'thewhatmatters/wmds#v0.2.0' -s use-wmds -s upgrade-wmds -s report-wmds-gap -a claude-code -y`, then commit `.claude/skills/` and `skills-lock.json`.
9. **Re-copy pasted patterns.** Every Pattern's Show code now compiles in a strict Next 16 app: it exports its component, takes app data and callbacks as typed props, has no placeholders or unused code, and imports only real exports. Replace each pasted copy with `node_modules/@whatmatters/wmds/docs/patterns/<id>.tsx` and re-apply only content, data, and handlers. Most affected:
   - **Sites/WhatMatters/Prompt chat → Pattern — landing to chat** (the site's `components/ask-what-matters.tsx`): typed throughout, dead constants removed, step 3 validates with `isIntakeAboutValid`.
   - **Sites/WhatMatters/Intake → Pattern — start a project**: apostrophes escaped in JSX text.
   - **Sites/PitchKit/** — all 15 patterns: exported data types (`PitchKitCreatorIdentity`, `PitchKitPastBrand`, `PitchKitPost`, `PitchKitPageData`, …) and typed props.
   - **Guides/Overlay flows → Pattern — notification preferences**, **Components/Panel → Pattern — end detail rail**, **Components/NavList → Pattern — side nav (settings)**, **Components/SiteNav → Pattern — compact (scrolled)**, **Components/PageHeader → Pattern — toolbar header**: were outlines with placeholders; now full mirrors of the canvas.
10. **FooterReveal: pass the footer content.** **FooterReveal.Ruled** and **FooterReveal.Brand** no longer ship content defaults (the ruled footer defaulted to a real email address). `FooterReveal.Ruled` now requires `wordmark` and renders `links`, `email`, `mark`, `copyright`, and `credit` only when passed; `FooterReveal.Brand` requires `headline`, `ctaLabel`, and `wordmark`, and renders `socialLinks` only when passed. TypeScript flags any call that relied on the defaults; pass the values the footer showed before. `footerRevealRuledDefaultCopy`, `footerRevealRuledDefaultLinks`, and `footerRevealDefaultSocialLinks` are removed. Re-copy **Components/FooterReveal → Pattern — ruled grid footer** and **Pattern — marketing hero ruled grid**.
11. **Drop Button `!` overrides.** Replace `className="!w-auto !gap-1.5"` on a `layout="row"` Button with `width="hug"`, and `className="… !justify-start !border-border"` on an outline Button with `emphasis="quiet" align="start"` (keep `w-full` as layout). Re-copy **Sites/WhatMatters/Prompt chat → Pattern — landing to chat**.
12. **Marketing homepage composer.** Replace the hand-rolled pinned prompt with **Components/PromptBar → Pattern — marketing composer**, and pass the ask page's `q` search param to **AskWhatMatters** as `initialPrompt` (re-copy **Pattern — landing to chat**).
13. **RFP submitted:** the pattern's `RfpSubmitted` now takes `onSubmit(draft): Promise<void>` instead of a simulated delay. Re-copy **Sites/WhatMatters/RFP submitted → Pattern — RFP submitted** and pass your request.
14. **Update Storybook links** in app docs and code comments. Paths changed: **Examples/…** and **Patterns/…** are now **Sites/WhatMatters/…**, **Sites/PitchKit/…**, or **Guides/…**, and components moved from `Components/{Category}/{Name}` to `Components/{Name}` (families: `Components/Button/…`, `Components/Card/…`, `Components/Checkbox/…`, `Components/Radio/…`). Pattern names and their Show code did not change.

### Changed

- **One module per source file.** An app that imports only `Button` bundles 148 KB minified (48 KB gzip), down from 806 KB. GSAP loads only with **TextSequence**, Rive only with **RiveHand**.
- **Fonts ship in the package** (`dist/files`), and `./theme.css` is self-contained: every partial it imports is in `dist`.
- **RiveHand** loads the Rive runtime from `/rive/rive.wasm` (`riveHandWasmSrc`) instead of a public CDN.
- **`lucide-react`** is a peer dependency.
- **Storybook** is organized as Getting started → Guides → Foundations → Components → Sites (ADR-0026, amended). Components are A–Z with a categorized **Components → Overview**.
- **Agent docs ship in the package** under `docs/`: `exports.json` (every export with category, summary, Storybook page, and patterns), `components.md` (component and token contracts), `component-contracts.md`, and `patterns/<id>.tsx` — every Pattern's Show code with a header naming the pattern and version.
- **Newly exported:** `ButtonIcon`, `BadgeIcon`, `buttonSizeForCluster`, `iconButtonSizeForCluster`, `clusterComponentSizeMap`, `clusterTiers`, and `ClusterTier`. Show code and the docs already told apps to use them.
- **Show code is checked in a consumer app.** CI pastes every pattern into `fixtures/next-consumer` (Next 16, React 19, strict TypeScript, `eslint-config-next`) and requires zero `tsc` errors and zero eslint warnings.
- **CalEmbed** shows a visitor-facing empty state (`emptyTitle`, `emptyDescription`) when no calendar is mounted, instead of developer theming notes.
- **Button** gains `width` (`fill` | `hug`, row layout), `align` (`center` | `start`, pills), and `emphasis` (`strong` | `quiet`, outline role). New patterns: **Pattern — row (hug)**, **Pattern — suggestion pills**.
- **PromptBar** mounts on the marketing homepage: **Pattern — marketing composer** pins it to the bottom of the viewport and hands off to the ask page.
- **Motion choreography tokens** `--motion-stagger`, `--motion-beat`, `--motion-blur-reveal`, with `motionStaggerSeconds()`, `motionBeatSeconds()`, `motionBlurReveal()`, and the newly exported `readMotionDurationSeconds()`. Show code no longer hard-codes blur or timing values.
- **RiveHand** passes `stateMachine` (not the deprecated `stateMachines`) and silences only Rive's `state-machine-inputs` deprecation until the art exposes a view-model boolean.
- **Agent skills** in `skills/`: `use-wmds`, `upgrade-wmds`, `report-wmds-gap`, installable with the `skills` CLI. The package exports `./docs/*` and `./CHANGELOG.md` so scripts can `require("@whatmatters/wmds/docs/exports.json")`.
- The package is published to npm under the MIT license. `public/rive/interactive-icon-set.riv` and its credits ship in the package.
