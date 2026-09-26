/**
 * Pointer scatter for HeroTileStack.
 *
 * The push is the vector from the pointer to the card's resting center.
 * Influence falls off with distance and is scaled by `strength`. Closer
 * pointers push harder. A pointer sitting on the resting center has no
 * direction, so the push is zero there.
 */

export const heroTileStackDefaultFalloff = 150;

/** Full wild scatter — cards near the pointer can leave the viewport. */
export const heroTileStackDefaultStrength = 1100;

/** Extra tilt (degrees) is clamped so a strong push does not spin the card. */
export const heroTileStackMaxTilt = 40;

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
  /** Multiplier. `0` is still. The default is the full wild scatter. */
  strength: number;
  /**
   * Distance falloff in px. Influence is 1 at the center and a quarter of
   * that when `distance === falloff`.
   */
  falloff?: number;
}

export interface HeroTileRepel {
  x: number;
  y: number;
  /** Added to the card's resting tilt. */
  rotate: number;
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
 * Repel a card from the pointer. Pure: same inputs always return the same
 * `{ x, y, rotate }`. `x` / `y` are px. `rotate` is degrees.
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
  const dy = input.centerY - input.pointerY;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) {
    return { x: 0, y: 0, rotate: 0 };
  }

  const influence = (falloff / (distance + falloff)) ** 2;
  const nx = dx / distance;
  const ny = dy / distance;
  const push = input.strength * influence;
  const x = nx * push;
  const y = ny * push;
  const rawTilt = nx * push * 0.05 + ny * push * 0.02;
  const rotate = Math.max(-heroTileStackMaxTilt, Math.min(heroTileStackMaxTilt, rawTilt));
  return { x, y, rotate };
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
