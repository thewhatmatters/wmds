---
bump: patch
---
**Carousel: the follow cursor no longer widens the page.**

- **Carousel** `cursor`: the follow badge now sits in a layer over the row (bleed included) that clips it sideways. Before, a mouse near the page's right edge pushed the badge, and with it the page, up to half a badge wider (a sideways scrollbar on a `bleed` row such as a looping testimonial strip), and the page stayed wider after the pointer left. Above and below the row the badge stays whole. The loop's copy of the items was never the cause: it scrolls inside the row.
- The Carousel root no longer gets `position: relative` when `cursor` is set; the row's frame holds the badge now.
- New interaction test **loop, bleed and follow cursor never widen the page** (fails on 0.4.45: page 1307px wide in a 1280px window).

### Consumer actions

- None. Apps that added `overflow-x-clip` around a Carousel only to stop this sideways scroll can drop it.
