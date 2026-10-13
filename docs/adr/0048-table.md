# ADR-0048: Table

**Status:** Accepted
**Date:** 2026-10-12

## Context

**Table** was planned and never built. Pages that list rows with shared columns — posts, creators, approvals — borrowed **TaskRows** `variant="table"` (a grid of `div`s that stacks to two lines on phones) or hand-wrote a `table`. **TaskRows** is a task-status pattern, not a general table, and a hand-written one chose its own rules, padding, and scroll behavior.

## Decision

Add **Table** (atom, `Components/Table`) as plain semantic HTML: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`. It imports no other component and adds no color, radius, shadow, or type role.

- **Scroll box** — `Table` renders a `div` around the `table`. The `div` scrolls on the inline axis, is a `region` named by the table's `aria-label` / `aria-labelledby`, and takes focus (`tabIndex={0}`, the **Button** focus ring, inset) so a keyboard can scroll it. The `table` is `w-full min-w-max`: columns keep their content width and a phone scrolls sideways instead of wrapping cells.
- **Tokens** — `border-border` row rules, `border-border-emphasized` above the footer, `hover:bg-ghost-hover` on rows, header cells in `caption` type and `text-muted`, body cells in `body` type. `align="end"` adds tabular figures. Navy is not used by the table; it reaches a page only through **Button** `primary` and a **Badge** `active` pill.
- **API** — `className` is layout only. `TableHead` defaults to `scope="col"`.

### Row actions: approvals

**Pattern — approvals queue** composes **Table**, **Button**, and **Badge** `status`; it is Show code, not a new export.

- Approve is **Button** `primary` with Lucide `Check`; Deny is `outline` with `X`. Both are `aria-label`led with the row name ("Approve Maya Chen").
- Deny does not open a dialog. The row's actions swap in place for **Confirm deny** (`primary`, `X`) and **Cancel** (`ghost`). Red is reserved for the status pill, so the confirm step does not use `destructive`; it reads as a step because it replaces the pair and takes focus.
- Focus: Deny moves it to Confirm deny; Cancel or Escape returns it to Deny; a decision moves it to the row's decision cell (`tabIndex={-1}`), which now holds the pill, so focus is never lost to the page.
- After a decision the cell shows **Badge** `status="success"` ("Approved") or `status="failed"` ("Denied") with a dot. Deciding is final in the pattern; undo is the app's call through `onDecision`.
- Empty: one row, "Nothing waiting on you". The caption counts what is still waiting.

## Consequences

- Apps get one table. **TaskRows** `variant="table"` stays for the needs-you task list.
- The row-name header cell is a `TableCell` in the pattern; a `TableHead scope="row"` would be muted caption type, which is wrong for a name.
- The decision cell announces only its pill on focus (the name is in the row). An app that wants the name spoken can pass a live region of its own.
- A table with a very long single column still scrolls; sticky first columns are not part of this decision.

## References

- ADR-0003, ADR-0004, ADR-0033, ADR-0040
