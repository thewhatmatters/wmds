# ADR-0024: Floating action button

## Status

Accepted

## Context

Compact mobile experiences sometimes need a small set of contextual actions without persistent full-width chrome. Those actions must remain explicit when opened and preserve page space when closed.

A vertical FAB gives the closed state one stable 48px control and reveals a short set of labeled destinations straight above it.

## Decision

Ship exported **FloatingActionButton** as a molecule.

### FloatingActionButton contract

- `items` + `onAction`
- optional `triggerIcon`, `openIcon`, trigger/close labels, and dismissible `backdrop`
- two to four actions
- fixed vertical path owned by WMDS; `className` is layout-only
- trigger and actions compose **IconButton**
- visible action labels accompany every icon

### Motion and styling

- Motion `AnimatePresence` owns mount/unmount
- `offsetPath` / `offsetDistance` place actions without layout reflow
- WMDS fast/medium duration and easing tokens replace configurable component-level springs
- Semantic WMDS surfaces, borders, focus rings, and elevation replace raw color literals
- No `motion-plus` runtime package is required; the implementation imports `motion/react`

## Consequences

- The action limit is intentional; larger action sets need a different pattern
- Storybook contract lives at **Components/Actions/FloatingActionButton**

## References

- [Motion floating action button](https://examples.motion.dev/react/floating-action-button)
