import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The release flow (AGENTS.md → Releases): feature branches add changes/<topic>.md; the release step folds
 * them into one CHANGELOG entry and bumps the version once. Runs the real scripts in a scratch folder.
 */
const scripts = path.resolve(import.meta.dirname, "../../scripts");

function scratch(changes: Record<string, string>) {
  const dir = mkdtempSync(path.join(tmpdir(), "wmds-release-"));
  writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "x", version: "0.4.42" }, null, 2) + "\n");
  writeFileSync(
    path.join(dir, "package-lock.json"),
    JSON.stringify({ name: "x", version: "0.4.42", packages: { "": { name: "x", version: "0.4.42" } } }, null, 2) + "\n",
  );
  writeFileSync(path.join(dir, "CHANGELOG.md"), "# Changelog\n\nIntro.\n\n## 0.4.42\n\n**Notice.**\n\n### Consumer actions\n\n- None.\n");
  mkdirSync(path.join(dir, "changes"));
  writeFileSync(path.join(dir, "changes", "README.md"), "# How to\n");
  for (const [name, text] of Object.entries(changes)) writeFileSync(path.join(dir, "changes", name), text);
  return dir;
}

const run = (script: string, cwd: string, ...args: string[]) =>
  spawnSync(process.execPath, [path.join(scripts, script), ...args], { cwd, encoding: "utf8" });

const note = (bump: string, headline: string, action = "- None.") =>
  `---\nbump: ${bump}\n---\n**${headline}**\n\n- Detail.\n\n### Consumer actions\n\n${action}\n`;

describe("release:prepare", () => {
  it("folds every change file into one entry, bumps once, and deletes them", () => {
    const dir = scratch({ "combobox.md": note("patch", "Combobox."), "notice.md": note("patch", "Notice.", "- Swap the red block for `<Notice>`.") });
    const result = run("release-prepare.mjs", dir);
    expect(result.status, result.stderr).toBe(0);

    const changelog = readFileSync(path.join(dir, "CHANGELOG.md"), "utf8");
    expect(changelog.indexOf("## 0.4.43")).toBeLessThan(changelog.indexOf("## 0.4.42"));
    const entry = changelog.slice(changelog.indexOf("## 0.4.43"), changelog.indexOf("## 0.4.42"));
    expect(entry).toContain("**Combobox.**");
    expect(entry).toContain("**Notice.**");
    // One Consumer actions list; "None." drops out when another note has a real step.
    expect(entry.match(/### Consumer actions/g)).toHaveLength(1);
    expect(entry).toContain("- Swap the red block");
    expect(entry).not.toContain("- None.");

    expect(JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8")).version).toBe("0.4.43");
    const lock = JSON.parse(readFileSync(path.join(dir, "package-lock.json"), "utf8"));
    expect([lock.version, lock.packages[""].version]).toEqual(["0.4.43", "0.4.43"]);
    expect(existsSync(path.join(dir, "changes", "combobox.md"))).toBe(false);
    expect(existsSync(path.join(dir, "changes", "README.md"))).toBe(true);
    expect(run("check-changelog.mjs", dir).status).toBe(0);
  });

  it("takes the largest bump, or the version it's given", () => {
    const minor = scratch({ "a.md": note("patch", "A."), "b.md": note("minor", "B.") });
    expect(run("release-prepare.mjs", minor).status).toBe(0);
    expect(JSON.parse(readFileSync(path.join(minor, "package.json"), "utf8")).version).toBe("0.5.0");

    const named = scratch({ "a.md": note("patch", "A.") });
    expect(run("release-prepare.mjs", named, "0.4.45").status).toBe(0);
    expect(readFileSync(path.join(named, "CHANGELOG.md"), "utf8")).toContain("## 0.4.45\n");
  });

  it("refuses an empty changes/ and a malformed change file", () => {
    expect(run("release-prepare.mjs", scratch({})).stderr).toContain("nothing to release");
    const bad = scratch({ "x.md": "**No front matter.**\n" });
    const check = run("check-changelog.mjs", bad);
    expect(check.status).toBe(1);
    expect(check.stderr).toContain("changes/x.md");
    const noActions = scratch({ "y.md": "---\nbump: patch\n---\n**Y.**\n" });
    expect(run("check-changelog.mjs", noActions).stderr).toContain("Consumer actions");
  });
});
