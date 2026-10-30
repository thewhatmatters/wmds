/**
 * The release step (AGENTS.md → Releases): run on its own "Release 0.x.y" branch after the features merge.
 * Folds every changes/*.md into one new top entry of CHANGELOG.md, bumps package.json and package-lock.json
 * once, and deletes the change files.
 *
 *   npm run release:prepare            # version from the largest bump the change files ask for
 *   npm run release:prepare -- 0.4.50  # or name it (e.g. the next free version after a collision)
 */
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { changelogEntry, nextVersion, readChangeNotes } from "./changeNotes.mjs";

const fail = (message) => {
  console.error(`release-prepare: ${message}`);
  process.exit(1);
};

let notes;
try {
  notes = readChangeNotes("changes");
} catch (error) {
  fail(error.message);
}
if (notes.length === 0) fail("no change files in changes/ — nothing to release");

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const version = process.argv[2] ?? nextVersion(pkg.version, notes);
if (!/^\d+\.\d+\.\d+$/.test(version)) fail(`"${version}" is not a version`);

const changelog = readFileSync("CHANGELOG.md", "utf8");
const firstEntry = changelog.search(/^## /m);
if (firstEntry === -1) fail("CHANGELOG.md has no entries");
if (changelog.includes(`\n## ${version}\n`)) fail(`CHANGELOG.md already has ${version}`);
writeFileSync("CHANGELOG.md", changelog.slice(0, firstEntry) + changelogEntry(version, notes) + "\n" + changelog.slice(firstEntry));

pkg.version = version;
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
// Only the package's own two version fields in the lockfile; npm install would churn the rest.
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
lock.version = version;
if (lock.packages?.[""]) lock.packages[""].version = version;
writeFileSync("package-lock.json", JSON.stringify(lock, null, 2) + "\n");

for (const note of notes) rmSync(path.join("changes", note.name));
console.log(`release-prepare: ${version} — folded ${notes.map((note) => note.name).join(", ")}. Run npm run docs:generate, then the checks.`);
