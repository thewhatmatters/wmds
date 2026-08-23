# WMDS — agent notes

## Paper vs Storybook

- **Paper** — token lab + design playground. Foundation (Theme tab) syncs with `src/tokens/tokens.css`. Use Paper to mock up features by composing layouts that match components already in Storybook — token-bound nodes only (see `.cursor/rules/wmds-paper-tokens.mdc`).
- **Storybook** — canonical component catalog: props, states, motion, exports. Source of truth for shipped primitives.
- **Do not** mirror every Storybook story as a Paper artboard. Update Paper for new design work or token changes; verify interaction in Storybook.
- **Promote to code:** `get_jsx` on a mockup frame → refine into React; add or extend stories — not the other way around by default.

## Examples vs components

- **Components** — `src/components/{Name}/`; exported from `src/index.ts`; Storybook `Components/{Name}`.
- **Examples** — `src/examples/{Name}/`; Storybook-only specimens (`Examples/{Name}`); **never** add to `src/index.ts`. Compose imported primitives; used to validate tokens + real UI patterns.
- **Lib** — `src/lib/` holds internal utilities shared across components (e.g. `cn`, `CountPill` / segmented-control presentation); not exported from `src/index.ts`.
- **MoreMenu module** — `types.ts` + `moreMenuLayout.ts` (pure positioning) + internal `MoreMenuPanel.tsx`; only `MoreMenu` is exported from `src/index.ts`.

## Component order

Keep **alphabetical (A→Z)** everywhere components are listed:

- `src/index.ts` exports (comment at top of file)
- Storybook sidebar — `Components/{Name}` titles; `.storybook/preview.tsx` uses `storySort: { method: "alphabetical-by-kind", order: ["Foundation", "Components", "Examples"] }`
- README component + examples tables

When adding a component, insert it in sort order — do not append to the end.

<!-- wire-vault:start -->
## Knowledge vault — project layer

This project's durable knowledge (overview, decisions, gotchas) lives in the
cross-project vault at `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/OBSDN/projects/wmds/`
(default vault: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/OBSDN`).

- **Read first:** before re-deriving an architecture decision or re-debugging
  a non-obvious issue, check `projects/wmds/index.md` there.
- **Write path:** durable insights go through `/curate-vault` (gated) —
  never write vault articles directly.
<!-- wire-vault:end -->
