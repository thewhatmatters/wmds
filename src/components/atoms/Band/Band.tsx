import type { AriaAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  bandClasses,
  bandPageClasses,
  bandSpacingClasses,
  type BandElement,
  type BandSpacing,
  type BandTone,
} from "./bandStyles";

export {
  bandElements,
  bandSpacings,
  bandTones,
  type BandElement,
  type BandSpacing,
  type BandTone,
} from "./bandStyles";

/** Layout-only — margin or grid placement of the band itself. */
export type BandLayoutClassName = string;

export interface BandProps {
  /** Section content, placed on the band's own `grid-page` columns with `col-span-*` / `col-start-*`. */
  children: ReactNode;
  /** `default` keeps the page's colours; `inverse` (brand surface) and `field` re-skin everything inside. */
  tone?: BandTone;
  /** Space above and below the content: `md` (default) 48px, `lg` 96px, `none`. */
  spacing?: BandSpacing;
  /** The band element. Default: `section`. */
  as?: BandElement;
  id?: string;
  "aria-label"?: AriaAttributes["aria-label"];
  "aria-labelledby"?: AriaAttributes["aria-labelledby"];
  className?: BandLayoutClassName;
}

/**
 * A full-bleed page section in one of the brand kit's tones. Its tone remaps the surface, text,
 * border and fill roles (`data-tone`), so every WMDS component inside re-skins with no `className`.
 * It holds its own `grid-page` on the shared `--grid-*` tokens, so its columns line up with the
 * page's; placed inside a `grid-page` it bleeds to the viewport edges and keeps the page's columns.
 */
export function Band({
  children,
  tone = "default",
  spacing = "md",
  as: Element = "section",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
}: BandProps) {
  return (
    <Element
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(bandClasses, bandSpacingClasses[spacing], className)}
      data-band=""
      data-tone={tone}
      // Inverse is a dark section: status, chart, shadow and focus roles take their dark values.
      data-theme={tone === "inverse" ? "dark" : undefined}
    >
      <div className={bandPageClasses}>{children}</div>
    </Element>
  );
}
