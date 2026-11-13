---
bump: patch
---
**Accordion: a plain label wraps instead of being cut off, and `size="reading"` covers the label.**

- **Accordion** `variant="plain"` (with or without `flush`): a label longer than its row now wraps and the row grows with it. Before, the label was one line in a fixed 44px row and the rest was cut with an ellipsis, so an FAQ question of more than about 34 characters lost its end on a 390px phone. A one-line row is still 44px. When a label wraps, its `leading` content, `trailing` content and chevron stay beside the first line.
- **Accordion** `size="reading"` on a plain accordion now sets the label at the answer's 17px step (`type-large`) too. Before, the label stayed 14px over a 17px answer, so a question read smaller than its answer.
- `list` and `capsule` rows are unchanged: one line, 44px, truncated.
- New story **Pattern — FAQ (reading, long questions)** and interaction test **a long plain label wraps; one-line rows stay 44px**.

### Consumer actions

- None needed. A plain accordion that relied on the ellipsis to hold every row at 44px now shows the whole label on more lines: shorten the label, or use `variant="list"`.
- With `size="reading"`, a plain-text label grows from 14px to 17px. A label that sets its own type (`<span className="type-heading-3">`) looks the same.
