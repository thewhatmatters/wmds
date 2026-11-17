---
bump: patch
---
**Post page pattern: a `hero` slot at the article column's width.**

- **Guides/Post page → Pattern — post page** takes `hero`: the post's lead picture (one `<img>` or the app's image component, with its `width` and `height`). The pattern frames it under the "/ Article" rule, above the text, at the article column's full width — 918px at 1440 beside a 3-column panel with the base page margins, the page's width less its margins on a phone — at the picture's own shape, with rounded corners and a hairline over its edge. It keeps that width with `articleMeasure="reading"`, where a picture inside the markdown is held to 40rem. Without `hero` the page is unchanged.

### Consumer actions

- Re-copy **Pattern — post page** if the app has a lead picture on its posts: pass it as `hero` and take it out of the markdown (or out of the children), along with any frame, radius, or border the app drew around it. Set a responsive image's `sizes` to `(min-width: 1024px) 75vw, 100vw` beside a 3-column panel, or `66vw` beside a 4-column one.
- Apps without a lead picture: None.
