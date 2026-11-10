import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readmeSection, readmeSnippets } from "./readmeSnippets";

const readme = readFileSync(path.resolve(import.meta.dirname, "../../README.md"), "utf8");

describe("Start here reads the README", () => {
  it("finds the pitch, the install command and a short quickstart", () => {
    const { pitch, install, quickstart } = readmeSnippets(readme);
    expect(pitch).toMatch(/^React components/);
    expect(install).toMatch(/^npm install @thewhatmatters\/wmds /);
    expect(quickstart).toContain('import "@thewhatmatters/wmds/styles.css";');
    expect(quickstart).toContain('from "@thewhatmatters/wmds"');
    expect(quickstart.split("\n").length).toBeLessThanOrEqual(15);
  });

  it("fails loudly when a section moves", () => {
    expect(() => readmeSection("# x\n\n## Other\n", "Install")).toThrow(/no "## Install"/);
    expect(() => readmeSection("# x\n\n## Install\n\ntext only\n", "Install")).toThrow(/no code block/);
  });
});
