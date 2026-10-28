# Changelog

Every release of `@thewhatmatters/wmds` is listed here, newest first.

- **Versions follow semver.** While the major version is `0`, a minor bump (`0.3.0`) can break an app and a patch bump (`0.2.1`) does not. Apps depend on `^0.2.0`, which accepts patches only.
- **Every release has a Consumer actions section**: the exact steps an app takes when it moves to that version. It says **None** when there are none. Agents upgrading an app read every Consumer actions section between the old and new version, oldest first.
- **Pasted patterns:** when a release changes a **Pattern — …** story's Show code, it is named under Consumer actions so apps re-copy it.
- **How to add an entry** (contributors): add your change to the top entry. If that version is already on npm (`npm view @thewhatmatters/wmds versions`), start a new entry above it and bump `version` in `package.json` to match. `npm run check:changelog` enforces the format.

## 0.4.30

**Capitals are tracked 0.08–0.12em (Eyebrow rule E3).**

- **HeroIntro** `lead` is renamed **`firstLine`** (it's the heading's first line, not a lead paragraph). `lead` still works as a deprecated alias and warns in development. New optional **`description`**: a lead paragraph under the heading, `type-lead` in ink (Lead rules L7, L8). Story Show code updated: **Components/HeroIntro**, **Components/FooterReveal** and **Components/HeroTileStack** marketing hero patterns.
- **Accordion** `size` (new): `ui` (default, 14px muted panel text) or `reading` (17px regular in ink) for FAQ answers and service descriptions (Body rules B7, B9). New unit test.
- **IntakeConfirmation** body is `type-large` (regular), not `type-heading-2`: it's a paragraph (B4).
- **Guides/PostPage** lead sits in ink (was muted) and is shorter, about 2 lines at 390 (B9, L8).
- **Foundations/Typography** docs: `type-body` 14px is for app UI; marketing paragraphs use `type-large` or `type-reading` (B7); `type-reading` 1.65 is the long-form exception (B1).
- **`type-large` is regular weight (was semibold; Body rule B4, Randy 2026-10-26: "regular or lighter when it's 1.5rem and below").** `--text-large-weight` is a documented knob for a face that needs more weight.
- **`type-eyebrow`** tracking is **0.08em** (was 0.05em): `--text-eyebrow-tracking`. Affects **SectionCaption**, **IndexList** captions, **DescriptionList** `variant="mono"`, **FilterPanel** titles and anything on `typographyClass("eyebrow")`.
- **`typographyClass("overline")`** tracks 0.08em (was `tracking-wider`, 0.05em).
- **Badge** `mono` and **Button** `mono` track 0.12em (was 0.14em).
- Story Show code updated: **Components/FooterReveal → Marketing page pattern** (its column labels).
- New unit test: every uppercase class string in WMDS tracks 0.08–0.12em.
- **SectionCaption** `as` defaults to **`p`** (was `h2`): a caption in capitals is an eyebrow, not a heading (Headings H6, Eyebrow E6). It still names a region through `id` + `aria-labelledby`. **FilterPanel**'s "/ Filters" title and the post page's "/ Metadata" follow.
- **PageHeader** `as` (new): `h1` / `h2` / `h3`, so the title's level follows the page outline (Headings H1). Defaults are unchanged (`app` → `h1`, `page` → `h2`).
- New interaction test **Internal/Interactions/Heading levels**.
- **Every display step** (`type-display-hero`, `-xl`, `-1`, `-2`, `-3`) sets `overflow-wrap: anywhere` (Display rule D5, WCAG 1.4.10): a long word breaks instead of widening its flex or grid track and scrolling a 320px page sideways. `type-display-hero` and `-xl` used `break-word`, which still overflowed inside flex and grid. Normal copy sets as before. New interaction test **Internal/Interactions/Display type**.
- **`type-lead`** (new, `typographyClass("lead")`): the one paragraph under a page's H1 that sums the page up (Lead paragraph rule L7). 18px on phones to 21px (`--text-lead-size`, about 1.25× the 17px reading body), regular weight, 1.45 leading; use it at the 42rem measure in `text-fg`. Nothing uses it yet, so nothing changes until you adopt it.
- **Button** and **IconButton** `disabled` stays in the tab order (Buttons rule U6): it sets `aria-disabled` instead of native `disabled`, ignores clicks, Enter and Space (a disabled submit button no longer submits its form, including on Enter in a field), and shows no hover or press feedback. Disabled dims to **70%** (was 50%), so every role's label keeps 3:1 against its fill in light and dark (unit test). **Button** `disabledReason` (new) shows why beside the button (`type-supporting`, muted) and is read with it through `aria-describedby`. `pressScaleClass` skips `aria-disabled`. Story **Components/Button/Button → Reference — disabled**; new interaction test **Internal/Interactions/Button disabled**.
- **Band** `spacing="lg"` is **64px on phones** and 96px from `md` (was 96px everywhere; Spacing rule S8). `md` stays 48px. A hero or closing band on a phone loses 32px above and below.
- **TextLink** `external` opens in the **same tab** (was a new tab; Links K9). It still shows the external icon. New **`newTab`** opt-in sets `target="_blank"`, `rel="noopener noreferrer"` and adds "(opens in a new tab)" to the accessible name. **Minor behaviour change.**
- **FooterReveal** social links open in the same tab (were a new tab for `https`; K9) and are at least 24px wide (K6). `FooterRevealSocialLink` gains an optional **`ariaLabel`**. **FooterRevealRuled**'s email link no longer opens a new tab. Story hrefs are real-looking, and the X link is named "WhatMatters on X".
- **SiteNav** docs record the **K7 navigation exception**: nav links have no underline; hover shows the ghost pill and darker ink, and the focus ring stays.
- **Breadcrumb** link crumbs are 24px tall targets (were 20px; Links rule K6, WCAG 2.5.8). Padding plus an equal negative margin, so the row does not move; the focus ring is 2px taller. New interaction test **Internal/Interactions/Link targets**.
- **Display type (Rule 3, D1/D2):** `type-display-1` leading **1.05** (was 1.15) and tracking **−0.03em** (was −0.04em); `type-display-2` **1.1** (was 1.2), new `--text-display-2-tracking` **−0.02em**; `type-display-3` **1.15** (was 1.24), new `--text-display-3-tracking` **−0.01em**; `type-display-hero` tracking **−0.03em** (was −0.04em). `--font-display-tracking` still overrides every step for a caps face. New unit test.
- **FooterReveal** headline is `type-heading-1` (was `type-display-1`): the fitted wordmark is the footer's one display moment (D9). The wordmark stays hidden from screen readers and is exempt from D1/D2 as a logo graphic.
- **Foundations/Typography** docs: heading steps sit two apart on the 1.2× ramp (≥ 1.25× between levels, Headings H7); an eyebrow and its heading are one spacing unit (H4, E5). The ramp is unchanged.
- **FooterReveal** sample headline is sentence case, "We build WhatMatters" (was Title Case; Headings H6). Show code changed in **Components/FooterReveal → Marketing page pattern**, **Marketing hero pattern**, **Marketing hero with gallery intro** and **Sequenced marketing hero**.

