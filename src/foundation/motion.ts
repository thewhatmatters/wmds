/** Motion token reference — durations, easing, press feedback. */
export interface MotionToken {
  token: string;
  value: string;
  role: string;
  usedIn: string[];
}

export const motionDurations: MotionToken[] = [
  {
    token: "--duration-instant",
    value: "100ms",
    role: "Micro feedback — list row hover, tight UI",
    usedIn: ["Agent card option rows (product reference)"],
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
    usedIn: ["Button hover colors", "Recommendation body swap (~180ms in product reference)"],
  },
  {
    token: "--duration-slow",
    value: "280ms",
    role: "Structural reveals",
    usedIn: ["Reserved — marquee-style button reveals in whatmatters-studio"],
  },
  {
    token: "--duration-slower",
    value: "300ms",
    role: "Panel / drawer expand",
    usedIn: ["Agent card alternatives drawer (product reference)", "Filter table row collapse", "Tab sliding indicator"],
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
    usedIn: ["Agent card alternatives drawer (product reference)", "Filter table row collapse", "Tab sliding indicator"],
  },
];

export const motionFeedback: MotionToken[] = [
  {
    token: "--motion-press-scale",
    value: "0.98",
    role: "Active press — subtle shrink on pointer down",
    usedIn: ["Button :active (enabled only)", "Matches product RecommendationCard button feel"],
  },
];
