---
bump: patch
---
**SegmentedControl: a 44px tap area on touch screens.**

- **SegmentedControl**: on a touch screen (`pointer: coarse`) each segment's tap area is now 44px tall at every size. Segments are 24 / 32 / 40px tall inside the 28 / 36 / 44px track, and had no larger tap layer. The track and the segments look the same: the extra room is an invisible layer centred on the segment, reaching up to 8px above and below the track (`sm`). It adds no width, so a tap never lands on the next segment. With a mouse nothing changes.

### Consumer actions

- None. If a control sits closer than 8px above or below a segmented control, check on a phone that taps land on the one you mean.
