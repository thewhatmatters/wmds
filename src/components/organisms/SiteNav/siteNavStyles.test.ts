import { describe, expect, it } from "vitest";
import { cn } from "../../../lib/cn";
import { classCascadeConflict } from "../../../lib/displayCascade";
import {
  siteNavBarBaseClasses,
  siteNavBarCompactGlassClasses,
  siteNavBarCompactLayoutClasses,
  siteNavBarStateClasses,
  siteNavMiddleHugResponsiveClasses,
  siteNavMiddleResponsiveClasses,
  siteNavLinkClasses,
  siteNavLinkListClasses,
  siteNavMobileTriggerClasses,
  siteNavTriggerClasses,
} from "./siteNavStyles";

describe("desktop links on touch screens", () => {
  it("gives links and menu triggers a 44px tap layer on coarse pointers, without growing the 36px pill", () => {
    for (const classes of [siteNavLinkClasses, siteNavTriggerClasses]) {
      expect(classes).toContain("relative");
      expect(classes).toContain("pointer-coarse:after:-inset-y-1");
      expect(classes).toContain("pointer-coarse:after:inset-x-0");
      expect(classes).toContain("pointer-coarse:after:content-['']");
      expect(classes).not.toMatch(/(^|\s)min-h-11(\s|$)/);
    }
  });

  it("lets the link list show that layer: 4px of padding above and below, pulled back by a margin", () => {
    expect(siteNavLinkListClasses).toContain("pointer-coarse:py-1");
    expect(siteNavLinkListClasses).toContain("pointer-coarse:-my-1");
  });
});

describe("compact pill fill", () => {
  it("is the elevation surface unless asked for glass, which frosts it with Card's glass knobs", () => {
    expect(siteNavBarStateClasses.compact).toContain("bg-elevation-surface");
    expect(siteNavBarStateClasses.compact).not.toContain("--card-glass-tint");
    expect(siteNavBarCompactGlassClasses).toContain("var(--color-background-surface)_var(--card-glass-tint,var(--card-glass-tint-default,70%))");
    expect(siteNavBarCompactGlassClasses).toContain("backdrop-blur-[var(--card-glass-blur,12px)]");
    expect(siteNavBarCompactGlassClasses).not.toContain("bg-elevation-surface");
    // The same shell: radius, hairline edge, padding and shadow.
    for (const shell of ["rounded-[var(--radius-control)]", "border-elevation-edge", "p-1.5", "shadow-soft-sm"]) {
      expect(siteNavBarStateClasses.compact).toContain(shell);
      expect(siteNavBarCompactGlassClasses).toContain(shell);
    }
    // Solid for visitors who ask for less transparency.
    expect(siteNavBarCompactGlassClasses).toContain("[@media(prefers-reduced-transparency:reduce)]:bg-surface");
    expect(classCascadeConflict(cn(siteNavBarBaseClasses, siteNavBarCompactGlassClasses, siteNavBarCompactLayoutClasses.hug))).toBeNull();
  });
});

describe("compact hug width", () => {
  it("keeps a single width on the hug pill and on the grid pill", () => {
    const hug = cn(
      siteNavBarBaseClasses,
      siteNavBarStateClasses.compact,
      siteNavBarCompactLayoutClasses.hug,
    );
    const grid = cn(
      siteNavBarBaseClasses,
      siteNavBarStateClasses.compact,
      siteNavBarCompactLayoutClasses.grid,
    );

    expect(hug).toContain("w-max");
    expect(hug).not.toMatch(/(?:^|\s)!?w-full(?:\s|$)/);
    expect(grid).toMatch(/(?:^|\s)w-full(?:\s|$)/);
    expect(grid).not.toContain("w-max");
    expect(classCascadeConflict(hug)).toBeNull();
    expect(classCascadeConflict(grid)).toBeNull();
  });

  it("sizes the responsive hug middle to its content", () => {
    expect(siteNavMiddleHugResponsiveClasses).toContain("max-md:hidden");
    expect(siteNavMiddleHugResponsiveClasses).toContain("md:flex");
    expect(siteNavMiddleHugResponsiveClasses).not.toMatch(/(?:^|\s)w-full(?:\s|$)/);
    expect(siteNavMiddleHugResponsiveClasses).not.toMatch(/(?:^|\s)hidden(?:\s|$)/);
    expect(siteNavMiddleHugResponsiveClasses).not.toMatch(/(?:^|\s)flex(?:\s|$)/);
    expect(classCascadeConflict(siteNavMiddleHugResponsiveClasses)).toBeNull();
    expect(siteNavMiddleResponsiveClasses).toContain("w-full");
    expect(classCascadeConflict(`inline-flex ${siteNavMobileTriggerClasses}`)).toBeNull();
  });
});
