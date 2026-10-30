import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Breakpoints rule P5: WMDS steps layout only at `md` (768) and `lg` (1024); `xl` is the container's.
 * No `sm:` (640) and no one-off `min-[…]:` / `max-[…]:` breakpoints, in shipped code or in Show code.
 */
const src = path.resolve(__dirname, "..");

describe("breakpoints (P5)", () => {
  it("uses md / lg only: no sm: and no one-off min-[…] / max-[…] variants", () => {
    const offenders: string[] = [];
    for (const file of globSync("**/*.{ts,tsx,css}", { cwd: src })) {
      if (/\.test\./.test(file)) continue;
      readFileSync(path.join(src, file), "utf8").split("\n").forEach((line, index) => {
        if (/(?<=["'`\s])(?:sm|2xl):[a-z!\[-]|(?<=["'`\s])(?:min|max)-\[[\d.]+(?:px|rem)\]:/.test(line)) offenders.push(`${file}:${index + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});
