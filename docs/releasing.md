# Releasing @whatmatters/wmds

The package publishes to npm from GitHub Actions only (`.github/workflows/release.yml`), after every CI check passes. It authenticates with npm trusted publishing (OIDC), so no npm token lives in the repository or in GitHub secrets.

## Cut a release

1. **Changelog.** The top entry of `CHANGELOG.md` is the version being released. It matches `version` in `package.json` and has a **Consumer actions** section. `npm run check:changelog` checks both.
2. **Merge to `main`** with CI green.
3. **Tag the merge commit and push the tag:**

   ```bash
   git checkout main && git pull
   git tag v0.2.0            # v + the package.json version
   git push origin v0.2.0
   ```

4. **Release workflow** runs every CI check, rebuilds, checks that the tag matches `package.json` and the changelog, checks the tarball contents, then runs `npm publish`. npm attaches provenance automatically.
5. **Confirm:** `npm view @whatmatters/wmds version` prints the new version.

**Dry run:** Actions → **Release** → **Run workflow** (any branch). It runs the same checks and `npm publish --dry-run`, and uploads nothing. Every pull request also runs `check:pack` and a publish dry run in CI.

**Next version:** after a release, the next change that apps can see starts a new top entry in `CHANGELOG.md` and bumps `package.json` (`npm version patch --no-git-tag-version`, or `minor` for a breaking change while the major version is `0`).

## One-time npm setup (owner only)

These happen on npmjs.com and in GitHub. Nothing in this repository can do them.

1. **Create the `whatmatters` organization on npm** (npmjs.com → Add organization; the free plan publishes public packages). Today the registry reports no `whatmatters` user or organization, so the `@whatmatters` scope is unclaimed. If the name turns out to be taken, choose another scope and rename the package in `package.json` before the first release.
2. **Turn on two-factor authentication** for the npm account that owns the organization.
3. **Publish 0.2.0 by hand, once** (see **First publish**). npm only lets you register a trusted publisher for a package that already exists.
4. **Register the trusted publisher** on npmjs.com → `@whatmatters/wmds` → Settings → Trusted publishing → GitHub Actions. Every field is case-sensitive, and npm does not check them until the next publish:
   - Organization or user: `thewhatmatters`
   - Repository: `wmds`
   - Workflow filename: `release.yml`
   - Environment: `npm`
   - Allowed actions: tick **npm publish**. Configurations created after 2026-09-03 allow only `npm stage publish` by default, and the workflow runs `npm publish`.

   The CLI equivalent, with npm 11.15 or later: `npm trust github @whatmatters/wmds --file release.yml --repo thewhatmatters/wmds --env npm --allow-publish`.
5. **Lock token publishing**: package Settings → Publishing access → *Require two-factor authentication and disallow tokens*. Trusted publishing keeps working.
6. **Optional, in GitHub:** add required reviewers to the `npm` environment (Settings → Environments; the first Release run creates it) so each publish waits for an approval, and protect `v*` tags so only maintainers can push them.

### First publish

Run once, from a clean checkout of the tagged commit, signed in to the account from step 1:

```bash
git fetch --tags && git checkout v0.2.0
npm ci                     # builds dist through `prepare`
npm run check:changelog -- --tag v0.2.0
npm run check:pack
npm login                  # if not signed in
npm publish                # prompts for the 2FA code; access is public via publishConfig
npm view @whatmatters/wmds version   # 0.2.0
```

Push the `v0.2.0` tag before this so the release commit is recorded, but expect the Release workflow's **Publish** step on that tag to fail (the package does not exist yet, so there is no trusted publisher). From 0.2.1 on, pushing the tag is the whole release.
