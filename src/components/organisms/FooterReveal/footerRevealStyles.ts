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
 * `--color-primary` / `--color-on-primary` — no separate footer color token.
 */
export const footerRevealFieldClasses = "bg-primary text-primary-foreground";

/**
 * Links on the brand field. **TextLink** locks `text-fg` for prose on the page
 * background; inherit so these links use on-primary ink from the field.
 */
export const footerRevealFieldLinkClasses =
  "text-inherit underline decoration-dotted decoration-current/45 underline-offset-4 " +
  "hover:decoration-current focus-visible:rounded-sm focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-primary-foreground/50";
