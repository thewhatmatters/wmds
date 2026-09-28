/**
 * Decorative hands from the Interactive Icon Set remix.
 * Artboard `31_Cigarette` has no cigarette — it is the point hand.
 */

export const riveHands = ["point", "rock"] as const;

export type RiveHandName = (typeof riveHands)[number];

/** Point is artboard `31_Cigarette` (cigarette removed). Rock is `29_Rock`. */
export const riveHandArtboards: Record<RiveHandName, string> = {
  point: "31_Cigarette",
  rock: "29_Rock",
};

export const riveHandSrc = "/rive/interactive-icon-set.riv";

export const riveHandStateMachine = "State Machine 1";

export const riveHandBooleanInput = "Boolean 1";

export const riveHandFillProperty = "handFill";

export const riveHandOutlineProperty = "outline";

/**
 * Hand fill — surface white in light mode (`#ffffff`).
 * Theme alias of `--color-background-surface`.
 */
export const riveHandFillToken = "--color-surface";

export const riveHandFillFallbackToken = "--color-background-surface";

/**
 * WhatMatters brand navy. `--color-brand` is `#011272` in both themes.
 * The hardcoded fallback is the same navy when that token cannot be read.
 */
export const riveHandOutlineToken = "--color-brand";

/** `#011272` — used when `--color-brand` is missing. */
export const riveHandOutlineFallback: Rgb = { r: 1, g: 18, b: 114 };

export const riveHandClassName = "pointer-events-none";

/** Marketing hero opts in. `none` is the resting box with no entrance. */
export const riveHandEntrances = ["slide-up", "grow", "none"] as const;

export type RiveHandEntrance = (typeof riveHandEntrances)[number];

/**
 * Gap after a finished gesture, and before the first one.
 * Each hand rolls its own 1–2s wait so the two poses rarely start together.
 */
export const riveHandIdleMinMs = 1000;

export const riveHandIdleMaxMs = 2000;

/**
 * How long `Boolean 1` stays true for one idle gesture.
 * The next 1–2s gap starts only after this hold releases.
 */
export const riveHandIdleHoldMs = 1100;

/** Point hand follows the rock by this much. Inside the 150–250ms stagger. */
export const riveHandGrowDelaySec = 0.2;

/**
 * Scale origin for `entrance="grow"` — lower-left of the point art, where it grips the s.
 * Fractions of the hand box.
 */
export const riveHandGrowOrigin = "22% 76%";

/**
 * Gap between the line box bottom and the text baseline on `type-display-1` (line-height 1.15).
 * The rock clip wrapper uses this as `bottom` so the hand rises out of the baseline.
 */
export const riveHandBaselineFromLineBottom = "0.22em";

/** `random` is a unit interval, the same contract as `Math.random()`. Returns the post-gesture wait. */
export function nextRiveHandIdleDelayMs(random: number = Math.random()): number {
  const unit = Math.min(1, Math.max(0, random));
  return Math.round(riveHandIdleMinMs + unit * (riveHandIdleMaxMs - riveHandIdleMinMs));
}

/** Idle pulses only while the hand is allowed to move and the page can be seen. */
export function riveHandIdleAllowed(input: {
  idle: boolean;
  reduced: boolean;
  pageVisible: boolean;
  inView: boolean;
}): boolean {
  return input.idle && !input.reduced && input.pageVisible && input.inView;
}

/** True once the hand box can hold a drawing. A 0×0 canvas is not a frame yet. */
export function riveHandHasLayoutBox(width: number, height: number): boolean {
  return width >= 1 && height >= 1;
}

/**
 * Viewport overlap of a sized box.
 * A zero-area rect is not an answer — the inline slot is 0px tall, so visibility
 * has to come from the hand box, not that slot.
 */
export function riveHandIntersectsViewport(
  rect: { width: number; height: number; top: number; left: number; right: number; bottom: number },
  viewportWidth: number,
  viewportHeight: number,
): boolean {
  if (!riveHandHasLayoutBox(rect.width, rect.height)) return false;
  return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
}

