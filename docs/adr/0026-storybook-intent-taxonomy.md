# ADR-0026: Intent-based Storybook catalog taxonomy

**Status:** Accepted
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
- **Navigation:** NavList, NavRail, Tab, TextLink; future Pagination
- **Feedback:** Badge, Skeleton, Status, Toast, Tooltip
- **Overlays:** Dialog, Dropdown, Panel, Sheet
- **Data display:** Avatar, Chart, Kbd, Stat, TaskRows; future Carousel and Table
- **Layout:** Accordion, Card, DisplayControls, PageHeader

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

## Related

- ADR-0002 — atomic filesystem and import tiers
- ADR-0004 — pattern-first component contracts
