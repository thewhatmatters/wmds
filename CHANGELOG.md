# Changelog

Every release of `@thewhatmatters/wmds` is listed here, newest first.

- **Versions follow semver.** While the major version is `0`, a minor bump (`0.3.0`) can break an app and a patch bump (`0.2.1`) does not. Apps depend on `^0.2.0`, which accepts patches only.
- **Every release has a Consumer actions section**: the exact steps an app takes when it moves to that version. It says **None** when there are none. Agents upgrading an app read every Consumer actions section between the old and new version, oldest first.
- **Pasted patterns:** when a release changes a **Pattern — …** story's Show code, it is named under Consumer actions so apps re-copy it.
- **How to add an entry** (contributors): add your change to the top entry. If that version is already on npm (`npm view @thewhatmatters/wmds versions`), start a new entry above it and bump `version` in `package.json` to match. `npm run check:changelog` enforces the format.

## 0.4.9

**Fixes from the site's 0.4.8 upgrade: router links in every page pattern, a tighter tile caption, and a checker that no longer skips files.**

- **`renderLink` on the page patterns** — one prop name everywhere, for links the app's router should handle. Without it they were plain anchors that reload the page, and swapping one in the pasted markup reads as drift.
  - **Guides/Filter panel → Pattern — filtered index**: `renderLink={(post) => <Link href={post.href} />}` (new) — post titles.
  - **Guides/Post page → Pattern — post page**: `renderLink={(link) => <Link href={link.href} />}` (new) — the **Breadcrumb** and the category tags. View as Markdown and the share links stay plain anchors.
  - **Guides/Resource detail → Pattern — resource detail**: `renderLink={(item) => <Link href={item.href} />}` (new) on `ResourceDetailPage` — the **Breadcrumb**.
  - **Pattern — filtered grid** already had it, for tiles.
- **IndexList.Item** `render` (new) — `render={<Link href="/blog/post" />}` in place of `href`, the same shape as **LinkTile** and **Badge**. `href` is now optional.
- **TextLink** `render` (new) — the same, for any text link. `href` is now optional; pass one or the other.
- **`type-caption`** (new type step; `typographyClass("caption-tight")`) — `type-supporting`'s size and weight on a 16px line. For a single line directly under a label; not for wrapped text, which stays on `type-supporting`. In this release it is used on **LinkTile**'s meta line only. **Foundations → Typography** lists it.
- **LinkTile** — the title and the meta line sit as a pair: no gap between them, and the meta line is on `type-caption`. The space between the title's text and the meta's goes from about 9px to about 5px. The 12px between the image and the title and the two-line clamp are unchanged. A tile with a meta line is 6px shorter. The `loading` placeholder's bars sit in the same 20px and 16px lines, so a placeholder is exactly as tall as a loaded tile with a one-line title.
- **`wmds-check`** — finds a pasted pattern's header when a `"use client"` or `"use server"` directive (or blank lines) comes before it. It read line 1 only, so such a file was skipped silently and never checked for drift. Findings name the header's line.
- **0.4.8 Consumer actions corrected** — they said to put `"use client"` above the pattern header. The header goes first and the directive below it, as the `use-wmds` skill says. Both orders now work with `wmds-check`.
- **TileGrid docs** — the space under a masonry tile is the 2rem row gap plus less than 4px (32px to just under 36px), not "within 3px". A tile's height rounds up to the next 4px row track. The behavior has not changed.

### Consumer actions

Re-copy three patterns, then pass the app's link through `renderLink`. Do the wiring in a client component (a function cannot cross from a server component), and remove any `<Link>` added to pasted markup.

