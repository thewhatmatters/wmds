/**
 * Pointer scatter for HeroTileStack.
 *
 * Position pushes along x only: each card moves away from the pointer's x,
 * with distance falloff scaled by `strength`. A still pointer does not
 * offset y. Vertical travel is a separate, clamped mapping from pointer
 * velocity (`heroTileVelocityY`) so a flick lifts the fan and the position
 * spring returns it when the pointer slows.
 */

export const heroTileStackDefaultFalloff = 150;

/**
 * Gentle horizontal shift. Cards near the pointer stay on screen, close to
 * the stack. Raise `strength` for a wider scatter.
 */
export const heroTileStackDefaultStrength = 120;

/**
 * Px of vertical nudge per px/s of vertical pointer velocity.
 * A moderate flick approaches `heroTileStackDefaultMaxVertical`.
 */
export const heroTileStackDefaultVelocityFactor = 0.02;

/** Clamp for the velocity nudge, in px. Small next to the horizontal shift. */
export const heroTileStackDefaultMaxVertical = 24;

/**
 * Horizontal velocity contributes this fraction of `velocityFactor` to the
 * vertical nudge. Vertical velocity stays the main driver.
 */
export const heroTileStackVelocityXShare = 0.25;

/** Extra tilt (degrees) is clamped so a strong push does not spin the card. */
export const heroTileStackMaxTilt = 40;

/**
 * Degrees of added tilt per px of horizontal push.
 * Softened with the gentler default strength: a normal hover tilts a few
 * degrees, and a raised strength still stops at `heroTileStackMaxTilt`.
 */
const heroTileStackTiltScale = 0.1;

/**
 * How long a coarse-pointer tap holds the scatter before the springs return.
 * Long enough for the default spring to arrive, then the cards spring back.
 */
export const heroTileStackTapHoldMs = 520;

export const heroTileStackDefaultSpring = {
  stiffness: 160,
  damping: 16,
  mass: 0.9,
} as const;

export interface HeroTileRepelInput {
  /** Pointer position in the stack's local coordinate space. */
  pointerX: number;
  pointerY: number;
  /** Card resting center in that same space. */
  centerX: number;
  centerY: number;
  /** Multiplier. `0` is still. The default is a gentle horizontal shift. */
  strength: number;
  /**
   * Distance falloff in px, measured on x. Influence is 1 at the card's x
   * and a quarter of that when the horizontal distance equals `falloff`.
   */
  falloff?: number;
}

export interface HeroTileRepel {
  x: number;
  y: number;
  /** Added to the card's resting tilt. */
  rotate: number;
}

export interface HeroTileVelocityInput {
  /** Horizontal pointer velocity in px/s. Positive is to the right. */
  velocityX: number;
  /** Vertical pointer velocity in px/s. Positive is downward. */
  velocityY: number;
  /** Px of nudge per px/s of vertical velocity. */
  velocityFactor?: number;
  /** Absolute clamp in px. */
  maxVertical?: number;
}

export interface HeroTileRestingLayout {
  offsetX: number;
  /** CSS length. Percentages are of the tile. */
  offsetY: string;
  /** Resting tilt in degrees. */
  rotate: number;
  zIndex: number;
}

const heroTileStackFan: readonly HeroTileRestingLayout[] = [
  { offsetX: 0, offsetY: "5%", rotate: 2, zIndex: 1 },
  { offsetX: 0, offsetY: "-6%", rotate: -3, zIndex: 2 },
  { offsetX: 0, offsetY: "5%", rotate: 6, zIndex: 3 },
  { offsetX: 0, offsetY: "-4%", rotate: -2, zIndex: 4 },
];

export interface HeroTileRestingOverrides {
  offsetX?: number;
  offsetY?: number | string;
  rotate?: number;
  zIndex?: number;
}

function finite(value: number): boolean {
  return Number.isFinite(value);
}

/**
 * Repel a card horizontally from the pointer. Pure: same inputs always
 * return the same `{ x, y, rotate }`. `x` / `y` are px. `y` is 0 — vertical
 * travel comes from `heroTileVelocityY`. `rotate` is degrees, scaled from
 * the horizontal push.
 */
export function heroTileRepel(input: HeroTileRepelInput): HeroTileRepel {
  const falloff = input.falloff ?? heroTileStackDefaultFalloff;
  if (
    !finite(input.pointerX) ||
    !finite(input.pointerY) ||
    !finite(input.centerX) ||
    !finite(input.centerY) ||
    !finite(input.strength) ||
    !finite(falloff) ||
    falloff <= 0 ||
    input.strength === 0
  ) {
    return { x: 0, y: 0, rotate: 0 };
  }

  const dx = input.centerX - input.pointerX;
  const distance = Math.abs(dx);
  if (distance === 0) {
    return { x: 0, y: 0, rotate: 0 };
  }

  const influence = (falloff / (distance + falloff)) ** 2;
  const x = Math.sign(dx) * input.strength * influence;
  const rawTilt = x * heroTileStackTiltScale;
  const rotate = Math.max(-heroTileStackMaxTilt, Math.min(heroTileStackMaxTilt, rawTilt));
  return { x, y: 0, rotate };
}

/**
 * Map pointer velocity (px/s) to a vertical offset in px.
 * Vertical velocity is the driver. Horizontal velocity adds
 * `heroTileStackVelocityXShare` of the same factor. The result is clamped
 * to ±`maxVertical`. A still pointer returns 0.
 */
export function heroTileVelocityY(input: HeroTileVelocityInput): number {
  const velocityFactor = input.velocityFactor ?? heroTileStackDefaultVelocityFactor;
  const maxVertical = input.maxVertical ?? heroTileStackDefaultMaxVertical;
  if (
    !finite(input.velocityX) ||
    !finite(input.velocityY) ||
    !finite(velocityFactor) ||
    !finite(maxVertical) ||
    velocityFactor === 0 ||
    maxVertical <= 0
  ) {
    return 0;
  }

  const raw =
    input.velocityY * velocityFactor +
    input.velocityX * velocityFactor * heroTileStackVelocityXShare;
  return Math.max(-maxVertical, Math.min(maxVertical, raw));
}

/**
 * Resting fan for a tile. The first four indexes use the default stack
 * (slight alternating tilt, small vertical nudge, later tiles paint on top).
 * Further tiles continue that fan. Per-tile fields override the preset.
 */
export function heroTileRestingLayout(
  index: number,
  overrides?: HeroTileRestingOverrides,
): HeroTileRestingLayout {
  const preset = heroTileStackFan[index] ?? {
    offsetX: 0,
    offsetY: index % 2 === 0 ? "5%" : "-5%",
    rotate: index % 2 === 0 ? 4 : -3,
    zIndex: index + 1,
  };
  const offsetY =
    overrides?.offsetY === undefined
      ? preset.offsetY
      : typeof overrides.offsetY === "number"
        ? `${overrides.offsetY}px`
        : overrides.offsetY;
  return {
    offsetX: overrides?.offsetX ?? preset.offsetX,
    offsetY,
    rotate: overrides?.rotate ?? preset.rotate,
    zIndex: overrides?.zIndex ?? preset.zIndex,
  };
}

/** Coarse pointers and touch get one scatter from the tap, then a spring back. */
export function heroTileStackIsOneShot(pointerType: string, coarsePointer: boolean): boolean {
  return coarsePointer || pointerType === "touch";
}
