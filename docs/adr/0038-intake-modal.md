# ADR-0038: Intake modal

**Status:** Accepted
**Date:** 2026-09-29

## Context

Start a project needs one full-screen flow: what you need, budget, about you, then a call or an email. The pieces are a shell, a step bar, a card grid, wrapping pills, a short form, a calendar slot, and two confirmations. Existing overlays stay as they are. **Dialog** is a brief card. This flow is the page.

## Decision

Ship the intake as exported components. The composed flow is **Patterns/Intake → Pattern — start a project**. Show code is the paste.

| Piece | Tier | Catalog |
|-------|------|---------|
| **IntakeModal** | Organism | Components/Overlays/IntakeModal |
| **StepProgress** | Molecule | Components/Feedback/StepProgress |
| **SelectableCard** | Molecule | Components/Forms/SelectableCard |
| **PillGroup** | Molecule | Components/Forms/PillGroup |
| **IntakeForm** | Molecule | Components/Forms/IntakeForm |
| **CalEmbed** | Molecule | Components/Forms/CalEmbed |
| **IntakeConfirmation** | Organism | Components/Feedback/IntakeConfirmation |

- **IntakeModal** portals to `document.body`. It uses the shared focus trap and scroll lock. Escape closes. `aria-modal="true"`. The header is the typographic **WM** mark and the **WhatMatters** wordmark. There is no separate logo asset. Close is **IconButton**. The footer is **Button** `secondary` and `primary`, pinned while the step body scrolls. `hideContinue` omits Continue. `hideFooter` centers the body.
- **StepProgress** is a muted **Badge** pill plus N segments. Filled segments use `--color-brand` (#011272).
- **SelectableCard** is a checkbox card. The grid is 2 columns, 3 from `lg`. The checked mark is **Badge** `iconOnly`. The `toggle` slot is a hugged **SegmentedControl**.
- **PillGroup** is a wrapping radio group. Idle pills use existing **Badge** neutral solid and muted surfaces. Selected pills use brand navy. That fill is not a Badge variant. **Not sure yet** uses `emphasis="muted"`.
- **IntakeForm** composes **Field**, **Input**, and **TextArea**. The character counter is the details description. **TextArea** gains no new prop.
- **CalEmbed** is a token-themed placeholder. Skip is **TextLink**.
- **IntakeConfirmation** calls `useConfettiOnMount` on mount. Colors are `intakeConfettiColors`, including `--color-brand`. Reduced motion does not burst.

No new variant was added to **Button**, **Badge**, **Field**, **Input**, **TextArea**, or **SegmentedControl**.

## Consequences

Consuming apps copy **Pattern — start a project**. They mount **ConfettiProvider** above the flow. Continue stays disabled until the step is valid. Step 4 does not render Continue. It completes from the calendar confirm or the skip link. The confirmation is centered, and **Booked** uses **Badge** `neutral`.

## References

- ADR-0002, ADR-0004, ADR-0016, ADR-0026, ADR-0031
