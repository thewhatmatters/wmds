/**
 * Footer reveal shell.
 *
 * Scrollbar: `src/theme/grid.css` already sets `scrollbar-gutter: stable` on
 * `html`. That gutter paints the page background beside a full-bleed field.
 * This shell does not hide the scrollbar. The root and the cover do not clip:
 * an `overflow-x: clip` ancestor keeps GridOverlay's column guides inside
 * `main`, so they never reach the hero. The wordmark's bottom bleed is clipped
 * on the brand panel and the footer field instead. Do not add `overflow-hidden`
 * on the root — it breaks `position: sticky`. Do not set `scrollbar-width: none`.
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

/**
 * Page-grid stripes on the brand field. Shown with `html.grid-on`.
 * They sit under the field content (`z-0` vs `z-[1]`) and over the navy fill.
 */
export const footerRevealFieldGuideClasses =
  "footer-reveal-guides pointer-events-none absolute inset-0 z-0 hidden";

/** Same max-width, margin, and tracks as `grid-page` / `.grid-guides-cols`. */
export const footerRevealFieldGuideFrameClasses =
  "pointer-events-none absolute inset-y-0 right-0 left-0 mx-auto w-[min(100%,var(--grid-max))]";

/** Footer type and controls. Above the field guides. */
export const footerRevealFieldContentClasses = "footer-reveal-field-content relative z-[1]";

export const footerRevealBrandCopyClasses =
  "relative z-[1] flex w-full max-w-4xl flex-col items-center gap-10";

export const footerRevealBrandHeadlineClasses = "type-display-1 text-balance text-on-brand";

export const footerRevealSocialListClasses =
  "m-0 flex list-none flex-wrap items-center justify-center gap-x-8 gap-y-3 p-0";

/** Heading-1 (24px) so the row clears large-text AA on brand, with the field underline. */
export const footerRevealSocialLinkClasses = footerRevealFieldLinkClasses + " type-heading-1";

/**
 * Full-bleed wordmark frame. Inline-size container for the wordmark's `cqi`
 * font-size. Sits on the brand panel's padding edge so the word spans the
 * footer, not the padded copy column.
 */
export const footerRevealWordmarkFrameClasses =
  "@container pointer-events-none absolute inset-x-0 bottom-0 z-0 flex w-full justify-center";

/**
 * Advance width in em used before measurement. Large enough that the default
 * word stays inside the footer until the real font is measured.
 */
export const footerRevealWordmarkEmFallback = 9;

/**
 * Font size that fills the wordmark frame. `100cqi` is the frame's inline
 * size; dividing by the measured advance width (in em) scales any word to
 * that width. No breakpoint cap.
 */
export const footerRevealWordmarkFontSize =
  `calc(100cqi / var(--footer-wordmark-em, ${footerRevealWordmarkEmFallback}))`;

/**
 * Decorative wordmark. Fills the frame, then shifts down so the letters bleed
 * off the bottom edge. `--color-brand-soft` is 40% white on the navy so it
 * stays visible; 20% white sinks into `#011272`.
 */
export const footerRevealWordmarkClasses =
  "pointer-events-none w-max max-w-none shrink-0 translate-y-[16%] select-none " +
  "whitespace-nowrap text-center font-sans font-bold leading-[0.78] tracking-[-0.045em] " +
  "text-brand-soft";