1. **Re-copy Guides/Filter panel → Pattern — filtered index** (`node_modules/@thewhatmatters/wmds/docs/patterns/guides-filter-panel--filtered-index.tsx`) over `components/blog-index.tsx`, re-apply your content, data, and handlers, and pass `renderLink={(post) => <Link href={post.href} />}` to `<FilteredIndex>`.
2. **Re-copy Guides/Post page → Pattern — post page** (`…/docs/patterns/guides-post-page--post-page.tsx`) over `components/post-page.tsx`, re-apply your content, and pass `renderLink={(link) => <Link href={link.href} />}` to `<PostPage>`.
3. **Re-copy Guides/Resource detail → Pattern — resource detail** (`…/docs/patterns/guides-resource-detail--detail.tsx`) over `components/resource-detail.tsx`, re-apply your content, and pass `renderLink={(item) => <Link href={item.href} />}` to `<ResourceDetailPage>`.
4. **Pattern headers:** the header stays on the first lines with `"use client"` below it. A file with the directive first is now checked too, so `npx wmds-check` may report drift it skipped before. Fix the drift, or re-copy.
5. **LinkTile:** nothing to do. Tiles with a meta line are 6px shorter. Update a screenshot baseline or a test that measures a tile's height. **Pattern — filtered grid** did not change; no re-copy.
6. **`type-caption`:** do not move other text to it. It is for one line under a label.
7. Other apps: none. `render` on **TextLink** and **IndexList.Item** is optional.

## 0.4.8

**A filtered grid and a resource detail for a resources page.** Three new components and two page patterns: a tile that is one link, a grid that packs tiles in reading order, the filter panel as a component, and a resource's detail as a dialog over the grid or as its own page. The WhatMatters Resources page is the first use. See **ADR-0044**.

- **LinkTile** (new) — a resource tile that is one link: `media` (an image with its `width` and `height`), `title`, a `meta` line such as the domain, an optional `tag` (a **Badge** over the image) and `source` mark (**Avatar** `xsm` or a favicon, before the title). One hit area and one focus ring; nothing interactive goes inside. `external` opens a new tab the way **Button** and **TextLink** do; `render={<Link href />}` makes it a router link. The image keeps its own ratio by default; `ratio` fixes it. `loading` is a **Skeleton** placeholder. A hairline inside the frame keeps an edge on light images in light mode and dark images in dark mode. Screen readers hear the title, the meta, the tag, then "opens in a new tab".
- **TileGrid** (new) with **TileGrid.Item** — `layout` `masonry` (default) or `uniform`; `columns` as one number or `{ base, sm, md, lg, xl }` (default 1, 2 from `sm`, 3 from `lg`); `empty`; `busy`. Reading order and tab order are the order of the items in both layouts: masonry puts each next item in the shortest column, so the order runs across and then down. When the items change, the tiles that stay move to their places and the others fade; reduced motion changes at once.
- **FilterPanel** (new) with **FilterPanel.Rail**, **.Trigger**, and **.Sheet** — the filter rail, its phone button, and its bottom Sheet as one component, so a page no longer pastes them. With it: `useFilterSelection`, `matchesFilterSelection`, `countFilterOptions`, `filterSelectionCount`, and the types `FilterSelection`, `FilterFacets`, `FilterPanelGroup`, `FilterPanelOption`.
- New **Guides/Filter panel → Pattern — filtered grid** — the filtered index page with **SectionCaption** over a **TileGrid** of **LinkTile** in the main column. A tile goes to the resource's route in the app (`item.href`), not out of the site; `item.external` is there for an app that links straight out. Props: `title`, `caption`, `items`, `groups`, `layout`, `columns`, `loading`, `defaultSelection`, `selection` + `onSelectionChange`, `renderLink` (the router's link for a tile), `renderImage` (the app's image component), `overlay`.
- New **Guides/Resource detail → Pattern — resource detail** — one module with both forms. `ResourceDetailDialog` opens over the grid (dimmed, not scrolling): the media as large as the window allows beside an info column — category eyebrow, title, the curator's note, the date added, and a **DescriptionList** (Category, Tags, Source, and the app's `rows`) — with the position, previous and next, and a close in the header, and a primary **Button** `external` to visit the resource pinned in the footer. Left and Right move between resources, Escape closes, and focus returns to the tile. On phones it is the whole screen, media first. `ResourceDetailPage` is the same content on the page grid under a **Breadcrumb**. Media is one image or one `video` with controls. The item is `{ id, title, image, video?: { src, poster, captions? }, category, tags?, meta?, note, added, addedLabel, visitHref, rows? }`.
- **Dialog.Content** `size="full"` (new) — the window less a margin, up to 90rem × 60rem, and the whole screen on phones. `headerEnd` (new) — actions before the close. `aria-labelledby` (new) — names the dialog from a heading in its body when there is no `title`.
- **Guides/Filter panel → Pattern — filtered index** now uses **FilterPanel** and the helpers. It looks and behaves the same and is about 90 lines shorter. `FilterGroupDef` is now `FilterPanelGroup` from the package; `FilterSelection` is imported from the package too.
- **Guides/Post page → Pattern — post page**: `metadataStack` (new, `"before"` | `"after"`, **default `"after"`**) — where the metadata panel sits below `lg`, where the page is one column. The article now comes first, with the date and the reading time in a mono line under the title (hidden from `lg`, where the panel is beside the article). It is also the panel's place in the markup: with `metadataSide="end"` the `aside` follows the article at every width and no order utility is used. From `lg` nothing changes. `metadataStack="before"` is the old stacking. See the amendment to **ADR-0041**.
- **`overlay`** (new prop) on **Pattern — filtered index**, **Pattern — filtered grid**, and **Guides/Post page → Pattern — post page** — page-level children such as **GridOverlay**, rendered first inside the page grid. Passing a prop leaves the pasted markup unchanged, so `wmds-check` no longer reports drift for an overlay.
- **Decisions taken** (the requests left them open): **LinkTile** is its own component, not a **Card** option. The detail over the grid is a **Dialog**, not a **Sheet** or a **Panel**. The detail item adds `category`, `tags`, `addedLabel`, and `video.captions` to the shape asked for. No view counts and no save control. No sort, no search field in the rail, no paging or Load more, and no save button in this version — the grid shows every item in the order it is given. A video in the tile is out of scope; `media` is one image.
- **Known limit:** a masonry grid packs after it measures its tiles. A server-rendered page shows aligned rows first and the tiles close up once at hydration, on grids of two or more columns (phones, at one column, do not move). That move is instant — no tile slides or fades; the reflow animation is for a change in the items only. Nothing moves as images load. The space under a tile is the row gap within 3px. **`layout="uniform"` has no such move**: it is CSS alone, so the server's markup is the final layout.