### Consumer actions

Re-copy the four **Components/FooterReveal** patterns named above if you pasted them (and write your own headline in sentence case). In your own code, give uppercase text `tracking-[0.08em]` (or use `type-eyebrow`) instead of `tracking-wider`. Labels are slightly wider; check eyebrows and mono badges at 390. A **SectionCaption** that should stay in the heading outline needs `as="h2"`; a test that finds it with `getByRole("heading")` now needs `getByText`. If your app sets subtext in `type-large` and wants the old weight, set `--text-large-weight: 600`. **HeroIntro:** rename `lead=` to `firstLine=` (re-copy the FooterReveal and HeroTileStack hero patterns); `lead` keeps working until a later release. **Disabled buttons are now focusable** (`aria-disabled`): a test that used `toBeDisabled()` on a WMDS Button or IconButton needs `toHaveAttribute("aria-disabled", "true")`, and code that read `button.disabled` reads `aria-disabled`. Prefer an enabled button plus an error on submit; when you keep one disabled, pass `disabledReason`.

If a **TextLink** `external` must keep opening a new tab, add `newTab`. Give a one-letter FooterReveal social label an `ariaLabel`.

## 0.4.29

**SiteNav's phone menu button says what it does.**

- **SiteNav** mobile menu trigger says what it does: its label is "Close menu" while the sheet is open ("Open menu" when closed), it sets `aria-haspopup="dialog"`, and `aria-controls` points at the sheet's dialog while it is open (omitted when closed, since the sheet is unmounted). **Sheet.Content** takes `id` (new), set on the `role="dialog"` panel. New interaction test **Internal/Interactions/SiteNav → mobile menu trigger names its state and controls the sheet**.

### Consumer actions

None.

## 0.4.28

**AlertDialog takes a body, Input takes a rich label, and dialogs get a roomier edge.**

