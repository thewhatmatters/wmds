export const bandTones = ["default", "inverse", "field"] as const;

/**
 * `default` — the page's own colours. `inverse` — the brand surface (`--color-brand-surface`, a dark
 * section; dark status, chart and focus roles). `field` — the saturated section colour (`--color-field`).
 */
export type BandTone = (typeof bandTones)[number];

export const bandSpacings = ["md", "lg", "none"] as const;

/** Space above and below the content: `md` (default) 48px, `lg` 96px, `none` 0. */
export type BandSpacing = (typeof bandSpacings)[number];

export const bandElements = ["section", "div", "header", "footer", "aside"] as const;

export type BandElement = (typeof bandElements)[number];

/**
 * Full-width block; the inner `grid-page` keeps its columns and margins (grid.css → Band). Inside a
 * parent `grid-page` it spans every column: a band is full width by definition.
 */
export const bandClasses = "relative col-[1/-1] block w-full min-w-0";

/** The inner page drops its own block padding; Band's spacing is the section's. */
export const bandPageClasses = "grid-page !py-0";

export const bandSpacingClasses: Record<BandSpacing, string> = {
  md: "py-[calc(var(--leading-base)*2)]",
  lg: "py-[calc(var(--leading-base)*4)]",
  none: "",
};