### Consumer actions

1. **WhatMatters site, Resources page: use the new grid.** Copy **Guides/Filter panel → Pattern — filtered grid** (`node_modules/@thewhatmatters/wmds/docs/patterns/guides-filter-panel--filtered-grid.tsx`) into `components/resource-grid.tsx`, keep its header comment as the first lines, and add `"use client"` below it. Each item is `{ id, title, href, image: { src, alt, width, height }, meta?, tag?, facets }` with `href: "/resources/<slug>"`; give every image its real `width` and `height`. Delete the hand-built list in `app/resources/page.tsx` and its classes.
2. **Wire the grid in one small client file** (functions cannot cross from a server component): `components/resources.tsx` with `"use client"` renders `<FilteredGrid title="Resources" caption="Library" items={items} groups={groups} renderLink={(item) => <Link href={item.href} scroll={false} />} renderImage={(image) => <Image {...image} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />} overlay={<SiteGridOverlay />} />`. `app/resources/page.tsx` loads the items and renders it. Change `sizes` if you change `columns`; allow the image hosts in `next.config.ts`. Do not edit the pasted file for any of this.
3. **Add the detail.** Copy **Guides/Resource detail → Pattern — resource detail** (`…/docs/patterns/guides-resource-detail--detail.tsx`) into `components/resource-detail.tsx`, keep its header comment as the first lines, and add `"use client"` below it. Each resource needs `{ id, title, image, video?: { src, poster, captions? }, category, tags?, meta?, note, added, addedLabel, visitHref, rows? }`.
4. **Pick the form by route.**
   - The page: `app/resources/[slug]/page.tsx` renders `<ResourceDetailPage item={…} breadcrumb={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: item.title }]} overlay={<SiteGridOverlay />} />`. Delete `app/resources/[category]`: the categories become a filter group on the grid. No redirects.
   - The dialog: a parallel slot with an intercepting route (`app/resources/@detail/(.)[slug]/page.tsx`, a `default.tsx` that returns `null`, and `{detail}` in `app/resources/layout.tsx`) renders a client component with `<ResourceDetailDialog item={…} open onClose={() => router.back()} onPrevious={previous ? () => router.replace("/resources/" + previous.slug, { scroll: false }) : undefined} onNext={…} position={"3 of 9"} />`. Leave `onPrevious` out on the first resource and `onNext` out on the last.
   - Opening `/resources/<slug>` directly, or from a shared link, shows the page; a tile click shows the dialog over the grid.
