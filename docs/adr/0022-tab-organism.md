# ADR-0022: Responsive Tab organism with promoted overflow

## Status

Accepted

## Context

Peer pages such as Profile, Notifications, and Security need tab semantics—not
SegmentedControl radio semantics and not a full mobile NavList. Labels must stay
readable at narrow widths without horizontal clipping.

The project vault already records two constraints:

- **Tab vs Chip:** tabs use `tablist` / `tab` / `aria-selected`; chips filter rows.
- **Sliding indicator overflow:** resolve excess tabs into More instead of clipping
  or horizontally scrolling the active rule.

Production mobile navigation commonly reserves a final **More** destination for
overflow. WMDS additionally needs the selected hidden destination promoted into
the visible row so users retain location context.

## Decision

Ship **Tab** as an organism under `src/components/organisms/Tab/`.

### API

- `Tab.Group`: controlled `value` + `onValueChange`, accessible label, size
- `Tab`: `value`, text label, optional `count`, `disabled`, and `panelId`
- The controlled panel remains outside Tab.Group

### Responsive overflow

1. ResizeObserver measures the available group width.
2. Invisible exact-style specimens measure every tab and the More trigger.
3. If all tabs fit, More is absent.
4. If tabs overflow, a stable prefix remains visible and More opens
   **Dropdown.Menu** with the remainder.
5. Selecting a hidden tab promotes it into the final visible position immediately
   before More; the displaced tab returns to the menu.

### Interaction

- Plain labels with one Motion shared-layout bottom rule
- Arrow Left/Right and Home/End move through all enabled tabs
- More supports pointer, Arrow Up/Down, Enter/Space, and Escape
- Counts are compact inline text—not Badge

### Composition

- More composes **Dropdown.Menu** + **Dropdown.Item**
- Tab and More triggers are documented organism shell exceptions because they own
  `role="tab"` and overflow-trigger semantics

## Consequences

- Responsive settings and peer-page flows can use one Tab row without exposing a full section list.
- SegmentedControl remains for settings values and view modes, not page navigation.
- No horizontally scrolling tab track or clipped selected pill.

## References

- ADR-0019 (NavList)
- **Organisms/Tab → Pattern — responsive overflow**
