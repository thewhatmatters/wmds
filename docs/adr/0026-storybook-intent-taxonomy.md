# ADR-0026: Intent-based Storybook catalog taxonomy

**Status:** Accepted — amended 2026-10-03 (see **Amendment** below)
**Date:** 2026-09-10

## Context

Atomic tiers are useful for filesystem placement and dependency direction, but they make engineers infer implementation structure before finding a control. Storybook is a product catalog, so its navigation should answer what an engineer is trying to build.

## Decision

The public sidebar order is:

1. **Start Here**
2. **Foundations**
3. **Components**
4. **Patterns**
5. **Examples**

**Foundations** contains design-language specimens. **Patterns** contains cross-component selection and composition guidance. **Examples** contains approved page and flow compositions.

Components use `Components/{category}/{Name}`:

- **Actions:** Button, IconButton, FloatingActionButton, MoreMenu
- **Forms:** Checkbox, CheckboxGroup, Chip, Field, Input, Radio, RadioGroup, Search, SegmentedControl, Select, Switch, TextArea
- **Navigation:** NavList, SiteNav, Tab, TextLink; future Pagination (NavRail removed — ADR-0020 superseded)
- **Feedback:** Badge, Confetti, Skeleton, Status, Toast, Tooltip
- **Overlays:** Dialog, Dropdown, Panel, Sheet
- **Data display:** Avatar, Chart, ChatQa, Kbd, Stat, TaskRows; future Carousel and Table
- **Layout:** Accordion, Card, DisplayControls, HeroIntro, HeroTileStack, PageHeader, ScrollHorizontal

Interaction fixtures and audits use `Internal/...`, retain the `test` tag, and opt out of normal browsing and generated docs with `!dev` and `!autodocs`.

## Boundaries

- Files remain under `src/components/atoms`, `molecules`, and `organisms`.
- `package.manifest.ts` remains the source of truth for atomic export tiers.
- ADR-0002 one-way import and composition rules remain in force.
- Component docs retain **Usage → Anatomy → Best practices → Examples**.
- Pattern-story Show code remains opt-in and unchanged.

## Consequences

- Engineers browse by function without needing to know implementation tier.
- A component's Storybook category can differ from its atomic filesystem tier.
- New components require both an atomic placement and a functional catalog category.
- Sidebar ordering is centralized in `.storybook/preview.tsx`.

## Amendment — 2026-10-03: A–Z components, Guides, Sites

### Context

The category folders made engineers guess a component's category before they could find it (is **Chip** a form control or feedback? **SegmentedControl**?). **Patterns** held one guidance page and two WhatMatters flows, and **Examples** mixed WhatMatters pages, PitchKit pages, and generic guidance. The structure is now modeled on the Astryx docs: an A–Z component list in the sidebar, categories on an overview page, and guidance separate from product pages.

### Decision

Sidebar order: **Getting started → Guides → Foundations → Components → Sites → Internal**.

- **Getting started** — the former **Start Here** page (`src/storybook/GettingStarted.mdx`).
- **Guides** — cross-component guidance not tied to one product: **Chart explorations**, **Form controls**, **Overlay flows**, **Profile typography** (`src/guides/`).
- **Foundations** — unchanged pages, sorted A–Z.
- **Components** — **Overview** first, then every export A–Z as `Components/{Name}`. Related exports share a family folder, `Components/{Family}/{Name}`:
  - **Button** — Button, FloatingActionButton, IconButton
  - **Card** — Card, SelectableCard
  - **Checkbox** — Checkbox, CheckboxGroup
  - **Radio** — Radio, RadioGroup
- **Components → Overview** groups every export by category. Categories live in `src/storybook/componentCatalog.ts`, not in titles: Action, Chat, Container, Content, Data visualization, Feedback & status, Form controls, Layout, Marketing, Navigation, Overlay, Table & list. Planned exports appear with a **Planned** badge.
- **Sites** — pages and flows per product, `Sites/{Site}/{Page}`, **WhatMatters** first:
  - **WhatMatters** — Intake, Marketing landing, Prompt chat, RFP submitted (`src/sites/WhatMatters/`)
  - **PitchKit** — Account settings, Creator identity, Insights and kit, Intro, Past brands, Theme picker (`src/sites/PitchKit/`)
- **Patterns** and **Examples** are retired as sections. **Pattern — …** stories keep their names and Show code.

### Consequences

- A new component needs a story title (`Components/{Name}` or a family) and a `componentCatalog.ts` entry. `componentCatalog.test.ts` fails when an export has no entry or an entry points at a title with no story.
- A new family needs at least two exports that an engineer would compare side by side; record it in this list.
- Story ids changed with the titles, so bookmarks and visual-test baselines keyed on old ids need refreshing.

## Amendment — 2026-10-03: Sites removed

The **Sites** section is removed. Its pages (WhatMatters: Intake, Marketing landing, Prompt chat, RFP submitted; PitchKit) had fallen behind the product apps they copied, so keeping them in WMDS Storybook meant maintaining a second, older copy of each site. Product pages and flows now live only in their apps.

- Sidebar order: **Getting started → Guides → Foundations → Components → Internal**.
- Components keep their own **Pattern — …** stories; cross-component guidance stays under **Guides**.
- `src/sites/` and the PitchKit interaction tests are deleted. The Intake and Confetti interaction tests now exercise **IntakeModal** and **IntakeConfirmation** directly.

## Related

- ADR-0002 — atomic filesystem and import tiers
- ADR-0004 — pattern-first component contracts
