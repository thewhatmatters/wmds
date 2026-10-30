import { afterEach, describe, expect, it, vi } from "vitest";
import { warnStatusWithoutMessage } from "./InputStatusBanner";

/** Errors and validation V10: an error or a warning always has a message; a success tick may stand alone. */
describe("warnStatusWithoutMessage (V10)", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  afterEach(() => warn.mockClear());

  it("warns for an error or warning with no message", () => {
    warnStatusWithoutMessage("Input", "error", undefined);
    warnStatusWithoutMessage("Input", "warning", "");
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[0][0]).toContain('status="error"');
  });

  it("stays quiet with a message, with no status, and for a success tick", () => {
    warnStatusWithoutMessage("Input", "error", "Enter your name");
    warnStatusWithoutMessage("Input", undefined, undefined);
    warnStatusWithoutMessage("Input", "success", undefined);
    expect(warn).not.toHaveBeenCalled();
  });
});
