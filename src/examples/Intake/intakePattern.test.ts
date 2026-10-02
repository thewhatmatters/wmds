import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { canContinueIntake } from "./IntakePattern";
import { intakeAboutEmpty } from "../../components/molecules/IntakeForm/IntakeForm";
import { intakePatternCopySource } from "./IntakePattern";

const exampleSource = readFileSync(join(import.meta.dirname, "IntakePattern.tsx"), "utf8");

function slice(source: string, start: string, end: string): string {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  if (from < 0 || to < 0) {
    throw new Error(`Missing ${start} … ${end}`);
  }
  return source.slice(from, to).trim();
}

const about = {
  name: "Jordan Lee",
  email: "jordan@northwind.com",
  company: "Northwind",
  url: "https://northwind.example",
  details: "A calmer brief.",
};

describe("intake pattern", () => {
  it("keeps Continue off until the step is valid, and off on the calendar step", () => {
    expect(
      canContinueIntake({ step: 1, needs: [], budget: null, about: intakeAboutEmpty }),
    ).toBe(false);
    expect(
      canContinueIntake({ step: 1, needs: ["brand"], budget: null, about: intakeAboutEmpty }),
    ).toBe(true);
    expect(
      canContinueIntake({ step: 2, needs: ["brand"], budget: null, about: intakeAboutEmpty }),
    ).toBe(false);
    expect(
      canContinueIntake({ step: 2, needs: ["brand"], budget: "unsure", about: intakeAboutEmpty }),
    ).toBe(true);
    expect(
      canContinueIntake({ step: 3, needs: ["brand"], budget: "unsure", about: intakeAboutEmpty }),
    ).toBe(false);
    expect(
      canContinueIntake({ step: 3, needs: ["brand"], budget: "unsure", about }),
    ).toBe(true);
    expect(canContinueIntake({ step: 4, needs: ["brand"], budget: "unsure", about })).toBe(false);
  });

  it("mirrors the live flow in Show code", () => {
    const live = slice(exampleSource, "export const intakeNeeds", "export const intakePatternCopySource");
    const shown = intakePatternCopySource
      .slice(intakePatternCopySource.indexOf("export const intakeNeeds"))
      .trim();
    expect(shown).toBe(live);
    expect(intakePatternCopySource).toContain('from "@whatmatters/wmds"');
    expect(intakePatternCopySource).toContain("IntakeConfirmation");
    expect(intakePatternCopySource).toContain("ConfettiProvider");
    expect(intakePatternCopySource).not.toContain("ExampleGridControls");
  });
});
