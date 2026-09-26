import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  heroTileRepel,
  heroTileRestingLayout,
  heroTileStackDefaultFalloff,
  heroTileStackDefaultSpring,
  heroTileStackDefaultStrength,
  heroTileStackIsOneShot,
  heroTileStackMaxTilt,
  heroTileStackTapHoldMs,
} from "./heroTileScatter";
import {
  heroTileStackImageClasses,
  heroTileStackRootClasses,
  heroTileStackRowClasses,
  heroTileStackSurfaceClasses,
  heroTileStackTileOverlap,
  heroTileStackTileSize,
} from "./heroTileStackStyles";

const origin = { pointerX: 0, pointerY: 0, centerX: 80, centerY: 0 };

describe("heroTileRepel", () => {
  it("returns no push when the pointer sits on the resting center", () => {
    expect(
      heroTileRepel({
        pointerX: 40,
        pointerY: -12,
        centerX: 40,
        centerY: -12,
        strength: heroTileStackDefaultStrength,
      }),
    ).toEqual({ x: 0, y: 0, rotate: 0 });
  });

  it("pushes away from the pointer", () => {
    const repel = heroTileRepel({ ...origin, strength: 400 });
    const dx = origin.centerX - origin.pointerX;
    const dy = origin.centerY - origin.pointerY;
    expect(repel.x * dx + repel.y * dy).toBeGreaterThan(0);
    expect(repel.x).toBeGreaterThan(0);
    expect(repel.y).toBe(0);
    expect(repel.rotate).toBeGreaterThan(0);
  });

  it("pushes the opposite way when the card is on the other side", () => {
    const left = heroTileRepel({
      pointerX: 100,
      pointerY: 20,
      centerX: 10,
      centerY: 20,
      strength: 400,
    });
    expect(left.x).toBeLessThan(0);
    expect(left.rotate).toBeLessThan(0);
  });

  it("increases magnitude as the pointer gets closer", () => {
    const near = heroTileRepel({ ...origin, centerX: 40, strength: 500 });
    const far = heroTileRepel({ ...origin, centerX: 280, strength: 500 });
    expect(Math.hypot(near.x, near.y)).toBeGreaterThan(Math.hypot(far.x, far.y));
  });

  it("scales x and y linearly with strength below the tilt clamp", () => {
    const soft = heroTileRepel({ ...origin, centerX: 420, strength: 100 });
    const firm = heroTileRepel({ ...origin, centerX: 420, strength: 250 });
    expect(firm.x).toBeCloseTo(soft.x * 2.5);
    expect(firm.y).toBeCloseTo(soft.y * 2.5);
    expect(firm.rotate).toBeCloseTo(soft.rotate * 2.5);
    expect(Math.abs(firm.rotate)).toBeLessThan(heroTileStackMaxTilt);
  });

  it("clamps added tilt", () => {
    const repel = heroTileRepel({
      pointerX: 0,
      pointerY: 0,
      centerX: 8,
      centerY: 0,
      strength: heroTileStackDefaultStrength,
    });
    expect(repel.rotate).toBe(heroTileStackMaxTilt);
    expect(repel.rotate).toBeLessThanOrEqual(heroTileStackMaxTilt);
  });

  it("is still at strength 0 and ignores non-finite input", () => {
    expect(heroTileRepel({ ...origin, strength: 0 })).toEqual({ x: 0, y: 0, rotate: 0 });
    expect(heroTileRepel({ ...origin, strength: Number.NaN })).toEqual({ x: 0, y: 0, rotate: 0 });
    expect(heroTileRepel({ ...origin, pointerX: Number.POSITIVE_INFINITY, strength: 10 })).toEqual({
      x: 0,
      y: 0,
      rotate: 0,
    });
    expect(heroTileRepel({ ...origin, strength: 10, falloff: 0 })).toEqual({ x: 0, y: 0, rotate: 0 });
  });

  it("uses the default falloff when one is not passed", () => {
    const implicit = heroTileRepel({ ...origin, strength: 200 });
    const explicit = heroTileRepel({
      ...origin,
      strength: 200,
      falloff: heroTileStackDefaultFalloff,
    });
    expect(implicit).toEqual(explicit);
  });

  it("ships a wild default strength", () => {
    const near = heroTileRepel({
      pointerX: 0,
      pointerY: 0,
      centerX: 48,
      centerY: 0,
      strength: heroTileStackDefaultStrength,
    });
    expect(near.x).toBeGreaterThan(500);
  });
});

