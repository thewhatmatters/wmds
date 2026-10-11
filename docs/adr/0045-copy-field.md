# ADR-0045: Copy field

**Status:** Accepted
**Date:** 2026-10-11

## Context

An unlock page needs to show an API key and let the visitor copy it. **Button** already has a copy pattern (`icon` + `status`, held for `buttonStatusHoldMs`): the app owns the clipboard call and the two-second timer. A key is different. The value has to stay visible in a read-only field, the confirmation has to be announced, and a missing or blocked Clipboard API has to leave the visitor a way to copy with Cmd/Ctrl+C. That fallback is easy to get wrong, and the value must never be logged.

## Decision

Ship **CopyField** as a molecule. It composes **Input** and **Button**. It does not add a color, a button role, or a type style.

- **Value.** **Input** `readOnly` and `mono`. `mono` applies the existing `type-code` face (Geist Mono via `--font-family-code`). `!font-mono` wins over the field's `font-sans` because `cn` does not merge conflicting utilities. The value is selected on focus, so Cmd/Ctrl+C copies it from the field.
- **Action.** **Button** `role="secondary"` `size="md"`, label "Copy key", Lucide **Copy** as `icon`. Success uses the button's status morph: the label becomes "Copied" and the icon becomes the status check. The button carries `aria-live="polite"`, so the change is announced. The hold is `buttonStatusHoldMs` (2s). Enter and Space activate it because it is a button.
- **Blocked clipboard.** If `navigator.clipboard.writeText` is missing or rejects, the field selects the value, calls `document.execCommand('copy')`, and shows "Press Cmd/Ctrl+C to copy." in a `role="status"` region (`aria-live="polite"`). The button stays on "Copy key".
- **Secrets.** The value is never passed to `console`. Rejections are not logged, because they can include the text.
- **`state`.** Optional `"copied"` or `"fallback"` to pin a specimen. The app omits it.

**Input** `mono` is the atom extension. **CopyField** is the pattern apps paste.

## Consequences

The unlock page imports `CopyField` and passes the key. A plain text copy stays on **Pattern — copy button**.

## References

- ADR-0004, ADR-0006, ADR-0011
