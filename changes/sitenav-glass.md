---
bump: minor
---
**SiteNav: `variant="glass"` frosts the compact pill.**

- **SiteNav**: for a page whose sections are pictures, video or a canvas, `variant="glass"` gives the scrolled pill Card's glass fill (the `--card-glass-tint` and `--card-glass-blur` knobs) instead of the near-solid elevation surface, like PromptBar and ChatDock `variant="glass"`. It is solid where the browser has no backdrop filter and when the visitor asks for reduced transparency. The default stays `"surface"`.

### Consumer actions

None. Opt in with `variant="glass"`; raise `--card-glass-tint` over bright pictures so the links keep their contrast.
