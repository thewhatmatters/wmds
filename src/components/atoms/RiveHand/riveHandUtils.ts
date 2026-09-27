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
 * WhatMatters brand blue (`#2f6bff`). Not `--color-fg`, and not status `--color-info`.
 */
export const riveHandOutlineToken = "--color-brand";

export const riveHandClassName = "pointer-events-none";

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

export function readRiveHandOutlineRgb(): Rgb | null {
  return readCssTokenRgb(riveHandOutlineToken);
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
