import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  errorSummaryClasses,
  errorSummaryLinkClasses,
  errorSummaryListClasses,
  errorSummaryTitleClasses,
  type ErrorSummaryHeadingLevel,
} from "./errorSummaryStyles";

export { errorSummaryHeadingLevels, type ErrorSummaryHeadingLevel } from "./errorSummaryStyles";

/** Layout-only — margin or grid placement. */
export type ErrorSummaryLayoutClassName = string;

export interface ErrorSummaryItem {
  /** The `id` of the field with the error; its link moves focus there. */
  field: string;
  /** The same words as the field's own message ("Enter your email address"). */
  message: ReactNode;
}

export interface ErrorSummaryProps {
  /** One line per error, in the order the fields appear. Renders nothing when empty. */
  errors: ErrorSummaryItem[];
  /** Default: "There's a problem". */
  title?: ReactNode;
  /** Its heading level in the page outline. Default `h2`. */
  as?: ErrorSummaryHeadingLevel;
  /**
   * Move focus to the summary when its errors change, so a screen reader starts here after a failed
   * submit. Default `true`.
   */
  focusOnShow?: boolean;
  className?: ErrorSummaryLayoutClassName;
}

/**
 * The summary at the top of a form after a failed submit (Errors and validation V5): "There's a problem",
 * then one link per error, worded like the field's own message. It takes focus when it appears, and each
 * link moves focus to its field. The fields keep their inline messages too.
 */
export function ErrorSummary({ errors, title = "There's a problem", as: Heading = "h2", focusOnShow = true, className }: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const key = errors.map((error) => error.field).join("|");

  useEffect(() => {
    if (focusOnShow && key !== "") ref.current?.focus();
  }, [focusOnShow, key]);

  if (errors.length === 0) return null;

  return (
    <div
      ref={ref}
      role="alert"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={cn(errorSummaryClasses, className)}
      data-error-summary=""
    >
      <Heading id={titleId} className={errorSummaryTitleClasses}>
        {title}
      </Heading>
      <ul className={errorSummaryListClasses}>
        {errors.map((error) => (
          <li key={error.field}>
            <a
              href={`#${error.field}`}
              className={errorSummaryLinkClasses}
              onClick={(event) => {
                const field = document.getElementById(error.field);
                if (field == null) return;
                event.preventDefault();
                field.scrollIntoView({ block: "center" });
                field.focus({ preventScroll: true });
              }}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
