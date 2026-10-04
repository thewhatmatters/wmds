# Changelog

Every release of `@thewhatmatters/wmds` is listed here, newest first.

- **Versions follow semver.** While the major version is `0`, a minor bump (`0.3.0`) can break an app and a patch bump (`0.2.1`) does not. Apps depend on `^0.2.0`, which accepts patches only.
- **Every release has a Consumer actions section**: the exact steps an app takes when it moves to that version. It says **None** when there are none. Agents upgrading an app read every Consumer actions section between the old and new version, oldest first.
- **Pasted patterns:** when a release changes a **Pattern — …** story's Show code, it is named under Consumer actions so apps re-copy it.
- **How to add an entry** (contributors): add your change to the top entry. If that version is already on npm (`npm view @thewhatmatters/wmds versions`), start a new entry above it and bump `version` in `package.json` to match. `npm run check:changelog` enforces the format.

## 0.4.1

**ChatDock:** follow-ups in the open window, actions and a match score under each reply, a Start a project gate in the composer's place, the visitor's messages on a brand tint, and a new open and close transition.

- **`followUps`** — predefined next questions for the latest reply, the same items as `suggestions`. They show under the reply (`followUpsPlacement="inline"`, the default; `"composer"` pins them as pills above the composer), hide while `thinking`, and disappear the moment the visitor sends. Choosing one calls `onSuggestionSelect`, then `onSend` with its `prompt`. A follow-up's `icon` is not shown: inline rows all lead with a corner-down-right arrow, and pills above the composer are text only. **Components/ChatDock → Pattern — chat dock** now keeps the follow-up state: `ask` may resolve with `string | { reply, followUps? }`.
- **Reply row** — under each finished reply: **Copy** (the message's `copyText`), thumbs up and down (shown when `onMessageFeedback` is passed, on replies that carry `feedback` — `"up" | "down" | null`, `null` until the visitor votes; pressing the active thumb clears it), and a short muted note (`meta: { label, description? }`, for example "Match 99%", with `description` read to screen readers). Each part shows on its own. Where the pointer can hover, the row shows while the reply is hovered or holds focus; on touch screens it is always shown. It keeps its place either way, so the thread never moves, and it stays empty while the latest reply is still arriving (`thinking`). Buttons are 44px on phones. New labels `copy`, `copied`, `helpful`, `notHelpful`; new types `ChatDockFeedback` and `ChatDockMessageMeta`.
- **`gate`** and **ChatDock.Gate** — a multi-step form in the composer's place, with the conversation above it. Setting `gate` opens the window and moves focus into it; the composer, suggestion rows, follow-ups, and disclaimer step aside, and come back with focus when it is cleared. The two crossfade while the area eases between their heights. The gate hugs each step up to a cap that keeps the last lines of the latest reply in view, then its body scrolls. Escape belongs to the gate (it closes it); the window's close keeps the gate, with its progress, for when the window reopens. **ChatDock.Gate** (`ChatDockGate`) is the shell: the step's title and subtitle with previous, "2 of 4", next, and close; the step in a scrolling body that slides between steps; a footer with a start slot, Cancel, and Next. 44px controls on phones. New **Pattern — start a project gate**.
- **Phones:** the full-screen window and the composer stay inside the part of the screen a keyboard leaves visible. The conversation takes keyboard focus so it can be scrolled without a mouse.
- **`useKbdChoiceKeys`** takes a `scope`: digits act only while focus is inside that element. A focused checkbox or radio now takes digits too (only text entry is skipped).
- **IconButton `pressed`** — the toggle pattern: sets `aria-pressed` and, while on, shows the pressed fill and a filled glyph.
- **Open and close.** The resting bar and the window are one object: one composer serves both states and stays on screen every frame. From `md` the window is an opaque card that grows up and out of the bar from its bottom edge; the mark moves to the header, the composer keeps its width and rises only by the disclaimer line, and the header, conversation, and rows fade in after it. Closing fades them and folds the window back into the bar, and the hover pills return once it has folded. On phones the window rises from the bottom edge to full screen and falls back. Escape while opening, or a click while closing, reverses from where it is. Reduced motion crossfades the window in place.
- **PromptBar:** the `start` slot takes its content's width (an **Avatar** `size="md"` is unchanged), so a caller can fold the mark away.
- The visitor's messages sit on a light navy tint, so they read apart from the replies. New color token `--color-brand-tint` (`bg-brand-tint`): 10% navy in light, a lifted navy in dark.
- **Fix:** choosing a suggestion row in the open window (by click or Enter) moves focus to the composer. The rows leave once the first message lands, and focus used to fall to the page, so Escape no longer closed the window.

**Index pages** — what the whatmatters.so blog index placed by hand. See **ADR-0040**.

- **IndexList** (new) — editorial index rows: **IndexList.Item** with `meta` (a `<time>`), a linked `title` (`href`; a quiet **TextLink** in an `h2`, `titleAs` to change it), and an optional `preview` that an **IconButton** at the row's end expands under the title (`defaultOpen`, or `open` / `onOpenChange`). `captions={{ meta, title }}` (sentence case — the "/" marker and rule come with them) sit over the rows on the same tracks. Two tracks (7.5rem meta, then the title, with the page grid's column gap) once the list is 32rem wide — a container query — and one column below, captions hidden. `size`: `lg` (type-display-3, default), `md`, `sm`. `empty` takes the rows' place when there are none. New **Pattern — post index**.
- **Guides/Filter panel → Pattern — filtered index** (new) — the filtered index page: a "/ Filters" panel of collapsible checkbox groups with counts and Clear all beside an **IndexList**, a live count in the title and a visually hidden status line, and below `md` a Filters button (with the number of filters on) that opens the same groups in a bottom **Sheet** with Clear all and Show N posts.
- **Checkbox** and **CheckboxGroup.Item** `count` — a muted number at the row's end, styled like **NavList** counts. Screen readers hear it after the label in parentheses: "Guides (2)", or "Guides (2 posts)" with `countLabel`.
- **`type-eyebrow`** — small uppercase mono caption (`typographyClass("eyebrow")`) for editorial labels such as "/ Filters" and "/ Date". `components.md` → Theme tokens says when to use it.
- **TextLink `variant`** — `prose` (default, unchanged) or `quiet`: no underline at rest, an underline scaled to the text on hover and focus, the same focus ring, and the size and weight of the heading around it. A wrapped quiet link draws its focus ring on every line. New **Pattern — quiet title link**; new exports `textLinkVariants` and `TextLinkVariant`.
- **Accordion `flush`** (plain variant) — no horizontal inset, so labels and panels line up with the text around the accordion; the trigger's hover band reaches 8px past each edge. New **Pattern — flush**.
- **Fix:** a closed **Accordion** panel — any `.motion-collapse` with `data-visible="false"` — turns `visibility: hidden` once its fold ends, so Tab skips its controls and screen readers skip its content. It opens visible at once.

