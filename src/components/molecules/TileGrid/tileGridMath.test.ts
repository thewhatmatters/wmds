import { describe, expect, it } from "vitest";
import { tileGridColumnCount, tileGridResolveColumns, tileGridRowSpan } from "./tileGridMath";

describe("tileGridResolveColumns", () => {
  it("defaults to one, two from sm, three from lg", () => {
    expect(tileGridResolveColumns()).toEqual({ base: 1, sm: 2, md: 2, lg: 3, xl: 3 });
  });

  it("uses one number at every breakpoint", () => {
    expect(tileGridResolveColumns(4)).toEqual({ base: 4, sm: 4, md: 4, lg: 4, xl: 4 });
  });

  it("lets a breakpoint left out keep the one below it", () => {
    expect(tileGridResolveColumns({ base: 2, md: 4 })).toEqual({ base: 2, sm: 2, md: 4, lg: 4, xl: 4 });
    expect(tileGridResolveColumns({ lg: 3 })).toEqual({ base: 1, sm: 1, md: 1, lg: 3, xl: 3 });
  });

  it("keeps counts whole and at least one", () => {
    expect(tileGridResolveColumns({ base: 0, sm: 2.6 })).toEqual({ base: 1, sm: 3, md: 3, lg: 3, xl: 3 });
  });
});

describe("tileGridRowSpan", () => {
  it("takes the row tracks a height needs, rounded up", () => {
    expect(tileGridRowSpan(400, 4)).toBe(100);
    expect(tileGridRowSpan(401, 4)).toBe(101);
    expect(tileGridRowSpan(0, 4)).toBe(1);
  });
});

describe("tileGridColumnCount", () => {
  it("counts the tracks in a computed template", () => {
    expect(tileGridColumnCount("285px 285px 285px")).toBe(3);
    expect(tileGridColumnCount("358px")).toBe(1);
    expect(tileGridColumnCount("none")).toBe(1);
    expect(tileGridColumnCount("")).toBe(1);
  });
});
