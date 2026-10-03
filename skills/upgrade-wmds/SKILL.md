---
name: upgrade-wmds
description: Use when updating @whatmatters/wmds in an app — bumping to a new version, moving from a git-commit pin to the npm package, or after a WMDS release is announced. Installs the new version with one command, applies every Consumer actions step from CHANGELOG.md between the old and new version, re-syncs pasted Storybook patterns, refreshes the WMDS agent skills, and runs the app's checks.
---

# Upgrade WMDS

Work through the steps in order and keep a checklist in your reply to the user.

## 1. Find the current and target versions

```bash
node -p "require('@whatmatters/wmds/package.json').version"   # installed
npm view @whatmatters/wmds versions --json                     # published
grep '"@whatmatters/wmds"' package.json                         # the dependency spec
```

- If the spec is a git pin (`github:thewhatmatters/wmds#…` or `git+https://…`), the installed version reads `0.1.0` (all git builds before npm) or the commit's version. Treat the old version as `0.1.0` and follow the 0.2.0 Consumer actions, which cover the move to npm.
- While the major version is `0`, a minor bump (`0.2.x` → `0.3.0`) can break the app; a patch bump does not.

## 2. Install with one command

```bash
npm install @whatmatters/wmds@<target>      # e.g. @^0.3.0
```

Never edit the version or a commit hash in `package.json` by hand — the lockfile keeps the old integrity and `npm install` skips the update.

## 3. Apply every Consumer actions step

Read `node_modules/@whatmatters/wmds/CHANGELOG.md`. For **each** version after the old one, up to and including the target, **oldest first**, do every step under **Consumer actions**. Some steps name files to delete, packages to remove, assets to copy into `public/`, or patterns to re-copy. Do them literally and tick them off.

## 4. Re-sync pasted patterns

Every pasted pattern starts with `// @whatmatters/wmds@<version> · <pattern name>` and a `?path=/story/<id>` line. List them and compare each with the installed copy:

```bash
node -e '
const fs = require("fs"), path = require("path"), cp = require("child_process");
const files = cp.execSync("grep -rl --include=*.tsx --exclude-dir=node_modules \"// @whatmatters/wmds@\" . || true").toString().split("\n").filter(Boolean);
const strip = (s) => s.split("\n").filter((l) => !l.startsWith("// @whatmatters/wmds@") && !l.startsWith("// Storybook:") && !l.startsWith("// Show code")).join("\n").trim();
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const id = src.match(/\?path=\/story\/([\w-]+)/)?.[1];
  const pinned = src.match(/@whatmatters\/wmds@([\d.]+)/)?.[1];
  const shipped = path.join("node_modules/@whatmatters/wmds/docs/patterns", `${id}.tsx`);
  if (!id || !fs.existsSync(shipped)) { console.log(`REMOVED  ${file} (${id}) — see CHANGELOG for its replacement`); continue; }
  console.log(`${strip(fs.readFileSync(shipped, "utf8")) === strip(src) ? "same    " : "changed "} ${file}  ${pinned} → ${id}`);
}'
```

For each **changed** file:

1. Copy the new `docs/patterns/<id>.tsx` over it, header included.
2. Re-apply only the app's allowed edits (export/rename, copy, data, URLs, handlers). `git diff` on the file shows them.
3. If the app had changed structure or styling inside the pattern, that is drift — keep the new pattern and raise it with the user (and the **report-wmds-gap** skill if WMDS is missing something).

For **unchanged** files, update the version in the header line so it reads the new version.

## 5. Refresh the WMDS skills

```bash
npx skills add 'thewhatmatters/wmds#v<target>' -s use-wmds -s upgrade-wmds -s report-wmds-gap -a claude-code -y
```

This rewrites `.claude/skills/*` and `skills-lock.json` at the release tag. Commit both.

## 6. Run the app's checks

Run `npx wmds-check` (it reports pasted patterns that still differ from the installed version), then the app's own install, lint, typecheck, unit tests, and build (for example `npm run lint && npx tsc --noEmit && npm run build`). Then open each page that uses a component named in the changelog and check it at mobile, tablet, and desktop widths.

## 7. Commit

Commit `package.json`, `package-lock.json`, re-synced patterns, `public/` assets, skills, and `skills-lock.json` together. Write the commit message like this: `Upgrade @whatmatters/wmds <old> → <new>`, then list the Consumer actions done.
