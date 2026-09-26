import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { confettiLayerClasses } from "./confettiStyles";
import {
  CONFETTI_KEYFRAME_STEPS,
  computeKeyframes,
  confettiCleanupDelayMs,
  confettiDefaultColors,
  confettiDefaults,
  confettiPieceBox,
  createConfettiParticles,
  isConfettiReducedMotion,
  resolveConfettiOrigin,
} from "./confettiPhysics";

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function readTranslate(transform: string): { x: number; y: number } {
  const match = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(transform);
  if (!match) {
    throw new Error(`No translate in ${transform}`);
  }
  return { x: Number(match[1]), y: Number(match[2]) };
}

function readScale(transform: string): number {
  const match = /scale\(([-\d.]+)\)/.exec(transform);
  if (!match) {
    throw new Error(`No scale in ${transform}`);
  }
  return Number(match[1]);
}

function readRotateY(transform: string): number {
  const match = /rotateY\(([-\d.]+)deg\)/.exec(transform);
  if (!match) {
    throw new Error(`No rotateY in ${transform}`);
  }
  return Number(match[1]);
}

describe("computeKeyframes", () => {
  const upward = {
    angle: -Math.PI / 2,
    startVelocity: 10,
    decay: 1,
    gravity: 1,
    drift: 0,
    wobbleSpeed: 0,
    wobbleOffset: 0,
    size: 1,
    ticks: 40,
    tiltRotations: 1,
    rotation: 90,
  } as const;

  it("emits 40 steps plus the start frame", () => {
    const frames = computeKeyframes(upward);
    expect(CONFETTI_KEYFRAME_STEPS).toBe(40);
    expect(frames.transform).toHaveLength(41);
    expect(frames.opacity).toHaveLength(41);
  });

  it("starts at the origin with a zero scale and holds opacity through halfway", () => {
    const frames = computeKeyframes(upward);
    expect(frames.transform[0]).toBe(
      "translate(0px, 0px) scale(0) rotateY(0deg) rotate(90deg)",
    );
    expect(frames.opacity[0]).toBe(1);
    expect(frames.opacity[20]).toBe(1);
    expect(frames.opacity[32]).toBeCloseTo(0.5, 10);
    expect(frames.opacity[40]).toBeCloseTo(0, 10);
    expect(readRotateY(frames.transform[40])).toBeCloseTo(360, 8);
    expect(readScale(frames.transform[40])).toBe(1);
  });

  it("integrates upward velocity, gravity × 3, and the wobble offset", () => {
    const frames = computeKeyframes(upward);
    const step1 = readTranslate(frames.transform[1]);
    expect(step1.x).toBeCloseTo(15, 8);
    expect(step1.y).toBeCloseTo(-7, 8);

    const step2 = readTranslate(frames.transform[2]);
    expect(step2.y).toBeCloseTo(-14, 8);
  });

  it("pops scale from 0 to about 1.15 and back to 1 inside the first 8%", () => {
    const frames = computeKeyframes(upward);
    expect(readScale(frames.transform[0])).toBe(0);
    const t = 2 / 40;
    const peakStart = 0.08 * 0.6;
    const expected = 1.15 - ((t - peakStart) / (0.08 * 0.4)) * 0.15;
    expect(readScale(frames.transform[2])).toBeCloseTo(expected, 8);
    expect(readScale(frames.transform[2])).toBeGreaterThan(1.1);
    expect(readScale(frames.transform[4])).toBe(1);
  });

  it("is deterministic for the same inputs", () => {
    expect(computeKeyframes(upward)).toEqual(computeKeyframes(upward));
  });
});