**Post pages** — what the whatmatters.so blog post page placed by hand. See **ADR-0041**.

- **DescriptionList** (new) — name-and-value rows as `dl` / `dt` / `dd`. **DescriptionList.Item** takes a `name` and a value (text, `<time>`, **Badge** tags, or **Button** actions). `layout`: `inline` (value beside the name, 2 : 3, default) or `stacked` (value under it), per list or per row. `rule`: `solid` (default), `dotted` (the quieter hairline), or `none`. `variant`: `sans` (caption name, body value) or `mono` (eyebrow name, mono caps value, tabular figures). New **Pattern — post metadata** and **Pattern — details**.
- **SectionCaption** (new) — the "/ Metadata" caption over a page column: `type-eyebrow` on an emphasized rule, the "/" marker hidden from screen readers, `as` (`h2` default, or `p`), and an `end` slot for a **Button** `size="xs"`. New **Pattern — column caption** and **Pattern — caption with an action**. **IndexList** captions and **Guides/Filter panel** use it (their rule is now the emphasized hairline).
- **Prose** (new) — long-form content from plain HTML elements: headings, paragraphs, lists, quotes, inline code, code blocks, rules, images, figures, and tables, with the spacing between them. `size="lg"` (default) sets `type-reading`; `size="md"` keeps `type-body`. `measure="reading"` (default) caps lines at 40rem. New **Pattern — article body**.
- **`type-reading`** — long-form text, 17px at a 28px line (`typographyClass("reading")`).
- **Badge** `emphasis="outline"` (hairline, transparent fill), `mono` (mono caps, as **Button** `mono`), and `render` — `render={<a href />}` makes a tag a link, with a hover underline, the focus ring, and a 44px-tall hit area. New **Pattern — outline tags**.
- **Button** `status` works with `icon`: the icon morphs into the status glyph, and the result is announced. New export `buttonStatusHoldMs` (2000) for how long a confirmation holds. New **Pattern — copy button**.
- **Button** `external` (with `render={<a href />}`): opens a new tab with a safe `rel`, adds a visually hidden "(opens in a new tab)", and shows **TextLink**'s trailing icon (`externalIcon={false}` drops it). New **Pattern — external link**.
- **Button** and **Badge** set their own text case: inside an `uppercase` parent (a mono **DescriptionList**), their labels no longer turn to capitals. `mono` still sets caps.
- **Guides/Post page → Pattern — post page** (new) — the display title, the metadata panel in 4 of 12 columns (sticky from `lg` under the pinned **SiteNav**), and the article in 8; below `lg` the panel stacks above the article.

