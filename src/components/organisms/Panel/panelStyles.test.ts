import { describe, expect, it } from "vitest";
import { panelShellClasses } from "./panelStyles";

describe("Panel shell", () => {
  it("keeps 16px top pad on overlay chrome", () => {
    expect(panelShellClasses).toContain("pt-4");
    expect(panelShellClasses).not.toContain("pt-[2px]");
  });
});
