---
bump: minor
---
**PromptBar and ChatDock: glass.**

- **PromptBar**: `variant="glass"` frosts the pill for a bar that floats over a picture, a video or a canvas. It is Card's glass (the same `--card-glass-tint` and `--card-glass-blur` knobs) under Card's hairline edge instead of the control border; solid where the browser has no backdrop filter, and when the visitor asks for less transparency. On glass the placeholder steps up to the text colour at 80%, so it holds AA over any backdrop at the default tints. Default stays `surface`. New exports: `promptBarVariants`, `PromptBarVariant`.
- **ChatDock**: `variant="glass"` frosts the bar and makes the open window a dense pane: the surface colour at 88% over a 24px blur, which keeps primary and secondary text at AA over any page. Knobs on the dock's wrapper: `--chat-dock-glass-fill` (the pane's colour, for example the page's black), `--chat-dock-glass-tint` and `--chat-dock-glass-blur`.

### Consumer actions

- None. To use glass over a backdrop you know, lower `--card-glass-tint` (bar) or `--chat-dock-glass-tint` (window) on the dock's wrapper and check the text against the brightest spot behind it.