### Consumer actions

1. **WhatMatters site: re-copy Components/ChatDock → Pattern — chat dock** (`node_modules/@thewhatmatters/wmds/docs/patterns/components-chatdock--pattern-chat-dock.tsx`) over `components/ask-whatmatters.tsx`, and re-apply only your content, data, and handlers. The pattern now holds the follow-up state, each reply's vote, and the Start a project gate's open state; `onStartProject` is gone.
2. **Paste Components/ChatDock → Pattern — start a project gate** (`node_modules/@thewhatmatters/wmds/docs/patterns/components-chatdock--pattern-start-project-gate.tsx`) as `components/start-project-gate.tsx`. Replace the services, budgets, and step copy with yours, and pass your calendar through `renderCalendar` (call `booked` when the visitor confirms a time).
3. **Wire the gate where you mount `AskWhatMatters`**, and remove the `Dialog` intake:
   - Hold `const [startProject, setStartProject] = useState<StartProjectRequest | null>(null)` and pass `startProject={startProject}` and `onStartProjectChange={setStartProject}`. Site buttons that opened the intake `Dialog` call `setStartProject({})` instead.
   - Pass `renderStartProject={(slot) => <StartProjectGate {...slot} onSubmit={sendIntake} renderCalendar={yourCalendar} />}`, where `sendIntake` posts the intake as the `Dialog` did.
   - Delete the intake `Dialog`, its open state, and its **IntakeConfirmation** step. Keep one **ConfettiProvider** at the app root; the gate fires the burst when it finishes.
4. **Return follow-ups, the score, the copy text, and Start a project requests from `ask`** for the replies that have them: resolve with `{ reply, followUps?, meta?, copyText?, startProject? }`.
   - `followUps`: one to three items, each `{ id, label, prompt? }`. Leave out `icon`; it is not shown. An item without a `prompt`, such as `{ id: "start", label: "Start a project" }`, opens the gate.
   - `startProject`: `{ services?, budget? }` with what the assistant picked up; the gate opens with them filled in.
   - `meta`: the score, for example `{ label: "Match 99%", description: "How sure the assistant is that it matched your question." }`. Your app computes it; leave it out when there is none.
   - `copyText`: what **Copy** puts on the clipboard. The pattern uses the reply text when you leave it out.
   - Replies with none of these can keep resolving with the reply string.
5. **Handle `onFeedback`** where you mount `AskWhatMatters`: `onFeedback={(reply, value) => …}`. `value` is `"up"`, `"down"`, or `null` when the visitor clears their vote; store it against `reply.id`. The prop is required, so TypeScript flags the mount until you add it.
6. **The open and close transition:** nothing to do. It comes with the upgrade.
7. **WhatMatters site, blog index: replace `components/blog-index.tsx` with Guides/Filter panel → Pattern — filtered index** (`node_modules/@thewhatmatters/wmds/docs/patterns/guides-filter-panel--filtered-index.tsx`). Map each post to `FilteredPost` (`facets: { topic: post.topic }`, `dateLabel` from your date formatter) and your topics to one `FilterGroupDef` (`{ id: "topic", label: "Topic", options }`), then render `<FilteredIndex title={copy["blog-title"]} posts={posts} groups={groups} />`. If the page already sits inside a `<main>`, change the pattern's `main` to a `div`. The pattern replaces these hand-placed parts of `components/blog-index.tsx`:
   - the rows' two-track grid (`grid-cols-[7.5rem_1fr]`, `border-b border-border py-4`) with the date and a **TextLink** title → **IndexList** + **IndexList.Item** (`meta={<time dateTime={post.date}>…</time>}`, `title`, `href`, `preview` for the description);
   - the "/ DATE" and "/ NAME" captions → **IndexList** `captions={{ meta: "Date", title: "Name" }}`;
   - the "/ FILTERS" caption built from `type-code uppercase text-muted` → **SectionCaption** with Clear all in its `end`;
   - the always-open Topic **CheckboxGroup** with the count written into each label ("Guides (2)") → an **Accordion** `variant="plain"` `flush` group of **CheckboxGroup.Item** with `count` and `countLabel`;
   - and it adds Clear all, the empty state, the announced post count, and the phone **Sheet**.
