import { describe, expect, it } from "vitest";
import {
  countFilterOptions,
  filterFacetValues,
  filterSelectionCount,
  matchesFilterSelection,
  type FilterPanelGroup,
} from "./filterSelection";

const groups: FilterPanelGroup[] = [
  { id: "topic", label: "Topic", options: [{ value: "guides", label: "Guides" }, { value: "notes", label: "Notes" }] },
  { id: "year", label: "Year", options: [{ value: "2026", label: "2026" }, { value: "2025", label: "2025" }] },
];

const items = [
  { facets: { topic: "guides", year: "2026" } },
  { facets: { topic: ["guides", "notes"], year: "2026" } },
  { facets: { topic: "notes", year: "2025" } },
];

describe("filter selection", () => {
  it("reads one option or several as a list", () => {
    expect(filterFacetValues({ topic: "guides" }, "topic")).toEqual(["guides"]);
    expect(filterFacetValues({ topic: ["guides", "notes"] }, "topic")).toEqual(["guides", "notes"]);
    expect(filterFacetValues({}, "topic")).toEqual([]);
  });

  it("shows everything when nothing is on", () => {
    expect(items.filter((item) => matchesFilterSelection(item.facets, {}))).toHaveLength(3);
    expect(items.filter((item) => matchesFilterSelection(item.facets, { topic: [] }))).toHaveLength(3);
  });

  it("treats options in a group as alternatives and groups as combined", () => {
    expect(items.filter((item) => matchesFilterSelection(item.facets, { topic: ["guides"] }))).toHaveLength(2);
    expect(items.filter((item) => matchesFilterSelection(item.facets, { topic: ["guides", "notes"] }))).toHaveLength(3);
    expect(items.filter((item) => matchesFilterSelection(item.facets, { topic: ["guides"], year: ["2025"] }))).toHaveLength(0);
  });

  it("counts the options on", () => {
    expect(filterSelectionCount({})).toBe(0);
    expect(filterSelectionCount({ topic: ["guides", "notes"], year: ["2025"] })).toBe(3);
  });

  it("counts each option over all items and says what it counts", () => {
    const counted = countFilterOptions(groups, items, (count) => (count === 1 ? "1 post" : `${count} posts`));
    expect(counted[0].options).toEqual([
      { value: "guides", label: "Guides", count: 2, countLabel: "2 posts" },
      { value: "notes", label: "Notes", count: 2, countLabel: "2 posts" },
    ]);
    expect(counted[1].options[1]).toEqual({ value: "2025", label: "2025", count: 1, countLabel: "1 post" });
    expect(countFilterOptions(groups, items)[0].options[0]).toMatchObject({ count: 2, countLabel: undefined });
  });
});
