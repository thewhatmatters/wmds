import { describe, expect, it } from "vitest";
import { cn } from "../../../lib/cn";
import { classCascadeConflict } from "../../../lib/displayCascade";
import {
  siteNavBarBaseClasses,
  siteNavBarCompactLayoutClasses,
  siteNavBarStateClasses,
  siteNavMiddleHugResponsiveClasses,
  siteNavMiddleResponsiveClasses,
  siteNavMobileTriggerClasses,
} from "./siteNavStyles";

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
