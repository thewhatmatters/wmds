---
bump: minor
---
**PriceList: priced rows for a menu or a rate card.**

- **PriceList** (new): a list of priced rows. **PriceList.Item** takes a `name`, an optional `note` and a `price`, under one rule. Prices line up in one end-aligned column in tabular figures. From `md` the name, note and price share one line; on a phone the note drops under the name and the price stays at the row's end, so the list never scrolls sideways (a long price wraps in its own track). `layout` `inline` / `stacked`, `rule` `solid` / `dotted` / `none`, `size` `md` (rate card) / `lg` (menu). See **Components → PriceList → Pattern — menu section**.

### Consumer actions

- None. If you set a menu or a rate card in a **Table** or hand-built rows, switch to **PriceList** to drop the sideways scroll on phones.
