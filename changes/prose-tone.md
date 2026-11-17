---
bump: patch
---
**Prose: `tone="muted"` sets body text in the secondary ink.**

- **Prose**: new prop `tone`. `"primary"` (default) is unchanged. `"muted"` sets paragraphs, lists, quotes, and table cells in `text-muted`; headings, links, strong text, inline code, code blocks, and table heads keep `text-fg`.
- **Guides/Post page → Pattern — post page**: the article uses `tone="muted"`, and the lead under the title is `text-muted` in the live example too (the copied code already had it). The title and the article's headings stay in the primary ink.

### Consumer actions

- Apps that pasted **Pattern — post page**: re-copy it, or add `tone="muted"` to its `Prose`, to get the grey body text. Nothing changes for other uses of **Prose**.
