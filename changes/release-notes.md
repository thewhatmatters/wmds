---
bump: patch
---
**Contributors: release notes as files, and releasing as its own step.**

- Feature branches add a release note as `changes/<topic>.md` instead of editing `CHANGELOG.md` and the version, so two open branches no longer conflict. `npm run release:prepare` folds the notes into one entry and bumps the version once, on its own **Release 0.x.y** branch. `npm run check:changelog` also checks the notes. See `AGENTS.md` → **Releases**.
- The **report-wmds-gap** skill's contributing steps say to add a `changes/` note.
- `src/package.manifest.ts` lists one component per line, sorted.

### Consumer actions

- None.
