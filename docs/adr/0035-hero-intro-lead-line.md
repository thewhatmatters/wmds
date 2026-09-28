# ADR-0035 — Hero intro lead line

**Status:** Accepted  
**Date:** 2026-09-27

## Context

The marketing hero intro started as two sentences on `type-large`. The first sentence — “We're a design and product studio based in Austin, Texas.” — was wrapping into the second, so the Austin line and “We help brands…” shared a line. The break has to be part of the component contract. A `<br />` in Show code would be consumer markup, and a utility class on the paragraph would be a one-off recipe.

The intro still sits on `grid-page`, columns 4–9 from `lg` (ADR-0032). That span must not move.

## Decision

Ship **HeroIntro** as a molecule under **Components/Layout**:

- `lead`: the first sentence. It wraps, including from `md`.
- `children`: the rest of the intro. A block box, so it always starts on the next line, including when `lead` wraps.
- Both lines are one paragraph: `type-display-2`, `!font-normal`, `text-pretty`, `text-muted`, centered. No extra gap between the lines. That is the same font-size as **ScrollHorizontal.Intro**.
- The shell is `grid-page` with the page block pad removed (`!py-0`). The default paragraph is `col-span-full` below `lg` and `lg:col-start-4 lg:col-end-10` from `lg`. `min-w-0` lets the lead wrap inside those tracks. `step="display"` is the same size, full width of the page grid.
- `className` is layout only.
- Show code passes `lead` and children. It does not contain a break.

**Components/Layout/HeroTileStack → Pattern — marketing hero** and **Components/Layout/FooterReveal → Pattern — marketing hero** compose **HeroIntro**. The inline **Badge** on `online` stays in the children (ADR-0033).

## Non-goals

- A second type step for either line.
- Nowrap below `md`. A 390px measure is too narrow for that sentence.
- Moving the column span off `lg`.

## Consequences

Consuming apps paste the marketing hero pattern. The first sentence is the `lead` prop. Engineering does not insert a line break or a nowrap utility at the call site.

## Update — display size, wrapping lead

**Date:** 2026-09-28

The default intro and the gallery statement share `type-display-2` at normal weight. `md:whitespace-nowrap` is removed. `lead` wraps at every width, including from `md`, so the Austin sentence does not clip in columns 4–9. `step="display"` stays full width for the sequenced hero and uses that same font-size. Both paragraphs and the gallery statement use `text-wrap: pretty`. The column span on the default step stays `lg:col-start-4 lg:col-end-10`.

## References

- ADR-0004 (pattern-first), ADR-0032 (hero tile stack), ADR-0033 (badge leading avatar), ADR-0034 (Rive hands)
