# ADR-0031 — Confetti

**Status:** Accepted  
**Date:** 2026-09-26

## Context

A successful action — especially submitting a request for proposal — needs a short celebration that is not owned by the button. The work is often async: the burst starts when the request succeeds, from the control that sent it, and more than one burst can be in flight.

The particle motion follows the canvas-confetti integration model (Kiril Vatev, ISC). Playback is precomputed transform and opacity keyframes so each piece is one WAAPI animation. WMDS does not depend on canvas-confetti or on Motion+.

## Decision

Ship **ConfettiProvider** and **useConfetti** as an organism under **Components/Feedback** (ADR-0026):

- **ConfettiProvider** portals one `position: fixed; inset: 0; pointer-events: none` layer to `document.body`. Stacking is **`--z-confetti: 110`**, above Dialog / Sheet / Panel (`z-[100]`) and Toast (`z-[70]`). The token does not change in dark mode.
- **`useConfetti().fire(options?)`** starts a burst. Options: `particleCount` (60), `startVelocity` (25), `spread` (100), `decay` (0.91), `gravity` (1), `drift` (0), `duration` (2.5), `size` (1), `colors`, `origin`.
- **`origin`** is an element, a ref, or a viewport `{ x, y }` point in pixels. Elements use `getBoundingClientRect` center. The default is the viewport center.
- Physics, unchanged: 40 steps (frame 0 through 40), translate plus wobble, scale 0 → 1.15 → 1 over the first 8%, `rotateY` tilt, constant `rotate`, opacity hold through 50% then fade. `animate()` from `motion/react`, ease `linear`, because the curve is already in the keyframes. Shapes: circle, rect, strip (rect and strip weighted twice).
- Each burst is removed at `duration + 0.5s`. Unmount clears those timers and each piece cancels its animation.
- Overlapping `fire()` calls append bursts; they do not replace one another.
- **`prefers-reduced-motion: reduce`**, and `MotionConfig` `reducedMotion="always"`, make `fire()` do nothing. No particles and no fade. `reducedMotion="never"` does not override the OS preference.
- Default colors are **`confettiDefaultColors`**: `var(--color-chart-categorical-1)` through **7**. Those tokens already exist in light and dark and are a distinct multi-hue set. Status colors (success, warning, info, error) would read as system state. No new color role.
- `"use client"` on the module, and the library bundle banner, so a Next App Router Server Component tree can import it.
- No **ConfettiButton**. **Button** already owns press feedback, including the status morph. Stories compose **Button** and call `fire()`. The RFP flow is **Examples/RFP submitted → Pattern — RFP submitted**.

The keyframe generator takes an injectable `random` so a seeded source is deterministic. That option is not part of the public `fire()` options.

## Non-goals

- A continuous emitter (snow, cannons, fireworks).
- Normalized 0–1 origins. `origin` is viewport pixels or an element.
- Motion+ and the `canvas-confetti` package.
- A second celebratory color ramp.

## Consequences

Consuming apps mount **ConfettiProvider** at the root and call `fire({ origin })` after the success they are celebrating. Copy **Examples/RFP submitted → Pattern — RFP submitted** for the form.

## References

- ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0026 (intent taxonomy)
- canvas-confetti, Kiril Vatev, ISC — https://github.com/catdad/canvas-confetti
