# ADR-0034 — Rive hands

**Status:** Accepted  
**Date:** 2026-09-26

## Context

The marketing hero can perch two decorative hands on the headline. The rock hand sits between the **e** in “Are” and the **W** in “WhatMatters”, behind the e and in front of the W. The point hand grips the top-right of the final **s** in “WhatMatters”. The art is a cleaned remix of the Rive Interactive Icon Set. The headline stays real, selectable text. The hands are not a second title.

Several graphics share the page, so the runtime has to stay small and share one canvas renderer.

## Decision

### Runtime

- Dependency: **`@rive-app/react-canvas`** (not the legacy `rive-react` package, and not `@rive-app/react-webgl2`). The canvas runtime is the smaller build, and its default offscreen renderer lets the two hands share one context.
- The library bundle externalizes `@rive-app/*`. The package is a dependency, so consumers install it with WMDS, and Rollup does not inline the runtime or its wasm loader.
- File: `public/rive/interactive-icon-set.riv`. Component `src` is `/rive/interactive-icon-set.riv`.

### Component

**`RiveHand`** is an atom. It does not compose other WMDS controls. Props:

- `hand`: `'point' | 'rock'`. `point` loads artboard `31_Cigarette` (the cigarette is removed). `rock` loads `29_Rock`.
- `size`: a number (pixels) or a CSS length. The hero passes an `em` length so the box tracks the h1.
- `active`: sets state-machine input `Boolean 1` through `useStateMachineInput`.
- `idle`: default `true`. Each gesture holds `Boolean 1` for 1.1s so the pose can finish. After it releases, that hand waits a random 1–2s before the next pulse. The same gap runs before the first pulse. Timers pause while the tab is hidden or the hand is offscreen, and they are cleared on unmount. Hover and focus still own `active`.
- `entrance`: `'slide-up' | 'grow' | 'none'` (default `'none'`). `slide-up` translates Y from below the box. The marketing hero wraps that hand in `overflow-clip` whose bottom is `0.22em` above the line box, the baseline on `type-display-1`. `grow` scales from 0 to 1 at `22% 76%` (the point grip) with a spring and a 200ms delay. Motion comes from `motion/react`. The scale stays on the hand box. The canvas runtime samples `getBoundingClientRect` inside `resizeDrawingSurfaceToCanvas`, and that rect includes transforms, so a mount at `scale: 0` would store a 0×0 drawing surface. That sample is the one that sticks when the hand mounts below the fold or the document is hidden, and WebKit can also lock a size taken mid-spring. A later scale does not change `clientWidth`, so the runtime would not sample again. `RiveHand` reports the canvas layout size (`clientWidth` / `clientHeight`) from that rect, then calls `resizeDrawingSurfaceToCanvas()` again once the spring has settled and on later layout resizes.
- `className`: layout only.
- `aria-hidden`: defaults to `true`.

`useRive` is called with `artboard`, `stateMachines: 'State Machine 1'`, `autoBind: true`, and `Layout({ fit: Fit.Contain })`. The parent box is sized. `<RiveComponent />` renders inside that box’s shadow root, so the canvas does not insert a break when someone copies the headline.

### Token colors

View model `View Model 1` colors are driven from theme tokens.

There was no brand-navy role. `--color-info` (`#00458c`) is the status blue behind an info **Badge**. `--color-primary` (`#39485c`) is the action brand and is slate. The hero focus tile paints `#011272`. **`--color-brand`** is that navy in both themes.

| View model | Token | Light value | Dark value |
|---|---|---|---|
| `handFill` | `--color-surface`, falling back to `--color-background-surface` (surface) | `#ffffff` | `#262626` |
| `outline` | `--color-brand` (fallback `#011272` when the token is missing) | `#011272` | `#011272` |

`useViewModelInstanceColor` applies them with `setRgb` (0–255). `onRiveReady` paints the same channels through the view model before the first drawn frame, then calls `drawFrame()`. A `data-theme` change reads the tokens again.

### Reduced motion

