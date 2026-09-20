import { describe, expect, it } from "vitest";
import {
  cardLayoutHeaderEndClasses,
  cardLayoutShellBottomClasses,
  cardLayoutShellClasses,
  cardLayoutShellTopClasses,
} from "./cardStyles";

describe("Card.Header end slot", () => {
  it("keeps end trailing when start is omitted", () => {
    expect(cardLayoutHeaderEndClasses).toContain("ml-auto");
    expect(cardLayoutHeaderEndClasses).toContain("shrink-0");
  });
});

describe("Card layout shell density", () => {
  it("keeps gap on the shared shell and does not bake vertical pad", () => {
    expect(cardLayoutShellClasses).toContain("gap-3");
    expect(cardLayoutShellClasses).not.toContain("pt-");
    expect(cardLayoutShellClasses).not.toContain("pb-");
  });

  it("keeps 16px top when Header is present", () => {
    expect(cardLayoutShellTopClasses(true)).toBe("pt-4");
    expect(cardLayoutShellTopClasses()).toBe("pt-4");
  });

  it("densifies top to 2px when Header is omitted", () => {
    expect(cardLayoutShellTopClasses(false)).toBe("pt-[2px]");
  });

  it("keeps 16px bottom when Footer is present", () => {
    expect(cardLayoutShellBottomClasses(false)).toBe("pb-4");
    expect(cardLayoutShellBottomClasses()).toBe("pb-4");
  });

  it("densifies bottom to 2px when Body is terminal", () => {
    expect(cardLayoutShellBottomClasses(true)).toBe("pb-[2px]");
  });
});