8. **If you keep your own blog index instead**, make the same swaps by hand: the row grid → **IndexList**; `type-code uppercase text-muted` captions → **SectionCaption**; `label="Guides (2)"` → `label="Guides" count={2} countLabel="2 posts"`; a large linked title → `<TextLink variant="quiet">` inside its heading. The Topic group can now collapse: closed panels leave the tab order.
9. **WhatMatters site, blog post page: paste Guides/Post page → Pattern — post page** (`node_modules/@thewhatmatters/wmds/docs/patterns/guides-post-page--post-page.tsx`) and render it from `app/blog/[slug]/page.tsx` as `<PostPage post={post}>{body}</PostPage>`, where `body` is the rendered markdown. Fill `PostPageData`: `markdown` is the post file's source, `markdownHref` your plain-markdown route, `url` the post's address. If the page already sits inside a `<main>`, change the pattern's `main` to a `div`. Then:
   - **`components/post-meta.tsx` — delete it.** Its hand-built `<dl>` (two-track `grid-cols-[2fr_3fr]` rows with `border-b border-border py-3`, `type-code text-muted uppercase` names, `type-code text-fg uppercase tabular-nums` values) is **DescriptionList** `variant="mono"` `rule="dotted"`; the author and category `Badge size="sm" emphasis="muted"` are **Badge** `emphasis="outline"` `mono`, with `render={<a href />}` on each category; the share buttons' hand-written `target`, `rel`, and visually hidden "(opens in a new tab)" are **Button** `external`.
   - **`components/copy-text-button.tsx` — delete it.** Its Copy → Check icon swap, "Copied" label, two-second timer, and `role="status"` text are **Button** `icon={<Copy />}` with `status` and `statusLabels`, held for `buttonStatusHoldMs` — the pattern's `CopyButton` (also **Components/Button/Button → Pattern — copy button**).
   - **`components/section-caption.tsx` — delete it** and import **SectionCaption** where it was used. Pass the caption in sentence case ("Metadata", not "/ METADATA"); the marker and the `border-border-emphasized` rule come with it.
   - **`components/markdown.tsx` — keep `compiler(…)`, drop the class map.** Keep the `h1` → `h2` and `a` → `MarkdownLink` (**TextLink** `external`) overrides; delete `blocksClasses`, the other class constants and overrides, and `MarkdownTable`, and return the compiled output without a wrapper `div`. The post page puts it in **Prose**; for a resource category's notes wrap it in `<Prose size="md">` (add `measure="none"` to fill the column). Long-form text moves from 14px (`type-body`) to 17px (`type-reading`).
10. **If you keep your own post page instead**, make the same swaps by hand: the `<dl>` → **DescriptionList**; muted badges → **Badge** `emphasis="outline"` `mono`; the copy swap → **Button** `icon` + `status`; hand-written new-tab links → **Button** `external`; the caption → **SectionCaption**; the markdown class map → **Prose**.
11. Other apps: none. The tint comes with the upgrade; **IconButton**'s `pressed`, **ChatDock**'s `gate`, **useKbdChoiceKeys**' `scope`, **Checkbox** `count`, **TextLink** `variant`, **Accordion** `flush`, **Badge** `emphasis="outline"` / `mono` / `render`, and **Button** `external` are optional. A **Button** or **Badge** inside an `uppercase` parent used to inherit the capitals and no longer does — set `mono` where caps were intended. If you show thumbs with `onMessageFeedback`, give each reply `feedback: null` until the visitor votes — replies without `feedback` take no vote. A test that finds content inside a closed **Accordion** panel (or any `.motion-collapse`) by role must open the panel first — closed, it is hidden.

## 0.4.0

