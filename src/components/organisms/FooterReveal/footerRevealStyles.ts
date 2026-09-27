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
 * Ruled-grid field. Page background with brand ink.
 * Dark theme repaints this class to `--color-on-brand` — brand navy on the
 * dark body is under 3:1. See `theme.css`.
 */
export const footerRevealRuledFieldClasses =
  "footer-reveal-ruled-field bg-body text-brand";

/** Page-grid box. 1px brand rules. Clips the fitted wordmark and the crop. */
export const footerRevealRuledFrameClasses =
  "mx-auto w-full min-w-0 max-w-[var(--grid-max)] overflow-hidden border border-brand text-brand";

export const footerRevealRuledSplitClasses = "grid grid-cols-1 md:grid-cols-2";

export const footerRevealRuledIdentityClasses =
  "flex min-w-0 flex-col gap-4 border-b border-brand p-[var(--grid-pad)] md:border-r";

export const footerRevealRuledLinksClasses =
  "flex min-w-0 flex-col gap-4 border-b border-brand p-[var(--grid-pad)]";

export const footerRevealRuledLinkColumnsClasses =
  "grid min-w-0 grid-cols-2 gap-x-[var(--grid-gutter)]";

export const footerRevealRuledColumnHeadingClasses = "type-label mb-4 text-brand";

export const footerRevealRuledLinkListClasses = "m-0 flex list-none flex-col gap-3 p-0";

/** Column link. Dotted rule spans the column; the arrow sits on the end. */
export const footerRevealRuledLinkClasses =
  "flex min-w-0 items-center justify-between gap-2 border-b border-dotted border-brand py-2 text-brand " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand";

export const footerRevealRuledLinkLabelClasses =
  "min-w-0 font-mono text-[length:var(--font-size-sm)] uppercase leading-none tracking-[0.14em]";

/** Shell glyph slot — smaller than ButtonIcon's xs (28px) cluster target. */
export const footerRevealRuledGlyphClasses =
  "inline-flex size-3.5 shrink-0 text-brand [&>svg]:size-full [&>svg]:stroke-current";

/** Decorative plus. Hidden below `md`, where the bands stack. */
export const footerRevealRuledPlusClasses =
  footerRevealRuledGlyphClasses + " pointer-events-none mt-auto hidden md:inline-flex";

export const footerRevealRuledCopyrightClasses = "type-supporting min-w-0 text-brand";

export const footerRevealRuledBlurbClasses =
  "max-w-[36ch] font-mono text-[length:var(--font-size-sm)] leading-[1.45] text-brand";

/** Corner mark. Typographic WM — not a separate logo asset. */
export const footerRevealRuledMarkClasses =
  "shrink-0 font-sans text-[length:var(--font-size-5xl)] font-bold leading-[0.8] tracking-[-0.04em] text-brand";

export const footerRevealRuledContactClasses =
  "flex min-w-0 flex-col justify-center border-b border-brand p-[var(--grid-pad)] md:border-r";

export const footerRevealRuledContactRowClasses =
  "flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between";

export const footerRevealRuledContactLabelClasses = "type-label text-brand";

export const footerRevealRuledEmailClasses =
  "type-label text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand";

export const footerRevealRuledServicesClasses =
  "type-label flex min-w-0 items-center gap-2 text-brand";

export const footerRevealRuledSocialGridClasses =
  "grid min-w-0 border-b border-brand";

export const footerRevealRuledSocialCellClasses =
  "flex aspect-square min-h-11 min-w-0 items-center justify-center border-r border-brand text-brand last:border-r-0 " +
  "hover:bg-neutral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand";

export const footerRevealRuledWordmarkFrameClasses =
  "@container flex w-full min-w-0 items-center overflow-hidden border-b border-brand px-[var(--grid-margin)] py-[var(--grid-baseline)]";

/** Fully visible. `leading-none` keeps the caps inside the row; the crop row below is the bleed. */
export const footerRevealRuledWordmarkClasses =
  "w-max max-w-none shrink-0 whitespace-nowrap font-sans font-bold leading-none tracking-[-0.045em] text-brand";

/**
 * Oversized letterforms, top-aligned. The frame is shorter than the em box,
 * so the bottom rule crops the letters.
 */
export const footerRevealRuledCropFrameClasses =
  "@container aspect-[3/1] w-full min-w-0 overflow-hidden border-b border-brand";

export const footerRevealRuledCropClasses =
  "w-max max-w-none whitespace-nowrap font-sans font-bold leading-none tracking-[-0.06em] text-brand";

export const footerRevealRuledCreditClasses =
  "flex min-w-0 items-center justify-between gap-4 px-[var(--grid-pad)] py-[var(--grid-baseline)]";

export const footerRevealRuledCreditMarkClasses =
  "shrink-0 font-sans text-[length:var(--font-size-xl)] font-bold leading-none tracking-[-0.04em] text-brand";

export const footerRevealRuledCreditCopyClasses =
  "min-w-0 text-right font-mono text-[length:var(--font-size-sm)] leading-none text-brand";
