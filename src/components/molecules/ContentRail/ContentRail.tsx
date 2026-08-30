import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  contentRailBodyClasses,
  contentRailHeaderClasses,
  contentRailPositionClasses,
  contentRailRootClasses,
  contentRailWidthClasses,
  type ContentRailPosition,
  type ContentRailWidth,
} from "./contentRailStyles";

export type { ContentRailPosition, ContentRailWidth } from "./contentRailStyles";
export { contentRailWidths } from "./contentRailStyles";

/** Layout-only — not for surface or width overrides. */
export type ContentRailLayoutClassName = string;

export interface ContentRailProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Required — names the rail landmark (e.g. "Market results"). */
  "aria-label": string;
  /** `end` (default) — list beside map on the right in LTR. */
  position?: ContentRailPosition;
  /** Fixed width from `md:` — default `md` (20rem). Full width on mobile. */
  width?: ContentRailWidth;
  /** Search, filters, or toolbar — sticky above scroll body. */
  header?: ReactNode;
  className?: ContentRailLayoutClassName;
}

export interface ContentRailSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: ContentRailLayoutClassName;
}

function ContentRailRoot({
  children,
  header,
  position = "end",
  width = "md",
  className,
  "aria-label": ariaLabel,
  ...props
}: ContentRailProps) {
  return (
    <aside
      className={cn(
        contentRailRootClasses,
        contentRailPositionClasses[position],
        contentRailWidthClasses[width],
        className,
      )}
      aria-label={ariaLabel}
      data-position={position}
      data-width={width}
      {...props}
    >
      {header ? <div className={contentRailHeaderClasses}>{header}</div> : null}
      <div className={contentRailBodyClasses}>{children}</div>
    </aside>
  );
}

function ContentRailHeader({ className, children, ...props }: ContentRailSectionProps) {
  return (
    <div className={cn(contentRailHeaderClasses, className)} {...props}>
      {children}
    </div>
  );
}

function ContentRailBody({ className, children, ...props }: ContentRailSectionProps) {
  return (
    <div className={cn(contentRailBodyClasses, className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Supporting content pane beside a main canvas (map, detail) — search/filters header, scrollable body.
 */
export const ContentRail = Object.assign(ContentRailRoot, {
  Header: ContentRailHeader,
  Body: ContentRailBody,
});

export { contentRailBodyClasses, contentRailHeaderClasses };
