# ADR-0037 — Text sequence (GSAP)

**Status:** Accepted  
**Date:** 2026-09-27

## Context

The marketing hero needs a multi-line intro where words slide up from behind a mask, inline decorative shapes pop between those words, and a few shapes keep a quiet idle motion. WMDS motion everywhere else is `motion/react` (ADR-0008). That library does not ship a text splitter that re-measures wraps, masks words, and keeps a screen reader on the original sentence.

The owner approved GSAP for this sequence only. GSAP and its plugins, including SplitText, are free for commercial use.

## Decision

**`TextSequence`** is a molecule under **Components/Layout**. It is the only module that imports `gsap`, `gsap/SplitText`, or `@gsap/react`.

- Dependency: `gsap` and `@gsap/react` (direct dependencies, same pattern as `@rive-app/react-canvas`).
- React cleanup goes through `useGSAP`. SplitText is registered beside it.
- The library build externalizes `gsap`, `gsap/*`, and `@gsap/*`. Rollup does not inline the runtime. Consumers resolve those packages from `node_modules` (they install with WMDS).
- Tree-shaking: source imports live only in `TextSequence`. The published entry is still one bundle, so that entry's import graph includes the external `gsap` specifiers. A bundler cannot drop them while the entry is a single module. A future `preserveModules` build would leave GSAP on the `TextSequence` path only. No other component may import GSAP to widen that graph.
- SplitText runs with `type: "words"` plus `lines` (on by default), `mask: "words"`, `autoSplit`, and `onSplit`. SplitText attaches its resize observer only when lines are split, so wrap re-measurement stays on that flag. `lines={false}` keeps a single word split and skips the observer.
- Shapes are an atom, **`TextSequence.Shape`**, inline SVG. The layout gap is zero-height and about 1.15em wide (pills 2.2–2.35em) so the line leading does not grow; the graphic is 1.12–1.2em tall, centered on the x-height, with a 14px floor. Fills are `--color-brand`, `--color-brand-soft`, `--color-accent`, and `--color-info-muted`. `brand-soft` and `info-muted` are two-stop gradients between those tokens. No hex in the component.
- `aria: "auto"` plus an explicit `aria-label` of the plain sentence (whitespace collapsed, shapes omitted). Split words are `aria-hidden`. Shapes are `aria-hidden`. The sentence is announced once.
- Reduced motion reads `prefers-reduced-motion` in `useLayoutEffect` (not Motion's config). The server render and the hydration render are the resting sentence. The effect bails before SplitText, so there is no masked hide, no pop, and no idle loop. No-JS stays on that markup: text is visible, shapes sit in the line, nothing is `visibility: hidden`.
- `trigger="mount"` splits before paint. `trigger="inView"` waits for an intersection, then splits once.
- Idle (off by default) is an asterisk spin and a pill / double-pill stretch on the same timeline, after the entrance. It does not run under reduced motion.

### Marketing hero

**Components/HeroTileStack → Pattern — marketing hero text sequence** is a variant. **Pattern — marketing hero** uses the same **HeroIntro** `h1` without the sequence.

**HeroIntro** is the page `h1`. There is no display-1 **We Are WhatMatters** headline. `step="display"` is `type-display-2` at normal weight and display-2 leading, the same size and line-height as **ScrollHorizontal.Intro**, full width of the page grid. Copy is one sentence: “An Austin, TX studio specializing in brand and product design.” It is one TextSequence and starts immediately. “Austin,” and “TX” stay one phrase (non-breaking space inside `whitespace-nowrap`) and still count as two words. The hero `h1` uses `text-wrap: balance`. The section is `shrink-0` and `justify-center-safe` so a tall intro grows downward from below the nav. A rock **RiveHand** with `inline` sits immediately after “TX”, inside that nowrap phrase, and pops on the beat after TX (`(3 - 0.5) × 0.07s`). The drawn hand is about 1.15em, centered on the line, and the slot is zero height. `aria-hidden`. `entrance="none"`. The heading has no circle or pill. `emphasis="none"` keeps every word regular. The heading `aria-label` is that sentence. The default **Pattern — marketing hero** stays on `step="large"` (`type-display-2`, columns 4–9, wrapping lead) with the inline **Badge**.

## Update — default intro matches the display size

**Date:** 2026-09-28

**Pattern — marketing hero** (`step="large"`) is `type-display-2` at normal weight, columns 4–9 from `lg`, and the lead wraps. It is the same computed font-size and line-height as `step="display"` and as **ScrollHorizontal.Intro**. `text-wrap: balance` is on both hero steps. The gallery statement stays `text-wrap: pretty`.

## Non-goals

- GSAP on any component other than **TextSequence** (no ScrollTrigger, no page transitions, no replacement for `motion/react`).
- Changing **Pattern — marketing hero**, **SiteNav**, or **FooterReveal** internals.
- GSAP on **ScrollHorizontal** itself. The gallery statement composes **TextSequence** (ADR-0036 update). Only **TextSequence** imports GSAP.
- A reduced-motion prop. The OS media query is the contract.
- Lucide icons as the decorative shapes.

## Consequences

- **Positive:** Word masks, wrap re-splits, and one accessible sentence come from SplitText instead of a one-off splitter.
- **Positive:** The rest of the catalog stays on `motion/react`.
- **Tradeoff:** Installing WMDS installs GSAP, and the single-file entry imports it even for apps that never render **TextSequence**, until the package is built as split modules.
- **Tradeoff:** The hero variant does not animate the h1, so the hands and the word masks do not fight.

## References

- ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0032 (hero tile stack), ADR-0034 (Rive hands), ADR-0035 (hero intro)