5. **WhatMatters site, blog index: re-copy Guides/Filter panel → Pattern — filtered index** (`…/docs/patterns/guides-filter-panel--filtered-index.tsx`) over `components/blog-index.tsx` and re-apply only your content, data, and handlers. Then remove `<SiteGridOverlay />` from the markup and pass it as `overlay={<SiteGridOverlay />}` where the page renders `<FilteredIndex>`. If the page imports `FilterGroupDef` from that file, import `FilterPanelGroup` from `@thewhatmatters/wmds` instead (same shape).
6. **WhatMatters site, post page: re-copy Guides/Post page → Pattern — post page** (`…/docs/patterns/guides-post-page--post-page.tsx`) over `components/post-page.tsx`, re-apply your content, and move `<SiteGridOverlay />` to `overlay={<SiteGridOverlay />}`. Keep `metadataSide="end"` and `metadataColumns={3}`: with them the panel now stacks after the article below `lg`, the date and reading time sit under the title there, and the `aside` follows the article in the markup. No other prop and no class edit is needed; `metadataStack="after"` is the default. Update any test that expects the panel before the article in the DOM or above it on a phone.
7. **Check:** `npx wmds-check` reports no `pattern-drift` for the four pasted files. Any `data-*` attributes the site adds to pasted elements are not drift and can stay.
8. **If the one move at hydration is not acceptable** on the Resources page, pass `layout="uniform"` to `<FilteredGrid>`: every image is cropped to 4:3 and nothing moves.
9. **Tests:** on a server-rendered grid of two or more columns, wait for `ul[data-packed]` before asserting tile positions or taking a screenshot. The detail dialog fades in over about 0.4s; wait for it before an accessibility or visual check.
10. Other apps: an app that pasted **Pattern — post page** and re-copies it gets the panel after the article below `lg`; pass `metadataStack="before"` to keep it above. Everything else here is new; `Dialog` `size`, `headerEnd`, and `aria-labelledby` are optional.

## 0.4.7

**Carousel: a row of items with a progress scrubber.** New component, built on the open `motion` package. The WhatMatters About page is the first use. See **ADR-0043**.

- **Carousel** (new) with **Carousel.Item** — a horizontal row the visitor drags, scrolls (touch, trackpad, shift-wheel), or steps through with the keyboard. A mouse drag glides on and stops softly at each end; the row does not loop. Name it with `aria-label` or `aria-labelledby` (one is required).
  - `itemWidth` — a percentage of the row, one number or `{ base, sm, md, lg }`. Default `{ base: 80, sm: 55, lg: 40 }`, so the next item always shows. The gap is the grid gutter.
  - `snap` (default on) rests the row on an item's leading edge. `bleed` runs it to the page edges while items start on the grid. `fade` (default on) fades clipped items the way `scroll-fade-x` does.
  - `progress` — the scrubber under the row: `center` (default) or `start` for a shorter track (full width on phones), `full`, or `none`. The filled part's place is the row's progress and its width the share of the row in view. Drag it, or press the track. It hides itself, keeping its space, while every item fits.
