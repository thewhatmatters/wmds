import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  sectionCaptionEndClasses,
  sectionCaptionLabelClasses,
  sectionCaptionMarkerClasses,
  sectionCaptionRowClasses,
  sectionCaptionRuledClasses,
  type SectionCaptionElement,
} from "./sectionCaptionStyles";

export { sectionCaptionElements, type SectionCaptionElement } from "./sectionCaptionStyles";

/** Layout-only — margin or grid placement. */
export type SectionCaptionLayoutClassName = string;

export interface SectionCaptionProps {
  /** The caption, in sentence case — for example "Metadata". The utility sets the capitals. */
  children: ReactNode;
  /** The element. `h2` (default) when the caption names a region; `p` when it only labels a column. */
  as?: SectionCaptionElement;
  /** For `aria-labelledby` on the region the caption names. */
  id?: string;
  /** The leading "/" — decoration screen readers skip. Default: true. */
  marker?: boolean;
  /** The rule under the caption. Default: true. */
  rule?: boolean;
  /** An action at the row's end — **Button** `size="xs"`, for example Clear all. */
  end?: ReactNode;
  className?: SectionCaptionLayoutClassName;
}

/**
 * The small uppercase mono caption over a page column — "/ Metadata", "/ Article", "/ Filters" —
 * on a hairline rule, with an optional action at its end.
 */
export function SectionCaption({
  children,
  as: Element = "h2",
  id,
  marker = true,
  rule = true,
  end,
  className,
}: SectionCaptionProps) {
  return (
    <div
      className={cn(sectionCaptionRowClasses, rule && sectionCaptionRuledClasses, className)}
      data-section-caption=""
    >
      <Element id={id} className={sectionCaptionLabelClasses}>
        {marker ? (
          <span className={sectionCaptionMarkerClasses} aria-hidden="true">
            /{" "}
          </span>
        ) : null}
        {children}
      </Element>
      {end != null ? <div className={sectionCaptionEndClasses}>{end}</div> : null}
    </div>
  );
}
