/**
 * Footer reveal shell.
 *
 * Scrollbar: `src/theme/grid.css` already sets `scrollbar-gutter: stable` on
 * `html`. That gutter paints the page background beside a full-bleed field.
 * This shell does not hide the scrollbar. The root and the cover do not clip:
 * an `overflow-x: clip` ancestor keeps GridOverlay's column guides inside
 * `main`, so they never reach the hero. The wordmark is clipped on the brand
 * panel and the footer field instead. Do not add `overflow-hidden` on the
 * root — it breaks `position: sticky`. Do not set `scrollbar-width: none`.
 */

/** Isolate root — negative z-index on the footer stays inside this stacking context. */
export const footerRevealRootClasses = "relative isolate w-full max-w-full overflow-visible";

/** Page cover — opaque page background, at least one viewport tall, above the footer. */
export const footerRevealContentClasses =
  "relative z-[1] min-h-dvh w-full max-w-full overflow-visible bg-body";

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
 * `--color-brand` (`#011272`) with `--color-on-brand` (white). White on that navy is 15.8:1.
 */
export const footerRevealFieldClasses = "bg-brand text-on-brand";

/**
 * Links on the brand field. **TextLink** locks `text-fg` for prose on the page
 * background; inherit so these links use the field ink (`--color-on-brand`).
 */
export const footerRevealFieldLinkClasses =
  "text-inherit underline decoration-solid underline-offset-[0.18em] " +
  "hover:decoration-current focus-visible:rounded-sm focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-on-brand focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-brand";

/** Centered brand footer. Clips the decorative wordmark so it cannot widen the page. */
export const footerRevealBrandClasses =
  "relative flex min-h-dvh w-full max-w-full flex-col items-center justify-center overflow-hidden " +
  "px-[var(--grid-margin)] pb-[18vw] pt-24 text-center";

export const footerRevealBrandCopyClasses =
  "relative z-[1] flex w-full max-w-4xl flex-col items-center gap-10";

export const footerRevealBrandHeadlineClasses = "type-display-1 text-balance text-on-brand";

export const footerRevealSocialListClasses =
  "m-0 flex list-none flex-wrap items-center justify-center gap-x-8 gap-y-3 p-0";

/** Heading-1 (24px) so the row clears large-text AA on brand, with the field underline. */
export const footerRevealSocialLinkClasses = footerRevealFieldLinkClasses + " type-heading-1";

/**
 * Decorative wordmark. Viewport-scaled, shifted off center, and cropped by the
 * footer's bottom edge. `--color-brand-soft` is 40% white on the navy so it
 * stays visible; 20% white sinks into `#011272`.
 */
export const footerRevealWordmarkClasses =
  "pointer-events-none absolute bottom-0 start-[-12vw] z-0 max-w-none translate-y-[16%] " +
  "select-none whitespace-nowrap font-sans font-bold leading-[0.78] tracking-[-0.045em] " +
  "text-brand-soft text-[clamp(4.75rem,20vw,22rem)]";

/** `https` links open in a new tab. Hash placeholders stay in the page. */
export function footerRevealExternalLinkProps(
  href: string,
): { target?: "_blank"; rel?: "noopener" } {
  if (/^https?:\/\//i.test(href)) return { target: "_blank", rel: "noopener" };
  return {};
}
