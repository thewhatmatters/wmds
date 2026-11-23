---
bump: patch
---
**Media: a picture in a frame that holds its shape.**

- **Media** (new): a picture at a set `ratio` (`4/3`, `16/9`, `1/1` and four more). The frame keeps its box before the picture loads, so the page doesn't jump. `focus` sets the crop point, by name (`top`, `bottom-left`) or as `{ x, y }` percentages of the picture. `radius` follows the surface radius knob. `caption` and `tag` (the visible source label, "Stock photo") sit under the frame. A missing or failed picture becomes a tinted box named by `alt`. `render` passes the picture through `next/image`. See **Components → Media → Pattern — photo with a source tag**.

### Consumer actions

- None. If you hold photos in a hand-built `figure` with an aspect class, switch to **Media**.