describe("heroTileRestingLayout", () => {
  it("fans the first four tiles", () => {
    expect(heroTileRestingLayout(0)).toEqual({ offsetX: 0, offsetY: "5%", rotate: 2, zIndex: 1 });
    expect(heroTileRestingLayout(1)).toEqual({ offsetX: 0, offsetY: "-6%", rotate: -3, zIndex: 2 });
    expect(heroTileRestingLayout(2)).toEqual({ offsetX: 0, offsetY: "5%", rotate: 6, zIndex: 3 });
    expect(heroTileRestingLayout(3)).toEqual({ offsetX: 0, offsetY: "-4%", rotate: -2, zIndex: 4 });
  });

  it("continues the fan and honors overrides", () => {
    expect(heroTileRestingLayout(4).zIndex).toBe(5);
    expect(heroTileRestingLayout(0, { rotate: 12, zIndex: 9, offsetX: 4, offsetY: 8 })).toEqual({
      offsetX: 4,
      offsetY: "8px",
      rotate: 12,
      zIndex: 9,
    });
    expect(heroTileRestingLayout(1, { offsetY: "-2%" }).offsetY).toBe("-2%");
  });
});

describe("heroTileStack pointer mode", () => {
  it("treats touch and coarse pointers as a one-shot", () => {
    expect(heroTileStackIsOneShot("touch", false)).toBe(true);
    expect(heroTileStackIsOneShot("mouse", true)).toBe(true);
    expect(heroTileStackIsOneShot("mouse", false)).toBe(false);
    expect(heroTileStackIsOneShot("pen", false)).toBe(false);
    expect(heroTileStackTapHoldMs).toBeGreaterThan(200);
  });
});

describe("hero tile stack shell", () => {
  it("clips inline overflow on the frame and leaves the row unclipped", () => {
    expect(heroTileStackRootClasses).toContain("overflow-x-clip");
    expect(heroTileStackRootClasses).toContain("overflow-y-visible");
    expect(heroTileStackRootClasses).not.toContain("overflow-hidden");
    expect(heroTileStackRowClasses).toContain("overflow-visible");
    expect(heroTileStackRowClasses).not.toContain("overflow-x-clip");
    expect(heroTileStackRowClasses).not.toContain("overflow-hidden");
  });

  it("paints the tile with the card radius and soft card shadow", () => {
    expect(heroTileStackSurfaceClasses).toContain("rounded-[var(--radius-card-shell)]");
    expect(heroTileStackSurfaceClasses).toContain("shadow-soft-card");
    expect(heroTileStackSurfaceClasses).toContain("pointer-events-none");
    expect(heroTileStackTileSize).toContain("14cqi");
    expect(heroTileStackTileOverlap).toContain("-0.44");
    expect(heroTileStackImageClasses).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    const shell = [
      heroTileStackRootClasses,
      heroTileStackRowClasses,
      heroTileStackSurfaceClasses,
      heroTileStackTileSize,
      heroTileStackTileOverlap,
    ].join(" ");
    expect(shell).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });

  it("is a client module and drives scatter from motion springs", () => {
    const source = readFileSync(new URL("./HeroTileStack.tsx", import.meta.url), "utf8");
    expect(source.startsWith('"use client"')).toBe(true);
    expect(source).toContain("useSpring");
    expect(source).toContain("useMotionValue");
    expect(source).toContain("heroTileRepel");
    expect(source).toContain("alt={tile.alt}");
    expect(source).not.toContain("<" + "button");
    expect(source).not.toContain("<style");
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(heroTileStackDefaultSpring.stiffness).toBeGreaterThan(0);
    expect(heroTileStackDefaultSpring.damping).toBeGreaterThan(0);
  });
});
