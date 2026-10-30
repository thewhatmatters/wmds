# Release notes waiting for the next release

A feature branch never changes `version` in `package.json` or `CHANGELOG.md`. It adds its release note here, as its own file named after the branch topic (`changes/combobox.md`), so two open branches never edit the same lines. The release step (`npm run release:prepare`, on its own **Release 0.x.y** branch) folds every file into one `CHANGELOG.md` entry, bumps the version once and deletes them. `npm run check:changelog` checks each file.

```md
---
bump: patch
---
**Combobox: a searchable select for long lists.**

- **Combobox** (new): … what apps can see, as in a CHANGELOG entry.

### Consumer actions

- None.
```

`bump` is `patch`, or `minor` for anything that breaks an app while the major version is `0`. The release takes the largest bump among the files.