- **InlinePill** (new): a pill that sits inside running text and scales with it (em-sized), with an optional picture on its left held in the pill's padding so it never parts from its word. `useInlinePillsPopIn()` pops the pictures in one after another when the text scrolls into view, on the WMDS motion tokens; nothing under reduced motion. Not a control: `Chip` and `Badge` stay UI-sized. Story **Components/InlinePill**, with a 390px long-word test.
- **AlertDialog** `children` (new) — content between the description and the actions, such as a typed-confirmation **Input**. It renders outside the description `<p>`, so `aria-describedby` still names the description alone. Cancel still takes initial focus. Without `children` the markup is unchanged.
- **Input** `label` is now `ReactNode` (was `string`), so a label can read "Type **@handle** to confirm". The `<label htmlFor>` association is unchanged, and the whole label is the field's accessible name. A string label behaves as before.
- **Pattern — alert dialog (typed confirmation delete)** is new on **Components/Dialog**: Delete stays off until the typed value matches the handle (a leading `@`, case, and surrounding spaces are ignored), and the field clears on reopen. **Pattern — rich label** is new on **Components/Input**.
- New interaction test **Internal/Interactions/Overlay → AlertDialog — typed confirmation**.
- **Dialog** and **AlertDialog** edge inset is **24px** on every side, phones included (was 16px): header, body, and footer share the same horizontal inset, and the panel's top and bottom are 24px. A pill action now clears the 16px panel radius instead of sitting in the corner. **Sheet**, **Panel**, and **Card** keep their 16px layout. `dialogStyles` adds `dialogPanelInsetXClasses`, `dialogHeaderInsetTopClasses`, `dialogFooterInsetBottomClasses`.
- **Dialog**, **Sheet**, and **IntakeModal** scroll lock no longer leaves a pale strip at the trailing edge on platforms with classic scrollbars: `html { scrollbar-gutter: stable }` kept that strip after the body stopped scrolling, and the fixed scrim cannot paint into it. While a modal is open the gutter is released and the body takes its width as `padding-right`, so the page behind does not move and the scrim reaches the edge.
- **Loading keeps keyboard focus.** **Button** `status="loading"` (and `"error"` with `disableOnError`), **IconButton** `loading`, **Checkbox** `loading`, and **Switch** `loading` set `aria-disabled` and ignore presses instead of setting native `disabled`, which dropped focus to `<body>` mid-submit. `disabled` still sets native `disabled`. **FilterPanel** Clear all moves focus to the first group (rail) or the results button (Sheet) as it disables itself. New interaction test **Internal/Interactions/Button → a loading button keeps keyboard focus and ignores presses**.
- **Field** `description` now reaches the control: Field appends its description id to the single child's `aria-describedby` (keeping the child's own ids) instead of setting it on the wrapper `<div>`, where screen readers ignored it. A multi-control Field keeps it on its `role="group"`. **Select** takes `aria-describedby` (new) and joins it with its own `description`. New interaction test **Internal/Interactions/Form controls → Field — description describes the control**.
- **AlertDialog** (and **Dialog** with `dismissOnBackdrop={false}`): a press on the scrim no longer moves focus to `<body>`, where the next Tab left the dialog. The interaction test **AlertDialog — confirm and cancel** now presses the scrim and checks focus stays inside.
- **AppShell** has a skip link (new): the first Tab shows "Skip to content" over the top-start corner, and Enter moves focus to `<main>` without changing the URL. `labels.skipToContent` (new) words it. New interaction test **Internal/Interactions/AppShell → the first Tab reaches a skip link that moves focus to the page**.
- **SiteNav**: while the compact bar is pinned (`placement="fixed"` or a `scrollContainer`), the page (or that container) gets `scroll-padding-top` of `--site-nav-height` plus 16px, so an element focused with Tab scrolls into view below the bar instead of under it. The previous value comes back when the bar unpins or unmounts. New interaction test **Internal/Interactions/SiteNav → pinned compact bar keeps focused elements out from under it**.
- **Dialog**, **Sheet**, **IntakeModal**, and **Panel** share one open/close lifecycle (`useOverlayLifecycle` in `lib/dialogOverlay`, internal). What changes for users:
  - **Escape closes only the topmost overlay**, so an AlertDialog over a Sheet no longer closes both. An Escape that a control inside already handled (`defaultPrevented`) is left alone.
  - **Dialog** and **IntakeModal** make the page behind inert, as **Sheet** already did, so a screen reader's virtual cursor stays in the modal.
  - **Panel** moves focus into itself on open (its first control).
  - On close, focus returns to the opener only if it is still in the page and focus has not moved on elsewhere; otherwise it goes to `<main>`. This was Sheet-only before.
  - Stacked modals share one scroll lock, so the page scrolls again however they close (closing them out of order used to leave it locked).
  - New interaction tests in **Internal/Interactions/Overlay lifecycle** cover the shared lifecycle and each of the four overlays.
  - **IntakeModal** `dismissOnEscape` (new, default `true`): set `false` so Escape cannot drop typed answers.
- **Menus share one behaviour** (`useDropdownMenu`, internal, in the Dropdown folder). **Select**, **MoreMenu**, and **Breadcrumb**'s "…" menu:
  - **Escape** closes only the menu and returns focus to its trigger, so a menu inside a **Dialog** or **Sheet** no longer closes the overlay too. An Escape during IME composition is ignored by menus and overlays.
  - **Tab** closes the menu. A press outside closes it (`pointerdown`, so touch works too). Scroll and resize keep it attached to its trigger.
  - **Keyboard:** ArrowDown/ArrowUp, Home/End, and type-ahead; disabled rows are skipped.
  - **Screen readers hear the active row.** **Select**'s trigger is a select-only `combobox` naming the active option with `aria-activedescendant`. **MoreMenu** and Breadcrumb move real focus onto the rows; Space chooses a row like Enter does.
  - **Tab** and **SiteNav** More menus use it too, through one overflow module (`useOverflowMenu`) that owns measuring, the fit, and the More menu. SiteNav no longer reaches into Tab. More menus now follow their trigger on scroll instead of closing, and stop listening for Escape on the whole page.
  - **SiteNav** More rows are real links (`<a href>`), so Cmd-click and middle-click open a new tab.
  - **Tab**: More now sits beside the `tablist` instead of inside it (a `tablist` may only own tabs), which clears the accessibility violations its overflow stories were waiving.
  - New interaction tests in **Internal/Interactions/Menus** cover the shared behaviour and all five menus, including a Select and a MoreMenu inside a **Dialog** and a Breadcrumb inside a **Sheet**, where Escape closes the menu and leaves the overlay open.
  - **Dropdown.Item** forwards its ref. A row that is both active and selected now shows the active fill, so focus is visible on it.
