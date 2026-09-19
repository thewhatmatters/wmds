import { describe, expect, it } from "vitest";
import { cardLayoutHeaderEndClasses } from "./cardStyles";

describe("Card.Header end slot", () => {
  it("keeps end trailing when start is omitted", () => {
    expect(cardLayoutHeaderEndClasses).toContain("ml-auto");
    expect(cardLayoutHeaderEndClasses).toContain("shrink-0");
  });
});