**ChatDock** is the site assistant: a pinned composer that shows suggested questions on hover and opens into a chat window, instead of a separate ask page. **PromptBar** gains `start` and `end` slots. **Components/PromptBar → Pattern — marketing composer** is removed. See **ADR-0039**.

### Consumer actions

1. **Replace the marketing composer and the ask page with ChatDock** (the WhatMatters site). Paste **Components/ChatDock → Pattern — chat dock** (`node_modules/@thewhatmatters/wmds/docs/patterns/components-chatdock--pattern-chat-dock.tsx`), pass your assistant request as `ask` and open **IntakeModal** from `onStartProject`, and mount it once in the marketing layout. Then delete the pasted **Pattern — marketing composer** (`npx wmds-check` reports it as `pattern-removed`), the ask page component (`components/ask-what-matters.tsx`), and its `/ask` route. Redirect `/ask` to the homepage if it has inbound links.
2. **Reply content is yours to render.** `messages[].content` takes text or Markdown your app has already rendered; WMDS does not parse Markdown.
3. **No other changes.** **PromptBar**'s new `start` and `end` props are optional; existing bars render as before.

### Added

- **ChatDock** (`ChatDock`, `chatDockDefaultLabels`, `chatDockPlacements`, and the `ChatDock*` types).
- **PromptBar** `start` (brand mark) and `end` (extra inset controls before send).

### Removed

- **Components/PromptBar → Pattern — marketing composer**.

## 0.3.0