- **Theme** sets `color-scheme` (new): `light` on `:root` and `dark` under `[data-theme="dark"]`, so native scrollbars, form controls, and autofill follow the theme instead of staying light in dark mode.
- **`docs/exports.json`** now lists all 41 lib helpers `src/index.ts` exports (was 12). Nothing was added to or removed from the package. `npm run validate:manifest` now also fails when `src/index.ts` exports a lib helper the manifest does not list.

- **Brand kit (new).** A client's brand is now a short `brand.css` of allow-listed knobs (**CONSUMING.md → Brand kit**):
  - **Type:** `--font-display` (every `type-display-*` step; unset follows `--font-family-heading`), `--font-display-weight`, `--font-display-tracking`, `--font-display-case`, and a `--font-serif` slot. `--font-family-heading` is now allow-listed too. With none set, type renders as before.
  - **New display steps:** `type-display-hero` (fluid to 16vw, `--text-display-hero-size` knob) and `type-display-xl` (44px → 136px), both with tight leading and safe word breaks on phones.
  - **Section colours:** `--color-brand-surface` / `--color-on-brand-surface` (default: the navy) and `--color-field` / `--color-on-field` (default: the primary), each with an optional `-muted` step.
  - **Band (new component):** `tone` `default` / `inverse` / `field` sets `data-tone`, which remaps surface, text, border, fill and focus roles so every component inside re-skins. It holds its own `grid-page`; inside a `grid-page` it bleeds to the viewport edges (no horizontal scrollbar) and keeps the page's columns. `spacing` `md` / `lg` / `none`. New stories **Components/Band → Pattern — page in bands** and **Foundations/Brand kit → Theme a client** (the offer-sheet values with a contrast table); new interaction tests **Internal/Interactions/Band**.
  - **wmds-check** `brand-contrast` (new, error): fails an on-colour or muted step under 4.5:1 on its colour, for primary, brand surface and field, when both are hex in the same CSS rule. It now reads the app's `.css` files.
  - **TextSequence** word masks reach 0.08em above and to the sides of each word, so tall caps on tight display leading and outline strokes aren't clipped. Layout is unchanged.
- **Design knobs for shape (new).** `--radius-control` (default pill) and `--radius-surface` (default 16px) reshape every control and surface. Set them on `:root`, or on a wrapper with Tailwind (`[--radius-control:4px]`), for rectangular buttons, inputs, selects, chips, badges and tabs, and squarer cards and menus. Avatars, dots, spinners, radios, switches and progress bars stay round. Defaults are unchanged: every component renders as before. **CONSUMING.md → Design knobs**; new story **Foundations/Shape → Design knobs — rectangular controls**; new interaction test **Internal/Interactions/Shape**.

### Consumer actions

None. To ask for a typed confirmation, pass an **Input** as `children` of **AlertDialog** and set `confirmDisabled` until the value matches. Copy **Components/Dialog → Pattern — alert dialog (typed confirmation delete)**. A **Dialog** or **AlertDialog** is 16px wider on each side's content inset and 16px taller (8px top, 8px bottom); check the narrowest phone width. No `className` change is needed. `npx wmds-check` now reads your `.css` files: if `brand-contrast` fails on an existing `--color-on-primary`, pick an ink that clears 4.5:1 (or mark a deliberate exception with `/* wmds-check-ignore brand-contrast <reason> */` on the line above). To carry a client's type and section colours, see **CONSUMING.md → Brand kit** and replace hand-rolled section colours with **Band** `tone`.

## 0.4.27

**An opt-in counter for the Carousel.**

- **Carousel** `counter` (new, default `false`) — a visible "1 of 6" under the row on `type-supporting`, `text-muted`, tabular figures; announced politely (`aria-live="polite"`) as the item the row rests on changes; hidden (keeping its space) while every item fits. `labels.counter(position, count)` words it.
- **Carousel** `onIndexChange(index, count)` (new) — 0-based; fires once the row has been still for a moment and the item it rests on has changed. At the end of the row the index is the last item.
- **Carousel** `activeIndex` (new) — controlled: the row moves to that item (0-based) when it changes; the first value is applied without a glide.
- With none of the new props, the markup and behavior are unchanged.
- Stories: **Carousel → Review — 390 counter** and **Reference — count outside the row**. See the ADR-0043 addendum.

### Consumer actions

None. To show the count, pass `counter`; to show it elsewhere, pass `onIndexChange`. No **Pattern — …** Show code changed.

## 0.4.26

**A side sheet with header actions, a phone layout, and URL state.**