- **Decisions taken** (the request left them open): one component with the scrubber as a prop, not a separate part; the scrubber is hidden from assistive tech and is not a tab stop — the row takes Left, Right, Home, and End, and each item says its place ("2 of 4"); no previous and next buttons in this version.
- **Also:** a drag never clicks a link inside an item, and images are not picked up by the browser's own drag. Reduced motion moves the row at once, with no glide. Right-to-left flips the direction and the arrow keys. On the server and the first paint the row is at its start with the scrubber at zero; it measures again on resize and when an image loads.
- New **Components/Carousel → Pattern — image carousel**: rounded outlined **Card** tiles with an image in the body.

### Consumer actions

1. **WhatMatters site, About page: replace the hand-built image strip.** Copy **Components/Carousel → Pattern — image carousel** (`node_modules/@thewhatmatters/wmds/docs/patterns/components-carousel--image-carousel.tsx`) into `components/image-carousel.tsx`, keep its header comment, and render `<ImageCarousel label="Selected work" images={…} />` where the strip is. Delete the scroll-snap list and its classes (`scroll-fade-x`, `snap-x`, `overflow-x-auto`, the per-image **Card** markup) — the pattern has the cards.
2. **Name the row once.** If a heading already sits over the strip, give the heading an `id` and pass `aria-labelledby` in place of `aria-label` (change the pattern's one prop). Do not also put that `aria-labelledby` on a `section` around it: two landmarks with one name fail the accessibility check.
3. **`next/image` is fine.** To use it, swap the pattern's `<img>` for `<Image>` with the same `className`, a `width` and `height` (or `fill` inside a sized box), and `sizes="(min-width: 1024px) 40vw, (min-width: 640px) 55vw, 80vw"` to match the default `itemWidth`. Change `sizes` if you change `itemWidth`.
4. **Page layout.** Place it on the grid like any other block: `className="col-span-full"` inside a `band`. Add `bleed` if the row should run to the page edges. The scrubber's hit area is 44px tall, so drop any margin the old strip had under it.
5. Other apps: none. Everything here is new.

## 0.4.6

**TextArea shows one focus ring.** A focused **TextArea** drew two: the ring on its shell, and the browser's own outline on the field inside it.

- **TextArea** — the field inside the shell drops its outline, so the shell's ring is the only focus indicator. This was visible on every **TextArea** without a status message, including Project details in **IntakeForm** and the Start a project gate. **PromptBar** and a **TextArea** with a `message` were already correct.

### Consumer actions

None. If an app added its own outline reset for this, remove it.

## 0.4.5

**The Start a project form is shorter and set into the conversation.** **IntakeForm** can leave out its optional fields, **Pattern — start a project gate** uses the short form, and **ChatDock.Gate** reads as embedded in the chat. See the amendments to **ADR-0038** and **ADR-0039**.

- **IntakeForm** `company` and `link` (new, both default `true`) — `false` leaves the field out; the form closes up with no gap. A left-out field keeps its value in `IntakeAboutValues` (empty), so `isIntakeAboutValid` and the app's submit code don't change. New **Components/IntakeForm → Pattern — short form**.
- **Components/ChatDock → Pattern — start a project gate** — step 3 is the short form: name, email, and project details (`company={false}` `link={false}`), two rows shorter. Drop those two props to ask for a company and a link again.
- **ChatDock.Gate** — set into the conversation as a well: a hairline border at the card body radius, the page floor inside, and an inset shade under its top edge. Before, it was flat under a hairline. At 1280×900, step 1 still shows all seven services with the reply above it.
- **`--shadow-inset-well`** (new token, `shadow-inset-well`) — a well set into a surface: an inset shade under its top edge (light and dark values). **Foundations → Shadows** lists it.

### Consumer actions

1. **WhatMatters site: re-copy Components/ChatDock → Pattern — start a project gate** (`node_modules/@thewhatmatters/wmds/docs/patterns/components-chatdock--pattern-start-project-gate.tsx`) over `components/start-project-gate.tsx` and re-apply only your services, budgets, step copy, and calendar. The change is step 3: `<IntakeForm values={about} onChange={setAbout} company={false} link={false} />`. If you'd rather not re-copy, add those two props by hand. Your `onSubmit` and its server code need no change: `company` and `url` arrive empty.
2. **The gate's new look: nothing to do.** It comes with the upgrade.
3. Other apps: none. `company`, `link`, and `shadow-inset-well` are new and optional.

## 0.4.4

**ChatDock: the Start a project form sits in the conversation.** Having seen 0.4.3 live, the form goes back inside the chat window instead of replacing it — as a component in the conversation, without the 0.4.2 problems (no card inside a card, one header and one close, no gap above the form, no cap that clips the step). See the second 2026-10-05 amendment to **ADR-0039**.

- **ChatDock `gate`** — the form is the last item in the conversation, under the latest message, where a reply would go. The window keeps its header and its close. The composer stays in place but is off, with the placeholder "Finish or cancel the form to keep chatting" (new label `gatePlaceholder`); suggestion rows, follow-ups, and the rows under replies (Copy, thumbs, score) step aside until the form goes. The disclaimer stays.
- **The window stays non-modal.** No scrim; the page behind stays usable, and focus is not held in the window.
- **The step is never clipped.** The form never scrolls on its own. From `md` the window grows to fit the conversation and the form — up to the viewport less 7rem — and eases back after; at 1280×900, step 1 shows all seven services with the reply above it. Past that the conversation scrolls, and each step is brought into view: the whole form when it fits, else its top.
- **`gateSubtitle`** (new) — the window's subtitle while a gate is up, for example "Start a project". Without it the subtitle is hidden while the gate is up.
- **ChatDock.Gate** — flat on the window surface under a hairline, and as wide as the conversation's turns. Its header is the step's title (now an `h3`), subtitle, previous, "2 of 4", and next; it has **no close of its own** — the window's close and Escape fold the window and keep the form, and Cancel leaves it. `pending` and `error` are unchanged. `labels.close` is unused and deprecated.
- **Unchanged from 0.4.3:** closing the window keeps the form and its answers, and reopening brings it back at the same step; `onSubmit` returns a promise, with "Sending…", the error, and Try again; the Toaster and reduced-motion hydration fixes, the post page and filtered index options, and the `wmds-check` changes.
- **Components/ChatDock → Pattern — chat dock** passes `gateSubtitle="Start a project"`. **Pattern — start a project gate**: only its `close` description changed. New stories: **Start a project — after a long conversation** at 1280 and 390; the step stories now show the reply above the form.
- **Fix:** the conversation stays at its end while the window changes size, so the confirmation a finished form leaves is in view.

### Consumer actions

1. **WhatMatters site: re-copy Components/ChatDock → Pattern — chat dock** (`node_modules/@thewhatmatters/wmds/docs/patterns/components-chatdock--pattern-chat-dock.tsx`) over your ask component, and re-apply only your content, data, and handlers. It adds `gateSubtitle="Start a project"` to **ChatDock**. If you'd rather not re-copy, add that one prop by hand.
2. **WhatMatters site: re-copy Components/ChatDock → Pattern — start a project gate** (`node_modules/@thewhatmatters/wmds/docs/patterns/components-chatdock--pattern-start-project-gate.tsx`) over `components/start-project-gate.tsx` and re-apply only your services, budgets, step copy, and calendar. Only a comment changed, so `npx wmds-check` reports nothing either way; re-copy to keep the header at 0.4.4.
3. **The form in the conversation: nothing else to do.** It comes with the upgrade, and your `onSubmit`, `renderCalendar`, and the 0.4.3 wiring stay as they are. Check your tests:
   - The page is no longer blocked while the form is up: a test that closed the window before clicking the page no longer needs to.
   - The form has no close: a test that pressed the gate's close should press the window's (**Close chat**) or Escape — both still keep the form — or **Cancel** to leave it.
   - The composer is disabled while the form is up, not hidden: a test that expected no textbox should expect a disabled one.
   - The step's title is an `h3`.
4. Other apps: step 3 only, if they render a ChatDock `gate`. `gateSubtitle` is optional.

## 0.4.3

**ChatDock: the gate takes over the window.** Start a project no longer sits as a card inside the chat. While a `gate` is up the window is the form: one header, the step, and the footer on the window's bottom edge, and the window is modal. Also: two hydration fixes, a promise-based send for the gate pattern, options for the post page and filtered index patterns, and fewer false positives in `wmds-check`. See the amendments to **ADR-0039**, **ADR-0040**, and **ADR-0041**.

- **ChatDock `gate`** — fills the window. The window's header, the conversation, the composer, the suggestion rows, the follow-ups, and the disclaimer fade out and wait behind it; finishing or cancelling brings them back as they were. The cap that kept the latest reply in view is gone: the step body takes the window's height and scrolls, and the footer sits on the window's bottom edge (above the home indicator on phones). While the gate is up the fixed window is modal: a scrim covers the page and **SiteNav**, the page is inert and does not scroll, and Tab stays inside (`aria-modal="true"`). Inline previews are not modal.
- **One close.** The gate's header close (named "Close chat", from ChatDock's `labels.close`), Escape, and a click on the scrim fold the window and keep the gate with its progress; reopening the chat brings it back. The gate's Cancel leaves it. Before, Escape and the gate's close left the gate and the window had a second close.
- **ChatDock.Gate** — a flush shell in the window instead of a raised card; the step sits on the window surface, not an inset well. New `pending` (shows `labels.pending`, "Sending…", in a status line, disables the step controls, sets `aria-busy`) and `error` (a line over the footer, announced). The header's next control is off on the last step, so `onNext` there is the footer's primary action — "Send" or "Try again" through `continueLabel`. New label `pending`.
- **Components/ChatDock → Pattern — start a project gate** — `onSubmit` returns a promise. Booking or skipping shows "Sending…"; the confetti, the answers, and the confirmation wait for it to resolve. If it rejects, every answer stays, the gate says the send failed, and Try again sends it again. `close` is the gate's Cancel. New stories: **Start a project — send failed** at 1280 and 390.
- **Fix: Toaster hydration.** **Toaster** rendered its list in the browser and nothing on the server, so a layout that held it failed hydration on every page. It now renders nothing on the server and in the hydration render, and mounts its list right after.
- **Fix: ChatDock hydration under reduced motion.** The closed window's inline style differed between the server and a browser that prefers reduced motion. ChatDock now reads reduced motion as off on the server and in the hydration render, and switches right after, while the window is hidden.
- **Guides/Post page → Pattern — post page** — `metadataSide` (`"start"`, default, or `"end"`) and `metadataColumns` (`4`, default, or `3`; the article takes the rest) place the metadata panel from `lg`. Below `lg` it stacks above the article either way. New story **Metadata on the right**.
- **Guides/Filter panel → Pattern — filtered index** — a post's `facets` take one option or a list per group (`{ topic: ["guides", "brand"] }`); within a group the options on are alternatives, and each option counts every post that has it. New `defaultSelection` (the filters on when the page opens) and `selection` + `onSelectionChange` (the app holds them). New exported types `FilterSelection` and `FilteredIndexProps`. New story **Starting selection**.
- **`wmds-check`** — `pattern-drift` compares a pasted pattern's markup and classes with the shipped file (its elements in order, its `className` and `style` values, and its `*Classes` constants), so edits to content, data, handlers, and exported names no longer warn; the warning names the first difference. `raw-color` no longer reads a character reference such as `&#039;` as a hex color.

