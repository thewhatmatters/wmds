import type { ReactNode } from "react";
import { Button } from "../../atoms/Button/Button";
import { cn } from "../../../lib/cn";
import {
  emptyStateActionsClasses,
  emptyStateClasses,
  emptyStateDescriptionClasses,
  emptyStateIconClasses,
  emptyStateTitleClasses,
  type EmptyStateKind,
} from "./emptyStateStyles";

export { emptyStateKinds, type EmptyStateKind } from "./emptyStateStyles";

/** Layout-only — width or margin. */
export type EmptyStateLayoutClassName = string;

export interface EmptyStateProps {
  /**
   * - `first-use`: nothing here yet. Say what shows up here and give the main action ("No projects yet" /
   *   "Projects you start show up here." / Start a project).
   * - `no-results`: a search or filter found nothing. Name the words or filters ("No work matches Restaurants
   *   and Video") and offer Clear filters (`onClearFilters`, required).
   * - `done`: everything is handled ("You're all caught up"). A short positive line, no action.
   */
  kind?: EmptyStateKind;
  /** The one line that says what's going on, in the feature's words. */
  title: ReactNode;
  /** Optional: what shows up here, or why nothing matched. One sentence. */
  description?: ReactNode;
  /** `first-use`: one way forward, a **Button** (secondary when the page already has a primary, U7). */
  action?: ReactNode;
  /** `no-results`: clears the search and filters. */
  onClearFilters?: () => void;
  clearFiltersLabel?: string;
  /** At most a quiet "Learn more" **TextLink**. */
  learnMore?: ReactNode;
  /** A 24px glyph that names the thing (Lucide). No illustrations. */
  icon?: ReactNode;
  className?: EmptyStateLayoutClassName;
}

/**
 * Empty states (Rule 22): what takes a list's place when there's nothing in it. The page around it stays
 * (heading, search, filters). Looks different from loading (Skeleton) and from an error.
 */
export function EmptyState({
  kind = "first-use",
  title,
  description,
  action,
  onClearFilters,
  clearFiltersLabel = "Clear filters",
  learnMore,
  icon,
  className,
}: EmptyStateProps) {
  if (kind === "no-results" && onClearFilters == null) {
    console.warn('[WMDS EmptyState] `kind="no-results"` needs `onClearFilters` (a way back to everything).');
  }
  if (kind === "done" && action != null) {
    console.warn('[WMDS EmptyState] `kind="done"` takes no action: a short positive line is enough.');
  }
  const clear =
    kind === "no-results" && onClearFilters != null ? (
      <Button role="secondary" size="sm" onClick={onClearFilters}>
        {clearFiltersLabel}
      </Button>
    ) : null;
  const shownAction = kind === "done" ? null : kind === "no-results" ? clear : action;
  return (
    <div className={cn(emptyStateClasses, className)} data-empty-state={kind}>
      {icon != null ? (
        <span className={emptyStateIconClasses} aria-hidden>
          {icon}
        </span>
      ) : null}
      <p className={emptyStateTitleClasses}>{title}</p>
      {description != null ? <p className={emptyStateDescriptionClasses}>{description}</p> : null}
      {shownAction != null || learnMore != null ? (
        <div className={emptyStateActionsClasses}>
          {shownAction}
          {learnMore}
        </div>
      ) : null}
    </div>
  );
}

/** A plain string in an `empty` slot becomes an **EmptyState** (Z7); anything else is used as given. */
export function emptySlot(empty: ReactNode, kind: EmptyStateKind = "first-use"): ReactNode {
  return typeof empty === "string" ? <EmptyState kind={kind} title={empty} /> : empty;
}
