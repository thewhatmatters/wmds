import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { auditClassCascade, classCascadeConflict, type ClassSource } from "./displayCascade";

const REPO_ROOT = join(import.meta.dirname, "..", "..");
const SRC_ROOT = join(REPO_ROOT, "src");

function walkSources(dir: string, files: ClassSource[] = []): ClassSource[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walkSources(path, files);
      continue;
    }
    if (!path.endsWith(".ts") && !path.endsWith(".tsx")) continue;
    if (path.endsWith(".test.ts") || path.endsWith(".test.tsx")) continue;
    const repoPath = relative(REPO_ROOT, path).replace(/\\/g, "/");
    files.push({ path: repoPath, source: readFileSync(path, "utf8") });
  }
  return files;
}

describe("classCascadeConflict", () => {
  it("flags a base display utility paired with hidden", () => {
    expect(classCascadeConflict("inline-flex size-3.5 hidden md:inline-flex")?.kind).toBe("display");
    expect(classCascadeConflict("flex min-w-0 hidden md:flex")?.kind).toBe("display");
    expect(classCascadeConflict("hidden md:flex")?.reason).toMatch(/hidden/);
    expect(classCascadeConflict("inline-flex md:hidden")?.kind).toBe("display");
  });

  it("allows a responsive pair that does not use the unprefixed hidden or display class", () => {
    expect(classCascadeConflict("max-md:hidden md:inline-flex size-3.5")).toBeNull();
    expect(classCascadeConflict("max-md:hidden md:flex min-w-0 w-full")).toBeNull();
    expect(classCascadeConflict("inline-flex md:!hidden")).toBeNull();
    expect(classCascadeConflict("relative hidden h-svh motion-reduce:!block")).toBeNull();
  });

  it("flags two unprefixed widths and ignores max-width or important overrides", () => {
    expect(classCascadeConflict("w-max w-full")?.kind).toBe("width");
    expect(classCascadeConflict("mx-auto w-max max-w-full")).toBeNull();
    expect(classCascadeConflict("w-max max-w-none")).toBeNull();
    expect(classCascadeConflict("w-max motion-reduce:!w-full")).toBeNull();
    expect(classCascadeConflict("flex overflow-hidden")).toBeNull();
  });
});

describe("auditClassCascade", () => {
  it("flags an IconButton className that loses to the control's inline-flex", () => {
    const source = `
      export const triggerClasses = "md:hidden";
      export function Demo() {
        return <IconButton className={triggerClasses} aria-label="Open menu" />;
      }
    `;
    const hits = auditClassCascade([{ path: "src/fixture.tsx", source }]);
    expect(hits.map((hit) => hit.reason).join(" ")).toMatch(/hidden/);
  });

  it("allows an important hidden variant on IconButton", () => {
    const source = `
      export const triggerClasses = "md:!hidden";
      export function Demo() {
        return <IconButton className={triggerClasses} aria-label="Open menu" />;
      }
    `;
    expect(auditClassCascade([{ path: "src/fixture.tsx", source }])).toEqual([]);
  });
});

describe("display cascade audit", () => {
  it("finds no order-dependent display or width pair under src", () => {
    const hits = auditClassCascade(walkSources(SRC_ROOT));
    expect(hits, hits.map((hit) => `${hit.path}: ${hit.reason}\n  ${hit.className}`).join("\n\n")).toEqual(
      [],
    );
  });
});
