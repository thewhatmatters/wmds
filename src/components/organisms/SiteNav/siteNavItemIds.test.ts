import { describe, expect, it } from "vitest";
import { uniqueSiteNavItemIds } from "./siteNavItemIds";

describe("uniqueSiteNavItemIds", () => {
  it("leaves ids that are already unique as they are", () => {
    expect(uniqueSiteNavItemIds(["/menu", "/visit", "/contact"])).toEqual(["/menu", "/visit", "/contact"]);
  });

  it("gives each link to the same page its own id, in order", () => {
    expect(uniqueSiteNavItemIds(["/menu", "/visit", "/menu", "/visit", "/menu"])).toEqual([
      "/menu",
      "/visit",
      "/menu (2)",
      "/visit (2)",
      "/menu (3)",
    ]);
  });

  it("never hands out an id another item already holds", () => {
    const ids = uniqueSiteNavItemIds(["/menu", "/menu (2)", "/menu", "/menu"]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe("/menu");
    expect(ids[1]).toBe("/menu (2)");
  });
});
