# ADR-0050: Notice

**Status:** Proposed
**Date:** 2026-10-26 (live roles 2026-10-30)

## Context

Restaurant sites need a closure or buyout note in the page, and PitchKit needs "account not connected" and "sync failed". The Cinder & Sotol prototype faked it with a **Badge** beside a paragraph (gap #5). **Toast** floats and expires, and **Input** `status` belongs to one field, so neither fits a message that is part of the layout.

## Decision

Ship **Notice** as a molecule. It composes **Badge** (`iconOnly`) and **IconButton**, and adds no colour token.

- **Tones** are Toast's: `neutral`, `info`, `success`, `warning`, `error`. The icon is a solid **Badge** in the tone colour, as in Toast.
- **Fill** is the tone colour mixed into `--color-background-surface` (10–14%) with a 32–36% tone border, not the fixed `*-muted` fills. The surface and `text-fg` swap together in dark mode and in a toned section, so the copy keeps its contrast wherever the notice sits.
- **Live region is opt-in** (`live`). A notice that is part of the page is read in order; one that appears after load is announced (`alert` for `error`, `status` otherwise). Announcing every static notice would interrupt on page load. `live="alert"` or `live="status"` sets the role directly, for a warning that must interrupt or an error that can wait. This also covers the inline Alert gap (#51): a failed send is `<Notice tone="error" live>`.
- **Dismiss.** `dismissible` shows a ghost **IconButton** (`dismissLabel`, default "Dismiss"). If focus was inside the notice, it moves to the next focusable element after it (else the one before), never to `<body>`.
- **Remembered dismiss.** `dismissKey` stores `wmds-notice:<key>` in `localStorage` through `useSyncExternalStore`, so every Notice with the key hides together, across tabs too. The server snapshot is "not dismissed", so server HTML always contains the notice and hydration matches; a visitor who dismissed it sees it removed on hydration. A blocked storage still hides it for the page view. This replaces the "announcement banner" idea (old gap #12).

## Consequences

Sites paste **Pattern — holiday closure** and **Pattern — private buyout**; apps paste **Pattern — account not connected** and **Pattern — sync failed**. A full-width site banner is a Notice in a page band, not a new component. The empty and error state pattern (gap #11) can reuse the tones.

## References

- ADR-0004, ADR-0005, ADR-0011
