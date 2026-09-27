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
- Shapes are an atom, **`TextSequence.Shape`**, inline SVG sized in `em` and painted with `currentColor` from token utilities (`text-brand`, `text-brand-soft`, `text-accent`, and the other tone classes). No hex in the component.
- `aria: "auto"` plus an explicit `aria-label` of the plain sentence (whitespace collapsed, shapes omitted). Split words are `aria-hidden`. Shapes are `aria-hidden`. The sentence is announced once.
- Reduced motion reads `prefers-reduced-motion` in `useLayoutEffect` (not Motion's config). The server render and the hydration render are the resting sentence. The effect bails before SplitText, so there is no masked hide, no pop, and no idle loop. No-JS stays on that markup: text is visible, shapes sit in the line, nothing is `visibility: hidden`.
- `trigger="mount"` splits before paint. `trigger="inView"` waits for an intersection, then splits once.
- Idle (off by default) is an asterisk spin and a pill / double-pill stretch on the same timeline, after the entrance. It does not run under reduced motion.

### Marketing hero

**Components/Layout/HeroTileStack → Pattern — marketing hero text sequence** is a variant. **Pattern — marketing hero** is unchanged.

The h1 stays the Rive hand headline (ADR-0034). SplitText rewrites text into masked word elements. The rock and point hands are anchored to the **e**, the **W**, and the final **s**. Running the sequence on that h1 would detach the hands, so this variant sequences the intro only. The h1 still reads **We Are WhatMatters** on `type-display-1`.

The intro stays **HeroIntro** (`type-large`, one step above body, shared leading, columns 4–9 from `lg`). Copy is two lines with no periods: “Your brand is already online” and “Make it impossible to ignore”. A few **`TextSequence.Shape`** marks replace the inline **Badge** / **Avatar** used on the default pattern. Headline `useState` for the hands lives on the headline, so a hover does not re-render the sequence and wipe the split DOM.

## Non-goals

- GSAP on any component other than **TextSequence** (no ScrollTrigger, no page transitions, no replacement for `motion/react`).
- Changing **Pattern — marketing hero**, **SiteNav**, **FooterReveal**, or **ScrollHorizontal**.
- A reduced-motion prop. The OS media query is the contract.
- Lucide icons as the decorative shapes.

## Consequences

- **Positive:** Word masks, wrap re-splits, and one accessible sentence come from SplitText instead of a one-off splitter.
- **Positive:** The rest of the catalog stays on `motion/react`.
- **Tradeoff:** Installing WMDS installs GSAP, and the single-file entry imports it even for apps that never render **TextSequence**, until the package is built as split modules.
- **Tradeoff:** The hero variant does not animate the h1, so the hands and the word masks do not fight.

## References

- ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0032 (hero tile stack), ADR-0034 (Rive hands), ADR-0035 (hero intro)