Storybook no longer mirrors product sites. The **Sites/** section (WhatMatters and PitchKit pages) is removed, and so are its `sites-…` files in `docs/patterns/`. No component, prop, token, or export changed.

### Consumer actions

1. **Pasted Sites patterns are now the app's own code.** If the app pasted any **Sites/WhatMatters/…** or **Sites/PitchKit/…** pattern (for example the ask page, the Start a project intake, or RFP submitted), keep the file and delete its three header lines (`// @thewhatmatters/wmds@…`, `// Storybook: Sites/…`, `// Show code — …`). Until then, `npx wmds-check` reports `pattern-removed` for that file.
2. **Skip the 0.2.0 steps that re-copy Sites patterns** if they are still open: the **Sites/** bullets under 0.2.0 step 9, and the re-copy in steps 11, 12, and 13. Make those changes in the app's own files instead: the Button props from step 11, starting the ask page from `q` (step 12), and the RFP `onSubmit` (step 13).
3. **Components/PromptBar → Pattern — marketing composer:** its Show code comment no longer names a site component; the code is unchanged. Re-copy it, or update the version in its header line.

## 0.2.0

First release on npm. Earlier builds were installed from git commits and all reported `0.1.0`.

### Consumer actions

1. **Move from the git pin to npm, under the new name.** The npm package is `@thewhatmatters/wmds`; git installs were named `@whatmatters/wmds`, and that npm scope belongs to another account. Uninstall `@whatmatters/wmds`, replace `@whatmatters/wmds` with `@thewhatmatters/wmds` in every import, CSS `@import`, and config file, then `npm install @thewhatmatters/wmds@^0.2.0`. The exact commands are in **CONSUMING.md → Install → Moving from a git pin**. Commit `package.json` and `package-lock.json` together.
2. **Delete `scripts/copy-wmds-fonts.mjs`** and the `package.json` script that runs it (usually `postinstall`). The fonts now ship in `dist/files` and both style entries reference them.
3. **Remove `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`** from the app's dependencies, unless the app imports them for something other than WMDS.
4. **Serve the Rive runtime from the app** (only if the app renders **RiveHand**, for example the marketing hero): copy `node_modules/@rive-app/canvas/rive.wasm` to `public/rive/rive.wasm`. Copy it again whenever `@rive-app/*` changes version. Until it is there, the runtime falls back to its CDN build and logs a warning.
5. **Copy the Rive art from the package** (same apps): `node_modules/@thewhatmatters/wmds/public/rive/interactive-icon-set.riv` to `public/rive/interactive-icon-set.riv`. Keep the CC BY 4.0 credit from `public/rive/CREDITS.md`.
6. **Install `lucide-react`** if the app does not already have it. It is a peer dependency because 24 shipped modules import it.
7. **Point the app's agents at the shipped docs:** paste the block from `node_modules/@thewhatmatters/wmds/docs/consumer-agents.md` into the app's `AGENTS.md` (or `CLAUDE.md`).
8. **Install the agent skills** (optional, recommended): `npx skills add 'thewhatmatters/wmds#v0.2.0' -s use-wmds -s upgrade-wmds -s report-wmds-gap -a claude-code -y`, then commit `.claude/skills/` and `skills-lock.json`.
9. **Re-copy pasted patterns.** Every Pattern's Show code now compiles in a strict Next 16 app: it exports its component, takes app data and callbacks as typed props, has no placeholders or unused code, and imports only real exports. Replace each pasted copy with `node_modules/@thewhatmatters/wmds/docs/patterns/<id>.tsx` and re-apply only content, data, and handlers. Most affected:
   - **Sites/WhatMatters/Prompt chat → Pattern — landing to chat** (the site's `components/ask-what-matters.tsx`): typed throughout, dead constants removed, step 3 validates with `isIntakeAboutValid`.
   - **Sites/WhatMatters/Intake → Pattern — start a project**: apostrophes escaped in JSX text.
   - **Sites/PitchKit/** — all 15 patterns: exported data types (`PitchKitCreatorIdentity`, `PitchKitPastBrand`, `PitchKitPost`, `PitchKitPageData`, …) and typed props.
   - **Guides/Overlay flows → Pattern — notification preferences**, **Components/Panel → Pattern — end detail rail**, **Components/NavList → Pattern — side nav (settings)**, **Components/SiteNav → Pattern — compact (scrolled)**, **Components/PageHeader → Pattern — toolbar header**: were outlines with placeholders; now full mirrors of the canvas.
10. **FooterReveal: pass the footer content.** **FooterReveal.Ruled** and **FooterReveal.Brand** no longer ship content defaults (the ruled footer defaulted to a real email address). `FooterReveal.Ruled` now requires `wordmark` and renders `links`, `email`, `mark`, `copyright`, and `credit` only when passed; `FooterReveal.Brand` requires `headline`, `ctaLabel`, and `wordmark`, and renders `socialLinks` only when passed. TypeScript flags any call that relied on the defaults; pass the values the footer showed before. `footerRevealRuledDefaultCopy`, `footerRevealRuledDefaultLinks`, and `footerRevealDefaultSocialLinks` are removed. Re-copy **Components/FooterReveal → Pattern — ruled grid footer** and **Pattern — marketing hero ruled grid**.
11. **Drop Button `!` overrides.** Replace `className="!w-auto !gap-1.5"` on a `layout="row"` Button with `width="hug"`, and `className="… !justify-start !border-border"` on an outline Button with `emphasis="quiet" align="start"` (keep `w-full` as layout). Re-copy **Sites/WhatMatters/Prompt chat → Pattern — landing to chat**.
12. **Marketing homepage composer.** Replace the hand-rolled pinned prompt with **Components/PromptBar → Pattern — marketing composer**, and pass the ask page's `q` search param to **AskWhatMatters** as `initialPrompt` (re-copy **Pattern — landing to chat**).
13. **RFP submitted:** the pattern's `RfpSubmitted` now takes `onSubmit(draft): Promise<void>` instead of a simulated delay. Re-copy **Sites/WhatMatters/RFP submitted → Pattern — RFP submitted** and pass your request.
14. **Add `npx wmds-check` to CI** (optional, recommended). Start with errors only; add `--max-warnings 0` once the warnings are cleared.
15. **Update Storybook links** in app docs and code comments. Paths changed: **Examples/…** and **Patterns/…** are now **Sites/WhatMatters/…**, **Sites/PitchKit/…**, or **Guides/…**, and components moved from `Components/{Category}/{Name}` to `Components/{Name}` (families: `Components/Button/…`, `Components/Card/…`, `Components/Checkbox/…`, `Components/Radio/…`). Pattern names and their Show code did not change.

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
- **`wmds-check`** consumer audit (`npx wmds-check`): raw controls, `!` overrides on WMDS components, raw color / type / motion values, and pasted patterns that drift from the installed version. See **CONSUMING.md → Consumer check**.
- **Agent skills** in `skills/`: `use-wmds`, `upgrade-wmds`, `report-wmds-gap`, installable with the `skills` CLI. The package exports `./docs/*` and `./CHANGELOG.md` so scripts can `require("@thewhatmatters/wmds/docs/exports.json")`.
- The package is published to npm under the MIT license. `public/rive/interactive-icon-set.riv` and its credits ship in the package.
