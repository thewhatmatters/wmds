import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * One name per line, sorted, in each tier of src/package.manifest.ts: two branches adding components then
 * touch different lines and rarely conflict (AGENTS.md → Releases).
 */
const source = readFileSync(new URL("../package.manifest.ts", import.meta.url), "utf8");

describe("package manifest format", () => {
  for (const tier of ["atoms", "molecules", "organisms"]) {
    it(`${tier}: one name per line, sorted`, () => {
      const block = source.match(new RegExp(`const ${tier} = \\[\\n([\\s\\S]*?)\\n\\] as const;`))?.[1];
      expect(block, `${tier} is not a one-name-per-line array`).toBeDefined();
      const lines = block!.split("\n");
      for (const line of lines) expect(line).toMatch(/^ {2}"[A-Za-z]+",$/);
      const names = lines.map((line) => line.trim().slice(1, -2));
      expect(names).toEqual([...names].sort());
    });
  }
});
