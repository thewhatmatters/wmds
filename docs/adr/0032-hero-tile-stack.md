# ADR-0032 — Hero tile stack

**Status:** Accepted  
**Date:** 2026-09-26

## Context

A marketing hero needs a short row of overlapping image tiles that react to the pointer. While the pointer is over the stack, every tile moves away from it. The push is stronger when the pointer is closer, and it adds tilt. When the pointer leaves, the tiles spring back to a resting fan. The motion is decorative: it does not reorder, scale, dim, or hide the images, and it has no click action.

The first cut used a full scatter (`strength` `1100`): tiles near the pointer left the viewport, and the push was a 2D vector, so a still pointer shoved cards up and down as well as sideways. After that shipped, the fan was too strong. The motion that belongs here is mostly left and right, with a little vertical travel only while the pointer is moving quickly. A wider scatter stays available by raising `strength`, not by a second component.

## Decision

Ship **HeroTileStack** as an organism under **Components/Layout**:

- `tiles`: `{ src, alt, offsetX?, offsetY?, rotate?, zIndex? }[]`. `alt` is required. The first four indexes use a resting fan (tilts 2 / -3 / 6 / -2 degrees, vertical nudges `5%` / `-6%` / `5%` / `-4%`, later tiles in front). Further tiles continue that fan. Per-tile fields override it.
- Pointer position is tracked with motion values relative to the resting row. Pointer moves do not re-render React. Each card's resting center is the slot, which does not follow the scatter.
- `heroTileRepel` is a pure function. The push is horizontal: sign of (card x − pointer x), with distance falloff `(falloff / (distance + falloff))²` measured on x, scaled by `strength`. `y` from position is `0`. Added tilt is `x * 0.1` degrees, clamped to ±40. `strength` `0`, a pointer on the card's x, and non-finite input return zeros.
- `heroTileVelocityY` is a pure function. Vertical pointer velocity (px/s) times `velocityFactor` is the nudge. Horizontal velocity contributes `heroTileStackVelocityXShare` (`0.25`) of that factor. The result is clamped to ±`maxVertical`. A still pointer, factor `0`, max `0`, and non-finite input return `0`.
- Default `strength` is `120` (`heroTileStackDefaultStrength`) with falloff `150`. That is a noticeable sideways shift and a few degrees of tilt, and the cards stay near the stack. Raise `strength` when they should travel farther (values around `1100` are the earlier full scatter). Default `velocityFactor` is `0.02` and default `maxVertical` is `24`. `spring` defaults to stiffness 160, damping 16, mass 0.9 and can be overridden. `x`, `y`, and rotate are `useSpring` motion values from `motion/react`. Pointer position is a pair of motion values; `useVelocity` tracks them and `useTransform` maps that velocity through `heroTileVelocityY`. Those updates do not re-render React. When the pointer slows, velocity falls to 0 and the y spring returns to rest.
- The root is full width with `overflow-x: clip` and `overflow-y: visible`. The row does not clip. `clip` does not force the block axis into a scroll container, so cards can leave the stack vertically without opening a horizontal scrollbar.
- The tile surface uses `--radius-card-shell` and `shadow-soft-card` (`--shadow-soft-card`). No new color token. Pointer events stay on the resting slots, so a card that has flown away does not keep the scatter active.
- `prefers-reduced-motion: reduce`, and `MotionConfig` `reducedMotion="always"`, render the resting fan with no springs and no scatter. `reducedMotion="never"` does not override the OS preference.
- A coarse pointer (`(pointer: coarse)`) or `pointerType="touch"` does not track continuously. A tap sets the horizontal scatter from that point (no velocity nudge), holds it for `heroTileStackTapHoldMs` (520), then springs back.
- `"use client"` on the module, and the library bundle banner, so a Next App Router Server Component tree can import it.

## Non-goals

- Click, focus, or idle motion.
- Reorder, scale, or dim on hover.
- Motion+.
- A second scatter component for a wider fan. Pass `strength`.

## Consequences

Consuming apps paste **Components/Layout/HeroTileStack → Pattern — marketing hero**. The hero is full width: a title-case display headline (`We Are WhatMatters`, no uppercase transform), 1rem body subtext (`text-base`, not a display style), the stack, and a primary **Button**. Replace the placeholder `src` values with product images. Keep `alt` on every tile.

## References

- ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0026 (intent taxonomy), ADR-0029 (`--shadow-soft-card`)
