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

export type StorybookViewportTier = keyof typeof storybookViewports;

/**
 * Lock a story to a WMDS viewport tier (Storybook 10 globals API).
 * Iframe matches breakpoint width; toolbar cannot override.
 * @see https://storybook.js.org/docs/essentials/viewport
 */
export function lockedViewportGlobals(tier: StorybookViewportTier) {
  return {
    viewport: {
      value: tier,
      isRotated: false,
    },
  } as const;
}

/** Story spread — locked viewport + WMDS options catalog + docs iframe (not inline). */
export function lockedViewportStory(tier: StorybookViewportTier) {
  const preset = storybookViewports[tier];

  return {
    globals: lockedViewportGlobals(tier),
    parameters: {
      layout: "fullscreen" as const,
      viewport: {
        options: storybookViewports,
      },
      docs: {
        story: {
          /** Inline docs use the browser viewport — Tailwind `md:` never fires. Iframe + globals locks width. */
          inline: false,
          iframeHeight: preset.styles.height,
        },
      },
    },
  } as const;
}

/** One step of the breakpoint ↔ grid contract. `sm:` exists; the column count does not change there. */
export interface GridBreakpointStep {
  prefix: string;
  minWidth: string;
  minWidthPx: number;
  cols: number;
  gutterPx: number;
  marginPx: number;
  /** Storybook review viewport that lands on this step, if any. */
  reviewViewport: StorybookViewportTier | null;
  label: string;
}

/**
 * Breakpoints and `--grid-cols` are the same scale.
 * Keep in sync with `src/theme/grid.css` media queries — do not invent a second ladder.
 */
export const gridScale: readonly GridBreakpointStep[] = [
  {
    prefix: "(default)",
    minWidth: "0",
    minWidthPx: 0,
    cols: 4,
    gutterPx: 16,
    marginPx: 16,
    reviewViewport: "mobile",
    label: "Mobile — 4 columns",
  },
  {
    prefix: "sm:",
    minWidth: "640px",
    minWidthPx: 640,
    cols: 4,
    gutterPx: 16,
    marginPx: 16,
    reviewViewport: null,
    label: "Large phone — grid does not step",
  },
  {
    prefix: "md:",
    minWidth: "768px",
    minWidthPx: 768,
    cols: 8,
    gutterPx: 24,
    marginPx: 24,
    reviewViewport: "tablet",
    label: "Tablet — 8 columns",
  },
  {
    prefix: "lg:",
    minWidth: "1024px",
    minWidthPx: 1024,
    cols: 12,
    gutterPx: 24,
    marginPx: 24,
    reviewViewport: "desktop",
    label: "Desktop — 12 columns",
  },
  {
    prefix: "xl:",
    minWidth: "1280px",
    minWidthPx: 1280,
    cols: 12,
    gutterPx: 24,
    marginPx: 24,
    reviewViewport: null,
    label: "Wide — still 12 columns",
  },
  {
    prefix: "2xl:",
    minWidth: "1536px",
    minWidthPx: 1536,
    cols: 12,
    gutterPx: 24,
    marginPx: 24,
    reviewViewport: null,
    label: "Ultra-wide — still 12 columns",
  },
];

/** Steps where `--grid-cols` actually changes (must match `grid.css`). */
export const gridColumnSteps = gridScale.filter((step, index, all) => {
  const previous = all[index - 1];
  return !previous || previous.cols !== step.cols;
});

/** Minimum touch target — WCAG 2.5.5 target size (Level AAA); use for atoms on mobile. */
export const minTouchTargetPx = 44;
