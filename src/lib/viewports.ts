/**
 * WMDS viewport and breakpoint reference — Tailwind v4 defaults.
 * Mobile-first: unprefixed utilities = mobile; scale up with sm/md/lg.
 */

export interface BreakpointToken {
  prefix: string;
  minWidth: string;
  tier: "mobile" | "sm" | "md" | "lg" | "xl" | "2xl";
  label: string;
}

/** Tailwind default breakpoints — change only via ADR + @theme. */
export const breakpoints: BreakpointToken[] = [
  {
    prefix: "(default)",
    minWidth: "0",
    tier: "mobile",
    label: "Mobile — unprefixed utilities",
  },
  {
    prefix: "sm:",
    minWidth: "640px",
    tier: "sm",
    label: "Large phone / small tablet",
  },
  {
    prefix: "md:",
    minWidth: "768px",
    tier: "md",
    label: "Tablet",
  },
  {
    prefix: "lg:",
    minWidth: "1024px",
    tier: "lg",
    label: "Desktop",
  },
  {
    prefix: "xl:",
    minWidth: "1280px",
    tier: "xl",
    label: "Wide desktop",
  },
  {
    prefix: "2xl:",
    minWidth: "1536px",
    tier: "2xl",
    label: "Ultra-wide",
  },
];

/** Storybook viewport presets — use in preview.tsx and story parameters. */
export const storybookViewports = {
  mobile: {
    name: "Mobile",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
  tablet: {
    name: "Tablet",
    styles: { width: "768px", height: "1024px" },
    type: "tablet" as const,
  },
  desktop: {
    name: "Desktop",
    styles: { width: "1280px", height: "800px" },
    type: "desktop" as const,
  },
};

/** Minimum touch target — WCAG 2.5.5 target size (Level AAA); use for atoms on mobile. */
export const minTouchTargetPx = 44;
