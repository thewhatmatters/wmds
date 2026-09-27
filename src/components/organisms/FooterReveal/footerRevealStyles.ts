/**
 * Footer reveal shell.
 *
 * Scrollbar: `src/theme/grid.css` already sets `scrollbar-gutter: stable` on
 * `html`. That gutter paints the page background beside a full-bleed field.
 * This shell does not hide the scrollbar. `overflow-x: clip` (with
 * `overflow-y: visible`) stops a full-bleed field from opening a horizontal
 * scrollbar — `clip` does not force the block axis into a scroll container,
 * so `position: sticky` on the footer keeps working. Do not add
 * `overflow-hidden` or `scrollbar-width: none` here.
 */

/** Isolate root — negative z-index on the footer stays inside this stacking context. */
export const footerRevealRootClasses =
  "relative isolate w-full max-w-full overflow-x-clip overflow-y-visible";

/** Page cover — opaque page background, at least one viewport tall, above the footer. */
export const footerRevealContentClasses =
  "relative z-[1] min-h-dvh w-full max-w-full overflow-x-clip bg-body";

/**
 * Sticky under-page footer. Class name is not `footer` — a bare `footer`
 * class collides with page-level footer rules in consuming apps.
 */
export const footerRevealStickyClasses =
  "sticky bottom-0 z-[-1] m-0 w-full max-w-full overflow-x-clip bg-transparent p-0";

/** Opacity layer. Field color belongs here (see `footerRevealFieldClasses`). */
export const footerRevealFadeClasses = "w-full max-w-full overflow-x-clip";

/** Scale + blur layer. Transform origin is the bottom center (`50% 100%`). */
export const footerRevealScaleClasses = "w-full max-w-full";

/**
 * Brand field for the uncovered footer plane.
 * `--color-brand` with surface ink. Surface on brand reports 4.5:1.
 */
export const footerRevealFieldClasses = "bg-brand text-surface";

/**
 * Links on the brand field. **TextLink** locks `text-fg` for prose on the page
 * background; inherit so these links use the field ink (surface on brand).
 */
export const footerRevealFieldLinkClasses =
  "text-inherit underline decoration-solid underline-offset-[0.18em] " +
  "hover:decoration-current focus-visible:rounded-sm focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-surface focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-brand";

/** Centered brand footer. Clips the decorative wordmark so it cannot widen the page. */
export const footerRevealBrandClasses =
  "relative flex min-h-dvh w-full max-w-full flex-col items-center justify-center overflow-hidden " +
  "px-[var(--grid-margin)] pb-[18vw] pt-24 text-center";

export const footerRevealBrandCopyClasses =
  "relative z-[1] flex w-full max-w-4xl flex-col items-center gap-10";

export const footerRevealBrandHeadlineClasses = "type-display-1 text-balance text-surface";

export const footerRevealSocialListClasses =
  "m-0 flex list-none flex-wrap items-center justify-center gap-x-8 gap-y-3 p-0";

/** Heading-1 (24px) so the row clears large-text AA on brand, with the field underline. */
export const footerRevealSocialLinkClasses = footerRevealFieldLinkClasses + " type-heading-1";

/**
 * Decorative wordmark. Viewport-scaled, shifted off center, and cropped by the
 * footer's bottom edge. `text-surface/20` is a faint tone on brand.
 */
export const footerRevealWordmarkClasses =
  "pointer-events-none absolute bottom-0 start-[-12vw] z-0 max-w-none translate-y-[16%] " +
  "select-none whitespace-nowrap font-sans font-bold leading-[0.78] tracking-[-0.045em] " +
  "text-surface/20 text-[clamp(4.75rem,20vw,22rem)]";

/** `https` links open in a new tab. Hash placeholders stay in the page. */
export function footerRevealExternalLinkProps(
  href: string,
): { target?: "_blank"; rel?: "noopener" } {
  if (/^https?:\/\//i.test(href)) return { target: "_blank", rel: "noopener" };
  return {};
}
