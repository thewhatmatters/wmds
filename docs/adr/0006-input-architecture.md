# ADR-0006: Input architecture — individual components, optional labels

**Status:** Accepted  
**Date:** 2026-08-29

## Context

WMDS needs text entry for Farmer Market (ZIP/city search, Find pill) and future forms. Two common models:

1. **Material-style** — one `TextField` family with `variant`, `type`, and shared floating-label shell; Select/Autocomplete extend the same base.
2. **Astryx-style** — discrete **Data Input** components (`Text Input`, `Text Area`, `Selector`, …) plus **`Field`** for label/layout composition.

Material’s grouped API creates prop soup and hides real behavioral differences (text vs select vs date). WMDS is **pattern-first** (ADR-0004): named components, typed props, Storybook patterns — not generic field variants.

Product preference:

- **Astryx** visuals and pattern stories ([Text Input](https://astryx.atmeta.com/components/TextInput))
- **ShadCN-style optional labels** — bare input is valid; label/helper/error are opt-in props, not a required `Field` wrapper

## Decision

### Public API — individual components

| Export | Tier | Role |
|--------|------|------|
| **`Input`** | Atom | Single-line text control |
| **`TextArea`** | Atom | Multiline control — same optional chrome as `Input` |
| **`Field`** | Molecule | Label/layout wrapper for orientation and multi-control rows — **never required** |
| **`Select`** | Molecule | Dropdown / listbox — own component, not `Input type="select"` |
| **`Search`** | Molecule | Search row patterns (inline input + button, clear, submit) |

Do **not** ship a monolithic `TextField` or `type` matrix as the consumer API.

### Shared internals (not exported)

- **`inputShellStyles.ts`** — border, radius, focus ring, sizes (`sm` \| `md` \| `lg`), disabled, error, read-only
- Reuse interaction primitives where aligned: focus ring family with Button/Chip (`segmentedFocusRingClasses` or sibling)
- Typography for label/helper/error from **`lib/typography.ts`**

Apps import **`Input`**, not raw shell utilities.

### `Input` / `TextArea` — optional label (ShadCN-style)

Bare control is the **default**. Optional props add field chrome when needed:

| Prop | Role |
|------|------|
| `label?` | Visible label + `htmlFor` / `id` wiring — **no required asterisk** |
| `description?` | Neutral helper text below control |
| `status?` | `error` \| `warning` \| `success` — border + trailing status icon |
| `message?` | Validation copy in attached footer — requires `status`; omit for status-only |
| `loading?` | Trailing spinner |
| `endBadge?` | Trailing inset inside shell — pass `<Badge>` (e.g. Required). Composable at call site; Input does not import Badge |
| `icon?` | Leading Lucide icon (pattern — no generic slots) |
| `size?` | `sm` \| `md` \| `lg` |
| `placeholder?`, `disabled`, `readOnly`, `name`, `value` / `defaultValue`, `onChange`, … | Standard control props |

**Accessibility:** when `label` is omitted, **`aria-label` is required** (dev warn in Storybook — same contract as `IconButton`).

```tsx
// Bare — FM Find pill, toolbar search (ShadCN-style)
<Input placeholder="ZIP or city" aria-label="Location" icon={<MapPin strokeWidth={2} />} />

// With label — simple form, no Field import
<Input label="Email" type="email" description="We'll never share this." />

// With validation — Astryx status footer (not label asterisks)
<Input label="Email" status="error" message="Please enter a valid email address." />

// Status only — border + icon, no message
<Input label="ZIP" status="error" defaultValue="test" />

// Required — Badge inside shell (not label asterisk)
<Input label="Email" required endBadge={<Badge size="sm">Required</Badge>} />
```

`TextArea` follows the same optional `label` / `description` / `error` pattern.

### `Field` — layout molecule, not gatekeeper

Inspired by [Astryx Field](https://astryx.atmeta.com/components/Field). Use when **composition** is clearer than props on the control:

| Pattern | Props |
|---------|--------|
| **Vertical** (default) | `label` + child control |
| **Horizontal / inline** | `orientation="horizontal"` — label beside control ([Astryx inline](https://astryx.atmeta.com/components/TextInput)) |
| **Multi-control** | One label context for `Select`, `TextArea`, etc. |

`Field` does **not** replace `Input`’s optional `label` — both are valid:

- **`Input label="…"`** — vertical stack in one component (most forms)
- **`<Field label="…"><Input aria-label="…" /></Field>`** — horizontal or when wrapper owns the label

Prefer **`Input label`** for simple vertical fields. Prefer **`Field`** for horizontal orientation or wrapping non-Input controls.

### `Search` molecule

Named patterns for search UX — not a second input kit:

| Pattern | Composition |
|---------|-------------|
| **Inline search** | `Input` + `Button` (Astryx inline + button) |
| **With clear** | Input + trailing clear affordance |
| **Find pill** (FM) | Example flow: `Button` → bare `Input` → removable `Chip` — see FM roadmap |

### Storybook contract

**Atoms/Input** — prescribed patterns (copy one story):

1. **Bare** — placeholder only, `aria-label` required
2. **With label** — label + optional description
3. **Error / warning / success** — `status` + optional `message` footer + trailing icon
4. **Status only** — `status` without `message`
5. **Loading** — `loading` spinner
6. **End badge** — `endBadge` with `<Badge>` for Required
7. **With icon** — leading Lucide
8. **Sizes** — sm / md / lg

**Molecules/Field** (when shipped):

6. **Horizontal** — `orientation="horizontal"`

**Molecules/Search** (when shipped):

7. **Inline + button** — search row

### Tier and imports

- **Input**, **TextArea** — atoms; import only `lib/`, theme, peers
- **Field**, **Select**, **Search** — molecules; may compose `Input`, `Button`, `IconButton`
- **Find pill** — **Example** or thin **Search** pattern; not a new tier

### Anti-patterns

- `Input type="select"` or unified `TextField` with mode prop
- Requiring `Field` for every labeled input
- Label asterisks for required fields — use `endBadge={<Badge>Required</Badge>}` + native `required`
- Generic trailing slots — only documented `endBadge` inset (Badge pattern)
- Generic `startSlot` / `endSlot` on Input — use named `icon`, `Search` patterns, or `IconButton` beside Input in Examples
- Raw utility styling in apps — extend via new patterns in WMDS

## Consequences

- **`Input` atom** is the FM blocker for Find pill and ZIP search
- **`Field`** can ship after `Input` when horizontal/labeled forms are needed
- **`Select`** / **`Search`** ship when their patterns are spec’d — not upfront
- Rebuild legacy flat input paths under `src/components/atoms/Input/`
- Update **`CONSUMING.md`** and **`AGENTS.md`** when `Input` exports

## Related

- ADR-0004 — pattern-first
- ADR-0002 — atoms vs molecules
- `docs/farmermarket-component-roadmap.md` — FM Input patterns
