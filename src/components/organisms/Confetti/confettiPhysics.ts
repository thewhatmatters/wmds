/**
 * Physics model derived from canvas-confetti by Kiril Vatev
 * Copyright (c) 2020, Kiril Vatev — ISC License
 * https://github.com/catdad/canvas-confetti
 *
 * We're pre-generating transform keyframes so the animation
 * can run entirely on the GPU.
 */

/** Samples along the burst. The loop emits step 0 through this value (41 frames). */
export const CONFETTI_KEYFRAME_STEPS = 40;

export const CONFETTI_SCALE_DURATION_FRACTION = 0.08;

/** Extra time after `duration` before a burst is removed from the layer. */
export const CONFETTI_CLEANUP_PADDING_SECONDS = 0.5;

export const confettiDefaults = {
  particleCount: 60,
  startVelocity: 25,
  spread: 100,
  decay: 0.91,
  gravity: 1,
  drift: 0,
  duration: 2.5,
  size: 1,
} as const;

/**
 * Celebratory sampling of the categorical chart palette (light and dark already
 * defined). Resolved at paint time so a brand override of those tokens follows.
 */
export const confettiDefaultColors = [
  "var(--color-chart-categorical-1)",
  "var(--color-chart-categorical-2)",
  "var(--color-chart-categorical-3)",
  "var(--color-chart-categorical-4)",
  "var(--color-chart-categorical-5)",
  "var(--color-chart-categorical-6)",
  "var(--color-chart-categorical-7)",
] as const;

export const CONFETTI_SHAPES = ["circle", "rect", "rect", "strip", "strip"] as const;

export type ConfettiShape = (typeof CONFETTI_SHAPES)[number];

export interface ConfettiViewportPoint {
  x: number;
  y: number;
}

export interface ConfettiOriginElement {
  getBoundingClientRect(): { left: number; top: number; width: number; height: number };
}

/** Viewport point, element, or ref. Element origins use the element's center. */
export type ConfettiOrigin =
  | ConfettiViewportPoint
  | ConfettiOriginElement
  | { current: ConfettiOriginElement | null };

export interface ConfettiPhysicsOptions {
  particleCount?: number;
  startVelocity?: number;
  spread?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  duration?: number;
  size?: number;
  colors?: readonly string[];
  /** Injected for tests. Defaults to `Math.random`. */
  random?: () => number;
}

export interface ConfettiKeyframes {
  transform: string[];
  opacity: number[];
}

export interface ConfettiParticleSpec {
  keyframes: ConfettiKeyframes;
  duration: number;
  size: number;
  color: string;
  shape: ConfettiShape;
}

export interface ConfettiKeyframeParams {
  angle: number;
  startVelocity: number;
  decay: number;
  gravity: number;
  drift: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  size: number;
  ticks: number;
  tiltRotations: number;
  rotation: number;
}

interface ResolvedConfettiPhysics {
  particleCount: number;
  startVelocity: number;
  spread: number;
  decay: number;
  gravity: number;
  drift: number;
  duration: number;
  size: number;
  colors: readonly string[];
  random: () => number;
}

export function confettiCleanupDelayMs(durationSeconds: number): number {
  return (durationSeconds + CONFETTI_CLEANUP_PADDING_SECONDS) * 1000;
}

/** OS reduced motion wins. `MotionConfig reducedMotion="always"` also reduces. */
export function isConfettiReducedMotion(
  prefersReducedMotion: boolean | null,
  motionConfigReducedMotion: string | null | undefined,
): boolean {
  return prefersReducedMotion === true || motionConfigReducedMotion === "always";
}

export function resolveConfettiOrigin(
  origin: ConfettiOrigin | undefined,
  viewport: { width: number; height: number },
): ConfettiViewportPoint {
  const center = { x: viewport.width / 2, y: viewport.height / 2 };
  if (origin == null) {
    return center;
  }
  if (isConfettiRef(origin)) {
    return origin.current == null ? center : confettiElementCenter(origin.current);
  }
  if (isConfettiElement(origin)) {
    return confettiElementCenter(origin);
  }
  return { x: origin.x, y: origin.y };
}

export function resolveConfettiPhysics(options?: ConfettiPhysicsOptions): ResolvedConfettiPhysics {
  const colors =
    options?.colors != null && options.colors.length > 0 ? options.colors : confettiDefaultColors;
  return {
    particleCount: options?.particleCount ?? confettiDefaults.particleCount,
    startVelocity: options?.startVelocity ?? confettiDefaults.startVelocity,
    spread: options?.spread ?? confettiDefaults.spread,
    decay: options?.decay ?? confettiDefaults.decay,
    gravity: options?.gravity ?? confettiDefaults.gravity,
    drift: options?.drift ?? confettiDefaults.drift,
    duration: options?.duration ?? confettiDefaults.duration,
    size: options?.size ?? confettiDefaults.size,
    colors,
    random: options?.random ?? Math.random,
  };
}

