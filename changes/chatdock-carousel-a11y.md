---
bump: patch
---
**Placeholders you can read, a marquee that stops for reduced motion, and 44px close and pause targets on phones.**

- **Input**, **TextArea**, **Search**, **PromptBar**, **ChatDock**, **Select** (fix): placeholder text was the disabled ink, 2.1:1 on white and 3.2:1 in dark. It now uses a new token, `--color-text-placeholder` (utility `text-placeholder`): 5.1:1 in light (`#6e6e6e`), 5.0:1 in dark (`#949494`), and the band's muted ink on an inverse or field band. It is still a step lighter than supporting copy, so a hint doesn't read as a typed value. `text-disabled` is now for disabled states only.
- **Carousel** (fix): `autoplay` kept drifting for a reader who asked for reduced motion, unless the app had wrapped it in `<MotionConfig reducedMotion="user">`. The reader's setting now always wins, with or without a `MotionConfig`.
- **ChatDock** (fix): the same for the window's open and close animation.
- **Dialog**, **Panel**, **Sheet**, **ChatDock** (fix): the close button's tap area is 44px on touch screens (the circle stays 36px). **Carousel**'s Pause button too.

### Consumer actions

- A brand kit that sets its own `--color-text-disabled` to tune placeholders should set `--color-text-placeholder` instead (keep it at 4.5:1 or more on your field fill).
- An app that wrapped a Carousel in `<MotionConfig reducedMotion="never">` to keep it moving under reduced motion: that no longer works, on purpose.
