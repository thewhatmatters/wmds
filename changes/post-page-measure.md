---
bump: patch
---
**Post page: the article fills its column.**

- **Guides/Post page → Pattern — post page**: the article (pictures and text) now runs the width of its 8 or 9 columns. It was capped at Prose's 40rem reading measure, which left a third of the column empty at 1440 and held a post's picture to 640px. New prop `articleMeasure`: `"none"` (default) fills the column, `"reading"` keeps the 40rem cap for long text-only posts. **Prose** itself is unchanged: its default measure is still `reading`.

### Consumer actions

- Apps that pasted **Pattern — post page**: re-copy it to get the full-width article, or pass `measure="none"` to its `Prose`. Check a post's picture `sizes` if it assumed 40rem.
