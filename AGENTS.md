# WMDS — agent notes

Paper is the visual source of truth. This repo is the runnable layer: tokens,
React components, Storybook.

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