### Consumer actions

1. **WhatMatters site: re-copy Components/ChatDock → Pattern — start a project gate** (`node_modules/@thewhatmatters/wmds/docs/patterns/components-chatdock--pattern-start-project-gate.tsx`) over `components/start-project-gate.tsx`, and re-apply only your services, budgets, step copy, and calendar. Then make `onSubmit` return the send's promise and reject when it fails — for example `onSubmit={async (intake) => { const response = await fetch("/api/intake", { method: "POST", body: JSON.stringify(intake) }); if (!response.ok) throw new Error("Intake failed"); }}`. TypeScript flags a handler that returns nothing. Remove the toast you show on a failed send; the gate shows the error and Try again.
2. **The gate taking over the window: nothing to re-copy.** It comes with the upgrade, and **Pattern — chat dock** is unchanged. While the gate is up the page behind is inert: a site test that clicks the page with the gate open must close the window first (the gate's close, Escape, or the scrim). A test that pressed Escape or the gate's close to leave the gate now finds the window folded with the gate kept; press **Cancel** to leave it.
3. **Mount `<Toaster />` directly in the layout** and remove the after-hydration workaround.
4. **WhatMatters site, post page: re-copy Guides/Post page → Pattern — post page** (`node_modules/@thewhatmatters/wmds/docs/patterns/guides-post-page--post-page.tsx`), re-apply only your content, data, and handlers, and pass `metadataSide="end"` and `metadataColumns={3}` where you render `PostPage` instead of editing the panel's classes.
5. **WhatMatters site, blog index: re-copy Guides/Filter panel → Pattern — filtered index** (`node_modules/@thewhatmatters/wmds/docs/patterns/guides-filter-panel--filtered-index.tsx`) and re-apply only your content and data. Map each post's topics to a list (`facets: { topic: post.topics }`). For the category tags that link to `/blog?topic=<id>`, read the parameter in the page and pass `defaultSelection={{ topic: [topic] }}` when it is set — or pass `selection` and `onSelectionChange` to keep the filters in the URL.
6. **`npx wmds-check --max-warnings 0`** now passes with content-only edits to pasted patterns. A remaining `pattern-drift` names the first markup or class that differs: re-copy that pattern, or use the pattern's props (steps 4 and 5) instead of editing its classes.
7. Other apps: steps 2 and 3 only, if they render a ChatDock `gate` or a **Toaster**. **ChatDock.Gate** `pending` and `error`, and the patterns' new props, are optional.

## 0.4.2

**Breadcrumb** — the path to the current page, after the shadcn/ui breadcrumb: links from the root, a separator between them, the current page last, and a long path folded into a "…" menu of links. See **ADR-0042**.

- **Breadcrumb** (new) — pass `items` (`{ label, href }`; the last item, without `href`, is the current page). Above `maxItems` (default 4) the first item and the last two stay and the middle folds into a "…" control; it opens a menu of the hidden links, with focus on the first, arrow keys between them, and Escape back to the control. Long labels truncate. `separator`: `chevron` (default) or `slash`. `variant`: `sans` (default) or `mono` (eyebrow caps). `renderLink` routes every link through your router (`(item) => <Link href={item.href} />`). New **Pattern — path**, **Pattern — long path**, **Pattern — router links**, and **Pattern — editorial**.
- **Dropdown.Item** `render` — compose a row onto another element, such as `render={<a href />}` for a menu of links.
- **Guides/Post page → Pattern — post page** — a mono, slash-separated **Breadcrumb** above the title. `PostPageData` gains `breadcrumb`.

### Consumer actions

1. **WhatMatters site, post page: re-copy Guides/Post page → Pattern — post page** (`node_modules/@thewhatmatters/wmds/docs/patterns/guides-post-page--post-page.tsx`) and re-apply only your content, data, and handlers. Pass `breadcrumb` in `PostPageData`, ending with the post — for example `[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]`, with the post's category between Blog and the title if you link categories. To route crumbs through Next, pass `renderLink={(item) => <Link href={item.href} />}` on the pattern's **Breadcrumb**.
2. **WhatMatters site, other deep pages** (a resource category, a case study): add `<Breadcrumb items={…} />` above the page title — `variant="mono" separator="slash"` on editorial pages, to match the post page.
3. Other apps: none. **Breadcrumb** and **Dropdown.Item** `render` are new and optional.

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
