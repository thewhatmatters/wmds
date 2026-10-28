import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Eyebrow rule E3: capitals get 0.08–0.12em letter-spacing. Every source string that sets
 * `uppercase` must carry tracking in that range (or use `type-eyebrow`, which does).
 */
const src = path.resolve(__dirname, "..");
const read = (file: string) => readFileSync(path.join(src, file), "utf8");
/** Initials in an avatar are a monogram, not set text. */
const exempt = ["components/atoms/Avatar/avatarStyles.ts"];

describe("caps tracking (E3)", () => {
  it("type-eyebrow tracks its capitals 0.08–0.12em", () => {
    const value = read("theme/typography.css").match(/--text-eyebrow-tracking:\s*([\d.]+)em/)?.[1];
    expect(Number(value)).toBeGreaterThanOrEqual(0.08);
    expect(Number(value)).toBeLessThanOrEqual(0.12);
  });

  it("every uppercase class string tracks 0.08–0.12em", () => {
    const files = globSync("**/*.{ts,tsx}", { cwd: src }).filter((file) => !/\.test\./.test(file) && !exempt.includes(file));
    const offenders: string[] = [];
    for (const file of files) {
      for (const [index, line] of read(file).split("\n").entries()) {
        // A class list: the quoted string holds `uppercase` beside a type, font, text or tracking utility.
        const classList = line.match(/["'`]([^"'`]*\buppercase\b[^"'`]*)["'`]/)?.[1];
        if (classList == null || !/(^|\s)!?(type|font|text|tracking)-/.test(classList)) continue;
        const tracking = line.match(/tracking-\[([\d.]+)em\]/)?.[1];
        const ok = /type-eyebrow/.test(line) || (tracking != null && Number(tracking) >= 0.08 && Number(tracking) <= 0.12);
        if (!ok) offenders.push(`${file}:${index + 1}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
