import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  listBodyClasses,
  listBodyDividersClasses,
  listHeaderClasses,
  listItemButtonClasses,
  listItemMetaClasses,
  listItemPaddingClasses,
  listItemMetaColumnClasses,
  listItemPrimaryClasses,
  listItemPrimaryColumnClasses,
  listItemSecondaryClasses,
  listItemSelectedClasses,
  listItemSplitContentClasses,
  listItemStackedContentClasses,
  listItemTrailingSplitClasses,
  listItemTrailingStackClasses,
  listRootClasses,
  listVariantClasses,
  type ListItemLayout,
  type ListVariant,
} from "./listStyles";

export type { ListItemLayout, ListVariant } from "./listStyles";
export { listItemLayouts, listVariants } from "./listStyles";

/** Layout-only — not for row colors or typography overrides. */
export type ListLayoutClassName = string;

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Optional heading row above items ([Astryx List](https://astryx.atmeta.com/components/List) `header`). */
  header?: ReactNode;
  /** Hairline dividers between rows — default `true`. */
  hasDividers?: boolean;
  /** `surface` (default) for panel trays; `ghost` when parent owns background. */
  variant?: ListVariant;
  className?: ListLayoutClassName;
}

export interface ListItemProps {
  /** Primary line — market name, member name, etc. */
  primary: ReactNode;
  /** Secondary line — address, subtitle. */
  secondary?: ReactNode;
  /** Metadata — distance, timestamp (`tabular-nums`). */
  meta?: ReactNode;
  /** Trailing accessory — read-only {@link Chip}, badge. */
  trailing?: ReactNode;
  /**
   * `stacked` — FM browse default (name → street → miles).
   * `split` — name, street, and trailing pills left; meta (miles) right.
   */
  layout?: ListItemLayout;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: ListLayoutClassName;
}

function ListRoot({
  header,
  hasDividers = true,
  variant = "surface",
  className,
  children,
  ...props
}: ListProps) {
  return (
    <div
      className={cn(listRootClasses, listVariantClasses[variant], className)}
      data-variant={variant}
      {...props}
    >
      {header ? <div className={listHeaderClasses}>{header}</div> : null}
      <ul
        className={cn(listBodyClasses, hasDividers && listBodyDividersClasses)}
        role="list"
      >
        {children}
      </ul>
    </div>
  );
}

function ListItemRow({
  primary,
  secondary,
  meta,
  trailing,
  layout = "stacked",
  selected = false,
  disabled = false,
  onPress,
  className,
}: ListItemProps) {
  const interactive = onPress != null;

  const content =
    layout === "stacked" ? (
      <div className={listItemStackedContentClasses}>
        <span className={listItemPrimaryClasses}>{primary}</span>
        {secondary ? <span className={listItemSecondaryClasses}>{secondary}</span> : null}
        {meta ? <span className={listItemMetaClasses}>{meta}</span> : null}
        {trailing ? <div className={listItemTrailingStackClasses}>{trailing}</div> : null}
      </div>
    ) : (
      <div className={listItemSplitContentClasses}>
        <div className={listItemPrimaryColumnClasses}>
          <span className={listItemPrimaryClasses}>{primary}</span>
          {secondary ? <span className={listItemSecondaryClasses}>{secondary}</span> : null}
          {trailing ? <div className={listItemTrailingSplitClasses}>{trailing}</div> : null}
        </div>
        {meta ? (
          <div className={listItemMetaColumnClasses}>
            <span className={listItemMetaClasses}>{meta}</span>
          </div>
        ) : null}
      </div>
    );

  if (!interactive) {
    return (
      <li className={cn("block", className)} role="listitem">
        <div className={cn(listItemPaddingClasses, selected && listItemSelectedClasses)}>
          {content}
        </div>
      </li>
    );
  }

  return (
    <li className={cn("block", className)} role="listitem">
      <button
        type="button"
        onClick={onPress}
        disabled={disabled}
        aria-pressed={selected}
        className={cn(
          listItemButtonClasses,
          listItemPaddingClasses,
          selected && listItemSelectedClasses,
        )}
      >
        {content}
      </button>
    </li>
  );
}

/**
 * Scannable row collection — [Astryx List](https://astryx.atmeta.com/components/List).
 * Records as rows inside a panel (`hasDividers`, `surface`); not one Card per row.
 */
export const List = Object.assign(ListRoot, {
  Item: ListItemRow,
});

export {
  listItemMetaClasses,
  listItemPrimaryClasses,
  listItemSecondaryClasses,
};