/** `Boolean 1` while hovering, focusing, or inside an idle pulse. Reduced motion forces it off. */
export function riveHandBooleanValue(active: boolean, idlePulse: boolean, reduced: boolean): boolean {
  if (reduced) return false;
  return active || idlePulse;
}

const riveHandLayoutRectCanvases = new WeakSet<HTMLCanvasElement>();

/**
 * Border box Rive should rasterize.
 * `resizeDrawingSurfaceToCanvas` reads `getBoundingClientRect`, which includes transforms.
 * A grow entrance mounts at `scale: 0`, so that rect is 0×0, and the later scale does not
 * change `clientWidth`, so the runtime never samples again. Layout size ignores that scale.
 */
export function riveHandLayoutClientRect(canvas: HTMLCanvasElement, painted: DOMRect): DOMRect {
  const width = canvas.clientWidth || painted.width;
  const height = canvas.clientHeight || painted.height;
  if (Math.abs(width - painted.width) < 0.5 && Math.abs(height - painted.height) < 0.5) {
    return painted;
  }
  return new DOMRect(painted.x, painted.y, width, height);
}

/** Report layout size from `getBoundingClientRect` so a scale transform cannot zero the backing store. */
export function installRiveHandLayoutRect(canvas: HTMLCanvasElement): void {
  if (riveHandLayoutRectCanvases.has(canvas)) return;
  riveHandLayoutRectCanvases.add(canvas);
  const painted = canvas.getBoundingClientRect.bind(canvas);
  canvas.getBoundingClientRect = () => riveHandLayoutClientRect(canvas, painted());
}

/** True once a grow scale has settled and it is safe to resample the drawing surface. */
export function riveHandGrowSettled(layoutWidth: number, layoutHeight: number, paintedWidth: number, paintedHeight: number): boolean {
  if (layoutWidth < 1 || layoutHeight < 1) return false;
  return paintedWidth / layoutWidth >= 0.92 && paintedHeight / layoutHeight >= 0.92;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface RiveHandColorTarget {
  rgb: (r: number, g: number, b: number) => void;
}

export interface RiveHandColorSetter {
  setRgb: (r: number, g: number, b: number) => void;
}

/** A number is pixels. Any other value is a CSS length (`1.25em` tracks the parent font). */
export function riveHandBoxSize(size: number | string): string {
  return typeof size === "number" ? `${size}px` : size;
}

/** Drawn hand height when `inline` is set. Matches TextSequence marks (`1.15em`). */
export const riveHandInlineVisibleEm = 1.15;

/**
 * Pop origin for a hand slot inside TextSequence.
 * The slot is zero height and the ink is centered on it, so `50% 50%` is the
 * drawn hand's center — the same visual center the circle and pill use.
 */
export const riveHandSequenceOrigin = "50% 50%";

/** Set on the slot when the sequence pop finishes. Idle waits for it inside a TextSequence. */
export const riveHandEnteredAttr = "data-rive-hand-entered";

/**
 * Drawn outline as a fraction of the square canvas, measured from a raster
 * after Rive has fit the artboard. Both hands sit in padding, and the rock
 * outline is only about half the canvas height.
 */
export const riveHandInkFractions = {
  rock: { width: 0.324, height: 0.505, centerX: 0.5, centerY: 0.409 },
  point: { width: 0.455, height: 0.422, centerX: 0.462, centerY: 0.545 },
} as const;

export interface RiveHandInlineLayout {
  /** Canvas box. Larger than the ink so the drawn hand reaches `riveHandInlineVisibleEm`. */
  box: string;
  /** In-flow gap. Zero height, as wide as the drawn hand. */
  slot: string;
  /** Shifts the canvas so the ink center sits on the slot center. */
  transform: string;
}

function riveHandFixed(value: number): string {
  return value.toFixed(2);
}

/** Scale and shift that make the drawn hand about 1.15em, centered on the line. */
export function riveHandInlineLayout(hand: RiveHandName): RiveHandInlineLayout {
  const ink = riveHandInkFractions[hand];
  const boxEm = riveHandInlineVisibleEm / ink.height;
  const slotEm = boxEm * ink.width;
  return {
    box: `${riveHandFixed(boxEm)}em`,
    slot: `${riveHandFixed(slotEm)}em`,
    transform: `translate(${riveHandFixed(-50 - (ink.centerX - 0.5) * 100)}%, ${riveHandFixed(-50 - (ink.centerY - 0.5) * 100)}%)`,
  };
}

/** Zero-height inline gap. The canvas is absolute, so the line box stays put. */
export const riveHandInlineSlotClassName =
  "pointer-events-none relative mx-[0.08em] inline-block h-0 shrink-0 select-none align-middle";

export function cssColorToRgb(value: string): Rgb | null {
  const trimmed = value.trim();
  const hex = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let digits = hex[1];
    if (digits.length === 3) {
      digits = digits
        .split("")
        .map((channel) => channel + channel)
        .join("");
    }
    const parsed = Number.parseInt(digits, 16);
    return {
      r: (parsed >> 16) & 255,
      g: (parsed >> 8) & 255,
      b: parsed & 255,
    };
  }

  const channels = trimmed.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (!channels) {
    return null;
  }

  return {
    r: Math.round(Number(channels[1])),
    g: Math.round(Number(channels[2])),
    b: Math.round(Number(channels[3])),
  };
}

