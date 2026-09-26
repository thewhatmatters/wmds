# ADR-0034 — Rive glove hands

**Status:** Accepted  
**Date:** 2026-09-26

## Context

The marketing hero can perch two decorative glove hands on the headline, one on the **W** of “We” and one on the last letters of “WhatMatters”. The art is a cleaned remix of the Rive Interactive Icon Set. The headline stays real, selectable text. The hands are not a second title.

Several graphics share the page, so the runtime has to stay small and share one canvas renderer.

## Decision

### Runtime

- Dependency: **`@rive-app/react-canvas`** (not the legacy `rive-react` package, and not `@rive-app/react-webgl2`). The canvas runtime is the smaller build, and its default offscreen renderer lets the two hands share one context.
- The library bundle externalizes `@rive-app/*`. The package is a dependency, so consumers install it with WMDS, and Rollup does not inline the runtime or its wasm loader.
- File: `public/rive/interactive-icon-set.riv`. Component `src` is `/rive/interactive-icon-set.riv`.

### Component

**`RiveGloveHand`** is an atom. It does not compose other WMDS controls. Props:

- `hand`: `'point' | 'rock'`. `point` loads artboard `31_Cigarette` (the cigarette is removed). `rock` loads `29_Rock`.
- `size`: a number (pixels) or a CSS length. The hero passes an `em` length so the box tracks the h1.
- `active`: sets state-machine input `Boolean 1` through `useStateMachineInput`.
- `className`: layout only.
- `aria-hidden`: defaults to `true`.

`useRive` is called with `artboard`, `stateMachines: 'State Machine 1'`, `autoBind: true`, and `Layout({ fit: Fit.Contain })`. The parent box is sized. The component always renders `<RiveComponent />`.

### Token colors

View model `View Model 1` colors are driven from existing tokens. No new color token.

| View model | Token | Light value |
|---|---|---|
| `handFill` | `--color-accent` (brand accent) | `#262626` |
| `outline` | `--color-fg`, falling back to `--color-text-primary` (foreground / ink) | `#171717` |

`useViewModelInstanceColor` applies them with `setRgb` (0–255). `onRiveReady` paints the same channels through the view model before the first drawn frame, then calls `drawFrame()`. A `data-theme` change reads the tokens again.

### Reduced motion

Handled with `matchMedia('(prefers-reduced-motion: reduce)')`, not Motion’s reduced-motion config. When it matches, `onRiveReady` paints the token colors, draws one frame, and calls `rive.pause()`. `Boolean 1` stays false, so the interaction does not run.

### Headline pattern

**Components/Layout/HeroTileStack → Pattern — marketing hero** is the default. The plain h1 uses **`type-display-1`**, the largest display token (`clamp` from `2.5rem` / 40px to `5rem` / 80px). `type-display-2` and `type-display-3` are smaller. No uppercase transform.

The rock hand sits on the **W**. The point hand sits on the last letters of WhatMatters. Slots are absolute and sized in `em`. Hover or focus on the h1 sets `active`.

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
- A new color token for the file’s default magenta (`#F32EEF`).
- Click targets on the gloves.

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
