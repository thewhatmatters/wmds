import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, mixSrgb } from "../../../lib/contrast";

/**
 * Buttons rule U6: a disabled button is dimmed, but its label keeps 3:1 against its own fill. The
 * whole button is drawn at the disabled opacity over the page, so label and fill are both mixed
 * toward the page colour.
 */
const styles = readFileSync(path.resolve(__dirname, "buttonStyles.ts"), "utf8");
const opacity = Number(styles.match(/aria-disabled:opacity-(\d+)/)?.[1]) / 100;

/** [label, fill or null for transparent] on each theme's page (`--color-background-body`). */
const themes = {
  light: {
    page: "#f8f8f8",
    roles: { primary: ["#fafafa", "#39485c"], secondary: ["#171717", "#f8f8f8"], ghost: ["#262626", null], destructive: ["#ffffff", "#a50c25"], inverse: ["#011272", "#ffffff"], outline: ["#171717", null] },
  },
  dark: {
    page: "#1b1b1b",
    roles: { primary: ["#fafaf8", "#5a6d85"], secondary: ["#fafafa", "#262626"], ghost: ["#ebebeb", null], destructive: ["#171717", "#ffc6c1"], inverse: ["#011272", "#ffffff"], outline: ["#fafafa", null] },
  },
  /** The inverse roles on the brand field (navy in both themes). */
  brandField: { page: "#011272", roles: { "inverse-outline": ["#ffffff", null] } },
  /** The brand-kit reference client (Foundations/Brand kit → Theme a client). */
  client: { page: "#f8f8f8", roles: { primary: ["#fff6ea", "#b33a1c"] } },
  clientDark: { page: "#1b1b1b", roles: { primary: ["#120d08", "#e86a3e"] } },
} as const;

describe("disabled button contrast (U6)", () => {
  it("dims, but not past 3:1", () => {
    expect(opacity).toBeGreaterThan(0.5);
    expect(opacity).toBeLessThan(1);
    expect(styles).toMatch(new RegExp(`(^|\\s)disabled:opacity-${opacity * 100}\\b`));
  });

  for (const [theme, { page, roles }] of Object.entries(themes)) {
    for (const [role, [label, fill]] of Object.entries(roles)) {
      it(`${theme} ${role}: label stays at 3:1 or more`, () => {
        const shownFill = mixSrgb(fill ?? page, opacity, page);
        const shownLabel = mixSrgb(label, opacity, page);
        expect(contrastRatio(shownLabel, shownFill)).toBeGreaterThanOrEqual(3);
      });
    }
  }
});