- **Sheet** `Sheet.Content` `headerActions` (new) — controls before the close (**IconButton** `size="sm"`: previous / next, share).
- **Sheet** `side="end"` is **full-screen below `md`** (no inset, no radius; header and footer pinned, body scrolls, footer clears the home indicator). From `md` it is a rail over a lighter scrim (`bg-overlay/50`). The page behind is `inert` while open; closing a deep-linked sheet moves focus to `main`; reduced motion fades instead of sliding.
- **`useSheetParam(kind, { initialUrl? })`**, **`readSheetParam(url)`**, **`withSheetParam(url, id | null, kind)`** (new) — keep a sheet in `?sheet=<kind>&id=<id>` with the History API, no router. Back closes; a deep link opens on first render; `initialUrl` serves the open sheet from the server.
- New patterns: **Components/Sheet → Pattern — side sheet**, **Pattern — side sheet header actions**, **Pattern — side sheet URL deep link**; **Components/Table → Pattern — approvals with sheet**.
- See ADR-0049.

### Consumer actions

None required. Every `side="end"` **Sheet**, including **SiteNav**'s phone menu, is now full-screen below `md`; check a phone width. To keep a detail in the URL, wire `useSheetParam` as in **Pattern — side sheet URL deep link** (new patterns, nothing to re-copy).

## 0.4.24

**One focus ring on TextArea and Input.**

- **TextArea** and **Input** no longer show a second ring. The shell's ring sat 2px off the border behind a page-colored gap, so it read as a gray ring around the field's own edge. The ring now hugs the border, one `--color-focus-ring` (or status ring) token, for solo and validation shells.
- The inner field of **TextArea**, **Input**, **PromptBar** and **CopyField** drops its outline and ring with `!important`. A global `:focus-visible { outline }` rule in an app is unlayered and used to beat the component's layered `outline-none`, which painted a blue ring inside the shell.
- New **Components/TextArea → Focused** story.

### Consumer actions

None.

## 0.4.23

**The package loads under Node, and TextArea announces progress.**

- **Fixed:** importing `@thewhatmatters/wmds` in Node ESM (a node test runner, or vitest in a DOM environment) threw `SyntaxError: Named export 'Rive' not found`. `@rive-app/react-canvas` is CommonJS, and **RiveHand** imported it by name; Node only exposes `default` for a CommonJS module. **RiveHand** now reads the runtime from the namespace and falls back to `default`, so bundlers (Vite, Next) and Node both load it. The `motion` imports were not the cause. The build now imports `dist/index.js` in Node, and a unit test does the same.
- **TextArea** `liveStatus` (new) — progress text under the field, in a polite live region (`role="status"`, `aria-live="polite"`). Pass `""` when idle so the region stays mounted and "Saving…" / "Saved" are heard. It is separate from the validation `status` + `message`. `description` and `message` were already tied to the field with `aria-describedby`; tests now cover it.
- **Pattern — save status** is new on **Components/TextArea**.

### Consumer actions

None. To announce a save state, pass `liveStatus`. Copy **Components/TextArea → Pattern — save status** (`docs/patterns/components-textarea--save-status.tsx`) for a worked example.

## 0.4.22

**A pinned sidebar footer, and AppShell on the server.**

- **AppShell** `sidebarFooter` / **AppShell.SidebarFooter** (new) — pinned to the bottom of the sidebar column and the phone **Sheet**. The **NavList** scrolls on its own above it, so a theme switch stays visible at 1440x900 and on a phone. No new color, border, radius, or shadow.
- **Pattern — portal dashboard** now puts a **DisplayControls** `controls="theme"` switch in the footer.
- Documented: the phone toggle's accessible name is **"Menu"** (`labels.menu`), and the docs now say which parts render on the server, which need a `"use client"` boundary, that `displayThemeNoFlashScript` goes in `<head>`, and a Next.js App Router example (`docs/component-contracts.md → AppShell — server rendering`).
- See the ADR-0047 addendum.

### Consumer actions

None for existing shells. To pin a footer, pass `sidebarFooter`. Re-copy **Components/AppShell → Pattern — portal dashboard** (`docs/patterns/components-appshell--portal-dashboard-pattern.tsx`) to get the theme switch in the footer.

## 0.4.21

**A table.**

