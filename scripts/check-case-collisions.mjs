/**
 * Fail when two repo paths collide on a case-insensitive filesystem.
 *
 * Full paths that differ only by case cannot both exist on macOS.
 * Extensionless imports also collide when only the extension differs:
 * `RiveHand.tsx` and `riveHand.ts` both resolve as `RiveHand`.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const listed = execFileSync("git", ["ls-files", "-z"], { cwd: root });
const files = listed.toString("utf8").split("\0").filter(Boolean);

const paths = new Set(files);
for (const file of files) {
  let dir = path.posix.dirname(file);
  while (dir && dir !== ".") {
    paths.add(dir);
    dir = path.posix.dirname(dir);
  }
}

function groupsOf(entries, keyFn) {
  const groups = new Map();
  for (const entry of entries) {
    const key = keyFn(entry);
    const group = groups.get(key);
    if (group) {
      group.push(entry);
    } else {
      groups.set(key, [entry]);
    }
  }
  return [...groups.values()].filter((group) => group.length > 1);
}

const pathHits = groupsOf([...paths], (entry) => entry.toLowerCase());
const moduleHits = groupsOf(files, (file) => {
  const parsed = path.posix.parse(file);
  return path.posix.join(parsed.dir, parsed.name).toLowerCase();
});

const seen = new Set(pathHits.map((group) => group.slice().sort().join("\0")));
const importHits = moduleHits.filter((group) => !seen.has(group.slice().sort().join("\0")));

if (pathHits.length > 0 || importHits.length > 0) {
  if (pathHits.length > 0) {
    console.error("case collision: these paths are equal ignoring case:");
    for (const group of pathHits) {
      console.error(`  ${group.join("\n  ")}`);
    }
  }
  if (importHits.length > 0) {
    console.error("case collision: extensionless imports resolve to more than one file:");
    for (const group of importHits) {
      console.error(`  ${group.join("\n  ")}`);
    }
  }
  process.exit(1);
}

console.log(`case collisions: none (${files.length} files)`);
