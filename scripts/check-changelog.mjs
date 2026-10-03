/**
 * CHANGELOG.md format gate. Fails when:
 * - an entry heading is not `## <semver>` or versions are not newest-first,
 * - an entry has no `### Consumer actions` section, or that section is empty,
 * - the top entry's version differs from package.json,
 * - a release tag (`--tag v1.2.3` or GITHUB_REF_NAME in a tag build) differs from package.json.
 */
import { readFileSync } from "node:fs";

const fail = (message) => {
  console.error(`check-changelog: ${message}`);
  process.exit(1);
};

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const changelog = readFileSync("CHANGELOG.md", "utf8");
const semver = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/;

const entries = [];
for (const block of changelog.split(/^## /m).slice(1)) {
  const [heading, ...rest] = block.split("\n");
  const version = heading.trim().split(/\s+/)[0];
  if (!semver.test(version)) fail(`"## ${heading.trim()}" is not "## <semver>"`);
  entries.push({ version, body: rest.join("\n") });
}
if (entries.length === 0) fail("no release entries");

const compare = (a, b) => {
  const [, ...x] = a.match(semver).map(Number);
  const [, ...y] = b.match(semver).map(Number);
  for (let i = 0; i < 3; i += 1) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};

entries.forEach(({ version, body }, index) => {
  const section = body.split(/^### Consumer actions\s*$/m)[1];
  if (section === undefined) fail(`${version} has no "### Consumer actions" section`);
  const content = section.split(/^##+ /m)[0].trim();
  if (!content) fail(`${version} has an empty Consumer actions section — write "None." when there are none`);
  const next = entries[index + 1];
  if (next && compare(version, next.version) <= 0) fail(`${version} is listed above ${next.version}; newest first`);
});

if (entries[0].version !== pkg.version) {
  fail(`top entry is ${entries[0].version} but package.json is ${pkg.version}`);
}

const tagArg = process.argv.indexOf("--tag");
const tag =
  tagArg !== -1
    ? process.argv[tagArg + 1]
    : process.env.GITHUB_REF_TYPE === "tag"
      ? process.env.GITHUB_REF_NAME
      : undefined;
if (tag && tag !== `v${pkg.version}`) fail(`tag ${tag} does not match package.json version v${pkg.version}`);

console.log(`check-changelog: ${entries.length} entr${entries.length === 1 ? "y" : "ies"}, top ${entries[0].version}${tag ? `, tag ${tag}` : ""}`);
