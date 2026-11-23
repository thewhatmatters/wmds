---
bump: patch
---
**ChatDock gate: Cancel and the way forward stay on screen when a step is taller than the conversation.**

- **ChatDock.Gate**: inside **ChatDock** the gate's footer (the pending or error line, Cancel and the primary action, and whatever sits in the footer's start slot) now stays pinned to the conversation's bottom edge while the step scrolls under it. Before, a tall step (a long checkbox list, an embedded calendar) pushed the footer below the composer, and a visitor had to guess to scroll inside the panel. The conversation keeps scroll padding equal to the footer's height, so Tab never lands on a control hidden under it. A gate used on its own, outside ChatDock, is unchanged.
- **ChatDock** (`placement="rise"`): the room kept for the composer is now measured against the component's own box instead of the viewport. When an app slides the whole dock into place with a `translate` on a wrapper, the old measure read 0 for the gap under the composer while the wrapper was still moving, and the conversation then ran under the composer by the height of that gap on phones.

### Consumer actions

- None.
