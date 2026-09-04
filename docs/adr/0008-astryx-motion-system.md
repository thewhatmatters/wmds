# ADR-0008: Astryx-aligned motion system

**Status:** Accepted  
**Date:** 2026-08-30

## Context

WMDS motion used a flat custom scale (`instant` 100ms → `slower` 300ms) and two easing curves (`ease-out`, `ease-out-expo`). Durations were generally too fast for spatial change and too slow for high-frequency interactions (Input focus at 280ms).

[Astryx Motion](https://astryx.atmeta.com/docs/motion) provides tiered durations (fast / medium / slow with min/default/max) and a single standard easing curve, plus explicit guidance on when animation helps vs hurts.

## Decision

### Source of truth

- **`src/theme/motion.css`** — Astryx duration and easing tokens.
- **`src/theme/theme.css`** — Tailwind `@theme` bridge + legacy aliases.
- **`src/lib/motion.ts`** — `motionTransition()`, `motionTransitionProp()`, `focusRingTransitionClasses`.

### Duration tiers

| Tier | Default | Use |
|------|---------|-----|
| **fast** | 175ms | Hover, press, color, focus ring, chip toggle |
| **medium** | 410ms | Panels, expand/collapse, layout morph, validation band |
| **slow** | 975ms | Large spatial transitions (rare) |

Each tier has `-min` and `-max` bounds per Astryx.

### Easing

Single token: `--ease-standard: cubic-bezier(0.24, 1, 0.4, 1)`. Remove `ease-out-expo` from new code (legacy alias → standard).

### Tier assignment (components)

| Component | Tier | Rationale |
|-----------|------|-----------|
| Button, Chip | fast | High-frequency |
| Input shell, focus ring | fast | Must not lag |
| Search expand morph | medium | Spatial rearrangement |
| Input validation band | medium | Structural reveal |
| motion-collapse | medium | Panel expand |

### Principles (from Astryx)

- Animate spatial change; keep list/hover interactions on **fast**.
- Do not block interaction during animation.
- Match exit direction to entrance when animating dismissals.
- Honor `prefers-reduced-motion` — Storybook `MotionConfig reducedMotion="user"` + CSS media queries.

### Legacy aliases

| Old | Maps to |
|-----|---------|
| `--duration-instant` | fast-min |
| `--duration-base` | medium-min |
| `--duration-slower` | medium-max |
| `--ease-out-expo` | ease-standard |

## Consequences

- Springs in examples may be replaced with medium-tier tweens where layout is the primary effect.
- New components pick a tier by intent, not by guessing milliseconds.
- Foundation → Motion documents tiers and Astryx principles.

## Related

- [Astryx Motion](https://astryx.atmeta.com/docs/motion)
- ADR-0007 — Astryx color system (same token pattern)
- `src/lib/motion.ts`
