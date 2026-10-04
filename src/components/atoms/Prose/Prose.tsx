import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  proseElementClasses,
  proseMeasureClasses,
  proseSizeClasses,
  type ProseElement,
  type ProseMeasure,
  type ProseSize,
} from "./proseStyles";

export {
  proseElements,
  proseMeasures,
  proseSizes,
  type ProseElement,
  type ProseMeasure,
  type ProseSize,
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
  /** The wrapping element. Default: `div`. */
  as?: ProseElement;
  className?: ProseLayoutClassName;
}

/**
 * Long-form content — headings, paragraphs, lists, quotes, inline code, code blocks, rules, images,
 * and tables — set from plain HTML elements inside it, with the spacing between them. Pass rendered
 * markdown in; there is no class map to keep.
 */
export function Prose({ children, size = "lg", measure = "reading", as: Element = "div", className }: ProseProps) {
  return (
    <Element
      className={cn(proseElementClasses, proseSizeClasses[size], proseMeasureClasses[measure], className)}
      data-size={size}
      data-prose=""
    >
      {children}
    </Element>
  );
}
