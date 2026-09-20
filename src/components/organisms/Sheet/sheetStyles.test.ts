import { describe, expect, it } from "vitest";
import { sheetPanelBaseClasses } from "./sheetStyles";

describe("Sheet panel shell", () => {
  it("keeps 16px top pad on overlay chrome", () => {
    expect(sheetPanelBaseClasses).toContain("pt-4");
    expect(sheetPanelBaseClasses).not.toContain("pt-[2px]");
  });
});
