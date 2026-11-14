---
bump: minor
---
**PromptBar and ChatDock: a glass composer.**

- **PromptBar**: `variant="glass"` frosts the pill for a bar that floats over a picture, a video or a canvas. It is Card's glass (the same `--card-glass-tint` and `--card-glass-blur` knobs) with the control border and a lit top edge; solid where the browser has no backdrop filter, and when the visitor asks for less transparency. Default stays `surface`. New exports: `promptBarVariants`, `PromptBarVariant`.
- **ChatDock**: `composer="glass"` passes it to the resting bar. The window stays solid, so the conversation keeps its contrast.

### Consumer actions

- None. To use it over a backdrop you know, lower `--card-glass-tint` on the bar's wrapper and check the placeholder against the brightest spot behind it.
