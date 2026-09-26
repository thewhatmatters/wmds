# ADR-0032 — Hero tile stack

**Status:** Accepted  
**Date:** 2026-09-26

## Context

A marketing hero needs a short row of overlapping image tiles that react to the pointer. While the pointer is over the stack, every tile moves away from it. The push is stronger when the pointer is closer, and it adds tilt. When the pointer leaves, the tiles spring back to a resting fan. The motion is decorative: it does not reorder, scale, dim, or hide the images, and it has no click action.

The default should be a full scatter. Tiles near the pointer can leave the viewport. A softer fan is a lower `strength`, not a second component.

## Decision

Ship **HeroTileStack** as an organism under **Components/Layout**:

- `tiles`: `{ src, alt, offsetX?, offsetY?, rotate?, zIndex? }[]`. `alt` is required. The first four indexes use a resting fan (tilts 2 / -3 / 6 / -2 degrees, vertical nudges `5%` / `-6%` / `5%` / `-4%`, later tiles in front). Further tiles continue that fan. Per-tile fields override it.
- Pointer position is tracked with motion values relative to the resting row. Pointer moves do not re-render React. Each card's resting center is the slot, which does not follow the scatter.
- `heroTileRepel` is a pure function. The push is the vector from the pointer to that center, with distance falloff `(falloff / (distance + falloff))²`, scaled by `strength`. `x` and `y` are px. Added tilt is clamped to ±40 degrees. `strength` `0`, a pointer on the center, and non-finite input return zeros.
- Default `strength` is `1100` (`heroTileStackDefaultStrength`) with falloff `150`. That is the full scatter. `spring` defaults to stiffness 160, damping 16, mass 0.9 and can be overridden. `x`, `y`, and rotate are `useSpring` motion values from `motion/react`.
- The root is full width with `overflow-x: clip` and `overflow-y: visible`. The row does not clip. `clip` does not force the block axis into a scroll container, so cards can leave the stack vertically without opening a horizontal scrollbar.
- The tile surface uses `--radius-card-shell` and `shadow-soft-card` (`--shadow-soft-card`). No new color token. Pointer events stay on the resting slots, so a card that has flown away does not keep the scatter active.
- `prefers-reduced-motion: reduce`, and `MotionConfig` `reducedMotion="always"`, render the resting fan with no springs and no scatter. `reducedMotion="never"` does not override the OS preference.
- A coarse pointer (`(pointer: coarse)`) or `pointerType="touch"` does not track continuously. A tap sets the scatter from that point, holds it for `heroTileStackTapHoldMs` (520), then springs back.
- `"use client"` on the module, and the library bundle banner, so a Next App Router Server Component tree can import it.

## Non-goals

- Click, focus, or idle motion.
- Reorder, scale, or dim on hover.
- Motion+.
- A second scatter component for the soft fan. Pass `strength`.

## Consequences

Consuming apps paste **Components/Layout/HeroTileStack → Pattern — marketing hero**. The hero is full width: headline, stack, subline. Replace the placeholder `src` values with product images. Keep `alt` on every tile.

## References

- ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0026 (intent taxonomy), ADR-0029 (`--shadow-soft-card`)
