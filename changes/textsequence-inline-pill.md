---
bump: patch
---
**TextSequence and ScrollHorizontal.Intro: key words in InlinePills.**

- **TextSequence**: an `InlinePill` among its children now belongs to the sequence. The words inside the pill slide up on their own beats and stay in the plain sentence that names the block (before, a pill's words were left out of the accessible name), and the pill's picture pops in as its first word arrives. Keep the picture static (an `img` or an `svg`). The plain sentence also keeps the text's own spacing now: a full stop or comma right after a pill stays on its word ("remember.", not "remember .").
- **ScrollHorizontal.Intro**: `statement` takes `InlinePill`s. While it holds one, the statement's leading opens to 1.35, so pills on neighbouring lines don't touch.

### Consumer actions

- None.
