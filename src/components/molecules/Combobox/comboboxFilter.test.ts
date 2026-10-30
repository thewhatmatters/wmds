import { describe, expect, it } from "vitest";
import { comboboxResultsMessage, filterComboboxOptions } from "./comboboxFilter";

const fonts = [
  { label: "Open Sans" },
  { label: "Inter" },
  { label: "Source Sans 3", keywords: ["sans"] },
  { label: "Plus Jakarta Sans" },
  { label: "Roboto Mono", keywords: ["monospace"] },
  { label: "Inter Tight" },
  { label: "Lato", keywords: ["humanist"] },
];

const labels = (query: string) => filterComboboxOptions(fonts, query).map((font) => font.label);

describe("filterComboboxOptions", () => {
  it("returns every option for an empty query", () => {
    expect(labels("  ")).toHaveLength(fonts.length);
  });

  it("ranks starts-with, then word starts-with, then contains, keeping order within a rank", () => {
    expect(labels("inter")).toEqual(["Inter", "Inter Tight"]);
    expect(labels("sans")).toEqual(["Open Sans", "Source Sans 3", "Plus Jakarta Sans"]);
    expect(labels("o")).toEqual(["Open Sans", "Source Sans 3", "Roboto Mono", "Lato"]);
  });

  it("is case-insensitive and matches keywords after labels", () => {
    expect(labels("MONO")).toEqual(["Roboto Mono"]);
    expect(labels("human")).toEqual(["Lato"]);
  });

  it("returns nothing when nothing matches", () => {
    expect(labels("zzz")).toEqual([]);
  });
});

describe("comboboxResultsMessage", () => {
  it("says the count, the cap and the empty text", () => {
    expect(comboboxResultsMessage(0, 0, "No fonts match")).toBe("No fonts match");
    expect(comboboxResultsMessage(1, 1, "x")).toBe("1 result");
    expect(comboboxResultsMessage(1800, 50, "x")).toBe("1,800 results, first 50 shown. Keep typing to narrow.");
  });
});
