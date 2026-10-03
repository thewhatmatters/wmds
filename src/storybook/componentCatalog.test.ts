import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { packageManifest } from "../package.manifest";
import { componentCatalog, componentCategories, storybookDocsPath } from "./componentCatalog";

const srcDir = path.resolve(__dirname, "..");

function storyTitles(): Set<string> {
  const titles = new Set<string>();
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const file = path.join(dir, name);
      if (statSync(file).isDirectory()) walk(file);
      else if (/\.stories\.tsx?$|\.mdx$/.test(name)) {
        const source = readFileSync(file, "utf8");
        // Every `title: "…"` in the file; story args can carry other titles, which is harmless here.
        for (const match of source.matchAll(/^\s*title:\s*"([^"]+)"|<Meta title="([^"]+)"/gm)) {
          titles.add(match[1] ?? match[2]);
        }
      }
    }
  };
  walk(srcDir);
  return titles;
}

describe("componentCatalog", () => {
  it("lists every shipped and planned export exactly once", () => {
    const names = componentCatalog.map((entry) => entry.name).sort();
    const expected = [...packageManifest.componentExports, ...packageManifest.plannedExports].sort();
    expect(names).toEqual(expected);
  });

  it("marks planned exports and only those", () => {
    const planned = componentCatalog.filter((entry) => entry.planned).map((entry) => entry.name).sort();
    expect(planned).toEqual([...packageManifest.plannedExports].sort());
  });

  it("uses a known category for every entry and leaves no category empty", () => {
    for (const entry of componentCatalog) expect(componentCategories).toContain(entry.category);
    for (const category of componentCategories) {
      expect(componentCatalog.some((entry) => entry.category === category)).toBe(true);
    }
  });

  it("links every shipped export to a Components story title that exists", () => {
    const titles = storyTitles();
    for (const entry of componentCatalog.filter((item) => !item.planned)) {
      expect(entry.title, entry.name).toMatch(/^Components\//);
      expect(titles.has(entry.title!), `${entry.name} → ${entry.title}`).toBe(true);
    }
  });

  it("builds manager docs paths from titles", () => {
    expect(storybookDocsPath("Components/Button/IconButton")).toBe("/docs/components-button-iconbutton--docs");
  });
});
