/**
 * Release notes waiting in changes/*.md (one file per feature branch, so two branches never edit the
 * same lines of CHANGELOG.md or package.json). Shared by check-changelog.mjs and release-prepare.mjs.
 *
 * A change file:
 *   ---
 *   bump: patch | minor
 *   ---
 *   **One-line headline.**
 *
 *   - What changed, for apps.
 *
 *   ### Consumer actions
 *
 *   - None.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const bumps = ["patch", "minor", "major"];

/** Every change file in `dir` (README.md excluded), parsed. Throws with the file name on a bad one. */
export function readChangeNotes(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".md") && name !== "README.md")
    .sort()
    .map((name) => parseChangeNote(name, readFileSync(path.join(dir, name), "utf8")));
}

export function parseChangeNote(name, text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`changes/${name}: starts with a "---" block holding "bump: patch" or "bump: minor"`);
  const bump = match[1].match(/^bump:\s*(\S+)\s*$/m)?.[1];
  if (!bump || !bumps.includes(bump)) throw new Error(`changes/${name}: bump must be ${bumps.join(", ")}`);
  const [notes, actions] = match[2].split(/^### Consumer actions\s*$/m);
  if (!notes?.trim()) throw new Error(`changes/${name}: no release note above "### Consumer actions"`);
  if (actions === undefined || !actions.trim()) {
    throw new Error(`changes/${name}: needs a "### Consumer actions" section — write "- None." when there are none`);
  }
  return { name, bump, notes: notes.trim(), actions: actions.trim() };
}

/** The next version: the largest bump any change file asks for. */
export function nextVersion(current, notes) {
  const [major, minor, patch] = current.split(".").map(Number);
  const rank = Math.max(...notes.map((note) => bumps.indexOf(note.bump)));
  if (rank === 2) return `${major + 1}.0.0`;
  if (rank === 1) return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

/** One CHANGELOG entry for every change file: their notes in order, then one merged Consumer actions list. */
export function changelogEntry(version, notes) {
  const isNone = (line) => /^-\s*None\.?\s*$/i.test(line.trim());
  const actions = notes.flatMap((note) => note.actions.split("\n")).filter((line) => line.trim());
  const real = actions.filter((line) => !isNone(line));
  const actionLines = real.length ? real : ["- None."];
  return [`## ${version}`, "", notes.map((note) => note.notes).join("\n\n"), "", "### Consumer actions", "", ...actionLines, ""].join("\n");
}
