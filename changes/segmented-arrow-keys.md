---
bump: patch
---
**SegmentedControl: arrow keys and one tab stop, as a radio group.**

- **SegmentedControl**: the group is one tab stop (the selected segment; every segment while none is selected), and the arrow keys move to the next or previous enabled segment and select it, wrapping at the ends; left and right follow the reading direction. Home and End go to the first and last segment. It was announced as a radio group but every segment was its own tab stop and arrows did nothing.

### Consumer actions

- None. Tests that tab through each segment in turn now reach only the selected one; use the arrow keys to move between segments.