function specifiedTokenRgb(token: string, depth: number): Rgb | null {
  if (typeof document === "undefined" || depth > 2) {
    return null;
  }
  const specified = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const direct = cssColorToRgb(specified);
  if (direct) {
    return direct;
  }
  const nested = specified.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (!nested) {
    return null;
  }
  return specifiedTokenRgb(nested[1], depth + 1);
}

/** Resolve a theme token to 0–255 channels. Returns null when the token is missing. */
export function readCssTokenRgb(token: string): Rgb | null {
  if (typeof document === "undefined") {
    return null;
  }

  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const usedColor = getComputedStyle(probe).color;
  const parentColor = probe.parentElement ? getComputedStyle(probe.parentElement).color : "";
  probe.remove();
  if (usedColor && usedColor !== parentColor) {
    const used = cssColorToRgb(usedColor);
    if (used) {
      return used;
    }
  }

  return specifiedTokenRgb(token, 0);
}

export function readRiveHandFillRgb(): Rgb | null {
  return readCssTokenRgb(riveHandFillToken) ?? readCssTokenRgb(riveHandFillFallbackToken);
}

export function readRiveHandOutlineRgb(): Rgb {
  return readCssTokenRgb(riveHandOutlineToken) ?? riveHandOutlineFallback;
}

/** Low-level view-model paint used from `onRiveReady` so the first frame is token-colored. */
export function paintRiveHandColors(
  rive: {
    viewModelInstance: {
      color: (path: string) => RiveHandColorTarget | null;
    } | null;
  } | null,
): void {
  const viewModel = rive?.viewModelInstance;
  if (!viewModel) {
    return;
  }

  const fill = readRiveHandFillRgb();
  const ink = readRiveHandOutlineRgb();
  if (fill) {
    viewModel.color(riveHandFillProperty)?.rgb(fill.r, fill.g, fill.b);
  }
  if (ink) {
    viewModel.color(riveHandOutlineProperty)?.rgb(ink.r, ink.g, ink.b);
  }
}

/** Hook path — `useViewModelInstanceColor` setters. */
export function applyRiveHandTokenColors(targets: {
  handFill?: RiveHandColorSetter | null;
  outline?: RiveHandColorSetter | null;
}): void {
  const fill = readRiveHandFillRgb();
  const ink = readRiveHandOutlineRgb();
  if (fill) {
    targets.handFill?.setRgb(fill.r, fill.g, fill.b);
  }
  if (ink) {
    targets.outline?.setRgb(ink.r, ink.g, ink.b);
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
