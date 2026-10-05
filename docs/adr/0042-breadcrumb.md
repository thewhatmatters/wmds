# ADR-0042: Breadcrumb

**Status:** Accepted
**Date:** 2026-10-05

## Context

The WhatMatters site needs breadcrumbs — on blog posts first, and on any page deeper than one level. The reference is the shadcn/ui breadcrumb: a `nav` with an ordered list of links, a separator between them, the current page last, and an ellipsis that opens a dropdown of the links a long path hides. shadcn ships it as primitives (`BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`) and leaves the collapse to each page; its responsive example keeps three crumbs and swaps the dropdown for a drawer on phones.

## Decision

Ship **Breadcrumb** as a molecule with an `items` API that does the collapse itself, and give **Dropdown.Item** a `render` prop so the menu's rows can be links.

- **`items`, not primitives.** `{ label, href }` from the root; the last item, without `href`, is the current page (`aria-current="page"`, not a link). Apps pass data; WMDS owns the markup, the separators, and the collapse. This follows the pattern-first rule (ADR-0004).
- **Collapse rule.** Above `maxItems` (default 4, minimum 3) the first item and the last `maxItems - 2` stay; the middle folds into a "…" **IconButton**. The rule does not change with the viewport; long labels truncate instead (10rem on phones, 16rem from `sm`, 24rem from `lg`), with the full label in the accessible name and `title`.
- **The "…" menu is a disclosure of links, not an ARIA menu.** The control has `aria-expanded` and `aria-controls`; the panel is the **Dropdown.Menu** list of **Dropdown.Item** rows rendered as links. Opening moves focus to the first link, arrow keys move between links, Tab and Shift+Tab leave (and close), Escape closes and returns focus. A `role="menu"` would promise menu semantics for what are plain navigation links.
- **One menu on every screen size.** shadcn's drawer on phones is not adopted: the menu is short, the dropdown already handles narrow screens, and a bottom **Sheet** would trap focus for a two- or three-link choice.
- **Router links through `renderLink`.** A function from the item to a link element without children (`(item) => <Link href={item.href} />`); Breadcrumb adds the label and the styling with Base UI `useRender`, in the path and in the menu.
- **Separators and type.** `separator` is `chevron` (default) or `slash`. `variant="mono"` sets `type-eyebrow`, so a breadcrumb sits with **SectionCaption** and **IndexList** captions on editorial pages; **Guides/Post page** uses `mono` with slashes.
- **Dropdown.Item `render`.** Composes the row onto another element; `disabled` maps to `aria-disabled` there. **Select** and **MoreMenu** are unchanged.

## Consequences

Breadcrumbs are one prop on a page. The post page pattern gains a `breadcrumb` field. A menu of links elsewhere can reuse **Dropdown.Item** `render`.

## References

- ADR-0004, ADR-0011, ADR-0028, ADR-0041