Handled with `matchMedia('(prefers-reduced-motion: reduce)')`, not Motion’s reduced-motion config. When it matches, `onRiveReady` paints the token colors. Pause waits until the hand box has a non-zero size, then draws one frame and calls `rive.pause()`. A 0×0 canvas is not paused, so the first real sample is not a blank frame. `Boolean 1` stays false, so hover, focus, and idle do not run. The entrance props render at rest: no slide and no scale. The server render and the hydration render both use that resting box. `matchMedia` is read in `useLayoutEffect`, and the slide or grow mounts only after that, and only when motion is allowed, so a reduced-motion client does not hydrate `transform: none` against server `translateY(100%)` or `scale(0)`.

### Inline pattern

The display-1 **We Are WhatMatters** headline is gone. Hands sit in the line, not on letter spans.

The rock hand is inline in **HeroIntro** immediately after “TX” on **Pattern — marketing hero text sequence**. That h1 is only “An Austin, TX studio specializing in brand and product design.” The hand stays inside the same `whitespace-nowrap` phrase as “Austin, TX”. The point hand is inline in **ScrollHorizontal.Intro** immediately after “is a first impression”, in place of the pill glyph. Asterisk and diamond stay on the statement. `inline` scales the canvas past the artboard padding so the drawn hand is about 1.15em and shifts it so the ink center sits on the line. The slot is `vertical-align: middle`. The in-flow slot is zero height and as wide as the ink, so the display-2 line box does not grow. `entrance="none"` skips the hand's own slide or grow. Inside a TextSequence the slot pops with the same recipe as a shape: scale from 0, rotation -16, ease `back.out(1.8)`, duration 0.55s, on the beat halfway between the neighboring words. The origin is `50% 50%` of the zero-height slot, the drawn ink's center, so the pop comes from the same visual center as a shape. The tween targets an inner layer on the slot so a zero-area gap is not reparented and the word spaces on either side stay put. When the pop finishes, the slot sets `data-rive-hand-entered` and idle may arm. `idle` still pulses when motion is allowed: 1.1s on `Boolean 1`, then a random 1–2s gap, starting only after that pop when the hand sits in a sequence. The timer watches the sized hand box (`data-rive-hand`), not the zero-height slot — a zero-area target can stay non-intersecting, which would leave `Boolean 1` false forever. Once that box has size and is on screen, a paused or stopped state machine is played again. `aria-hidden` stays true. Outline remains `--color-brand` (`#011272`). Reduced motion never builds that tween. It draws one static frame after the box has size, then pauses, and idle stays off.

### Consuming the pattern

Show code is a Next.js App Router client module:

- The file starts with `"use client"`.
- `npm install @rive-app/react-canvas`. WMDS depends on it and externalizes it, so the app must be able to resolve the package.
- Copy `public/rive/interactive-icon-set.riv` into the app’s `public/rive/` directory. The component loads `/rive/interactive-icon-set.riv`.

### Attribution

The file is **CC BY 4.0**. Credit **Silvia Sguotti** and **Gabriele Montinaro** in `public/rive/CREDITS.md`, in the pattern story, and in the Show code comment.

## Non-goals

- A second pattern that omits the hands.
- A new display size above `type-display-1`.
- A color token for the file’s default magenta (`#F32EEF`). The hand `outline` is `--color-brand` (`#011272`) in both themes, with the same navy hardcoded when the token is missing. `--color-brand-outline` is the lighter mix for other dark-surface strokes (`#011272` on `#1b1b1b` is about **1.1:1`). The hands do not use that mix. The footer field stays `#011272`.
- Click targets on the hands.

## Consequences

- **Positive:** The headline stays text. Colors follow the theme, including dark mode.
- **Positive:** Reduced motion shows a still first frame.
- **Positive:** One Show code block is the hero a consuming app pastes.
- **Tradeoff:** The app must serve `interactive-icon-set.riv` at `/rive/interactive-icon-set.riv` and resolve `@rive-app/react-canvas`.
- **Tradeoff:** `useStateMachineInput` is a legacy Rive API. The file’s interaction input is still that boolean.

## References

- ADR-0002 — atom tier
- ADR-0008 — motion, reduced motion
- ADR-0032 — HeroTileStack marketing hero
- `public/rive/CREDITS.md`