/** `https` links open in a new tab. Hash placeholders stay in the page. */
export function footerRevealExternalLinkProps(
  href: string,
): { target?: "_blank"; rel?: "noopener" } {
  if (/^https?:\/\//i.test(href)) return { target: "_blank", rel: "noopener" };
  return {};
}

/**
 * Cream field with brand ink. Page background (`bg-body`) and `--color-brand`
 * (`#011272`). Dark theme repaints this class to `--color-on-brand` — brand
 * navy on the dark body is under 3:1. See `theme.css`.
 */
/**
 * Cream field. At least one viewport (`100vh`) so a short stack cannot leave
 * the page showing above the footer. Taller content grows the field.
 */
export const footerRevealRuledFieldClasses =
  "footer-reveal-ruled-field min-h-[100vh] bg-body text-brand";

/**
 * Full-bleed shell. At least `100vh`, same floor as the field, so every mount
 * of **FooterReveal.Ruled** fills the viewport. Taller content grows it.
 * Centered link stack, then the fitted wordmark, then the quiet meta row.
 * No max-width and no overflow clip — the nav, wordmark, and meta row stay
 * visible. The wordmark has to reach the viewport width.
 *
 * Top padding clears the pinned site nav on every mount. `--site-nav-height`
 * is the nav band. `var(--spacing) * 4` is that pill's 1rem pin (`top-4`).
 * The bottom inset stays `--grid-pad`.
 */
export const footerRevealRuledRootClasses =
  "flex min-h-[100vh] w-full min-w-0 flex-col items-center gap-[var(--grid-pad)] " +
  "pb-[var(--grid-pad)] pt-[calc(var(--site-nav-height)+var(--spacing)*4)] text-center text-brand";

/** Centered link stack. The list hugs its labels; it does not stretch into columns. */
export const footerRevealRuledLinksClasses =
  "flex w-full min-w-0 justify-center px-[var(--grid-margin)]";

/**
 * Parent of the three **TextLink**s. Geist sans is inherited. Below `sm` the
 * size is `--font-size-4xl` (2.1875rem) so the stack does not fill a phone.
 * From `sm` it is 4rem. No type token is 4rem. **TextLink** keeps its own
 * solid underline, medium weight, and focus ring.
 */
export const footerRevealRuledLinkListClasses =
  "m-0 flex list-none flex-col items-center gap-3 whitespace-nowrap p-0 font-sans " +
  "text-[length:var(--font-size-4xl)] leading-none sm:text-[4rem]";

/**
 * Brand ink on these three footer links. **TextLink** sets `text-fg` on the
 * anchor, which wins over a parent `text-brand`. `!` keeps `--color-brand`
 * (`#011272`) on the words only. The solid underline stays TextLink's.
 */
export const footerRevealRuledNavLinkClasses = "!text-brand";

/**
 * Quiet meta row. One centered stack below `md`. From `md`, seal and copyright
 * lead, the email is centered, and the credit sits on the end.
 */
export const footerRevealRuledMetaClasses =
  "grid w-full min-w-0 grid-cols-1 items-center gap-3 px-[var(--grid-margin)] md:grid-cols-3 md:gap-4";

export const footerRevealRuledIdentityClasses =
  "flex min-w-0 items-center justify-center gap-2 md:justify-start";

export const footerRevealRuledCopyrightClasses = "type-supporting min-w-0 text-brand";

/** Small typographic WM beside the copyright. Not a separate logo asset. */
export const footerRevealRuledMarkClasses =
  "shrink-0 font-sans text-[length:var(--font-size-xl)] font-bold leading-none tracking-[-0.04em] text-brand";

export const footerRevealRuledContactClasses = "flex min-w-0 justify-center";

export const footerRevealRuledEmailClasses =
  "type-label text-brand focus-visible:rounded-sm focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-brand";

/**
 * Wordmark frame. Full footer width so `100cqi` tracks the viewport, not the
 * page grid. A 12px inset keeps side-bearing ink off the viewport edge. Overflow
 * stays visible — a hidden frame is what cropped the previous giant word.
 */
export const footerRevealRuledWordmarkFrameClasses =
  "@container flex w-full min-w-0 items-center justify-center overflow-visible px-3 py-[var(--grid-baseline)]";

/** Fully visible. `leading-none` keeps the line box on the caps. No crop shift. */
export const footerRevealRuledWordmarkClasses =
  "w-max max-w-none shrink-0 whitespace-nowrap text-center font-sans font-bold leading-none tracking-[-0.045em] text-brand";

export const footerRevealRuledCreditClasses = "flex min-w-0 justify-center md:justify-end";

export const footerRevealRuledCreditCopyClasses =
  "min-w-0 max-w-full text-center font-mono text-[length:var(--font-size-sm)] leading-none text-brand break-words md:text-right";