- **Table** (new, atom) — `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`. Semantic HTML in a focusable, horizontal-scroll `region`. No new color, radius, shadow, or variant.
- Patterns: **Components/Table → Pattern — basic table** and **Pattern — approvals queue** (Approve `primary`, Deny `outline`, an inline Confirm deny / Cancel step in the same row, then a success or failed status pill; keyboard focus follows, Escape cancels, and each button's `aria-label` carries the row name). States: deny confirm step, decided, empty, mobile 390.
- **Table** polish: headers use `ui-label` and the caption `body` (one step up), `sticky` on `TableHead` / `TableCell` pins a column to the start edge (existing `bg-body` surface), and a table with a `colgroup` lays out from its `col` widths (fixed layout) so an empty and a filled table match.
- **Pattern — approvals queue**: the row keeps one height through pending, confirm, and decided (44px decision slot); focus after a decision lands on the status pill and shows the `focus-ring` only for keyboard focus (no box after a mouse click); the Name column is sticky; a `colgroup` fixes the column widths for the filled and empty states.
- **Pattern — approvals queue** on a phone (below `sm`, 640px): each row stacks as an outlined **Card** — name, then type and waiting, then **Approve** and **Deny** each taking half the row, all visible without sideways scroll. The deny confirm stays inline (Confirm deny · Cancel in the same slot) and the 44px decision slot keeps the card one height through pending, confirm, and decided. From `sm` the table is unchanged. No new color, radius, shadow, or Button role.
- `Table` moves out of the planned list.
- See ADR-0048.

### Consumer actions

None for existing pages. If you pasted **Pattern — approvals queue** from an earlier draft, re-copy `docs/patterns/components-table--approvals.tsx` (**Pattern — approvals queue** changed: phone card layout; it now also imports `Card`). To adopt it, `import { Table } from "@thewhatmatters/wmds"` and paste a **Components/Table** pattern (`docs/patterns/components-table--basic.tsx`, `docs/patterns/components-table--approvals.tsx`).

## 0.4.20

**An app shell.**

- **AppShell** (new) — a sidebar on the page background and the page as an inset, raised surface with a title bar. It composes **NavList**, **PageHeader** `variant="app"`, **Sheet** (the sidebar below `lg`), and **Panel** (the optional aside). No new color, radius, shadow, or variant.
- `<AppShell title brand sidebar header aside>` or the slots **AppShell.Brand**, **Sidebar**, **Header**, **Aside**. A `PanelLeft` toggle collapses the sidebar, **Ctrl** / **⌘** + **B** does the same, and `useAppShell()` returns the state.
- Patterns: **Components/AppShell → Pattern — portal dashboard**. States: collapsed, aside open, phone, phone menu open.
- **PageHeader** now applies `aria-label` when `title` is also set (it used to drop it), so a page header can have a name that tells it apart from other banners.
- **Sheet**, **Panel**, **Dialog**, and **AlertDialog** headers carry `role="presentation"`, so an open overlay no longer adds a second `banner` landmark beside the page header.
- See ADR-0047.

### Consumer actions

None for existing pages. To adopt it, `import { AppShell } from "@thewhatmatters/wmds"` and paste **Components/AppShell → Pattern — portal dashboard** (`docs/patterns/components-appshell--portal-dashboard-pattern.tsx`).

## 0.4.19

**A chart beside a stat column.**

- **Pattern — revenue by line** composes **Chart.Cartesian** and a column of **Stat** inside a **Card**. No new component.
- The same pattern includes the unwired state: "Revenue by line is not wired". Do not draw a series until the source exists.

### Consumer actions

Paste **Components/Chart → Pattern — revenue by line** (`docs/patterns/components-chart--revenue-by-line.tsx`). Keep the unwired card until revenue by line is connected. Drop it once `data` is real.

## 0.4.18

**A log viewer, and a dark detail pane.**

- **LogView** (new) — line numbers, a tabular line count, **Copy**, and **Follow**. `follow` keeps the scroller on the last line. `loading` is a **Skeleton**. An empty log says "No log lines".
- **Stat** `detail` — one tabular line under the figure, for example "3 new". Hidden while `loading` or `unavailable`. Hero props (`size="lg"`, `context`, `icon`, `action`, `unavailable`) stay.
- Patterns: **Components/LogView → Pattern — log viewer**, **Pattern — detail pane** (prev/next, tags, a 2×2 stat grid, the log, on `data-theme="dark"`).

### Consumer actions

`import { LogView } from "@thewhatmatters/wmds"`. Paste **Components/LogView → Pattern — log viewer** (`docs/patterns/components-logview--log-viewer.tsx`) and **Pattern — detail pane** (`docs/patterns/components-logview--detail-pane.tsx`). Pass `detail` on **Stat** for the sub line. Existing hero stats keep `size`, `context`, `icon`, `action`, and `unavailable`.

## 0.4.17

**Card.Body can be a terminal frame.**

- **`Card.Body variant="terminal"`** is a dark embed. `data-theme="dark"` on the frame uses the existing dark tokens, so the surface stays dark in both page themes. No new color.
- `src` or `srcDoc`, `title`, `height` (`sm` | `md` | `lg` | `fill`), `readOnly` (muted **Read only** badge), `state` (`ready` | `loading` | `disconnected`).
- `bodyTerminal` is unchanged: it only densifies the shell bottom when Body has no Footer. A terminal frame sits flush to the bottom of a footerless card.
- Pattern: **Components/Card/Card → Pattern — terminal frame**.

### Consumer actions

Replace a hand-rolled iframe in **Card.Body** with `variant="terminal"`. Paste **Components/Card/Card → Pattern — terminal frame** (`docs/patterns/components-card-card--terminal-frame.tsx`). `bodyTerminal` still means footerless density — do not use it as the embed.

## 0.4.16

**DisplayControls can be a theme switch, with a no-flash snippet.**

- **DisplayControls** `controls="theme"` drops the grid button. **G** is not captured. **T** still cycles Auto → Light → Dark.
- `readDisplayTheme`, `persistDisplayTheme`, `applyDisplayTheme`, `commitDisplayTheme`, and `subscribeDisplayTheme` remember the choice under `wmds-theme` and set or clear `data-theme` on `<html>`. `light` clears the attribute. `dark` sets it. `auto` follows `prefers-color-scheme` and keeps listening until the next call. `useSyncExternalStore(subscribeDisplayTheme, readDisplayTheme, …)` reads the saved choice without a hydration mismatch.
- `displayThemeNoFlashScript` is the head snippet that reads the same key before paint. Paste it before the stylesheet.
- Pattern: **Components/DisplayControls → Pattern — theme switch**.

### Consumer actions

Paste `displayThemeNoFlashScript` in `<head>` before the stylesheet (a `<script>` whose text is that string). Render **DisplayControls** with `controls="theme"` and call `commitDisplayTheme` from `onThemeChange`. Paste **Components/DisplayControls → Pattern — theme switch** (`docs/patterns/components-displaycontrols--theme-switch.tsx`).

Existing grid + theme pages keep `controls` omitted. **Pattern — page display controls** is unchanged.

## 0.4.15

**TaskRows: a needs-you table.**

- **TaskRows** `variant="table"` (new) — columns of title, waiting, and metric. Not an accordion. `columns` is `{ id: "title" | "waiting" | "metric", header, align?, width? }`. Defaults are Item, Waiting, and Metric.
- **TaskRows.Row** (new) — `title`, `href` or `render` (a router link; `render` wins), `status` (`tone`, `label` such as "Open · 2d", `pulsing`), `waiting` (a muted **Badge** pill and a detail line), `metric` (`value` is tabular, plus `detail`).
- `source` — `ready` (default), `loading` (skeleton, `aria-busy`), `error` (the `note` in the destructive color), `unwired` (the `note` as a muted footer line, no fake metric).
- `empty` — shown when there are no rows. Defaults to "Nothing waiting".
- Below `md` the headers are visually hidden and each row is two lines: the title, then the status, the waiting detail, and the metric.
- Pattern: **Components/TaskRows → Pattern — needs you**.

### Consumer actions

None for existing **TaskRows** lists and capsules.

For a needs-you table, paste **Components/TaskRows → Pattern — needs you** (`docs/patterns/components-taskrows--needs-you-table.tsx`). Pass `source="unwired"` and `note` when a source is not connected. Do not invent a zero.

## 0.4.14

**Chart: a segmented progress ring, a tabular legend, and a SegmentedBar that renders before it is measured.**

- **Chart.SegmentedRing** (new) — radial capacity meter. `value` / `max`, `segments` (default 72), `tone`, `centerValue`, `centerLabel`, `size` (`sm` 96px, `md` 160px, `lg` 192px), `animate` (`initial` sweeps on mount, `none` holds the fill), `label`. The figure is tabular. A fixed viewBox, so the ticks are in the server HTML.
- Over capacity — a value above `max` fills every tick and shows "Over capacity". The arc does not grow past the ring.
- `unavailable` — `{ reason, label? }` empties the track and replaces the center with muted "Not connected" (or `label`) and the reason. Do not pass a zero for an unwired source.
- Reduced motion — no sweep. The server render is the settled fill, so hydration matches.
- **Chart.Legend** `variant="tabular"` (new) — one row: swatch, label, mono value, percent, delta. `config` entries take optional `value`, `percent`, and `delta` (`{ label, direction?: "up" | "down" | "flat" }`). `up` is success, `down` is destructive, `flat` is muted. The default `series` variant is unchanged.
- **Chart.SegmentedBar** — draws CSS ticks when the host width is still 0 (server HTML and the first client render). The measured SVG, including `fill="velocity"` and `fill="semantic"`, replaces them once the width is known. `animate="initial"` still springs that SVG.
- Pattern: **Components/Chart → Pattern — segmented ring**.

### Consumer actions

None for existing **Chart.Legend** rows or **Chart.SegmentedBar** props.

**Chart.SegmentedBar** now shows ticks before hydration. A client island is no longer required for the meter to appear. `animate="initial"` still springs once the bar has a width.

For a radial meter and a source breakdown, paste **Components/Chart → Pattern — segmented ring** (`docs/patterns/components-chart--segmented-ring-pattern.tsx`). Pass `unavailable={{ reason }}` when the source is unwired.

## 0.4.13

**NavList: link rows, a trailing mark, a section action, and an app sidebar.**

- **NavList** item `href` (new) — the row is an anchor, so a server-rendered app navigates without mapping `onSelect` to a router. `render={<Link href="/tasks/ikea" />}` (new) is the router link. Pass one. If both are set, `render` is used.
- `trailing` (new) — a **Status** dot or a **Badge** `status` pill at the end of the row. Counts stay tabular beside it.
- Section `action` (new) — an **IconButton** for filter or more, in the section label row.
- **Button** `layout="nav"` accepts `render`, the same way a pill does. A selected link sets `aria-current="page"`.
- Pattern: **Components/NavList → Pattern — app sidebar** — brand row, **Search**, sections, a footer slot, and below `lg` a **Sheet** `side="start"` opened from a menu **IconButton** in **PageHeader** `variant="app"`.

### Consumer actions

None for existing button rows.

To navigate from a row: pass `href` or `render`. Paste **Components/NavList → Pattern — app sidebar** (`docs/patterns/components-navlist--app-sidebar.tsx`) for the sidebar and the phone sheet.

## 0.4.12

**Badge: a status pill for run state, cadence, and freshness.**

- **Badge** `status` (new) — `active` | `idle` | `success` | `failed` | `warning`. A pill at cluster height (28px `sm`, 36px `md`) with tabular figures. `active` uses `bg-brand-tint` and `text-brand-outline` (navy `#011272` in light, the lifted navy in dark). The others use the existing muted fills. Not with `count`, `iconOnly`, or `avatar`.
- `dot` (new) — an 8px mark on a status pill. It pulses when `status` is `active`. Reduced motion holds it still. The mark is Badge's own dot, not the **Status** component.
- `icon` on a status pill leads cadence ("Every 2 days") and freshness ("Last checked 1d ago").
- Plain label badges stay on the 20 / 24px shell.
- Pattern: **Components/Badge → Pattern — status pill**.

### Consumer actions

None for existing badges.

For a routine's state: `<Badge status="active" dot>Active</Badge>`, and `<Badge status="idle" icon={<Calendar />}>Every 2 days</Badge>`. Paste **Components/Badge → Pattern — status pill** (`docs/patterns/components-badge--status-pill.tsx`).

## 0.4.11

**Stat: a hero figure with a visible "vs" line.**

- **Stat** `size="lg"` (new) — the figure is `type-display-3` with tabular numbers. The label is sentence case. `sm` and `md` are unchanged.
- `context` (new) — a visible secondary line under the figure, tabular, for "vs $14,850" or "of $1M goal". `trend.label` stays a tooltip on the badge.
- `icon` (new) — a leading Lucide glyph in a brand-tint tile (**ButtonIcon**). The glyph uses `text-brand-outline`, which is navy (`#011272`) in light and the lifted navy in dark.
- `action` (new) — label-row slot. Pass **Button** `size="sm"` ("View details").
- `unavailable` (new) — `{ reason, label? }` replaces the figure with muted "Not connected" (or `label`) and the reason. `trend` and `context` stay hidden. Do not fake a zero.
- `trend.direction` accepts `flat`, the same muted badge as `neutral`.
- `loading` still sets `aria-busy` and a **Skeleton**. `lg` adds a third bar for the context line.
- Pattern: **Components/Stat → Pattern — hero stat**.

### Consumer actions

None for existing **Stat** tiles.

For a hero KPI with a visible comparison: `size="lg"`, `context="vs $14,850"`, optional `icon` and `action`. Paste **Components/Stat → Pattern — hero stat** (`docs/patterns/components-stat--hero-stat.tsx`). When the source is unwired, pass `unavailable={{ reason }}` instead of a zero.

## 0.4.10

**CopyField: a read-only value with a Copy key button.** For copying an API key. See **ADR-0045**.

- **CopyField** (new) — a read-only monospace value and a **Button** `role="secondary"` `size="sm"` labeled "Copy key", seated at the trailing end of **PromptBar**'s pill. **Input** is `inline` `mono` (`type-code`) and truncates, so a long key does not run under the button. A click copies `value` and the label switches to "Copied" for `buttonStatusHoldMs` (2s), announced from the button's polite live region, then returns. The button is in the tab order (Enter and Space). Focusing the value selects it. If the Clipboard API is missing or blocked, the field selects the value, tries `execCommand('copy')`, and shows "Press Cmd/Ctrl+C to copy." in a polite status. The value is never logged.
- **Input** `mono` (new, optional) — the same monospace face, for a read-only key or id. Existing inputs are unchanged.
- `state` (`"copied"` | `"fallback"`) pins that appearance for a specimen. Omit it in the app.
- Patterns: **Components/CopyField → Pattern — copy key**, **Pattern — copied**, **Pattern — clipboard blocked**.
- **On a navy field** — `data-theme="dark"` does not belong on `bg-brand`. Dark surfaces are `#262626`, about 1:1 on `#011272`, so the pill and a secondary button disappear. The label and the clipboard hint inherit the section color instead of `text-fg` / `text-muted`. The pill stays a surface. **Button** `role="inverse-outline"` is the on-brand hairline (`--color-on-brand`, no new color). The filled action stays `role="inverse"`. See **ADR-0046**. Paste **Components/CopyField → Pattern — on a navy field**.

### Consumer actions

None for existing apps on a light surface.

On a brand-navy section: wrap it in `bg-brand text-on-brand`. Do not set `data-theme="dark"` on that section. Paste **Components/CopyField → Pattern — on a navy field** (`docs/patterns/components-copyfield--on-navy.tsx`): `<CopyField label="API key" value={apiKey} />`, **Button** `role="inverse"` for the filled action, `role="inverse-outline"` for the hairline. Do not log the key, and do not pass `state`.

To copy an API key on a light surface: `import { CopyField } from "@thewhatmatters/wmds"` and render `<CopyField label="API key" value={apiKey} />`. Paste **Components/CopyField → Pattern — copy key** (`docs/patterns/components-copyfield--copy-key.tsx`). Do not log the key, and do not pass `state`.

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
