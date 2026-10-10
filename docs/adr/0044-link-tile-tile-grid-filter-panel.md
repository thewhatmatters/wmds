# ADR-0044: Link tile, tile grid, the filter panel as a component, and the resource detail

**Status:** Accepted
**Date:** 2026-10-09

## Context

The WhatMatters Resources page is to be a browsable grid of resources — image tiles of varying heights that link out — beside the blog's filter rail. The site had a ruled list of categories built by hand with **TextLink**, because WMDS had no tile that is a link and no grid that packs. **Pattern — filtered index** carried the rail and its phone Sheet as about 80 pasted lines, and a second page pattern would have pasted them again. The site also mounts its own **GridOverlay** inside each page pattern's `main`, which `wmds-check` reports as drift.

## Decision

| Piece | Where |
|-------|-------|
| **LinkTile** | New molecule, Components/LinkTile |
| **TileGrid** + **TileGrid.Item** | New molecule, Components/TileGrid |
| **FilterPanel** + **.Rail** / **.Trigger** / **.Sheet**, and the selection helpers | New organism, Components/FilterPanel |
| **Guides/Filter panel → Pattern — filtered grid** | New page pattern |
| `overlay` on the three page patterns | filtered index, filtered grid, post page |

- **LinkTile is a new component, not a Card option.** A **Card** is a surface with header, body, and footer slots that may hold several controls. A tile is a single anchor with no shell: one hit area, one focus ring, and nothing interactive inside. Making Card a link would have meant forbidding most of what Card's slots allow.
- **The tile names itself with `aria-labelledby`** — the title, the meta line, the tag, then "(opens in a new tab)". The image's `alt` stays on the image and out of the link's name, so a tile does not read "Screenshot of X, X, x.com".
- **The image keeps its own ratio by default**; `ratio` fixes the frame. The `width` and `height` on the image reserve its space, so nothing moves when it loads.
- **The edge is a hairline drawn over the image**, inside the frame (`border-border`, darkening on hover and focus). It shows on a light image in light mode and a dark image in dark mode without adding a frame colour around every image.
- **Masonry is CSS grid with measured row spans, not CSS columns and not absolute positioning.** The list is a grid with 4px row tracks; each item spans the tracks its height needs; the browser's own auto-placement then puts each next item in the first free cell, which is the shortest column. DOM order is never changed, so reading order and tab order are the order of the items and run across and then down. CSS columns order top to bottom; distributing items into column wrappers does the same to the DOM.
- **Packing waits for measurement.** A span must be a whole number of tracks, and a tile's height depends on the column's width, which the server does not know. The server and the first paint show aligned rows (the same grid without spans); the tiles close up in a layout effect. One column is not packed. This is a one-time move at hydration on grids of two or more columns; it is not a shift as images load. Native masonry (`display: grid-lanes`) can replace the measuring when it is in every supported browser. The move is instant: the spans are written to the DOM in a layout effect without a React render, so Motion's layout animation, which runs on a change in the items, has nothing to animate. A hydration test in the browser watches every frame for a transformed or faded tile. `layout="uniform"` takes no measurement and does not move.
- **Rounding:** spans round up, so the space under a tile is the 2rem row gap plus up to 3px.
- **Reflow uses Motion's layout animation** on each item (`motionTransitionProp("medium")`), with a fade for items that come and go. Reduced motion turns both off.
- **The filter panel becomes a component** (amending ADR-0040, which kept it a guide). Two patterns now need it. **FilterPanel** renders no element, so its rail, trigger, and Sheet can sit in different places on the page grid; it is controlled, and `useFilterSelection` holds the state the page also needs to filter its items. `matchesFilterSelection` and `countFilterOptions` replace the functions each pattern pasted.
- **`overlay` is the page patterns' slot for page-level children.** It renders first inside `main.grid-page`, where **GridOverlay** has to be. A prop keeps the pasted markup unchanged, so `wmds-check` has nothing to report.

### Left out of this version

| Asked | Decision |
|-------|----------|
| Sort | No. The grid shows items in the order the app passes them. The caption's `end` is where a sort would go. |
| Search in the rail | No. With a few dozen items the filter groups are enough. |
| More items | Nothing. Every item renders; images load lazily. **Pagination** stays planned. |
| Save / bookmark | No. The site has no accounts, and a button inside the tile would nest a control in a link. |
| Video in the tile | No. The frame sizes and crops an image; autoplay, reduced motion, and a poster need their own contract. |

### Addendum — the same day: a tile opens the resource's detail

A tile no longer leaves the site. Its one link goes to the resource's route in the app, and the visitor goes on to the resource from there. `external` stays on **LinkTile** for apps that link out.

| Piece | Where |
|-------|-------|
| **Guides/Resource detail → Pattern — resource detail** (`ResourceDetailDialog`, `ResourceDetailPage`) | New page pattern |
| **Dialog.Content** `size="full"`, `headerEnd`, `aria-labelledby` | Organism props |
| `renderLink`, `renderImage` on **Pattern — filtered grid** | Pattern props |

- **The overlay form is a Dialog, not a Sheet or a Panel.** The detail is centered, as large as the window allows, and blocks the page: the grid stays behind it, dimmed, and does not scroll. A **Sheet** is an edge drawer and a **Panel** leaves the page in use. Dialog already had the scrim, the focus trap, the scroll lock, Escape, and the return of focus to what opened it; it lacked the size. `full` is the window less a margin, capped at 90rem × 60rem, and the whole screen below `md`.
- **Previous and next sit in the Dialog's header beside the close** (`headerEnd`), and the dialog is named by the title in its info column (`aria-labelledby`), so the header carries only the position and the controls.
- **Visit is in the Dialog's footer**, which is already pinned — that is the phone's "Visit pinned at the bottom" and the same on wider screens.
- **Both forms are one pattern module.** The media well and the info column are shared, so the site pastes one file and the two forms cannot drift apart.
- **The app drives it by route.** `onClose`, `onPrevious`, and `onNext` are callbacks; leaving one out turns its control off. The pattern does not hold which resource is open. Left and Right are ignored while focus is in the video, where they seek.
- **`renderLink` and `renderImage` are props, not edits.** Swapping the pattern's `<a>` for the router's link or its `<img>` for the app's image component changes the pasted markup, which `wmds-check` reports. A prop does not.
- **The item adds** `category`, `tags`, `addedLabel`, and `video.captions` to what was asked (`note`, `added`, `video`, `visitHref`, `rows`): the eyebrow and the Category and Tags rows need labels, not filter ids; a date needs the text readers see; and a video with speech needs captions.
- **Not included, as asked:** view counts or other stats, and a save control.

## Consequences

The Resources page copies **Pattern — filtered grid**. The blog index re-copies **Pattern — filtered index**, which shrinks to the page and its rows. Apps pass their grid overlay through `overlay` and the drift warnings on the post page and the filtered index go away. A page that server-renders a masonry grid of two or more columns sees the tiles close up once at hydration.

## References

- ADR-0004, ADR-0008, ADR-0026, ADR-0040, ADR-0041, ADR-0043
