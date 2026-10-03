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

These happen on npmjs.com and in GitHub settings. Nothing in this repository can do them.

1. **Own the `@whatmatters` scope.** Sign in to npmjs.com and create the organization `whatmatters` (the free plan publishes public packages). If the name is taken, pick another scope and rename the package in `package.json` before the first release.
2. **Enable two-factor authentication** on the npm account that owns the organization.
3. **Register the trusted publisher** on the package's npm settings page (Settings → Trusted publishing → GitHub Actions):
   - Organization or user: `thewhatmatters`
   - Repository: `wmds`
   - Workflow filename: `release.yml`
   - Environment: `npm`

   See **First publish** below for when this can happen.
4. **Lock token publishing** after the first trusted publish succeeds: package Settings → Publishing access → *Require two-factor authentication and disallow tokens*. Trusted publishing keeps working.
5. **Optional, in GitHub:** add required reviewers to the `npm` environment (Settings → Environments; the first release run creates it) so each publish waits for an approval, and add a tag rule so only maintainers can push `v*` tags.

### First publish

npm configures trusted publishers per package. If npm does not let you add one before the package exists, publish `0.2.0` once by hand from a clean checkout of the tagged commit, then register the trusted publisher (step 3) for every later release:

```bash
git checkout v0.2.0
npm ci                   # builds dist through `prepare`
npm run check:pack
npm publish              # prompts for the 2FA code
```

This is the only time a release is published from a laptop.
