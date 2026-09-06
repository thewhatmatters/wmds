import type { ElementType, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  pageHeaderEndClasses,
  pageHeaderShellClasses,
  pageHeaderStartClasses,
  pageHeaderTitleClasses,
  type PageHeaderVariant,
} from "./pageHeaderStyles";

export type { PageHeaderVariant } from "./pageHeaderStyles";
export {
  pageHeaderAppBandHeightClasses,
  pageHeaderVariants,
} from "./pageHeaderStyles";

/** Layout-only — width, margin; not for re-theming the header shell. */
export type PageHeaderLayoutClassName = string;

export interface PageHeaderProps {
  /**
   * Visible heading — omit on toolbar-only rows.
   * When omitted, pass `aria-label` (toolbar) or rely on `start` copy (app/page).
   */
  title?: string;
  /** App canvas band, in-page section title, or compact toolbar row. */
  variant?: PageHeaderVariant;
  /** Leading slot — breadcrumb, back, **Badge**, filter **Chip** rail. */
  start?: ReactNode;
  /** Trailing slot — cluster controls (**SegmentedControl**, **Button**, **Avatar**, **MoreMenu**). */
  end?: ReactNode;
  /** Accessible name when `title` is omitted — required for toolbar-only rows. */
  "aria-label"?: string;
  className?: PageHeaderLayoutClassName;
}

const pageHeaderTitleTags: Record<PageHeaderVariant, ElementType> = {
  app: "h1",
  page: "h2",
  toolbar: "span",
};

export function PageHeader({
  title,
  variant = "page",
  start,
  end,
  "aria-label": ariaLabel,
  className,
}: PageHeaderProps) {
  const TitleTag = pageHeaderTitleTags[variant];
  const hasTitle = title != null && title.length > 0;
  const labelledByTitle = hasTitle ? undefined : ariaLabel;

  if (variant === "toolbar") {
    return (
      <div
        role="toolbar"
        aria-label={labelledByTitle}
        className={cn(pageHeaderShellClasses.toolbar, className)}
      >
        {start != null || hasTitle ? (
          <div className={pageHeaderStartClasses}>
            {start}
            {hasTitle ? (
              <TitleTag className={pageHeaderTitleClasses.toolbar}>{title}</TitleTag>
            ) : null}
          </div>
        ) : (
          <span className="min-w-0 flex-1" />
        )}
        {end != null ? <div className={pageHeaderEndClasses}>{end}</div> : null}
      </div>
    );
  }

  return (
    <header aria-label={labelledByTitle} className={cn(pageHeaderShellClasses[variant], className)}>
      <div className={pageHeaderStartClasses}>
        {start}
        {hasTitle ? (
          <TitleTag className={pageHeaderTitleClasses[variant]}>{title}</TitleTag>
        ) : null}
      </div>
      {end != null ? <div className={pageHeaderEndClasses}>{end}</div> : null}
    </header>
  );
}
