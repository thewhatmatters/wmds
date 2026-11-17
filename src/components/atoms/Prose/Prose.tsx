import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  proseElementClasses,
  proseMeasureClasses,
  proseSizeClasses,
  proseToneClasses,
  type ProseElement,
  type ProseMeasure,
  type ProseSize,
  type ProseTone,
} from "./proseStyles";

export {
  proseElements,
  proseMeasures,
  proseSizes,
  proseTones,
  type ProseElement,
  type ProseMeasure,
  type ProseSize,
  type ProseTone,
} from "./proseStyles";

/** Layout-only — margin or grid placement. */
export type ProseLayoutClassName = string;

export interface ProseProps {
  /** Rendered long-form content — plain HTML elements (the output of a markdown renderer). */
  children: ReactNode;
  /** `lg` (default) — `type-reading` article text. `md` — `type-body`, for denser notes. */
  size?: ProseSize;
  /** `reading` (default) caps lines at 40rem. `none` fills the column. */
  measure?: ProseMeasure;
  /**
   * `primary` (default) — body text in the primary ink. `muted` — body text in the secondary ink;
   * headings, links, strong text, and code keep the primary ink.
   */
  tone?: ProseTone;
  /** The wrapping element. Default: `div`. */
  as?: ProseElement;
  className?: ProseLayoutClassName;
}

/**
 * Long-form content — headings, paragraphs, lists, quotes, inline code, code blocks, rules, images,
 * and tables — set from plain HTML elements inside it, with the spacing between them. Pass rendered
 * markdown in; there is no class map to keep.
 */
export function Prose({
  children,
  size = "lg",
  measure = "reading",
  tone = "primary",
  as: Element = "div",
  className,
}: ProseProps) {
  return (
    <Element
      className={cn(
        proseElementClasses,
        proseToneClasses[tone],
        proseSizeClasses[size],
        proseMeasureClasses[measure],
        className,
      )}
      data-size={size}
      data-prose=""
    >
      {children}
    </Element>
  );
}
