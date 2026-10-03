import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { rfpSubmittedCopySource } from "./RfpSubmittedExample";

const exampleSource = readFileSync(join(import.meta.dirname, "RfpSubmittedExample.tsx"), "utf8");

function slice(source: string, start: string, end: string): string {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  if (from < 0 || to < 0) {
    throw new Error(`Missing ${start} … ${end}`);
  }
  return source.slice(from, to).trim();
}

describe("RFP submitted show code", () => {
  it("is the live confirmation flow with package imports", () => {
    const live = slice(exampleSource, "const projectOptions", "export function RfpSubmittedPage")
      .replace("export function RfpFlow()", "function RfpFlow()");
    const shown = slice(rfpSubmittedCopySource, "const projectOptions", "export function RfpSubmitted");
    expect(shown).toBe(live);

    const livePage = slice(exampleSource, "export function RfpSubmittedPage()", "export const rfpSubmittedCopySource")
      .replace("export function RfpSubmittedPage()", "export function RfpSubmitted()");
    const shownPage = rfpSubmittedCopySource.slice(rfpSubmittedCopySource.indexOf("export function RfpSubmitted()")).trim();
    expect(shownPage).toBe(livePage.trim());
    expect(rfpSubmittedCopySource).not.toContain("ExampleGridControls");
    expect(rfpSubmittedCopySource).not.toContain("submitRef");
    expect(rfpSubmittedCopySource).toContain('from "@whatmatters/wmds"');
  });
});
