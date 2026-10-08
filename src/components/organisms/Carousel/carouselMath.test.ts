import { describe, expect, it } from "vitest";
import {
  carouselMaxScroll,
  carouselNearestSnap,
  carouselOverflows,
  carouselOverscrollOffset,
  carouselProgress,
  carouselProgressAtPointer,
  carouselSnapPoints,
  carouselStep,
  carouselThumbMinWidth,
  carouselThumbShare,
} from "./carouselMath";

describe("carouselMath", () => {
  it("measures how far the row can scroll", () => {
    expect(carouselMaxScroll(400, 1000)).toBe(600);
    expect(carouselMaxScroll(400, 300)).toBe(0);
    expect(carouselOverflows(400, 1000)).toBe(true);
    expect(carouselOverflows(400, 400.5)).toBe(false);
  });

  it("rests on each item's leading edge and caps the last ones at the end of the row", () => {
    // Four 300px items with a 20px gap in a 700px row: 1260px of content, 560px of travel.
    expect(carouselSnapPoints([0, 320, 640, 960], 560)).toEqual([0, 320, 560]);
    expect(carouselSnapPoints([640, 0, 320], 2000)).toEqual([0, 320, 640]);
    expect(carouselSnapPoints([], 0)).toEqual([0]);
    expect(carouselSnapPoints([0, 320], 0)).toEqual([0]);
  });

  it("finds the nearest resting place", () => {
    const points = [0, 320, 560];
    expect(carouselNearestSnap(points, 100)).toBe(0);
    expect(carouselNearestSnap(points, 200)).toBe(320);
    expect(carouselNearestSnap(points, 9999)).toBe(560);
    expect(carouselNearestSnap(points, -50)).toBe(0);
  });

  it("steps one item and stops at either end", () => {
    const points = [0, 320, 560];
    expect(carouselStep(points, 0, 1)).toBe(320);
    expect(carouselStep(points, 320, 1)).toBe(560);
    expect(carouselStep(points, 560, 1)).toBe(560);
    expect(carouselStep(points, 560, -1)).toBe(320);
    expect(carouselStep(points, 0, -1)).toBe(0);
    // Between two items, a step lands on the next edge, not one past it.
    expect(carouselStep(points, 100, 1)).toBe(320);
    expect(carouselStep(points, 400, -1)).toBe(320);
    // A sub-pixel scroll position does not count as past an edge.
    expect(carouselStep(points, 319.6, 1)).toBe(560);
  });

  it("reports progress from 0 to 1", () => {
    expect(carouselProgress(0, 560)).toBe(0);
    expect(carouselProgress(280, 560)).toBe(0.5);
    expect(carouselProgress(600, 560)).toBe(1);
    expect(carouselProgress(10, 0)).toBe(0);
  });

  it("sizes the filled part to the share of the row in view", () => {
    expect(carouselThumbShare(700, 1400, 240)).toBe(0.5);
    expect(carouselThumbShare(700, 700, 240)).toBe(1);
    // A long row keeps a grabbable filled part.
    expect(carouselThumbShare(400, 40000, 240)).toBe(carouselThumbMinWidth / 240);
    expect(carouselThumbShare(0, 0, 0)).toBe(1);
  });

  it("centers the filled part on a press on the track", () => {
    expect(carouselProgressAtPointer(120, 240, 60)).toBe(0.5);
    expect(carouselProgressAtPointer(0, 240, 60)).toBe(0);
    expect(carouselProgressAtPointer(240, 240, 60)).toBe(1);
    expect(carouselProgressAtPointer(100, 240, 240)).toBe(0);
  });

  it("follows an overscroll at a fraction of the pointer", () => {
    expect(carouselOverscrollOffset(0)).toBe(0);
    expect(Math.abs(carouselOverscrollOffset(100))).toBeLessThan(100);
    expect(carouselOverscrollOffset(-40)).toBeLessThan(0);
  });
});
