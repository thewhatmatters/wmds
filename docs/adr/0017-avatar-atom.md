# ADR-0017: Avatar atom

**Status:** Accepted  
**Date:** 2026-09-06

## Context

Product surfaces need a consistent person/team identity glyph — profile photos, initials, contact rows, assignee pickers. **Dropdown** docs already reference a leading avatar slot; no atom existed.

WMDS **Status** `variant="dot"` already covers semantic presence tones — Avatar should reuse dot **style tokens**, not import the **Status** component (atoms do not compose other components).

## Decision

### Tier and API

- **Atom:** `Avatar` in `src/components/atoms/Avatar/`
- **Required `name`** — alt text, initials derivation, accessible name
- **Optional `src`** — photo; on error → initials → Lucide **User** fallback
- **Optional `presence`** — `{ tone, label, pulsing? }` — rim dot using `statusDotStyles` + surface ring cutout

### Size scale

| Size | px | Default |
|------|-----|---------|
| `xsm` | 20 | |
| `sm` | 24 | dropdown rows |
| `md` | 36 | **default** — pairs with cluster **md** |
| `lg` | 48 | emphasis |
| `xl` | 128 | profile hero |

Helper: **`avatarSizeForCluster(tier)`** maps cluster sm/md/lg → avatar sm/md/lg.

### Documentation

Storybook **Components/Data display/Avatar** is the product contract — Usage, Anatomy, Best practices, and **For agents building UIs**. No external design-system references in consumer-facing docs.

### Non-goals (v1)

- **AvatarGroup** + overflow `+N` — defer to molecule v2
- Clickable avatar — wrap at call site
- Slots / `children` — pattern-first props only

## Consequences

- **Positive:** Closes Dropdown composition gap; cluster pairing documented.
- **Positive:** Presence visually matches **Status** dot without a second dot implementation.
- **Follow-up:** **AvatarGroup** molecule; **TaskRows** assignee pattern story.

## References

- ADR-0011 — cluster control scale  
- ADR-0002 — atomic composition  
- ADR-0004 — pattern-first documentation  
- `src/components/atoms/Status/statusDotStyles.ts` — presence dot tokens
