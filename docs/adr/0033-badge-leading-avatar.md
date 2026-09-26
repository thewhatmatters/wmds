# ADR-0033 — Badge leading avatar

**Status:** Accepted  
**Date:** 2026-09-26

## Context

Inline badges in the marketing hero need a round picture in the leading slot, not a Lucide glyph. **Badge** already has a leading `icon`. **Avatar** is the round image atom (ADR-0017).

ADR-0002 says atoms import only `lib/`, theme, and peers — not other WMDS components. A consumer-supplied `media={<Avatar />}` slot would keep that rule, and it would also let the caller pass an avatar size that does not match the pill. The badge has to own the size so the circle scales with `sm` and `md`.

The hero subtext is the one place a badge is decorative. Everywhere else, badges stay status labels.

## Decision

### API

- **`avatar?: BadgeAvatar`** — `{ src: string; alt: string }`.
- Badge renders `<Avatar name={alt} src={src} size={badgeAvatarSize[size]} />`.
- **`badgeAvatarSize`**: badge `sm` → Avatar `xsm` (20px, matches `h-5`); badge `md` → Avatar `sm` (24px, matches `h-6`).
- Mutually exclusive with **`icon`**, **`iconOnly`**, and **`count`**. Passing more than one warns and the avatar label wins over icon and count.
- `alt` is the Avatar accessible name. Pass `alt=""` when the badge label already speaks the word, so the image is not announced twice. A non-empty `alt` is announced with the label.
- No Badge `lg`. `md` (24px) matches the `type-large` hero line. Add a larger size only if a later layout shows `md` as too small.
- Exported from `src/index.ts`: `BadgeAvatar`, `badgeAvatarSize`. **Badge** stays an atom in `package.manifest.ts`.

### Atom exception

Badge may import **Avatar** for this slot only. That is the exception to ADR-0002's atom rule. No other atom composes a component. Avatar still does not import Badge.

### Decorative marketing use

The one sanctioned decorative use of Badge is inline emphasis in **Components/Layout/HeroTileStack → Pattern — marketing hero**. Those badges are not clickable. The sentence still reads in order. Placeholder art lives in `public/hero-badges/` (a globe for `online`, an eye for `impossible to ignore`) and is marked as placeholder in that story. Product images replace those files.

## Non-goals

- A free `media` ReactNode slot.
- Avatar `presence` inside a badge.
- A Badge `lg` size.
- Clickable badges.

## Consequences

- **Positive:** The circle always matches the pill. Call sites pass `src` and `alt`, not an avatar size.
- **Positive:** Icon, count, and icon-only patterns stay unchanged.
- **Tradeoff:** Badge is the one atom that imports another atom, and only to render Avatar.

## References

- ADR-0002 — atomic tiers (atom import rule, and this exception)
- ADR-0017 — Avatar
- ADR-0032 — HeroTileStack marketing hero
- Components/Feedback/Badge → **Pattern — with avatar**