export function confettiPieceBox(
  shape: ConfettiShape,
  size: number,
): { width: number; height: number; borderRadius: number | string } {
  const width = shape === "strip" ? size * 0.3 : shape === "rect" ? size * 0.7 : size;
  const height = shape === "strip" ? size * 2 : size;
  const borderRadius = shape === "circle" ? "50%" : shape === "strip" ? size * 0.12 : 2;
  return { width, height, borderRadius };
}

export function computeKeyframes(params: ConfettiKeyframeParams): ConfettiKeyframes {
  const {
    angle,
    startVelocity,
    decay,
    gravity,
    drift,
    wobbleSpeed,
    wobbleOffset,
    size,
    ticks,
    tiltRotations,
    rotation,
  } = params;

  const transform: string[] = [];
  const opacity: number[] = [];

  let velocity = startVelocity;
  let x = 0;
  let y = 0;
  let wobble = wobbleOffset;
  let tick = 0;

  for (let step = 0; step <= CONFETTI_KEYFRAME_STEPS; step++) {
    const t = step / CONFETTI_KEYFRAME_STEPS;

    if (step > 0) {
      const targetTick = Math.round((step * ticks) / CONFETTI_KEYFRAME_STEPS);
      while (tick < targetTick) {
        x += Math.cos(angle) * velocity + drift;
        y += Math.sin(angle) * velocity + gravity * 3;
        velocity *= decay;
        wobble += wobbleSpeed;
        tick++;
      }
    }

    const wx = step === 0 ? 0 : x + Math.cos(wobble) * 15 * size;
    const wy = y;

    let scale: number;
    if (t < CONFETTI_SCALE_DURATION_FRACTION * 0.6) {
      scale = (t / (CONFETTI_SCALE_DURATION_FRACTION * 0.6)) * 1.15;
    } else if (t < CONFETTI_SCALE_DURATION_FRACTION) {
      const st =
        (t - CONFETTI_SCALE_DURATION_FRACTION * 0.6) / (CONFETTI_SCALE_DURATION_FRACTION * 0.4);
      scale = 1.15 - st * 0.15;
    } else {
      scale = 1;
    }

    const rotateY = tiltRotations * 360 * t;

    let opacityKeyframe: number;
    if (t <= 0.5) {
      opacityKeyframe = 1;
    } else if (t <= 0.8) {
      opacityKeyframe = 1 - ((t - 0.5) / 0.3) * 0.5;
    } else {
      opacityKeyframe = 0.5 - ((t - 0.8) / 0.2) * 0.5;
    }

    transform.push(
      `translate(${wx}px, ${wy}px) scale(${scale}) rotateY(${rotateY}deg) rotate(${rotation}deg)`,
    );
    opacity.push(opacityKeyframe);
  }

  return { transform, opacity };
}

/**
 * One burst. `random` is consumed per particle in this order: angle, velocity,
 * wobble speed, wobble offset, piece size, tilt, rotation, color, shape.
 */
export function createConfettiParticles(options?: ConfettiPhysicsOptions): ConfettiParticleSpec[] {
  const resolved = resolveConfettiPhysics(options);
  const {
    particleCount,
    startVelocity,
    spread,
    decay,
    gravity,
    drift,
    duration,
    size,
    colors,
    random,
  } = resolved;
  const ticks = Math.round(duration * 60);
  const count = Math.max(0, Math.floor(particleCount));

  return Array.from({ length: count }, () => {
    const radSpread = spread * (Math.PI / 180);
    const angle = -Math.PI / 2 + (0.5 * radSpread - random() * radSpread);
    const velocity = startVelocity * 0.5 + random() * startVelocity;
    const wobbleSpeed = Math.min(0.11, random() * 0.1 + 0.05);
    const wobbleOffset = random() * 10;
    const pieceSize = 6 * size + random() * 6 * size;
    const tiltRotations = 2 + random() * 4;
    const rotation = random() * 360;
    const color = colors[Math.floor(random() * colors.length)] ?? colors[0] ?? confettiDefaultColors[0];
    const shape = CONFETTI_SHAPES[Math.floor(random() * CONFETTI_SHAPES.length)] ?? "rect";

    return {
      keyframes: computeKeyframes({
        angle,
        startVelocity: velocity,
        decay,
        gravity,
        drift,
        wobbleSpeed,
        wobbleOffset,
        size,
        ticks,
        tiltRotations,
        rotation,
      }),
      duration,
      size: pieceSize,
      color,
      shape,
    };
  });
}

function isConfettiRef(
  origin: ConfettiOrigin,
): origin is { current: ConfettiOriginElement | null } {
  return "current" in origin;
}

function isConfettiElement(origin: ConfettiOrigin): origin is ConfettiOriginElement {
  return "getBoundingClientRect" in origin;
}

function confettiElementCenter(element: ConfettiOriginElement): ConfettiViewportPoint {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}
