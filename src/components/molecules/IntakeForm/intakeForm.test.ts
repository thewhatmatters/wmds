import { describe, expect, it } from "vitest";
import { intakeAboutEmpty, intakeDetailsMax, isIntakeAboutValid } from "./IntakeForm";

const valid = {
  name: "Jordan Lee",
  email: "jordan@example.com",
  company: "",
  details: "A calmer way to brief a new brand.",
};

describe("isIntakeAboutValid", () => {
  it("accepts name, email, and details without a company", () => {
    expect(isIntakeAboutValid(valid)).toBe(true);
  });

  it("rejects an empty name, a bad email, or empty details", () => {
    expect(isIntakeAboutValid({ ...valid, name: "  " })).toBe(false);
    expect(isIntakeAboutValid({ ...valid, email: "jordan" })).toBe(false);
    expect(isIntakeAboutValid({ ...valid, details: "" })).toBe(false);
    expect(isIntakeAboutValid(intakeAboutEmpty)).toBe(false);
  });

  it("rejects details past the counter", () => {
    expect(isIntakeAboutValid({ ...valid, details: "a".repeat(intakeDetailsMax + 1) })).toBe(false);
    expect(isIntakeAboutValid({ ...valid, details: "a".repeat(intakeDetailsMax) })).toBe(true);
  });
});
