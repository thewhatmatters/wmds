import type { Transition } from "motion/react";

/** Motion token reference for Foundation docs — values resolved from Theme CSS vars. */
export interface MotionToken {
  token: string;
  value: string;
  role: string;
  usedIn: string[];
}

export type MotionDuration = "instant" | "fast" | "base" | "slow" | "slower";
export type MotionEase = "standard" | "out-expo";

const DURATION_CSS_VAR: Record<MotionDuration, string> = {
  instant: "--duration-instant",
  fast: "--duration-fast",
  base: "--duration-base",
  slow: "--duration-slow",
  slower: "--duration-slower",
};

const EASE_CSS_VAR: Record<MotionEase, string> = {
  standard: "--ease-standard",
  "out-expo": "--ease-out-expo",
};

/** Fallbacks mirror src/theme/theme.css — used in tests and SSR. */
export const motionDurationFallbackMs: Record<MotionDuration, number> = {
  instant: 100,
  fast: 150,
  base: 200,
  slow: 280,
  slower: 300,
};

const motionDurationClasses: Record<MotionDuration, string> = {
  instant: "duration-instant",
  fast: "duration-fast",
  base: "duration-base",
  slow: "duration-slow",
  slower: "duration-slower",
};

const motionEaseClasses: Record<MotionEase, string> = {
  standard: "ease-standard",
  "out-expo": "ease-out-expo",
};

export const motionDurations: MotionToken[] = [
  {
    token: "--duration-instant",
    value: "100ms",
    role: "Micro feedback — list row hover, tight UI",
    usedIn: ["Option rows", "Icon affordances"],
  },
  {
    token: "--duration-fast",
    value: "150ms",
    role: "Press transform, toggles",
    usedIn: ["Button active scale"],
  },
  {
    token: "--duration-base",
    value: "200ms",
    role: "Color shifts, content crossfade",
    usedIn: ["Button hover colors", "Body swap fades"],
  },
  {
    token: "--duration-slow",
    value: "280ms",
    role: "Structural reveals",
    usedIn: ["Marquee-style reveals"],
  },
  {
    token: "--duration-slower",
    value: "300ms",
    role: "Panel / drawer expand, layout slides",
    usedIn: ["Drawers", "Tab indicator", "Row collapse"],
  },
];

export const motionEasing: MotionToken[] = [
  {
    token: "--ease-standard",
    value: "ease-out",
    role: "Default — hover, press, fades",
    usedIn: ["Button", "Most transitions"],
  },
  {
    token: "--ease-out-expo",
    value: "cubic-bezier(0.16, 1, 0.3, 1)",
    role: "Decelerating reveal — drawers, height animations",
    usedIn: ["Drawer expand", "Tab sliding indicator"],
  },
];

export const motionFeedback: MotionToken[] = [
  {
    token: "--motion-press-scale",
    value: "0.98",
    role: "Active press — subtle shrink on pointer down",
    usedIn: ["Button whileTap", "CSS :active scale"],
  },
];

/** Parse `"150ms"` → `0.15`. Returns undefined when unparseable. */
export function parseDurationSeconds(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed.endsWith("ms")) {
    const ms = Number.parseFloat(trimmed.slice(0, -2));
    return Number.isFinite(ms) ? ms / 1000 : undefined;
  }
  if (trimmed.endsWith("s")) {
    const s = Number.parseFloat(trimmed.slice(0, -1));
    return Number.isFinite(s) ? s : undefined;
  }
  return undefined;
}

/** Read a Theme motion duration from CSS custom properties. */
export function readMotionDurationSeconds(
  duration: MotionDuration,
  root: Element | null | undefined = typeof document !== "undefined"
    ? document.documentElement
    : null,
): number {
  if (!root) {
    return motionDurationFallbackMs[duration] / 1000;
  }
  const raw = getComputedStyle(root).getPropertyValue(DURATION_CSS_VAR[duration]);
  return parseDurationSeconds(raw) ?? motionDurationFallbackMs[duration] / 1000;
}

/** Parse `cubic-bezier(0.16, 1, 0.3, 1)` → Motion bezier tuple. */
export function parseCubicBezier(raw: string): [number, number, number, number] | undefined {
  const match = raw.trim().match(/cubic-bezier\(\s*([^)]+)\s*\)/i);
  if (!match) return undefined;
  const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return undefined;
  return parts as [number, number, number, number];
}

/** Read easing from Theme CSS — falls back to standard curves. */
export function readMotionEase(
  ease: MotionEase,
  root: Element | null | undefined = typeof document !== "undefined"
    ? document.documentElement
    : null,
): Transition["ease"] {
  if (ease === "out-expo") {
    if (root) {
      const raw = getComputedStyle(root).getPropertyValue(EASE_CSS_VAR[ease]);
      const bezier = parseCubicBezier(raw);
      if (bezier) return bezier;
    }
    return [0.16, 1, 0.3, 1];
  }

  if (root) {
    const raw = getComputedStyle(root).getPropertyValue(EASE_CSS_VAR[ease]).trim();
    if (raw === "ease-out") return [0, 0, 0.2, 1];
  }
  return [0, 0, 0.2, 1];
}

/** Duration + easing utility classes for CSS `transition`. */
export function motionTransition(
  duration: MotionDuration,
  ease: MotionEase = "standard",
): string {
  return `${motionDurationClasses[duration]} ${motionEaseClasses[ease]}`;
}

export const pressScaleClass = "enabled:active:scale-[var(--motion-press-scale)]";

/** Map WMDS Theme tokens to a Motion `transition` prop — reads CSS vars at runtime. */
export function motionTransitionProp(
  duration: MotionDuration,
  ease: MotionEase = "standard",
  root?: Element | null,
): Transition {
  return {
    duration: readMotionDurationSeconds(duration, root),
    ease: readMotionEase(ease, root),
  };
}

/** Resolve live token values for Foundation docs (browser only). */
export function resolveMotionTokenValues(root: Element | null = typeof document !== "undefined"
  ? document.documentElement
  : null): {
  durations: MotionToken[];
  easing: MotionToken[];
} {
  if (!root) {
    return { durations: motionDurations, easing: motionEasing };
  }
  const style = getComputedStyle(root);
  return {
    durations: motionDurations.map((row) => ({
      ...row,
      value: style.getPropertyValue(row.token).trim() || row.value,
    })),
    easing: motionEasing.map((row) => ({
      ...row,
      value: style.getPropertyValue(row.token).trim() || row.value,
    })),
  };
}
