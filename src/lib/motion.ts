import type { Transition, Variants } from "motion/react";

/** Motion token reference for Foundation docs — values resolved from Theme CSS vars. */
export interface MotionToken {
  token: string;
  value: string;
  role: string;
  usedIn: string[];
}

/** Astryx-aligned duration tiers — https://astryx.atmeta.com/docs/motion */
export type MotionDuration =
  | "fast-min"
  | "fast"
  | "fast-max"
  | "medium-min"
  | "medium"
  | "medium-max"
  | "slow-min"
  | "slow"
  | "slow-max";

/** @deprecated Use {@link MotionDuration} tiers. Kept for gradual migration. */
export type LegacyMotionDuration = "instant" | "base" | "slower";

export type MotionDurationKey = MotionDuration | LegacyMotionDuration;

export type MotionEase = "standard";

/** Astryx standard easing fallback — cubic-bezier(0.24, 1, 0.4, 1) */
export const ASTRYX_EASE_STANDARD: [number, number, number, number] = [0.24, 1, 0.4, 1];

const DURATION_CSS_VAR: Record<MotionDurationKey, string> = {
  "fast-min": "--duration-fast-min",
  fast: "--duration-fast",
  "fast-max": "--duration-fast-max",
  "medium-min": "--duration-medium-min",
  medium: "--duration-medium",
  "medium-max": "--duration-medium-max",
  "slow-min": "--duration-slow-min",
  slow: "--duration-slow",
  "slow-max": "--duration-slow-max",
  instant: "--duration-instant",
  base: "--duration-base",
  slower: "--duration-slower",
};

const EASE_CSS_VAR: Record<MotionEase, string> = {
  standard: "--ease-standard",
};

/** Fallbacks mirror src/theme/motion.css — used in tests and SSR. */
export const motionDurationFallbackMs: Record<MotionDurationKey, number> = {
  "fast-min": 130,
  fast: 175,
  "fast-max": 230,
  "medium-min": 310,
  medium: 410,
  "medium-max": 550,
  "slow-min": 730,
  slow: 975,
  "slow-max": 1300,
  instant: 130,
  base: 310,
  slower: 550,
};

const motionDurationClasses: Record<MotionDurationKey, string> = {
  "fast-min": "duration-fast-min",
  fast: "duration-fast",
  "fast-max": "duration-fast-max",
  "medium-min": "duration-medium-min",
  medium: "duration-medium",
  "medium-max": "duration-medium-max",
  "slow-min": "duration-slow-min",
  slow: "duration-slow",
  "slow-max": "duration-slow-max",
  instant: "duration-instant",
  base: "duration-base",
  slower: "duration-slower",
};

const motionEaseClasses: Record<MotionEase, string> = {
  standard: "ease-standard",
};

export const motionDurations: MotionToken[] = [
  {
    token: "--duration-fast-min",
    value: "130ms",
    role: "Micro feedback — must not lag behind cursor",
    usedIn: ["Row hover", "High-frequency highlights"],
  },
  {
    token: "--duration-fast",
    value: "175ms",
    role: "Default fast — color, press, focus ring",
    usedIn: ["Button", "Chip", "Input shell", "Focus rings"],
  },
  {
    token: "--duration-fast-max",
    value: "230ms",
    role: "Upper fast bound",
    usedIn: ["Toggles", "Selection highlight"],
  },
  {
    token: "--duration-medium-min",
    value: "310ms",
    role: "Lower medium bound — small layout shifts",
    usedIn: ["Enter/exit (compact)"],
  },
  {
    token: "--duration-medium",
    value: "410ms",
    role: "Panels, expand/collapse, layout morph",
    usedIn: ["Search expand", "Validation band", "motion-collapse", "Panel reveal"],
  },
  {
    token: "--duration-medium-max",
    value: "550ms",
    role: "Upper medium bound — drawer-style reveals",
    usedIn: ["Layout animation specimens"],
  },
  {
    token: "--duration-slow-min",
    value: "730ms",
    role: "Lower slow bound — large spatial change",
    usedIn: ["Full-screen transitions (rare)"],
  },
  {
    token: "--duration-slow",
    value: "975ms",
    role: "Hero transitions — use sparingly",
    usedIn: ["Marketing/onboarding (if ever)"],
  },
  {
    token: "--duration-slow-max",
    value: "1300ms",
    role: "Upper slow bound",
    usedIn: ["Reserved"],
  },
];

export const motionEasing: MotionToken[] = [
  {
    token: "--ease-standard",
    value: "cubic-bezier(0.24, 1, 0.4, 1)",
    role: "Single default easing — all tiers",
    usedIn: ["All transitions", "Motion tween props"],
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
  duration: MotionDurationKey,
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

/** Parse `cubic-bezier(0.24, 1, 0.4, 1)` → Motion bezier tuple. */
export function parseCubicBezier(raw: string): [number, number, number, number] | undefined {
  const match = raw.trim().match(/cubic-bezier\(\s*([^)]+)\s*\)/i);
  if (!match) return undefined;
  const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return undefined;
  return parts as [number, number, number, number];
}

/** Read easing from Theme CSS — Astryx standard curve. */
export function readMotionEase(
  ease: MotionEase = "standard",
  root: Element | null | undefined = typeof document !== "undefined"
    ? document.documentElement
    : null,
): Transition["ease"] {
  if (root) {
    const raw = getComputedStyle(root).getPropertyValue(EASE_CSS_VAR[ease]);
    const bezier = parseCubicBezier(raw);
    if (bezier) return bezier;
  }
  return ASTRYX_EASE_STANDARD;
}

/** Duration + easing utility classes for CSS `transition`. */
export function motionTransition(
  duration: MotionDurationKey,
  ease: MotionEase = "standard",
): string {
  return `${motionDurationClasses[duration]} ${motionEaseClasses[ease]}`;
}

/**
 * Focus ring + shell border fade — Tailwind rings use box-shadow.
 * `fast` keeps focus from popping instantly without lagging (Astryx: high-frequency = fast tier).
 */
export const focusRingTransitionClasses =
  `transition-[box-shadow,border-color,outline-color] ${motionTransition("fast")}`;

export const pressScaleClass = "enabled:active:scale-[var(--motion-press-scale)]";

/** Map WMDS Theme tokens to a Motion `transition` prop — reads CSS vars at runtime. */
export function motionTransitionProp(
  duration: MotionDurationKey,
  ease: MotionEase = "standard",
  root?: Element | null,
): Transition {
  return {
    duration: readMotionDurationSeconds(duration, root),
    ease: readMotionEase(ease, root),
  };
}

/** Medium-tier transition — panel / secondary column reveal. */
export function motionPanelRevealTransition(root?: Element | null): Transition {
  return motionTransitionProp("medium", "standard", root);
}

/** Slide + fade from inline-start — tablet+ sub-nav beside rail. */
export const motionPanelRevealFromStart: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
};

/** Slide + fade from block-start — mobile sub-nav below header. */
export const motionPanelRevealFromTop: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

/** Sub-nav list container — stagger children on pane enter. */
export const motionSubNavListVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
};

/** Sub-nav row — micro slide on stagger enter. */
export const motionSubNavItemVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: motionDurationFallbackMs.fast / 1000,
      ease: ASTRYX_EASE_STANDARD,
    },
  },
};

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
