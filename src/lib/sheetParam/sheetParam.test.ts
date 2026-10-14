import { describe, expect, it } from "vitest";
import { readSheetParam, withSheetParam } from "./sheetParam";

describe("readSheetParam", () => {
  it("reads kind and id", () => {
    expect(readSheetParam("/approvals?sheet=approval&id=maya-chen")).toEqual({
      kind: "approval",
      id: "maya-chen",
    });
  });

  it("reads an absolute URL", () => {
    expect(readSheetParam("https://example.com/a?sheet=idea&id=7#x")).toEqual({ kind: "idea", id: "7" });
  });

  it("returns nulls when either is missing or empty", () => {
    const none = { kind: null, id: null };
    expect(readSheetParam("/approvals")).toEqual(none);
    expect(readSheetParam("/approvals?sheet=approval")).toEqual(none);
    expect(readSheetParam("/approvals?id=1")).toEqual(none);
    expect(readSheetParam("/approvals?sheet=&id=")).toEqual(none);
  });
});

describe("withSheetParam", () => {
  it("sets the pair and keeps the rest", () => {
    expect(withSheetParam("/approvals?tab=open#top", "maya-chen", "approval")).toBe(
      "/approvals?tab=open&sheet=approval&id=maya-chen#top",
    );
  });

  it("replaces an existing pair", () => {
    expect(withSheetParam("/a?sheet=approval&id=1", "2", "approval")).toBe("/a?sheet=approval&id=2");
  });

  it("removes the pair for null and leaves a clean path", () => {
    expect(withSheetParam("/a?sheet=approval&id=1", null, "approval")).toBe("/a");
    expect(withSheetParam("/a?tab=open&sheet=approval&id=1", null, "approval")).toBe("/a?tab=open");
  });

  it("encodes ids", () => {
    expect(withSheetParam("/a", "a b&c", "approval")).toBe("/a?sheet=approval&id=a+b%26c");
    expect(readSheetParam(withSheetParam("/a", "a b&c", "approval")).id).toBe("a b&c");
  });

  it("keeps an absolute URL absolute", () => {
    expect(withSheetParam("https://example.com/a", "1", "idea")).toBe("https://example.com/a?sheet=idea&id=1");
  });
});
