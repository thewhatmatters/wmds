# ADR-0016: Overlay family — Dialog, AlertDialog, Sheet, Panel

**Status:** Accepted  
**Date:** 2026-09-06

## Context

WMDS needs a small, predictable set of overlay patterns for consuming apps. Modal confirms, brief settings dialogs, mobile filters, and persistent detail rails are different UX contracts — not one generic “modal” with props.

Prior art: [Astryx Dialog](https://astryx.atmeta.com/components/Dialog), [AlertDialog](https://astryx.atmeta.com/components/AlertDialog). WMDS ships **Sheet** for edge-attached dismissible overlays and **Panel** for non-blocking flyovers.

Shared internals live in **`src/lib/dialogOverlay.ts`** (focus trap, scroll lock, focus restore) and **`OverlayPanelHeader`** (Card header parity + optional close).

## Decision

### Product map

| Pattern | Component | Scrim | Scroll lock | Focus trap | Hairlines | Typical use |
|---------|-----------|-------|-------------|------------|-----------|-------------|
| **Modal** | `Dialog` | Yes | Yes | Yes | No | Brief form or copy; dismissible |
| **Blocking confirm** | `AlertDialog` | Yes | Yes | Yes | No | Irreversible / high-stakes; scrim dismiss off by default |
| **Edge overlay** | `Sheet` | Yes | Yes | Yes | Yes (scroll regions) | Filters, side detail, mobile drawer |
| **Persistent flyover** | `Panel` | No | No | No | Yes (scroll regions) | Detail rail; page stays interactive |

**Naming note:** Public API keeps **`Dialog`** for the dismissible modal and **`AlertDialog`** for blocking confirms. A future **`Modal`** alias for `Dialog` is optional and breaking — defer until consuming apps adopt.

### Dialog / AlertDialog chrome

- **No section hairlines** — brief, direct copy; spacing via `dialogPanelShellClasses` (`gap-4`) and `overlayPanelDialogFooterClasses` (`pt-2`).
- **AlertDialog** — title + description in header (Card subheading + caption scale); single scroll-free stack; cancel receives initial focus.
- **Dialog.Content** — optional scroll body between header and footer; body copy uses one horizontal inset (`overlayPanelDialogBodyScrollClasses`).

### Sheet chrome

- Full-viewport stack + scrim — same focus/scroll primitives as **Dialog**.
- **Hairlines** on header/footer when a scroll body sits between them (`OverlayPanelHeader delineated`, footer `border-t`).
- **Sides:** `bottom` | `end` | `start` only — no `top`.
- Mobile: **16px inset on trailing edge only** so scrim peeks on the opposite side.

### Panel chrome

- Edge-attached (`end` | `start`); **no scrim**, **no scroll lock**, **no focus trap**.
- `role="dialog"` with **`aria-modal="false"`** — page behind remains usable.
- Reuses **Sheet** placement/sizes/motion for the shell; **Sheet** hairline rules for scroll regions.
- Escape closes by default; no backdrop dismiss (no backdrop).

### Shared rules

- Compose actions from **Button** roles — never raw `<button>` affordances in organisms.
- Portal to `document.body` for **Dialog**, **AlertDialog**, **Sheet**, **Panel**.
- **Medium** enter/exit motion tier (ADR-0008).
- **`className`** on overlay components is layout-only (width, margin) — not new variants.

### Examples

**`Examples/Overlay flows`** — notification preferences Card composing **Dialog** (channel picker), **AlertDialog** (disable critical alerts), **Sheet** (market filters). Copy this for real settings surfaces.

### Interaction tests

**`Foundation/Overlay interactions`** — Playwright via Storybook Vitest (`npm run test:interactions`):

- **Dialog** — open, accessible name, close via **IconButton**
- **AlertDialog** — cancel vs confirm paths; blocking (`dismissOnBackdrop={false}`)
- **Sheet** — Escape dismiss

Portals require `within(document.body)` in `play` functions.

## Consequences

- **Positive:** Clear “which overlay?” table for app engineers; Sheet vs Dialog visual language differs intentionally (hairlines vs borderless).
- **Positive:** Panel enables detail rails without dimming the whole page.
- **Negative:** Four primitives to document — mitigated by Examples story and this ADR.
- **Follow-up:** Optional **Popover** molecule (ADR-0015 backlog) for floating non-modal menus/tooltips.

## References

- ADR-0004 — pattern-first  
- ADR-0008 — motion tiers  
- ADR-0015 — Chart tooltip (Popover extract backlog)  
- `AGENTS.md` — Dialog / Sheet / Panel bullets  
- `src/lib/dialogOverlay.ts` — shared focus + scroll lock  