describe("createConfettiParticles", () => {
  it("repeats exactly when the random source is seeded", () => {
    const options = { particleCount: 5, random: mulberry32(7) };
    const again = { particleCount: 5, random: mulberry32(7) };
    expect(createConfettiParticles(options)).toEqual(createConfettiParticles(again));
  });

  it("changes when the seed changes", () => {
    const first = createConfettiParticles({ particleCount: 4, random: mulberry32(1) });
    const second = createConfettiParticles({ particleCount: 4, random: mulberry32(2) });
    expect(first).not.toEqual(second);
  });

  it("uses the documented defaults, shapes, and token colors", () => {
    expect(confettiDefaults).toEqual({
      particleCount: 60,
      startVelocity: 25,
      spread: 100,
      decay: 0.91,
      gravity: 1,
      drift: 0,
      duration: 2.5,
      size: 1,
    });
    const particles = createConfettiParticles({ particleCount: 12, random: mulberry32(3) });
    expect(particles).toHaveLength(12);
    for (const particle of particles) {
      expect(["circle", "rect", "strip"]).toContain(particle.shape);
      expect(confettiDefaultColors).toContain(particle.color);
      expect(particle.duration).toBe(2.5);
      expect(particle.keyframes.transform[0]).toContain("scale(0)");
    }
  });
});

describe("confetti origins and cleanup", () => {
  const viewport = { width: 800, height: 600 };

  it("defaults to the viewport center", () => {
    expect(resolveConfettiOrigin(undefined, viewport)).toEqual({ x: 400, y: 300 });
  });

  it("uses a viewport point as given", () => {
    expect(resolveConfettiOrigin({ x: 12, y: 34 }, viewport)).toEqual({ x: 12, y: 34 });
  });

  it("uses an element or ref center, and the viewport center when the ref is empty", () => {
    const element = {
      getBoundingClientRect: () => ({ left: 10, top: 20, width: 40, height: 60 }),
    };
    expect(resolveConfettiOrigin(element, viewport)).toEqual({ x: 30, y: 50 });
    expect(resolveConfettiOrigin({ current: element }, viewport)).toEqual({ x: 30, y: 50 });
    expect(resolveConfettiOrigin({ current: null }, viewport)).toEqual({ x: 400, y: 300 });
  });

  it("removes a burst half a second after duration", () => {
    expect(confettiCleanupDelayMs(2.5)).toBe(3000);
    expect(confettiCleanupDelayMs(0.12)).toBeCloseTo(620);
  });
});

describe("confetti piece boxes", () => {
  it("sizes circle, rect, and strip the same way as the burst model", () => {
    expect(confettiPieceBox("circle", 10)).toEqual({ width: 10, height: 10, borderRadius: "50%" });
    expect(confettiPieceBox("rect", 10)).toEqual({ width: 7, height: 10, borderRadius: 2 });
    expect(confettiPieceBox("strip", 10)).toEqual({ width: 3, height: 20, borderRadius: 1.2 });
  });
});

describe("reduced motion", () => {
  it("does nothing for an OS preference or MotionConfig always", () => {
    expect(isConfettiReducedMotion(true, "user")).toBe(true);
    expect(isConfettiReducedMotion(true, "never")).toBe(true);
    expect(isConfettiReducedMotion(false, "always")).toBe(true);
    expect(isConfettiReducedMotion(null, "always")).toBe(true);
    expect(isConfettiReducedMotion(false, "user")).toBe(false);
    expect(isConfettiReducedMotion(false, "never")).toBe(false);
    expect(isConfettiReducedMotion(null, undefined)).toBe(false);
  });
});

describe("confetti source contract", () => {
  const dir = dirname(fileURLToPath(import.meta.url));

  it("keeps the canvas-confetti ISC attribution", () => {
    const source = readFileSync(join(dir, "confettiPhysics.ts"), "utf8");
    expect(source).toContain("Kiril Vatev");
    expect(source).toContain("ISC License");
    expect(source).toContain("https://github.com/catdad/canvas-confetti");
  });

  it("does not hard-code hex colors in the component or physics", () => {
    const physics = readFileSync(join(dir, "confettiPhysics.ts"), "utf8");
    const component = readFileSync(join(dir, "Confetti.tsx"), "utf8");
    expect(physics).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(component).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(confettiDefaultColors.every((color) => color.startsWith("var(--color-"))).toBe(true);
  });

  it("paints the layer as a fixed, click-through top overlay", () => {
    expect(confettiLayerClasses).toContain("pointer-events-none");
    expect(confettiLayerClasses).toContain("fixed");
    expect(confettiLayerClasses).toContain("inset-0");
    expect(confettiLayerClasses).toContain("z-[var(--z-confetti)]");
  });
});
