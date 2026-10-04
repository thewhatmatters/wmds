# ADR-0041: Post page

**Status:** Accepted
**Date:** 2026-10-04

## Context

The whatmatters.so blog post page is a display title, a "/ Metadata" panel, and a "/ Article" column. The panel lists the date, the author, the reading time, and categories, then Agents actions (Copy for LLM, View as Markdown) and Share links. The app built it by hand: a `<dl>` of two-track rows, outline tags faked with muted badges, a copy button that swapped its own icon and label and announced the result, share buttons that added their own new-tab text and `rel`, a caption component, and a markdown renderer that mapped every element to a type utility.

## Decision

| Piece | Where |
|-------|-------|
| **DescriptionList** + **DescriptionList.Item** | New molecule, Components/DescriptionList |
| **SectionCaption** | New atom, Components/SectionCaption |
| **Prose** | New atom, Components/Prose |
| `type-reading` | Utility in `src/theme/typography.css`; `typographyClass("reading")` |
| **Badge** `emphasis="outline"`, `mono`, `render` | Atom props |
| **Button** `status` with `icon`, `buttonStatusHoldMs`, `external`, `externalIcon` | Atom props and export |
| **Guides/Post page → Pattern — post page** | Guide; Show code is the page |

- **DescriptionList renders `dl` > `div` > `dt` + `dd`.** Rows are `inline` (2 : 3 tracks, the app's proportions) or `stacked` (actions need the width), per list or per row. `rule` is `solid`, `dotted`, or `none`. The dotted rule is `border-dotted` on the emphasized hairline color — 1px dots on `border-border` disappear. `variant="mono"` sets eyebrow names and mono caps values. It is not a utility: the rule is a prop of the list that needs it.
- **Atoms own their case.** A mono list sets `text-transform: uppercase` on its values, which children inherit. **Button** and **Badge** now set `normal-case` on their shells; their `mono` options set caps with `!uppercase`.
- **Badge links compose through `render`** (Base UI, as **Button** does). A link badge underlines on hover, gets the focus ring, and has a 44px-tall hit area around the 20–24px pill. Actions stay on **Button**.
- **Button `status` now works with `icon`.** The idle icon is the first frame of the status glyph, so it morphs into the check or the cross. The status pill already carries `aria-live="polite"`, so the result is announced. The copy button is a pattern (**Pattern — copy button**), not a component: the clipboard call and the two-second hold (`buttonStatusHoldMs`) are a few lines the app owns.
- **Button `external`** needs `render={<a href />}`. It sets `target="_blank"` and `rel="noopener noreferrer"`, adds a visually hidden "(opens in a new tab)", and shows **TextLink**'s trailing icon unless `externalIcon={false}`.
- **SectionCaption is a component**, not only the utility, so the "/" marker is `aria-hidden` everywhere and the rule (`border-border-emphasized`) and an end action are consistent. **IndexList** captions draw the same marker and rule; the filter panel guide uses **SectionCaption**.
- **Prose styles plain elements** through descendant selectors in `proseStyles.ts`. Long-form text is `type-reading` (17px at a 28px line): at 14px the 40rem measure runs past 90 characters a line; 17px keeps it near 70. `size="md"` keeps `type-body` for denser notes. Headings step up one size at `lg`. Wide tables scroll inside themselves (`display: block` on the table). Links get the **TextLink** prose treatment; apps map markdown links to **TextLink** for `external`.
- **The panel sticks from `lg`** under the pinned **SiteNav** (`top: calc(var(--site-nav-height) + 1rem)`). It is short, so it never needs its own scroll; the share and copy actions stay in reach. Below `lg` it stacks above the article.

## Consequences

The app deletes its hand-built `<dl>`, its copy button's swap and announcement, its new-tab text, its caption component, and its markdown class map. Buttons and badges inside caps-styled containers keep their own case.

## References

- ADR-0004, ADR-0009, ADR-0026, ADR-0033, ADR-0040
